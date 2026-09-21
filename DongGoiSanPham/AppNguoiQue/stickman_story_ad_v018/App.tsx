import React, { useState, useEffect, useMemo } from 'react';
import { Flow } from 'flow-sdk';
import JSZip from 'jszip';
import { AppConfig, Scene, ImageResult, VoiceType, AspectRatio, PaperStyle, StickmanType, StoryRhythm } from './types';
import { SUGGESTED_THEMES, PAPER_STYLES, STICKMAN_TYPES, RHYTHMS, VOICE_TYPES, ASPECT_RATIOS, PARALLEL_OPTIONS, GET_SYSTEM_PROMPT } from './constants';
import { SectionLabel, PillButton, FieldDropdown, SegmentedToggle } from './components/Primitives';
import { ffmpegService } from './services/ffmpegService';
const VIDEO_MODELS = [
  'Omni 1.1 Flash',
  'Veo 3.1 - Lite',
  'Veo 3.1 - Fast',
  'Veo 3.1 - Quality'
];
export default function StickmanStoryApp() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [config, setConfig] = useState<AppConfig>({
    videoModel: 'Omni 1.1 Flash',
    imageModel: '🍌 Nano Banana Pro',
    aspectRatio: '9:16',
    duration: 8,
    paperStyle: 'Giấy trắng nhăn',
    stickmanType: 'Mực đen tối giản',
    rhythm: 'Nhẹ nhàng',
    voiceType: 'Giọng Truyền Cảm',
    maxParallel: 2,
    productName: '',
    productDesc: '',
  });
  
  const [theme, setTheme] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [isZipping, setIsZipping] = useState(false);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);
  const [concatStatus, setConcatStatus] = useState<string | null>(null);
  useEffect(() => {
    const id = 'stickman-global-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .paper-bg { background-color: #0e0e0e; background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%); }
      .dark-scrollbar { scrollbar-width: thin; scrollbar-color: #333 transparent; }
      .dark-scrollbar::-webkit-scrollbar { width: 4px; }
      .dark-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .dark-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      @keyframes pulse-soft { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
      .animate-pulse-soft { animation: pulse-soft 2s infinite ease-in-out; }
      @keyframes dropdown-enter { from { opacity: 0; transform: scale(0.95) translateY(-5px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .animate-dropdown { animation: dropdown-enter 0.15s ease-out forwards; }
    `;
    document.head.appendChild(style);
    
    ffmpegService.load().then(() => setIsFFmpegReady(true));
  }, []);
  const handleDownloadCode = async () => {
    if (password !== 'Fast@006') {
      setError("Mật khẩu không chính xác.");
      return;
    }
    setIsZipping(true);
    try {
      const zip = new JSZip();
      zip.file("App.tsx", "/* Vui lòng copy nội dung file App.tsx từ tab CODE trong Flow. */");
      const base64 = await zip.generateAsync({ type: "base64" });
      await Flow.download({ base64, mimeType: "application/zip", filename: "stickman_story_pro_codes.zip" });
      setShowPasswordInput(false);
      setPassword('');
      setShowVersionModal(false);
    } catch (err) {
      setError("Không thể nén mã nguồn.");
    } finally {
      setIsZipping(false);
    }
  };
  const handleSelectProductImage = async () => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        setConfig(prev => ({
          ...prev,
          productImage: { mediaId: media.mediaId, base64: media.base64, mimeType: media.mimeType }
        }));
      }
    } catch (err) {
      console.error("Lỗi chọn ảnh:", err);
    }
  };
  const generateScript = async (inputTheme: string) => {
    if (!inputTheme.trim()) return;
    setTheme(inputTheme);
    setIsProcessing(true);
    setError(null);
    try {
      const hasProduct = !!config.productImage;
      const response = await Flow.generate.text(
        `Chủ đề: "${inputTheme}". Nền: ${config.paperStyle}. Vẽ bằng: ${config.stickmanType}. Nhịp điệu: ${config.rhythm}.`,
        { systemInstruction: GET_SYSTEM_PROMPT(hasProduct, config.productName, config.productDesc) }
      );
      const text = response.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);
      setScenes(parsed.map((s: any, idx: number) => ({
        ...s, id: idx + 1, imageStatus: 'idle', imageResults: [], selectedImageIndex: 0, videoStatus: 'idle', isSelected: true
      })));
      setCurrentStep(2);
    } catch (err) {
      setError("Không thể tạo kịch bản. Thử lại với chủ đề khác.");
    } finally {
      setIsProcessing(false);
    }
  };
  const generateImage = async (sceneId: number, styleRefId?: string) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, imageStatus: 'generating', imageResults: [] } : s));
    try {
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene) return null;
      const results: ImageResult[] = [];
      const prompt = `${scene.promptEn}. Background: ${config.paperStyle}, Drawing Style: ${config.stickmanType}, Mood: ${config.rhythm}.`;
      for (let i = 0; i < 2; i++) {
        const referenceIds = [];
        if (styleRefId) referenceIds.push(styleRefId);
        if (scene.isProductAd && config.productImage) referenceIds.push(config.productImage.mediaId);
        const res = await Flow.generate.image({
          prompt: prompt + (i > 0 ? " variation" : ""),
          modelDisplayName: config.imageModel,
          aspectRatio: config.aspectRatio,
          referenceImageMediaIds: referenceIds.length > 0 ? referenceIds : undefined
        });
        results.push({ base64: res.base64, mimeType: res.mimeType, mediaId: res.mediaId });
      }
      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, imageStatus: 'completed', imageResults: results } : s));
      return results[0];
    } catch (err) {
      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, imageStatus: 'error' } : s));
      return null;
    }
  };
  const generateVideo = async (sceneId: number) => {
    const scene = scenes.find(s => s.id === sceneId);
    const selectedImg = scene?.imageResults[scene.selectedImageIndex];
    if (!scene || !selectedImg) return;
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, videoStatus: 'generating' } : s));
    try {
      const audioPrompt = `VIETNAMESE AUDIO NARRATION: "${scene.voiceScript}". Mood: ${config.rhythm}.`;
      const videoRes = await Flow.generate.video({
        prompt: `${scene.promptEn}. ${audioPrompt}`,
        modelDisplayName: config.videoModel,
        aspectRatio: config.aspectRatio === '4:3' || config.aspectRatio === '1:1' ? '16:9' : config.aspectRatio as '16:9' | '9:16',
        durationSeconds: config.duration,
        firstFrameImageMediaId: selectedImg.mediaId
      });
      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, videoStatus: 'completed', videoResult: { base64: videoRes.base64, mimeType: videoRes.mimeType, mediaId: videoRes.mediaId } } : s));
    } catch (err) {
      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, videoStatus: 'error' } : s));
    }
  };
  const generateAllImages = async () => {
    const firstScene = scenes.find(s => s.id === 1);
    let scene1Ref = firstScene?.imageResults[0]?.mediaId;
    if (!scene1Ref) {
      const res = await generateImage(1);
      scene1Ref = res?.mediaId;
    }
    const remaining = scenes.filter(s => s.id !== 1 && s.imageStatus !== 'completed');
    for (let i = 0; i < remaining.length; i += config.maxParallel) {
      const chunk = remaining.slice(i, i + config.maxParallel);
      await Promise.all(chunk.map(s => generateImage(s.id, scene1Ref)));
    }
  };
  const generateAllVideos = async () => {
    const ready = scenes.filter(s => s.imageStatus === 'completed' && s.videoStatus !== 'completed');
    for (let i = 0; i < ready.length; i += config.maxParallel) {
      const chunk = ready.slice(i, i + config.maxParallel);
      await Promise.all(chunk.map(s => generateVideo(s.id)));
    }
  };
  const handleMergeClips = async () => {
    const selected = scenes.filter(s => s.isSelected && s.videoResult);
    if (selected.length < 2) {
      setError("Hãy chọn ít nhất 2 clip đã tạo xong để ghép.");
      return;
    }
    if (!isFFmpegReady) {
      setError("FFmpeg đang khởi động, vui lòng đợi...");
      return;
    }
    setConcatStatus("Đang ghép clips...");
    try {
      const fileNames: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        const name = `clip_${i}.mp4`;
        fileNames.push(name);
        const bytes = Uint8Array.from(atob(selected[i].videoResult!.base64), c => c.charCodeAt(0));
        await ffmpegService.writeFile(name, bytes);
      }
      const inputArgs: string[] = [];
      fileNames.forEach(name => inputArgs.push('-i', name));
      const filterInputs = fileNames.map((_, i) => `[${i}:v][${i}:a]`).join('');
      const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
      await ffmpegService.exec([
        ...inputArgs, '-filter_complex', filterComplex, '-map', '[outv]', '-map', '[outa]',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-c:a', 'aac', '-pix_fmt', 'yuv420p',
        '-movflags', 'faststart', '-y', 'output.mp4'
      ]);
      const outData = await ffmpegService.readFile('output.mp4') as Uint8Array;
      const base64 = btoa(Array.from(outData).map(b => String.fromCharCode(b)).join(''));
      await Flow.download({ base64, mimeType: 'video/mp4', filename: 'stickman_merged_story.mp4' });
      for (const f of fileNames) await ffmpegService.deleteFile(f);
      await ffmpegService.deleteFile('output.mp4');
      setConcatStatus(null);
    } catch (err) {
      setError("Lỗi ghép clip bằng FFmpeg.");
      setConcatStatus(null);
    }
  };
  const handleDownloadMedia = async (base64: string, mimeType: string, type: 'image' | 'video', sceneId: number) => {
    const ext = mimeType.split('/')[1] || (type === 'image' ? 'png' : 'mp4');
    await Flow.download({ base64, mimeType, filename: `stickman_scene_${sceneId}_${type}.${ext}` });
  };
  return (
    <div className="flex h-screen w-screen bg-[#0e0e0e] text-white overflow-hidden font-sans">
      {/* Sidebar - Always visible for quick tweaks in later steps */}
      <div className="border-r border-white/10 flex flex-col justify-between p-3 w-[280px] h-full bg-[#0e0e0e] shrink-0">
        <div className="flex flex-col gap-6 overflow-y-auto dark-scrollbar pr-1">
          <div className="flex flex-col gap-3">
            <SectionLabel>Phong cách Nghệ thuật</SectionLabel>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white/35 shrink-0">Phong cách</span>
                <div className="w-[150px]"><FieldDropdown value={config.paperStyle} options={PAPER_STYLES} onChange={(v) => setConfig(p => ({ ...p, paperStyle: v as PaperStyle }))} /></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white/35 shrink-0">Kiểu nét</span>
                <div className="w-[150px]"><FieldDropdown value={config.stickmanType} options={STICKMAN_TYPES} onChange={(v) => setConfig(p => ({ ...p, stickmanType: v as StickmanType }))} /></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white/35 shrink-0">Cảm xúc</span>
                <div className="w-[150px]"><FieldDropdown value={config.rhythm} options={RHYTHMS} onChange={(v) => setConfig(p => ({ ...p, rhythm: v as StoryRhythm }))} /></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white/35 shrink-0">Thuyết minh</span>
                <div className="w-[150px]"><FieldDropdown value={config.voiceType} options={VOICE_TYPES} onChange={(v) => setConfig(p => ({ ...p, voiceType: v as VoiceType }))} /></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SectionLabel>Cấu hình Media & Xử lý</SectionLabel>
            <div className="grid grid-cols-4 gap-1">
              {ASPECT_RATIOS.map(ar => (
                <button key={ar.value} onClick={() => setConfig(p => ({ ...p, aspectRatio: ar.value as AspectRatio }))} className={`h-[28px] rounded-lg text-[10px] font-bold border transition-all ${config.aspectRatio === ar.value ? 'bg-[#969696] text-black border-[#969696]' : 'border-white/10 text-white/40 hover:bg-white/5'}`}>{ar.label}</button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-white/35 shrink-0">Model video</span>
              <div className="w-[150px]"><FieldDropdown value={config.videoModel} options={VIDEO_MODELS} onChange={(v) => setConfig(p => ({ ...p, videoModel: v }))} /></div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-white/35 shrink-0">Số luồng</span>
              <div className="w-[100px]"><SegmentedToggle value={String(config.maxParallel)} items={PARALLEL_OPTIONS.map(opt => ({ value: opt, label: opt }))} onChange={(v) => setConfig(p => ({ ...p, maxParallel: Number(v) }))} /></div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-white/35 shrink-0">Thời lượng</span>
              <div className="w-[150px]"><SegmentedToggle value={String(config.duration)} items={[{value: '4', label: '4s'}, {value: '6', label: '6s'}, {value: '8', label: '8s'}, {value: '10', label: '10s'}]} onChange={(v) => setConfig(p => ({ ...p, duration: Number(v) }))} /></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
          {currentStep > 1 && <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">restart_alt</span>} onClick={() => setCurrentStep(1)}>Làm lại</PillButton>}
          <button onClick={() => setShowVersionModal(true)} className="text-[10px] text-white/20 hover:text-white/40 text-center py-1">App version 0.1.8</button>
        </div>
      </div>
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-12 paper-bg dark-scrollbar">
        {error && (
          <div className="fixed top-6 right-6 z-[100] max-w-sm animate-dropdown">
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-4 rounded-2xl flex items-start gap-3 shadow-2xl">
              <span className="material-symbols-outlined text-red-500 text-xl">error</span>
              <div className="flex-1 text-xs text-white/80">{error}</div>
              <button onClick={() => setError(null)}><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
          </div>
        )}
        
        {concatStatus && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-dropdown">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
            <p className="text-xl font-medium tracking-tight">{concatStatus}</p>
          </div>
        )}
        {/* Modal Version */}
        {showVersionModal && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-dropdown">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">Stickman Story Builder</h3>
                  <p className="text-white/40 text-sm">Phiên bản 0.1.8 - New Step 1 Layout</p>
                </div>
                <button onClick={() => setShowVersionModal(false)}><span className="material-symbols-outlined text-white/40">close</span></button>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-white/70">
                  <p>• Chuyển phần nhập thông tin sản phẩm sang cột bên phải ở Bước 1.</p>
                  <p>• Bố cục 2 cột cho Cốt truyện và Sản phẩm.</p>
                  <p>• Xóa các nút gợi ý chủ đề phía trên.</p>
                  <p>• Di chuyển nút Bắt đầu xuống dưới cùng.</p>
                </div>
                <PillButton variant="solid" onClick={() => setShowPasswordInput(true)}>Mở khóa tải mã nguồn</PillButton>
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto py-10 space-y-12 animate-dropdown">
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-white/90">Stickman Ad Storyteller</h1>
              <p className="text-white/40 mt-2">Dựng clip người que chuyên nghiệp với thuyết minh Tiếng Việt</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Left Column: Story Idea */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <span className="material-symbols-outlined text-white/40 text-xl">auto_stories</span>
                   <h3 className="text-[13px] font-bold uppercase tracking-wider text-white/60">Ý tưởng cốt truyện</h3>
                </div>
                <textarea 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)} 
                  placeholder="Nhập ý tưởng cốt truyện bằng Tiếng Việt. Ví dụ: Một câu chuyện về người que nhỏ bé tìm thấy một hạt giống lấp lánh và trồng nó lên thành cây đại thụ..." 
                  className="w-full h-[300px] bg-white/5 border border-white/10 rounded-3xl p-6 text-[15px] focus:outline-none focus:border-white/20 transition-colors resize-none leading-relaxed placeholder:text-white/10" 
                />
              </div>
              {/* Right Column: Product Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <span className="material-symbols-outlined text-white/40 text-xl">featured_video</span>
                   <h3 className="text-[13px] font-bold uppercase tracking-wider text-white/60">Thông tin sản phẩm (QC)</h3>
                </div>
                <div className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-4 shadow-2xl">
                  <button onClick={handleSelectProductImage} className="w-full aspect-video rounded-2xl border border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden relative group">
                    {config.productImage ? (
                      <>
                        <img src={`data:${config.productImage.mimeType};base64,${config.productImage.base64}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="material-symbols-outlined text-white">edit</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-white/20 text-4xl">add_photo_alternate</span>
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[1px]">Thêm ảnh sản phẩm</span>
                      </>
                    )}
                  </button>
                  <input 
                    type="text" 
                    placeholder="Tên sản phẩm..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-white/20" 
                    value={config.productName} 
                    onChange={(e) => setConfig(p => ({...p, productName: e.target.value}))} 
                  />
                  <textarea 
                    placeholder="Mô tả sản phẩm (tính năng, lợi ích...)" 
                    className="w-full h-[100px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-white/20 resize-none leading-normal" 
                    value={config.productDesc} 
                    onChange={(e) => setConfig(p => ({...p, productDesc: e.target.value}))} 
                  />
                </div>
                <p className="text-[10px] text-white/20 px-2 italic">Cảnh cuối cùng sẽ được AI tự động lồng ghép thông tin sản phẩm vào câu chuyện.</p>
              </div>
            </div>
            {/* Bottom Button */}
            <div className="flex justify-center pt-4">
              <button 
                disabled={!theme.trim() || isProcessing} 
                onClick={() => generateScript(theme)}
                className="group relative flex items-center justify-center gap-3 h-[56px] px-10 rounded-full bg-white text-black font-bold text-base shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                    <span>Đang soạn kịch bản...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined font-bold">auto_fix_high</span>
                    <span>Bắt đầu kể chuyện</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-dropdown">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium">Kịch bản chi tiết</h2>
              <div className="flex gap-2">
                <button onClick={() => setError("Hãy yêu cầu sửa kịch bản bằng tin nhắn chat.")} className="h-[34px] w-[150px] rounded-xl border border-white/10 px-[15px] text-[11px] font-medium hover:bg-white/5">Sửa kịch bản</button>
                <button onClick={() => setCurrentStep(3)} className="h-[34px] w-[150px] rounded-xl bg-white text-black px-[15px] text-[11px] font-bold">Dựng phim ngay</button>
              </div>
            </div>
            <div className="space-y-4 pb-20">
              {scenes.map(s => (
                <div key={s.id} className={`p-5 rounded-2xl border transition-colors ${s.isProductAd ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white/10">{s.id}</span>
                    <div className="flex-1 space-y-2">
                      <p className="text-lg text-white/90 font-medium">{s.textVi}</p>
                      <p className="text-sm text-white/60 italic leading-relaxed">"{s.voiceScript}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="max-w-6xl mx-auto space-y-10 animate-dropdown pb-20">
            <div className="flex justify-between items-center sticky top-0 bg-[#0e0e0e]/80 backdrop-blur-md z-20 py-4 border-b border-white/5">
              <div className="flex gap-2">
                <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">photo_library</span>} onClick={generateAllImages}>Tạo toàn bộ ảnh</PillButton>
                <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">movie</span>} onClick={generateAllVideos}>Tạo tất cả Clip</PillButton>
              </div>
              <div className="flex gap-2">
                <PillButton variant="solid" icon={<span className="material-symbols-outlined text-[18px]">merge</span>} onClick={handleMergeClips} disabled={!!concatStatus}>Ghép clip</PillButton>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-16">
              {scenes.map((scene) => (
                <div key={scene.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 rounded-3xl border relative ${scene.isProductAd ? 'border-amber-500/20 bg-amber-500/[0.02]' : 'border-white/5'}`}>
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      onClick={() => setScenes(prev => prev.map(s => s.id === scene.id ? {...s, isSelected: !s.isSelected} : s))}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${scene.isSelected ? 'bg-white border-white text-black' : 'border-white/20 text-transparent'}`}
                    >
                      <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white/80">Cảnh {scene.id}: {scene.textVi}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1].map(idx => {
                        const img = scene.imageResults[idx];
                        const isSelected = scene.selectedImageIndex === idx;
                        const aspectClassComp = config.aspectRatio === '9:16' ? 'aspect-[9/16] h-[250px]' : 'aspect-video w-full';
                        return (
                          <div key={idx} className={`relative rounded-xl overflow-hidden border-2 transition-all ${aspectClassComp} ${isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-white/5'}`}>
                            {scene.imageStatus === 'generating' ? (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-6 h-6 border-2 border-t-white rounded-full animate-spin"></div></div>
                            ) : img ? (
                              <>
                                <img src={`data:${img.mimeType};base64,${img.base64}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setScenes(prev => prev.map(s => s.id === scene.id ? {...s, selectedImageIndex: idx} : s))} />
                                {isSelected && <div className="absolute top-2 right-2 bg-amber-500 text-black rounded-full p-0.5"><span className="material-symbols-outlined text-[14px] font-bold">lock</span></div>}
                              </>
                            ) : (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined text-white/10">image</span></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <PillButton variant="outline" onClick={() => generateImage(scene.id, scenes[0]?.imageResults[0]?.mediaId)} disabled={scene.imageStatus === 'generating'}>Vẽ lại phác thảo</PillButton>
                      {scene.imageResults.length > 0 && <button onClick={() => handleDownloadMedia(scene.imageResults[scene.selectedImageIndex].base64, scene.imageResults[scene.selectedImageIndex].mimeType, 'image', scene.id)} className="w-10 h-[34px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><span className="material-symbols-outlined text-[18px]">download</span></button>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className={`relative rounded-2xl overflow-hidden border border-white/10 bg-black ${config.aspectRatio === '9:16' ? 'aspect-[9/16] h-[250px]' : 'aspect-video w-full'} flex items-center justify-center shadow-2xl mx-auto`}>
                      {scene.videoStatus === 'generating' && <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center gap-3"><div className="w-10 h-10 border-2 border-t-white rounded-full animate-spin"></div><span className="text-[10px] font-bold animate-pulse">ĐANG DỰNG CLIP & THUYẾT MINH...</span></div>}
                      {scene.videoResult ? <video src={`data:${scene.videoResult.mimeType};base64,${scene.videoResult.base64}`} className="w-full h-full object-cover" controls loop /> : <div className="text-white/5 flex flex-col items-center gap-3"><span className="material-symbols-outlined text-5xl">movie</span><span className="text-[10px] font-bold uppercase tracking-tighter">Chưa dựng video</span></div>}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        {scene.videoResult && <button onClick={() => handleDownloadMedia(scene.videoResult!.base64, scene.videoResult!.mimeType, 'video', scene.id)} className="w-10 h-[34px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">download</span></button>}
                        <PillButton variant="solid" icon={<span className="material-symbols-outlined text-[18px]">play_circle</span>} disabled={scene.imageResults.length === 0 || scene.videoStatus === 'generating'} onClick={() => generateVideo(scene.id)}>Dựng Video</PillButton>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                       <p className="text-[11px] uppercase text-white/30 font-bold mb-1">Thuyết minh:</p>
                       <p className="text-sm text-white/70 leading-relaxed italic border-l-2 border-amber-500/50 pl-3">"{scene.voiceScript}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}