import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Flow } from 'flow-sdk';
import { StoryboardCardData, ProjectConfig, AspectRatio, MediaItem } from './types';
import { StoryboardCard } from './components/StoryboardCard';
import { ActionButton, UploadBox, Badge } from './components/Primitives';
import { MergedVideoCard } from './components/MergedVideoCard';
import { ffmpegService } from './services/ffmpegService';
import { Lightbox } from './components/Lightbox';
import { ConfigControls } from './components/ConfigControls';
// --- DATA & THEMES ---
import { CAMPAIGN_THEMES } from './prompts';
// --- LICENSE IMPORTS ---
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
import { LicenseStatus } from './components/LicenseStatus';
const APP_VERSION = "1.0.5";
// --- LOCK BLOCKS (VIETNAMESE FOR IMAGE PROMPTS) ---
const IDENTITY_LOCK_VN = "giữ khuôn mặt, kiểu tóc, màu tóc, dáng người, chiều cao và làn da của nhân vật chính xác 100% như ảnh tham chiếu, không thay đổi nhận diện, không làm đẹp ảo hóa";
const OUTFIT_LOCK_VN = "giữ nguyên chính xác bộ trang phục như trong ảnh tham chiếu, cùng phong cách, màu sắc, chất liệu vải và họa tiết, không thay đổi hay thêm bớt phụ kiện";
const FOCUS_LOCK_VN = "sản phẩm (giày/sandal) phải luôn là tiêu điểm sắc nét nhất trong khung hình, sử dụng độ sâu trường ảnh mỏng (bokeh) để làm nổi bật sản phẩm hơn các vùng cơ thể khác, ánh sáng ưu tiên cho sản phẩm";
const PRODUCT_SHAPE_LOCK_VN = "giữ nguyên chính xác tuyệt đối hình dáng, cấu tạo, kiểu khóa/quai/dây, chất liệu, màu sắc và mọi chi tiết thiết kế của sản phẩm đúng như ảnh gốc, không suy diễn thêm, không thay đổi hay thêm bớt bất kỳ chi tiết cấu tạo nào không có trong ảnh gốc";
// --- LOCK BLOCKS (ENGLISH FOR VIDEO PROMPTS) ---
const IDENTITY_LOCK_EN = "keep the character's face, hairstyle, hair color, body shape, height and skin tone exactly identical to the reference image, no alterations, no beautification, do not change facial identity";
const OUTFIT_LOCK_EN = "keep the exact same outfit as shown in the reference image, same style, color, fabric and pattern, no changes, no added or removed accessories";
const FOCUS_LOCK_EN = "the product (shoes) must remain the sharpest focal point in the frame at all times, use shallow depth of field to emphasize the footwear over other body areas, lighting should prioritize the product";
const PRODUCT_SHAPE_LOCK_EN = "keep the product's shape, structure, buckle/strap/lace type, material, color and all design details exactly identical to the original image, do not add or remove any structural details not present in the reference";
// --- PHOTO PROMPT CONSTRAINTS ---
const ENFORCE_PHOTOREAL = "phong cách ảnh chụp thực tế (photorealistic), chất lượng ảnh cao, ánh sáng studio chuyên nghiệp, chi tiết siêu thực, texture chất liệu rõ nét.";
const NEGATIVE_PROMPT = "sketch, pencil drawing, line art, illustration, cartoon, anime, black and white drawing, paper texture, hand-drawn, watercolor, painting style, blurry product, out of focus shoes, low detail footwear";
export default function StoryboardStudio() {
  // --- PROTECTION STATE ---
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  // --- THEME STATE ---
  const [selectedThemeId, setSelectedThemeId] = useState<string>('lifestyle');
  const currentTheme = useMemo(() => CAMPAIGN_THEMES[selectedThemeId], [selectedThemeId]);
  // Initial cards based on default theme
  const [cards, setCards] = useState<StoryboardCardData[]>(
    CAMPAIGN_THEMES['lifestyle'].scenes.map((scene, idx) => ({
      id: `scene-${scene.id}-${Date.now()}`,
      order: idx + 1,
      sceneId: scene.id,
      lockType: scene.lockType,
      promptTemplate: scene.prompt_template,
      isGeneratingImage: false,
      isGeneratingVideo: false,
      isAnalyzing: false
    }))
  );
  // --- CONSOLIDATED CONFIG STATE (UPDATED FOR 1.0.5 - REMOVED OUTFIT_MODE) ---
  const [config, setConfig] = useState<ProjectConfig>({
    ratio: '16:9',
    speed: '1x',
    model: 'Omni 1.1 Flash',
    threads: 4,
    resolution: '720p',
    productReferences: []
  });
  
  const [mergedVideo, setMergedVideo] = useState<MediaItem | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [isMergedOutdated, setIsMergedOutdated] = useState(false);
  const [mergeProgress, setMergeProgress] = useState('');
  const [mergeError, setMergeError] = useState<string | undefined>();
  const [analyzingStatus, setAnalyzingStatus] = useState<string | null>(null);
  
  const [animatingCount, setAnimatingCount] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | 'merged' | null>(null);
  // Function to handle Theme Change with reset logic
  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    const theme = CAMPAIGN_THEMES[themeId];
    setCards(theme.scenes.map((scene, idx) => ({
      id: `scene-${scene.id}-${Date.now()}`,
      order: idx + 1,
      sceneId: scene.id,
      lockType: scene.lockType,
      promptTemplate: scene.prompt_template,
      isGeneratingImage: false,
      isGeneratingVideo: false,
      isAnalyzing: false
    })));
    setMergedVideo(null);
    setIsMergedOutdated(false);
  };
  useEffect(() => {
    checkLicense().then(result => setIsLicensed(result.valid));
    ffmpegService.load().catch(console.error);
    const style = document.createElement('style');
    style.id = 'storyboard-global-styles';
    style.textContent = `
      .sidebar-scroll::-webkit-scrollbar { width: 6px; }
      .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
      .sidebar-scroll::-webkit-scrollbar-thumb { background: #D1D1D6; border-radius: 10px; }
      .hover-video-overlay { opacity: 0; transition: opacity 0.2s ease-in-out; }
      .video-preview-container:hover .hover-video-overlay { opacity: 1; }
      html, body, #root { width: 100% !important; max-width: 100% !important; overflow-x: hidden; background: #F5F5F7; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .header-glass { backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.8); }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById('storyboard-global-styles')?.remove(); };
  }, []);
  const handleUploadChar = async () => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      setConfig(s => ({ ...s, charReference: media }));
    } catch (e) {}
  };
  const handleUploadProducts = async () => {
    try {
      const media = await Flow.media.selectMultiple({ filter: 'image' });
      setConfig(s => ({ ...s, productReferences: [...s.productReferences, ...media] }));
    } catch (e) {}
  };
  const handleAnalyzeImages = async () => {
    const readyCards = cards.filter(c => c.image && !c.isAnalyzing);
    if (readyCards.length === 0) return;
    for (let i = 0; i < readyCards.length; i++) {
      const card = readyCards[i];
      setAnalyzingStatus(`Analyzing ${i + 1}/${readyCards.length}...`);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, isAnalyzing: true } : c));
      try {
        const { text: visionDescription } = await Flow.generate.text(
          "Describe this image in detail focusing on composition, subject, lighting, product placement, and character pose (if any). Be concise and accurate.",
          { images: [{ base64: card.image!.base64, mimeType: card.image!.mimeType }] }
        );
        
        const themeConfig = CAMPAIGN_THEMES[selectedThemeId].scenes.find(s => s.id === card.sceneId);
        let generatedPrompt = `${visionDescription}. ${themeConfig?.video_action_context || ''}.`;
        
        if (card.lockType === 'product_only') {
          generatedPrompt += ` PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}.`;
        } else if (card.lockType === 'product_and_feet') {
          generatedPrompt += ` IDENTITY: ${IDENTITY_LOCK_EN}. PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}. FOCUS: ${FOCUS_LOCK_EN}.`;
        } else if (card.lockType === 'full_body') {
          generatedPrompt += ` IDENTITY: ${IDENTITY_LOCK_EN}. OUTFIT: ${OUTFIT_LOCK_EN}. PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}. FOCUS: ${FOCUS_LOCK_EN}.`;
        }
        
        generatedPrompt += " no audio";
        setCards(prev => prev.map(c => c.id === card.id ? { ...c, videoPrompt: generatedPrompt, originalVideoPrompt: generatedPrompt, isAnalyzing: false } : c));
      } catch (err) {
        setCards(prev => prev.map(c => c.id === card.id ? { ...c, isAnalyzing: false, error: 'Phân tích lỗi' } : c));
      }
    }
    setAnalyzingStatus(null);
  };
  const drawCard = useCallback(async (id: string, currentAspectRatio: AspectRatio) => {
    const targetCard = cards.find(c => c.id === id);
    if (!targetCard || !targetCard.promptTemplate) return;
    
    setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingImage: true, error: undefined } : c));
    setIsMergedOutdated(true);
    
    try {
      const refs = [config.charReference, ...config.productReferences].filter(Boolean).map(r => r!.mediaId);
      
      let assembledPrompt = targetCard.promptTemplate;
      
      if (targetCard.lockType === 'product_only') {
        assembledPrompt += ` ${PRODUCT_SHAPE_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      } else if (targetCard.lockType === 'product_and_feet') {
        assembledPrompt += ` ${IDENTITY_LOCK_VN} ${PRODUCT_SHAPE_LOCK_VN} ${FOCUS_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      } else if (targetCard.lockType === 'full_body') {
        assembledPrompt += ` ${IDENTITY_LOCK_VN} ${OUTFIT_LOCK_VN} ${PRODUCT_SHAPE_LOCK_VN} ${FOCUS_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      }
      
      assembledPrompt += `. Tránh: ${NEGATIVE_PROMPT}.`;
      
      const res = await Flow.generate.image({
        prompt: assembledPrompt,
        referenceImageMediaIds: refs.length > 0 ? refs : undefined,
        aspectRatio: currentAspectRatio as any,
        modelDisplayName: '🍌 Nano Banana Pro'
      });
      setCards(prev => prev.map(c => c.id === id ? { ...c, image: res, isGeneratingImage: false } : c));
    } catch (e) {
      setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingImage: false, error: 'Lỗi vẽ hình' } : c));
    }
  }, [config.charReference, config.productReferences, cards]);
  const animateCard = useCallback(async (id: string, currentAspectRatio: AspectRatio, currentModel: string) => {
    const targetCard = cards.find(c => c.id === id);
    if (!targetCard?.image || !targetCard.videoPrompt) return;
    setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingVideo: true, error: undefined } : c));
    setIsMergedOutdated(true);
    try {
      const res = await Flow.generate.video({
        prompt: targetCard.videoPrompt,
        firstFrameImageMediaId: targetCard.image.mediaId,
        modelDisplayName: currentModel,
        aspectRatio: currentAspectRatio as any,
        durationSeconds: 8
      });
      setCards(prev => prev.map(c => c.id === id ? { ...c, video: res, isGeneratingVideo: false } : c));
      return true;
    } catch (e) {
      setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingVideo: false, error: 'Lỗi dựng phim' } : c));
      return false;
    }
  }, [cards]);
  const handleConcatenate = async () => {
    if (cards.some(c => !c.video)) { alert("Cần hoàn thành video cho tất cả 6 cảnh trước khi ghép"); return; }
    setIsMerging(true); setMergeError(undefined); setMergeProgress('Đang chuẩn bị FFmpeg...');
    try {
      await ffmpegService.load();
      const videoClips = [...cards].sort((a, b) => a.order - b.order);
      const fileNames: string[] = [];
      for (let i = 0; i < videoClips.length; i++) {
        setMergeProgress(`Đang tải cảnh ${i + 1}/6...`);
        const clip = videoClips[i].video!;
        const name = `clip_${i}.mp4`;
        fileNames.push(name);
        const bytes = Uint8Array.from(atob(clip.base64), c => c.charCodeAt(0));
        await ffmpegService.writeFile(name, bytes);
      }
      setMergeProgress('Đang xử lý ghép video...');
      const inputArgs: string[] = [];
      fileNames.forEach(name => inputArgs.push('-i', name));
      const filterInputs = fileNames.map((_, i) => `[${i}:v][${i}:a]`).join('');
      const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
      await ffmpegService.exec([
        ...inputArgs, '-filter_complex', filterComplex, '-map', '[outv]', '-map', '[outa]',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-c:a', 'aac', '-pix_fmt', 'yuv420p',
        '-movflags', 'faststart', '-y', 'output_merged.mp4',
      ]);
      const data = await ffmpegService.readFile('output_merged.mp4') as Uint8Array;
      const base64 = btoa(Array.from(data).map(b => String.fromCharCode(b)).join(''));
      setMergedVideo({ mediaId: `merged-${Date.now()}`, base64, mimeType: 'video/mp4' });
      for (const name of fileNames) await ffmpegService.deleteFile(name);
      await ffmpegService.deleteFile('output_merged.mp4');
      setIsMergedOutdated(false);
      setMergeProgress('Hoàn tất!');
    } catch (e) { setMergeError('Ghép video thất bại, vui lòng thử lại'); } finally { setIsMerging(false); }
  };
  const handleDrawAll = () => cards.forEach(c => drawCard(c.id, config.ratio));
  
  const handleAnimateAll = async () => {
    const animationTargets = cards.filter(c => c.image && c.videoPrompt);
    if (animationTargets.length === 0) return;
    setAnimatingCount(0);
    
    const firstBatch = animationTargets.slice(0, 3);
    const secondBatch = animationTargets.slice(3);
    
    await Promise.all(firstBatch.map(async c => {
      const ok = await animateCard(c.id, config.ratio, config.model);
      if (ok) setAnimatingCount(prev => (prev || 0) + 1);
    }));
    
    if (secondBatch.length > 0) {
      await Promise.all(secondBatch.map(async c => {
        const ok = await animateCard(c.id, config.ratio, config.model);
        if (ok) setAnimatingCount(prev => (prev || 0) + 1);
      }));
    }
    setTimeout(() => setAnimatingCount(null), 2000);
  };
  const currentLightboxMedia = useMemo(() => {
    if (lightboxIndex === null) return null;
    if (lightboxIndex === 'merged') return mergedVideo;
    const card = cards[lightboxIndex];
    return card?.video || card?.image || null;
  }, [lightboxIndex, cards, mergedVideo]);
  if (isLicensed === null) return null;
  if (isLicensed === false) return <LicenseGate onSuccess={() => setIsLicensed(true)} />;
  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F5F7] overflow-hidden text-[#1A1A1A] font-sans">
      <header className="h-16 px-4 lg:px-6 border-b border-[#E5E5EA] header-glass flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">{sidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
          
          <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[30px] lg:h-[34px] w-auto object-contain" />
          
          <a href="https://fastaivn.com" className="hidden sm:block text-[11px] font-bold text-slate-500 hover:text-[#F31B17] transition-colors mt-0.5">fastaivn.com</a>
          <div className="hidden md:block h-6 w-px bg-slate-200 mx-1" />
          <div className="flex items-baseline gap-2">
            <div className="flex items-center text-[18px] font-black tracking-tight">
              <span>REVIEW</span><span className="text-[#F31B17] ml-1">GIÀY</span>
            </div>
            <Badge color="red">v{APP_VERSION}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton 
            icon="search" 
            disabled={analyzingStatus !== null}
            onClick={handleAnalyzeImages}
            className="hidden sm:flex"
          >
            {analyzingStatus || "Phân tích ảnh"}
          </ActionButton>
          <ActionButton 
            variant="primary" 
            icon={animatingCount !== null ? "sync" : "movie"} 
            disabled={!cards.every(c => c.videoPrompt) || animatingCount !== null}
            onClick={handleAnimateAll}
          >
            {animatingCount !== null ? `Đang dựng (${animatingCount}/6)` : "Dựng toàn bộ"}
          </ActionButton>
          <ActionButton variant="solid" icon="merge" disabled={isMerging} onClick={handleConcatenate} className="hidden lg:flex">Ghép clip</ActionButton>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative w-full">
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-full w-[320px] bg-white border-r border-[#E5E5EA] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
          <div className="flex-1 overflow-y-auto sidebar-scroll p-6 flex flex-col gap-6">
            
            {/* Standard Config Controls Integration */}
            <ConfigControls config={config} onChange={setConfig} />
            <div className="grid grid-cols-2 gap-2">
              <UploadBox 
                label="1. Ảnh nhân vật" icon="person" onUpload={handleUploadChar}
                onClear={() => setConfig(s => ({ ...s, charReference: undefined }))}
                items={[config.charReference ? `data:${config.charReference.mimeType};base64,${config.charReference.base64}` : undefined]}
              />
              <UploadBox 
                label="2. Ảnh sản phẩm" icon="inventory_2" multiple onUpload={handleUploadProducts}
                onClear={(idx) => setConfig(s => ({ ...s, productReferences: s.productReferences.filter((_, i) => i !== idx) }))}
                items={config.productReferences.map(r => `data:${r.mimeType};base64,${r.base64}`)}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-[#F2F2F7] pt-4">
              <p className="text-[12px] font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#F31B17]">movie_creation</span>
                3. Gói Kịch Bản (Campaign Theme)
              </p>
              <select 
                value={selectedThemeId} 
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full h-[48px] rounded-xl border border-[#D1D1D6] px-3 bg-white text-[13px] font-medium text-[#1A1A1A] outline-none focus:border-[#F31B17] transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                {Object.values(CAMPAIGN_THEMES).map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#8E8E93] leading-relaxed px-1">
                {currentTheme.description}
              </p>
            </div>
            <div className="mt-auto pt-6 flex flex-col gap-2">
              <LicenseStatus />
            </div>
          </div>
          <div className="p-4 border-t border-[#E5E5EA] bg-white">
            <ActionButton variant="primary" fullWidth className="h-[52px] !text-[14px] !rounded-[16px]" onClick={handleDrawAll}>
              Vẽ toàn bộ Storyboard
            </ActionButton>
          </div>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <main className="flex-1 flex flex-col w-full bg-[#F5F5F7] overflow-y-auto relative p-4 lg:p-8 xl:p-12 no-scrollbar">
          <MergedVideoCard 
            video={mergedVideo} isMerging={isMerging} isOutdated={isMergedOutdated} progress={mergeProgress} error={mergeError} 
            onMerge={handleConcatenate} 
            onOpenLightbox={() => setLightboxIndex('merged')}
            onDownload={() => Flow.download({ base64: mergedVideo!.base64, mimeType: mergedVideo!.mimeType, filename: 'video_hoan_chinh.mp4' })}
          />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#F31B17] flex items-center justify-center text-white shadow-lg shadow-[#F31B17]/20">
              <span className="material-symbols-outlined">grid_view</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[22px] font-black tracking-tight">{currentTheme.name}</h3>
              <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">{currentTheme.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 w-full pb-20">
            {cards.map((card, idx) => (
              <StoryboardCard 
                key={card.id} data={card} isProcessing={false}
                onOpenLightbox={() => setLightboxIndex(idx)}
                onDraw={() => drawCard(card.id, config.ratio)}
                onAnimate={() => animateCard(card.id, config.ratio, config.model)}
                onPromptChange={(val) => setCards(prev => prev.map(c => c.id === card.id ? { ...c, videoPrompt: val } : c))}
                onRestorePrompt={() => setCards(prev => prev.map(c => c.id === card.id ? { ...c, videoPrompt: c.originalVideoPrompt } : c))}
                onClearError={() => setCards(prev => prev.map(c => c.id === card.id ? { ...c, error: undefined } : c))}
                onDownload={() => Flow.download({ base64: card.image!.base64, mimeType: card.image!.mimeType, filename: `frame_${card.order}.png` })}
                onSave={() => Flow.save({ base64: card.video!.base64, mimeType: card.video!.mimeType, name: `Video ${card.order}` })}
              />
            ))}
          </div>
        </main>
      </div>
      {currentLightboxMedia && (
        <Lightbox 
          media={currentLightboxMedia} 
          aspectRatio={config.ratio as any} 
          onClose={() => setLightboxIndex(null)}
          onPrev={lightboxIndex !== 'merged' && (lightboxIndex as number) > 0 ? () => setLightboxIndex(lightboxIndex as number - 1) : undefined}
          onNext={lightboxIndex !== 'merged' && (lightboxIndex as number) < cards.length - 1 ? () => setLightboxIndex(lightboxIndex as number + 1) : undefined}
          title={lightboxIndex === 'merged' ? 'Bản ghép cuối' : `Cảnh ${cards[lightboxIndex as number].order}: ${currentTheme.scenes.find(s => s.id === cards[lightboxIndex as number].sceneId)?.label}`}
        />
      )}
    </div>
  );
}