
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Flow } from 'flow-sdk';
import JSZip from 'jszip';
import { StoryboardCardData, AppSettings, AspectRatio, MediaItem } from './types';
import { StoryboardCard } from './components/StoryboardCard';
import { ActionButton, UploadBox, Badge } from './components/Primitives';
import { MergedVideoCard } from './components/MergedVideoCard';
import { ffmpegService } from './services/ffmpegService';
import { Lightbox } from './components/Lightbox';
// --- LICENSE IMPORTS ---
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
import { LicenseStatus } from './components/LicenseStatus';
const APP_VERSION = "1.0.2";
const DEFAULT_MODEL = 'Omni Flash';
const MODELS = [
  'Omni Flash', 
  'Veo 3.1 - Lite', 
  'Veo 3.1 - Fast', 
  'Veo 3.1 - Quality'
];
// --- LOCK BLOCKS (VIETNAMESE FOR IMAGE PROMPTS) ---
const IDENTITY_LOCK_VN = "giữ khuôn mặt, kiểu tóc, màu tóc, dáng người, chiều cao và làn da của nhân vật chính xác 100% như ảnh tham chiếu, không thay đổi nhận diện, không làm đẹp ảo hóa";
const OUTFIT_LOCK_VN = "giữ nguyên chính xác bộ trang phục như trong ảnh tham chiếu, cùng phong cách, màu sắc, chất liệu vải và họa tiết, không thay đổi hay thêm bớt phụ kiện";
const FOCUS_LOCK_VN = "sản phẩm (giày/sandal) phải luôn là tiêu điểm sắc nét nhất trong khung hình, sử dụng độ sâu trường ảnh mỏng (bokeh) để làm nổi bật sản phẩm hơn các vùng cơ thể khác, ánh sáng ưu tiên cho sản phẩm";
const PRODUCT_SHAPE_LOCK_VN = "giữ nguyên chính xác tuyệt đối hình dáng, cấu tạo, kiểu khóa/quai/dây, chất liệu, màu sắc và mọi chi tiết thiết kế của sản phẩm đúng như ảnh gốc {product_image}, không suy diễn thêm, không thay đổi hay thêm bớt bất kỳ chi tiết cấu tạo nào không có trong ảnh gốc";
// --- LOCK BLOCKS (ENGLISH FOR VIDEO PROMPTS) ---
const IDENTITY_LOCK_EN = "keep the character's face, hairstyle, hair color, body shape, height and skin tone exactly identical to the reference image, no alterations, no beautification, do not change facial identity";
const OUTFIT_LOCK_EN = "keep the exact same outfit as shown in the reference image, same style, color, fabric and pattern, no changes, no added or removed accessories";
const FOCUS_LOCK_EN = "the product (shoes) must remain the sharpest focal point in the frame at all times, use shallow depth of field to emphasize the footwear over other body areas, lighting should prioritize the product";
const PRODUCT_SHAPE_LOCK_EN = "keep the product's shape, structure, buckle/strap/lace type, material, color and all design details exactly identical to the original image, do not add or remove any structural details not present in the reference";
// --- PHOTO PROMPT CONSTRAINTS ---
const ENFORCE_PHOTOREAL = "phong cách ảnh chụp thực tế (photorealistic), chất lượng ảnh cao, ánh sáng studio làm nổi bật chất liệu da/vải và form dáng đế giày, nền vải xám nhạt trơn không hoạ tiết, lấy nét toàn bộ sản phẩm 100%, không có người, phong cách chụp thương mại tối giản, product photography.";
const NEGATIVE_PROMPT = "sketch, pencil drawing, line art, illustration, cartoon, anime, black and white drawing, paper texture, hand-drawn, watercolor, painting style, blurry product, out of focus shoes, low detail footwear";
const SCENES_CONFIG = [
  { id: 1, label: "Unboxing sản phẩm", prompt_template: "Sản phẩm giày đặt trong hộp giấy màu be, chụp góc chéo trên xuống 45 độ, ánh sáng studio làm nổi bật chất liệu da/vải và form dáng đế giày, nền vải xám nhạt trơn không hoạ tiết, lấy nét toàn bộ sản phẩm 100%, không có người, phong cách chụp thương mại tối giản, product photography.", video_action_context: "Static top-down camera, slow subtle zoom-in on the shoes inside the box over 4 seconds, studio lighting remains constant, no camera shake." },
  { id: 2, label: "Tay chạm sản phẩm", prompt_template: "Cận cảnh bàn tay người (móng tay tự nhiên, không sơn màu nổi) đang nhẹ nhàng chạm/sờ vào bề mặt sản phẩm {product_image}, giữ nguyên chính xác 100% hình dáng, cấu tạo, chất liệu, màu sắc và mọi chi tiết của sản phẩm đúng như ảnh gốc, không tự ý thêm/bớt hay thay đổi bất kỳ chi tiết cấu tạo nào (khóa, quai, dây, đế, hoạ tiết...), sản phẩm đặt trên sàn gỗ hoặc thảm cói, góc máy cận cảnh top-down, ánh sáng tự nhiên từ cửa sổ, độ nét cao vào chi tiết logo và bề mặt sản phẩm, tạo cảm giác chân thực đời thường.", video_action_context: "Close-up top-down camera, a hand gently touches and feels the surface of the product over 4 seconds, slow natural motion, focus stays sharp on the texture and logo." },
  { id: 3, label: "KOC cầm sản phẩm", prompt_template: "Nhân vật tham chiếu đứng, hai tay cầm sản phẩm đưa ra phía trước ngang tầm ngực hướng về máy ảnh, sản phẩm là chủ thể tiền cảnh chiếm 40-50% khung hình và được lấy nét sắc nhất, khuôn mặt và thân người KOC ở hậu cảnh với độ nét nhẹ nhàng hơn (shallow depth of field), nền phòng ánh sáng ấm đơn giản.", video_action_context: "Static camera facing the subject, the character gently rotates the sandals in her hands to show both sides over a slow single motion, natural soft smile, hair moves slightly with the motion, shallow depth of field keeps the product in sharpest focus while the face is slightly softer, duration 4-5 seconds." },
  { id: 4, label: "Chân mang sản phẩm", prompt_template: "Cặp chân của nhân vật tham chiếu gác lên ghế gỗ, đã mang sản phẩm, khung hình cắt từ đầu gối trở xuống, KHÔNG lộ mặt, góc máy thấp hướng thẳng vào đôi giày làm chủ thể chính chiếm 60-70% khung, lấy nét sắc nhất vào giày, ánh sáng tự nhiên từ cửa sổ lớn phía sau, nền nội thất gỗ tối giản.", video_action_context: "Low-angle camera pointing at feet, the feet gently tilt or rotate to show the shoe's shape, subtle dolly camera movement around the shoes, consistent rim lighting, no face shown, 4 seconds." },
  { id: 5, label: "Toàn thân trong nhà", prompt_template: "Nhân vật tham chiếu đứng toàn thân, mang sản phẩm ở chân, dáng tự chụp qua gương, ống kính lấy nét chính vào đôi giày dưới chân trong khi phần thân trên hơi mềm nét hơn để dẫn mắt xuống sản phẩm, không gian phòng tối giản màu trắng kem, ánh sáng dịu chiếu rõ vào vùng chân.", video_action_context: "Camera zooms very slowly towards the character standing in front of a mirror, subtle weight shifts and natural body motion, outfit and hair sway slightly, focus remains sharpest on the feet and shoes at all times, duration 5 seconds." },
  { id: 6, label: "Ngoài trời, lifestyle", prompt_template: "Nhân vật tham chiếu ngồi trên bậc thềm đá ngoài trời, mang sản phẩm ở chân, tư thế ngồi nghiêng để đôi giày lộ rõ toàn bộ form dáng hướng về phía máy ảnh, ánh sáng ban ngày tự nhiên chiếu trực tiếp làm nổi bật màu sắc và chất liệu giày, lấy nét sắc nhất vào đôi giày dù khung hình là toàn thân, sân vườn đơn giản.", video_action_context: "Static or very slow horizontal pan, the character stretches or moves legs naturally to showcase the footwear, gentle wind affects hair and clothing, stable outdoor lighting, priority focus on the shoes, duration 5 seconds." }
];
export default function StoryboardStudio() {
  // --- PROTECTION STATE ---
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  const [cards, setCards] = useState<StoryboardCardData[]>(
    SCENES_CONFIG.map((scene, idx) => ({
      id: `scene-${scene.id}`,
      order: idx + 1,
      sceneId: scene.id,
      isGeneratingImage: false,
      isGeneratingVideo: false,
      isAnalyzing: false
    }))
  );
  const [settings, setSettings] = useState<AppSettings>({
    productReferences: [],
    aspectRatio: '16:9',
    videoModel: DEFAULT_MODEL
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
  useEffect(() => {
    // --- LICENSE CHECK ON MOUNT ---
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
      setSettings(s => ({ ...s, charReference: media }));
    } catch (e) {}
  };
  const handleUploadProducts = async () => {
    try {
      const media = await Flow.media.selectMultiple({ filter: 'image' });
      setSettings(s => ({ ...s, productReferences: [...s.productReferences, ...media] }));
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
        const sceneConfig = SCENES_CONFIG.find(s => s.id === card.sceneId)!;
        let generatedPrompt = `${visionDescription}. ${sceneConfig.video_action_context}.`;
        const sid = card.sceneId!;
        if (sid === 1 || sid === 2) generatedPrompt += ` PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}.`;
        else if (sid === 4) generatedPrompt += ` IDENTITY: ${IDENTITY_LOCK_EN}. PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}. FOCUS: ${FOCUS_LOCK_EN}.`;
        else generatedPrompt += ` IDENTITY: ${IDENTITY_LOCK_EN}. OUTFIT: ${OUTFIT_LOCK_EN}. PRODUCT_SHAPE: ${PRODUCT_SHAPE_LOCK_EN}. FOCUS: ${FOCUS_LOCK_EN}.`;
        
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
    if (!targetCard) return;
    const sceneConfig = SCENES_CONFIG.find(s => s.id === targetCard.sceneId);
    if (!sceneConfig) return;
    setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingImage: true, error: undefined } : c));
    setIsMergedOutdated(true);
    try {
      const refs = [settings.charReference, ...settings.productReferences].filter(Boolean).map(r => r!.mediaId);
      const sid = sceneConfig.id;
      let assembledPrompt = sceneConfig.prompt_template;
      if (sid === 1 || sid === 2) assembledPrompt += ` ${PRODUCT_SHAPE_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      else if (sid === 4) assembledPrompt += ` ${IDENTITY_LOCK_VN} ${PRODUCT_SHAPE_LOCK_VN} ${FOCUS_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      else assembledPrompt += ` ${IDENTITY_LOCK_VN} ${OUTFIT_LOCK_VN} ${PRODUCT_SHAPE_LOCK_VN} ${FOCUS_LOCK_VN} ${ENFORCE_PHOTOREAL}`;
      assembledPrompt += `. Tránh: ${NEGATIVE_PROMPT}.`;
      const res = await Flow.generate.image({
        prompt: assembledPrompt,
        referenceImageMediaIds: refs.length > 0 ? refs : undefined,
        aspectRatio: currentAspectRatio,
        modelDisplayName: '🍌 Nano Banana Pro'
      });
      setCards(prev => prev.map(c => c.id === id ? { ...c, image: res, isGeneratingImage: false } : c));
    } catch (e) {
      setCards(prev => prev.map(c => c.id === id ? { ...c, isGeneratingImage: false, error: 'Lỗi vẽ hình' } : c));
    }
  }, [settings.charReference, settings.productReferences, cards]);
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
        aspectRatio: currentAspectRatio,
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
  const handleDrawAll = () => cards.forEach(c => drawCard(c.id, settings.aspectRatio));
  
  const handleAnimateAll = async () => {
    const animationTargets = cards.filter(c => c.image && c.videoPrompt);
    if (animationTargets.length === 0) return;
    setAnimatingCount(0);
    
    const firstBatch = animationTargets.slice(0, 4);
    let completed = 0;
    await Promise.all(firstBatch.map(async c => {
      const ok = await animateCard(c.id, settings.aspectRatio, settings.videoModel);
      if (ok) { completed++; setAnimatingCount(prev => (prev || 0) + 1); }
    }));
    
    const secondBatch = animationTargets.slice(4);
    if (secondBatch.length > 0) {
      await Promise.all(secondBatch.map(async c => {
        const ok = await animateCard(c.id, settings.aspectRatio, settings.videoModel);
        if (ok) { completed++; setAnimatingCount(prev => (prev || 0) + 1); }
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
  // --- PROTECTION BLOCKS ---
  if (isLicensed === null) return null;
  if (isLicensed === false) return <LicenseGate onSuccess={() => setIsLicensed(true)} />;
  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F5F7] overflow-hidden text-[#1A1A1A] font-sans">
      <header className="h-16 px-4 lg:px-6 border-b border-[#E5E5EA] header-glass flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">{sidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
          <div className="flex items-baseline gap-2">
            <div className="flex items-center text-[18px] font-black tracking-tight">
              <span>STORYBOARD</span><span className="text-[#F31B17] ml-1">STUDIO</span>
            </div>
            <Badge color="red">v{APP_VERSION}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton 
            icon="search" 
            disabled={analyzingStatus !== null}
            onClick={handleAnalyzeImages}
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
          <ActionButton variant="solid" icon="merge" disabled={isMerging} onClick={handleConcatenate}>Ghép clip</ActionButton>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative w-full">
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-full w-[320px] bg-white border-r border-[#E5E5EA] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
          <div className="flex-1 overflow-y-auto sidebar-scroll p-6 flex flex-col gap-8">
            {/* Sidebar Header Brand */}
            <div className="flex flex-col mb-2">
              <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[40px] w-[120px] object-contain mb-1" />
              <a href="https://fastaivn.com" className="text-[9px] text-slate-500 hover:text-[#F31B17] mb-3 transition-colors">fastaivn.com</a>
            </div>
            <UploadBox 
              label="Ảnh nhân vật" icon="person" onUpload={handleUploadChar}
              onClear={() => setSettings(s => ({ ...s, charReference: undefined }))}
              items={[settings.charReference ? `data:${settings.charReference.mimeType};base64,${settings.charReference.base64}` : undefined]}
            />
            <UploadBox 
              label="Ảnh sản phẩm (Giày)" icon="inventory_2" multiple onUpload={handleUploadProducts}
              onClear={(idx) => setSettings(s => ({ ...s, productReferences: s.productReferences.filter((_, i) => i !== idx) }))}
              items={settings.productReferences.map(r => `data:${r.mimeType};base64,${r.base64}`)}
            />
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold text-[#1A1A1A]">Tỷ lệ khung hình</p>
              <div className="flex gap-2">
                {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                  <button key={ratio} onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio }))}
                    className={`flex-1 h-[48px] rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      settings.aspectRatio === ratio ? 'border-[#F31B17] bg-red-50 text-[#F31B17]' : 'border-[#D1D1D6] text-[#8E8E93]'
                    }`}>
                    <span className="material-symbols-outlined text-[20px]">{ratio === '16:9' ? 'rectangle' : 'smartphone'}</span>
                    <span className="text-[13px] font-bold">{ratio}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold text-[#1A1A1A]">Model tạo video</p>
              <div className="flex flex-col border border-[#D1D1D6] rounded-xl overflow-hidden">
                {MODELS.map(model => (
                  <button key={model} onClick={() => setSettings(s => ({ ...s, videoModel: model }))}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b border-[#F2F2F7] last:border-0 transition-colors ${settings.videoModel === model ? 'bg-[#F2F2F7]' : 'bg-white hover:bg-[#F2F2F7]'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.videoModel === model ? 'border-[#F31B17]' : 'border-[#D1D1D6]'}`}>
                      {settings.videoModel === model && <div className="w-2 h-2 rounded-full bg-[#F31B17]" />}
                    </div>
                    <span className={`text-[13px] font-medium ${settings.videoModel === model ? 'text-[#1A1A1A]' : 'text-[#8E8E93]'}`}>{model}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Sidebar Footer Info */}
            <div className="mt-auto pt-6 flex flex-col gap-2">
              <LicenseStatus />
              <p className="text-[9px] text-center text-slate-600 mt-2">App version {APP_VERSION}</p>
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
              <h3 className="text-[22px] font-black tracking-tight">Storyboard Pipeline</h3>
              <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">Trình tạo kịch bản 6 cảnh quay chuyên nghiệp</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 w-full pb-20">
            {cards.map((card, idx) => (
              <StoryboardCard 
                key={card.id} data={card} isProcessing={false}
                onOpenLightbox={() => setLightboxIndex(idx)}
                onDraw={() => drawCard(card.id, settings.aspectRatio)}
                onAnimate={() => animateCard(card.id, settings.aspectRatio, settings.videoModel)}
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
          aspectRatio={settings.aspectRatio} 
          onClose={() => setLightboxIndex(null)}
          onPrev={lightboxIndex !== 'merged' && lightboxIndex! > 0 ? () => setLightboxIndex(lightboxIndex as number - 1) : undefined}
          onNext={lightboxIndex !== 'merged' && lightboxIndex! < cards.length - 1 ? () => setLightboxIndex(lightboxIndex as number + 1) : undefined}
          title={lightboxIndex === 'merged' ? 'Bản ghép cuối' : `Cảnh ${cards[lightboxIndex as number].order}: ${SCENES_CONFIG.find(s => s.id === cards[lightboxIndex as number].sceneId)?.label}`}
        />
      )}
    </div>
  );
}