import JSZip from 'jszip';
import { AppConfig, Scene, ImageResult, VoiceType, AudioMode, AspectRatio, PaperStyle, StickmanType, StoryRhythm } from './types';
import { PAPER_STYLES, STICKMAN_TYPES, RHYTHMS, VOICE_TYPES, AUDIO_MODES, ASPECT_RATIOS, PARALLEL_OPTIONS, GET_SYSTEM_PROMPT } from './constants';
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
    voiceType: VOICE_TYPES[0],
    audioMode: 'Chỉ thuyết minh',
    maxParallel: 2,
    productName: '',
    productDesc: '',
  });
  
  const [theme, setTheme] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    `;
    document.head.appendChild(style);
    ffmpegService.load().then(() => setIsFFmpegReady(true));
  }, []);
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
  const updateSceneField = (id: number, field: keyof Scene, value: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
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
      const musicPrompt = config.audioMode === 'Thuyết minh & Nhạc nền' ? 'with cinematic background music matching the mood' : 'no background music';
      const audioPrompt = `VIETNAMESE AUDIO NARRATION ONLY. 
      Voice Actor Profile: ${config.voiceType.prompt}. 
      Speaking Mood: ${config.rhythm}. 
      Spoken Text: "${scene.voiceScript}".
      Audio Layering: ${musicPrompt}.`;
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
      await Flow.download({ base64, mimeType: 'video/mp4', filename: 'story_final.mp4' });
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
      {/* Sidebar */}
      <div className="border-r border-white/10 flex flex-col justify-between p-3 w-[300px] h-full bg-[#0e0e0e] shrink-0">
        <div className="flex flex-col gap-6 overflow-y-auto dark-scrollbar pr-1">
          <div className="flex flex-col gap-3">
            <SectionLabel>Tùy chỉnh Nghệ thuật</SectionLabel>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/30 uppercase pl-2">Giấy & Nét vẽ</span>
                <FieldDropdown value={config.paperStyle} options={PAPER_STYLES} onChange={(v) => setConfig(p => ({ ...p, paperStyle: v as PaperStyle }))} />
                <FieldDropdown value={config.stickmanType} options={STICKMAN_TYPES} onChange={(v) => setConfig(p => ({ ...p, stickmanType: v as StickmanType }))} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/30 uppercase pl-2">Thuyết minh & Âm thanh</span>
                <FieldDropdown value={config.voiceType.label} options={VOICE_TYPES.map(v => v.label)} onChange={(v) => {
                  const selected = VOICE_TYPES.find(item => item.label === v);
                  if (selected) setConfig(p => ({ ...p, voiceType: selected }));
                }} />
                <FieldDropdown value={config.audioMode} options={AUDIO_MODES} onChange={(v) => setConfig(p => ({ ...p, audioMode: v as AudioMode }))} />
                <FieldDropdown value={config.rhythm} options={RHYTHMS} onChange={(v) => setConfig(p => ({ ...p, rhythm: v as StoryRhythm }))} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SectionLabel>Kỹ thuật Video</SectionLabel>
            <div className="grid grid-cols-4 gap-1">
              {ASPECT_RATIOS.map(ar => (
                <button key={ar.value} onClick={() => setConfig(p => ({ ...p, aspectRatio: ar.value as AspectRatio }))} className={`h-[28px] rounded-lg text-[10px] font-bold border transition-all ${config.aspectRatio === ar.value ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:bg-white/5'}`}>{ar.label}</button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] text-white/50">Model</span>
                <span className="text-[11px] text-white/80">{config.videoModel}</span>
              </div>
              <FieldDropdown value={config.videoModel} options={VIDEO_MODELS} onChange={(v) => setConfig(p => ({ ...p, videoModel: v }))} />
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] text-white/50">Độ dài: {config.duration}s</span>
              </div>
              <SegmentedToggle value={String(config.duration)} items={[{value: '4', label: '4s'}, {value: '6', label: '6s'}, {value: '8', label: '8s'}, {value: '10', label: '10s'}]} onChange={(v) => setConfig(p => ({ ...p, duration: Number(v) }))} />
              
              {/* PHẦN CẤU HÌNH SỐ LUỒNG MỚI */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[11px] text-white/50 font-medium">Số luồng</span>
                  <div className="flex gap-1">
                    {PARALLEL_OPTIONS.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setConfig(p => ({ ...p, maxParallel: Number(opt) }))}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all ${config.maxParallel === Number(opt) ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-[9px] text-white/20 italic leading-tight">Số luồng càng cao, tốc độ tạo ảnh/video càng nhanh nhưng yêu cầu tài khoản ổn định.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
          {currentStep > 1 && <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">restart_alt</span>} onClick={() => setCurrentStep(1)}>Làm lại từ đầu</PillButton>}
          <div className="text-[9px] text-white/20 text-center uppercase tracking-widest">Người Que Kể Chuyện v2.0</div>
        </div>
      </div>
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-12 paper-bg dark-scrollbar">
        {error && (
          <div className="fixed top-6 right-6 z-[100] max-w-sm">
            <div className="bg-red-500/90 backdrop-blur-md p-4 rounded-2xl flex items-start gap-3 shadow-2xl text-white">
              <span className="material-symbols-outlined">error</span>
              <div className="flex-1 text-xs">{error}</div>
              <button onClick={() => setError(null)}><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
          </div>
        )}
        
        {concatStatus && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
            <p className="text-xl font-medium">{concatStatus}</p>
          </div>
        )}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto py-10 space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-white">Người Que Kể Chuyện</h1>
              <div className="text-white/60 space-y-1 text-sm border-l-2 border-white/10 pl-4">
                <p>Phong cách tối giản của người que đen trắng rất phù hợp để truyền tải các thông điệp sâu sắc, các bài học cuộc sống mà không làm người xem bị phân tâm bởi hình ảnh quá sặc sỡ. Nên phù hợp với các dạng:</p>
                <ul className="list-disc list-inside mt-2 space-y-0.5 text-white/50">
                  <li>Kênh Video Đạo lý / Triết lý nhân sinh</li>
                  <li>Kể chuyện thương hiệu (Brand Storytelling) & Bán sách/Khóa học</li>
                  <li>Nội dung Giáo dục / Truyện ngụ ngôn thiếu nhi</li>
                  <li>Video Chữa lành (Healing)</li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
              {/* Cột trái: Sản phẩm */}
              <div className="space-y-4">
                <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-5">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Quảng bá sản phẩm (Tùy chọn)</span>
                  <button onClick={handleSelectProductImage} className="w-full aspect-square rounded-2xl border border-dashed border-white/10 hover:border-white/30 flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative group">
                    {config.productImage ? (
                      <img src={`data:${config.productImage.mimeType};base64,${config.productImage.base64}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-white/20 text-4xl">add_photo_alternate</span>
                    )}
                  </button>
                  <input 
                    type="text" 
                    placeholder="Tên sản phẩm..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20" 
                    value={config.productName} 
                    onChange={(e) => setConfig(p => ({...p, productName: e.target.value}))} 
                  />
                  <textarea 
                    placeholder="Mô tả sản phẩm..." 
                    className="w-full h-[100px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 resize-none" 
                    value={config.productDesc} 
                    onChange={(e) => setConfig(p => ({...p, productDesc: e.target.value}))} 
                  />
                </div>
              </div>
              {/* Cột phải: Nhập ý tưởng + Nút bắt đầu */}
              <div className="space-y-6 flex flex-col h-full">
                <textarea 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)} 
                  placeholder="Nhập ý tưởng cốt truyện của bạn... (Ví dụ: Một người que học cách buông bỏ những gánh nặng quá khứ để bắt đầu hành trình mới)" 
                  className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-8 text-xl focus:outline-none focus:border-white/20 transition-all resize-none leading-relaxed placeholder:text-white/5" 
                />
                
                <div className="flex justify-start">
                  <button 
                    disabled={!theme.trim() || isProcessing} 
                    onClick={() => generateScript(theme)}
                    className="h-[64px] px-12 rounded-full bg-white text-black font-black text-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <span className="material-symbols-outlined">magic_button</span>}
                    BẮT ĐẦU KỂ CHUYỆN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Kịch bản & Thuyết minh</h2>
                <p className="text-white/40 text-sm">Chỉnh sửa trực tiếp tên cảnh và lời thoại bên dưới.</p>
              </div>
              <button onClick={() => setCurrentStep(3)} className="h-[48px] px-8 rounded-full bg-white text-black font-bold">TIẾP TỤC: DỰNG PHIM</button>
            </div>
            <div className="space-y-6">
              {scenes.map(s => (
                <div key={s.id} className={`p-6 rounded-3xl border ${s.isProductAd ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/10 bg-white/5'} space-y-4`}>
                  <div className="flex gap-4 items-start">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black bg-white/10">{s.id}</span>
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        value={s.textVi} 
                        onChange={(e) => updateSceneField(s.id, 'textVi', e.target.value)}
                        className="w-full bg-transparent border-none text-xl font-bold text-white focus:outline-none p-0"
                        placeholder="Tên cảnh..."
                      />
                      <textarea 
                        value={s.voiceScript} 
                        onChange={(e) => updateSceneField(s.id, 'voiceScript', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/70 italic focus:outline-none focus:border-white/20 resize-none h-[80px]"
                        placeholder="Lời thuyết minh..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center sticky top-0 bg-[#0e0e0e]/90 backdrop-blur-md z-20 py-6 border-b border-white/10">
              <div className="flex gap-3">
                <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">photo_library</span>} onClick={generateAllImages}>VẼ TẤT CẢ PHÁC THẢO</PillButton>
                <PillButton variant="outline" icon={<span className="material-symbols-outlined text-[18px]">movie</span>} onClick={generateAllVideos}>DỰNG TOÀN BỘ CLIP</PillButton>
              </div>
              <div className="flex gap-3">
                <PillButton variant="solid" icon={<span className="material-symbols-outlined text-[18px]">merge</span>} onClick={handleMergeClips} disabled={!!concatStatus}>XUẤT VIDEO CUỐI</PillButton>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12">
              {scenes.map((scene) => (
                <div key={scene.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 rounded-[40px] border relative ${scene.isProductAd ? 'border-amber-500/20 bg-amber-500/[0.02]' : 'border-white/5'}`}>
                  <div className="absolute top-6 right-6 z-10">
                    <button 
                      onClick={() => setScenes(prev => prev.map(s => s.id === scene.id ? {...s, isSelected: !s.isSelected} : s))}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${scene.isSelected ? 'bg-white border-white text-black' : 'border-white/20 text-transparent hover:border-white/40'}`}
                    >
                      <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Bước 1: Chọn phác thảo</span>
                      <h3 className="text-xl font-bold">{scene.textVi}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1].map(idx => {
                        const img = scene.imageResults[idx];
                        const isSelected = scene.selectedImageIndex === idx;
                        return (
                          <div key={idx} className={`relative rounded-2xl overflow-hidden border-4 transition-all aspect-[3/4] ${isSelected ? 'border-white shadow-2xl' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                            {scene.imageStatus === 'generating' ? (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-6 h-6 border-2 border-t-white rounded-full animate-spin"></div></div>
                            ) : img ? (
                              <img src={`data:${img.mimeType};base64,${img.base64}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setScenes(prev => prev.map(s => s.id === scene.id ? {...s, selectedImageIndex: idx} : s))} />
                            ) : (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="material-symbols-outlined text-white/5 text-4xl">image</span></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => generateImage(scene.id, scenes[0]?.imageResults[0]?.mediaId)} className="flex-1 h-[44px] rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 uppercase tracking-wider">VẼ LẠI CLIP NÀY</button>
                      {scene.imageResults.length > 0 && <button onClick={() => handleDownloadMedia(scene.imageResults[scene.selectedImageIndex].base64, scene.imageResults[scene.selectedImageIndex].mimeType, 'image', scene.id)} className="w-[44px] h-[44px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><span className="material-symbols-outlined">download</span></button>}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Bước 2: Dựng Video & Lồng tiếng</span>
                      <div className="text-sm italic text-white/50">"{scene.voiceScript}"</div>
                    </div>
                    <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-black aspect-[9/16] max-h-[500px] flex items-center justify-center shadow-2xl mx-auto w-full`}>
                      {scene.videoStatus === 'generating' && (
                        <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-4">
                          <div className="w-12 h-12 border-4 border-t-white border-white/10 rounded-full animate-spin"></div>
                          <span className="text-[10px] font-black tracking-widest text-center px-6">ĐANG DỰNG CLIP & THUYẾT MINH VỚI GIỌNG {config.voiceType.label.toUpperCase()}...</span>
                        </div>
                      )}
                      {scene.videoResult ? (
                        <video src={`data:${scene.videoResult.mimeType};base64,${scene.videoResult.base64}`} className="w-full h-full object-cover" controls loop />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-white/5">
                          <span className="material-symbols-outlined text-8xl">movie</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {scene.videoResult && (
                          <button onClick={() => handleDownloadMedia(scene.videoResult!.base64, scene.videoResult!.mimeType, 'video', scene.id)} className="w-[48px] h-[48px] rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">download</span>
                          </button>
                        )}
                        <button 
                          disabled={scene.imageResults.length === 0 || scene.videoStatus === 'generating'} 
                          onClick={() => generateVideo(scene.id)}
                          className="h-[48px] px-6 rounded-2xl bg-white text-black font-black text-xs shadow-2xl shadow-black/50 uppercase tracking-wider"
                        >
                          DỰNG CLIP
                        </button>
                      </div>
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