import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { ffmpegService } from './services/ffmpegService';
import { 
  ASPECT_RATIOS, GENDERS, ACCENTS, SPEEDS, 
  VIDEO_MODELS, THREAD_OPTIONS, SYSTEM_PROMPT,
  ALLOWED_DURATIONS
} from './constants';
import { ProjectConfig, Shot, AspectRatio, Gender, Accent, Speed, OutfitMode } from './types';
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
import { LicenseStatus } from './components/LicenseStatus';
export default function App() {
  // --- Licensing ---
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  // --- States ---
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showConfig, setShowConfig] = useState(true);
  const [previewShot, setPreviewShot] = useState<Shot | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  
  // Config
  const [config, setConfig] = useState<ProjectConfig>({
    ratio: '9:16',
    gender: 'Nam',
    accent: 'Miền Bắc',
    speed: '1x',
    outfitMode: 'Thay trang phục',
    model: 'Omni 1.1 Flash',
    threads: 1
  });
  
  // Media
  const [mainChar, setMainChar] = useState<{ mediaId: string; base64: string; mimeType: string } | null>(null);
  const [outfitRef, setOutfitRef] = useState<{ mediaId: string; base64: string; mimeType: string } | null>(null);
  const [forgedChar, setForgedChar] = useState<{ mediaId: string; base64: string } | null>(null);
  const [isForging, setIsForging] = useState(false);
  
  // Scripting
  const [rawTranscript, setRawTranscript] = useState('');
  const [shots, setShots] = useState<Shot[]>([]);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  // --- Init ---
  useEffect(() => {
    checkLicense().then(result => {
      setIsLicensed(result.valid);
    });
    ffmpegService.load().then(() => setFfmpegReady(true));
  }, []);
  // --- Handlers ---
  const handleUploadMain = async () => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      if (!media) return;
      setMainChar({ mediaId: media.mediaId, base64: media.base64, mimeType: media.mimeType });
      setForgedChar(null); // Reset forge if main changes
      
      setStatus('Đang nhận diện giới tính...');
      const { text } = await Flow.generate.text(
        "Người trong ảnh là Nam hay Nữ? Chỉ trả về đúng 1 chữ: Nam hoặc Nữ",
        { images: [{ base64: media.base64, mimeType: media.mimeType }] }
      );
      const detected = text.trim().includes('Nữ') ? 'Nữ' : 'Nam';
      setConfig(prev => ({ ...prev, gender: detected }));
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
    }
  };
  const handleUploadOutfit = async () => {
    const media = await Flow.media.select({ filter: 'image' });
    if (media) {
      setOutfitRef({ mediaId: media.mediaId, base64: media.base64, mimeType: media.mimeType });
      setForgedChar(null); // Reset forge if outfit changes
    }
  };
  const handleForgeCharacter = async () => {
    if (!mainChar) return;
    setIsForging(true);
    setStatus('Đang ghép trang phục cho nhân vật...');
    try {
      const prompt = `Full body portrait of the exact person from the first reference image, wearing the exact outfit and clothing from the second reference image. Maintain anatomical facial features, exact eyes, nose, lips, and hairstyle of the original person. High fidelity, studio cinematic lighting, clean solid background, sharp detail.`;
      
      const result = await Flow.generate.image({
        prompt,
        referenceImageMediaIds: outfitRef ? [mainChar.mediaId, outfitRef.mediaId] : [mainChar.mediaId],
        modelDisplayName: '🍌 Nano Banana Pro',
        aspectRatio: config.ratio
      });
      setForgedChar({ mediaId: result.mediaId, base64: result.base64 });
    } catch (err) {
      console.error(err);
      alert('Không thể tạo nhân vật. Vui lòng thử lại.');
    } finally {
      setIsForging(false);
      setStatus('');
    }
  };
  const calculateDuration = useCallback((text: string, speedStr: string) => {
    const wordCount = text.split(/\s+/).length;
    const speed = parseFloat(speedStr.replace('x', ''));
    
    let dur = (wordCount / 4) * (1 / speed) * 1.5;
    dur = Math.ceil(dur / 2) * 2;
    if (dur < 2) dur = 2;
    if (dur > 10) dur = 10;
    
    return dur;
  }, []);
  const handleGenerateScript = async () => {
    if (!rawTranscript || (!mainChar && !forgedChar)) return;
    setLoading(true);
    setStatus('Đang phân tích script & thiết kế cảnh quay...');
    try {
      let finalSystemPrompt = SYSTEM_PROMPT;
      if (config.outfitMode === 'Cố định') {
        finalSystemPrompt = finalSystemPrompt
          .replace(
            "Mỗi shot phải có sự thay đổi về Text, Icon/Graphic, hoặc Background/Trang phục.",
            "Mỗi shot phải có sự thay đổi về Text, Icon/Graphic, hoặc Background"
          )
          .replace(
            "- Magic Transitions: Đổi phông nền chớp nóng, đổi trang phục tức thì.",
            "- Magic Transitions: Đổi phông nền chớp nhoáng."
          );
      }
      const { text } = await Flow.generate.text(
        `SCRIPT:\n${rawTranscript}\n\nSelected Ratio: ${config.ratio}`,
        { systemInstruction: finalSystemPrompt, thinkingLevel: 'medium' }
      );
      
      const jsonStr = text.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      const generatedShots = parsed.shots.map((s: any) => ({
        ...s,
        duration: calculateDuration(s.transcript, config.speed),
        isSelected: true
      }));
      
      setShots(generatedShots);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert('Không thể tạo kịch bản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };
  const generateSingleVideo = async (shotIndex: number) => {
    const shot = shots[shotIndex];
    if (shot.isGenerating) return;
    const updatedShots = [...shots];
    updatedShots[shotIndex].isGenerating = true;
    updatedShots[shotIndex].videoBase64 = undefined;
    updatedShots[shotIndex].error = undefined;
    setShots(updatedShots);
    try {
      const audioInstr = `VIETNAMESE AUDIO NARRATION ONLY. Voice Actor: ${config.gender}, ${config.accent} Vietnam accent. Speaking Speed: ${config.speed}. Spoken Text: "${shot.transcript}".`;
      
      let outfitConstraint = "";
      if (config.outfitMode === 'Cố định') {
        outfitConstraint = "\nSTRICT REQUIREMENT: The character's outfit and appearance MUST remain IDENTICAL to the provided reference image. Do not change or alter clothing.";
      }
      let fullPrompt = `${shot.prompt}${outfitConstraint}\n\n${audioInstr}`;
      
      const referenceId = forgedChar?.mediaId || mainChar?.mediaId;
      if (!referenceId) throw new Error("No character reference available");
      const mediaIds = [referenceId];
      const callApi = async (modelName: string) => {
        return await Flow.generate.video({
          prompt: fullPrompt,
          referenceImageMediaIds: mediaIds,
          modelDisplayName: modelName,
          aspectRatio: config.ratio === '16:9' || config.ratio === '9:16' ? config.ratio : '16:9',
          durationSeconds: shot.duration as any
        });
      };
      let video;
      try {
        video = await callApi(config.model);
      } catch (genErr) {
        if (config.model.includes('Veo')) {
          video = await callApi('Omni 1.1 Flash');
        } else {
          throw genErr;
        }
      }
      setShots(prev => {
        const next = [...prev];
        next[shotIndex].videoBase64 = video.base64;
        next[shotIndex].isGenerating = false;
        return next;
      });
    } catch (err: any) {
      setShots(prev => {
        const next = [...prev];
        next[shotIndex].isGenerating = false;
        next[shotIndex].error = err.message;
        return next;
      });
    }
  };
  const handleGenerateAll = async () => {
    const queue = shots
      .map((_, i) => i)
      .filter(i => !shots[i].videoBase64 && !shots[i].isGenerating);
    
    let active = 0;
    const processQueue = async () => {
      while (queue.length > 0) {
        if (active < config.threads) {
          const index = queue.shift()!;
          active++;
          generateSingleVideo(index).finally(() => {
            active--;
            processQueue();
          });
        } else {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };
    processQueue();
  };
  const handleMerge = async () => {
    const selected = shots.filter(s => s.isSelected && s.videoBase64);
    if (selected.length < 2) {
      alert('Chọn ít nhất 2 cảnh để ghép.');
      return;
    }
    setLoading(true);
    setStatus('Đang chuẩn bị file...');
    setMergeProgress(0);
    try {
      const fileNames: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        setStatus(`Đang nạp file ${i + 1}/${selected.length}...`);
        const name = `clip_${i}.mp4`;
        fileNames.push(name);
        const bytes = Uint8Array.from(atob(selected[i].videoBase64!), c => c.charCodeAt(0));
        await ffmpegService.writeFile(name, bytes);
        setMergeProgress(Math.round(((i + 1) / selected.length) * 100));
      }
      setStatus('Đang ghép các cảnh video...');
      const inputArgs: string[] = [];
      fileNames.forEach(name => inputArgs.push('-i', name));
      
      const filterInputs = fileNames.map((_, i) => `[${i}:v][${i}:a]`).join('');
      const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
      ffmpegService.onProgress(({ progress }) => {
        setMergeProgress(Math.min(100, Math.round(progress * 100)));
      });
      await ffmpegService.exec([
        ...inputArgs,
        '-filter_complex', filterComplex,
        '-map', '[outv]',
        '-map', '[outa]',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-c:a', 'aac',
        '-pix_fmt', 'yuv420p',
        '-movflags', 'faststart',
        '-y', 'merged_output.mp4',
      ]);
      setStatus('Đang tải xuống video hoàn thiện...');
      const data = await ffmpegService.readFile('merged_output.mp4') as Uint8Array;
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await Flow.download({
          base64,
          mimeType: 'video/mp4',
          filename: `TechCreator_Final_${Date.now()}.mp4`
        });
      };
      reader.readAsDataURL(new Blob([data.buffer]));
      for (const name of fileNames) await ffmpegService.deleteFile(name);
      await ffmpegService.deleteFile('merged_output.mp4');
    } catch (err) {
      console.error(err);
      alert('Ghép video thất bại.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };
  const handleDownloadSingle = async (shot: Shot) => {
    if (!shot.videoBase64) return;
    await Flow.download({
      base64: shot.videoBase64,
      mimeType: 'video/mp4',
      filename: `Shot_${shot.number}.mp4`
    });
  };
  // --- Render Protection ---
  if (isLicensed === null) return null;
  if (isLicensed === false) {
    return <LicenseGate onSuccess={() => setIsLicensed(true)} />;
  }
  return (
    <div className="flex h-full bg-[#0d0b14] text-white overflow-hidden font-sans relative">
      {/* Configuration Toggle */}
      <button 
        onClick={() => setShowConfig(!showConfig)}
        className={`absolute z-[70] top-1/2 -translate-y-1/2 w-6 h-12 bg-slate-800/90 border border-red-500/30 rounded-r-lg flex items-center justify-center transition-all duration-300 shadow-xl ${showConfig ? 'left-[320px]' : 'left-0'}`}
      >
        <span className="text-xs font-black text-[#F31B17]">
          {showConfig ? '<<' : '>>'}
        </span>
      </button>
      {/* Sidebar */}
      <aside className={`border-r border-red-900/10 bg-[#12101a] flex flex-col transition-all duration-300 relative z-[60] ${showConfig ? 'w-80 p-5' : 'w-0 p-0 overflow-hidden opacity-0 pointer-events-none'}`}>
        <header className="mb-2 shrink-0 flex flex-col items-center">
          <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[40px] w-[120px] object-contain mb-1" />
          <a href="https://fastaivn.com" target="_blank" rel="noopener noreferrer" className="text-[9px] text-slate-500 hover:text-[#F31B17] mb-3">fastaivn.com</a>
          <h1 className="text-sm font-black uppercase tracking-tighter text-[#F31B17] flex items-center gap-2 text-center">
            <span className="material-symbols-outlined">movie_filter</span>
            Podcast Studio
          </h1>
        </header>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto mt-4 custom-scrollbar pr-1 pb-4">
          <section className="space-y-3">
             <div className="flex flex-wrap gap-1">
               {ASPECT_RATIOS.map(r => (
                 <button 
                   key={r}
                   onClick={() => setConfig({...config, ratio: r as any})}
                   className={`flex-1 min-w-[50px] py-2 text-[10px] font-black rounded-lg border transition-all ${config.ratio === r ? 'bg-[#F31B17] border-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                 >
                   {r}
                 </button>
               ))}
             </div>
          </section>
          {/* Media Section */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleUploadMain}
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group overflow-hidden ${mainChar ? 'border-[#F31B17] bg-[#F31B17]/10' : 'border-slate-800 hover:border-[#F31B17] hover:bg-[#F31B17]/5'}`}
              >
                {mainChar ? (
                  <img src={`data:image/jpeg;base64,${mainChar.base64}`} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-[#F31B17]">person_add</span>
                    <span className="text-[9px] text-center px-2 text-slate-500 group-hover:text-[#F31B17]">Ảnh nhân vật</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleUploadOutfit}
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group overflow-hidden ${outfitRef ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/5'}`}
              >
                {outfitRef ? (
                  <img src={`data:image/jpeg;base64,${outfitRef.base64}`} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-emerald-400">checkroom</span>
                    <span className="text-[9px] text-center px-2 text-slate-500 group-hover:text-emerald-400">Trang phục</span>
                  </>
                )}
              </button>
            </div>
            {/* Intermediate Forge Step */}
            {mainChar && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Xử lý nhân vật</h3>
                   {forgedChar && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Đã xong</span>}
                </div>
                
                <button 
                  disabled={isForging || !mainChar}
                  onClick={handleForgeCharacter}
                  className={`w-full py-2.5 disabled:opacity-50 border rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${forgedChar ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400'}`}
                >
                  {isForging ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">{forgedChar ? 'refresh' : 'face_retouching_natural'}</span>
                      <span className="text-[10px] font-bold uppercase">{forgedChar ? 'Ghép lại nhân vật' : 'Ghép nhân vật & đồ'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
          <section className="space-y-4">
            <div className="space-y-4">
              <ConfigButtonGroup label="" icon="" value={config.gender} options={GENDERS} onChange={v => setConfig({...config, gender: v as any})} />
              <ConfigButtonGroup label="" icon="" value={config.accent} options={ACCENTS} onChange={v => setConfig({...config, accent: v as any})} />
              <ConfigButtonGroup label="" icon="" value={config.speed} options={SPEEDS} onChange={v => setConfig({...config, speed: v as any})} />
              
              <div className="px-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {(['Thay trang phục', 'Cố định'] as OutfitMode[]).map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setConfig({...config, outfitMode: opt})}
                      className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-md border transition-all ${config.outfitMode === opt ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <ConfigButtonGroup label="Số luồng" icon="bolt" value={config.threads} options={THREAD_OPTIONS} onChange={v => setConfig({...config, threads: Number(v)})} />
              
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-slate-500">model_training</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Model</span>
                </div>
                <select 
                  value={config.model} 
                  onChange={e => setConfig({...config, model: e.target.value})}
                  className="bg-[#1c192b] border border-slate-800 rounded-lg px-2 py-1 text-[10px] focus:border-[#F31B17] outline-none cursor-pointer"
                >
                  {VIDEO_MODELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </section>
          <section className="space-y-3 shrink-0">
            <textarea 
              value={rawTranscript}
              onChange={e => setRawTranscript(e.target.value)}
              placeholder="Dán nội dung script..."
              className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:border-[#F31B17] outline-none transition-colors"
            />
            <button 
              disabled={!rawTranscript || (!mainChar && !forgedChar) || loading}
              onClick={handleGenerateScript}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${!forgedChar && outfitRef ? 'bg-slate-800 text-slate-500 opacity-50' : 'bg-[#F31B17] hover:bg-[#d11713] text-white shadow-red-900/20'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_fix</span>
                  Bước 1: Tạo kịch bản
                </>
              )}
            </button>
            {!forgedChar && outfitRef && (
              <p className="text-[9px] text-amber-500 font-bold text-center italic">Vui lòng ghép nhân vật & đồ trước</p>
            )}
          </section>
          {/* License Status follows Step 1 naturally */}
          <section className="mt-2 shrink-0">
            <LicenseStatus />
          </section>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-red-900/10 transition-all duration-300">
        
        {status && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-red-500/30 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
            <div className="w-4 h-4 border-2 border-red-500/20 border-t-[#F31B17] rounded-full animate-spin" />
            <span className="text-xs font-medium text-red-200">{status}</span>
            {mergeProgress > 0 && <span className="text-xs font-bold text-[#F31B17]">{mergeProgress}%</span>}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {!shots.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="max-w-xl bg-[#12101a]/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
                {forgedChar ? (
                   <div className="mb-6 flex flex-col items-center">
                      <div 
                        onClick={() => setZoomImage(`data:image/jpeg;base64,${forgedChar.base64}`)}
                        className="relative w-48 rounded-2xl overflow-hidden border-2 border-[#F31B17]/30 shadow-2xl mb-4 group cursor-zoom-in bg-black transition-all"
                        style={{ aspectRatio: config.ratio.replace(':', '/') }}
                      >
                         <img src={`data:image/jpeg;base64,${forgedChar.base64}`} className="w-full h-full object-cover" />
                         <div className="absolute top-0 left-0 bg-[#F31B17] text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase">Nhân vật tham chiếu</div>
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                         </div>
                      </div>
                      
                      {/* Refresh Button moved here */}
                      <button 
                        onClick={handleForgeCharacter}
                        disabled={isForging}
                        className="mb-4 px-6 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        <span className="text-xs font-black uppercase">Làm mới ảnh</span>
                      </button>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Đã sẵn sàng!</h3>
                   </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-6xl mb-4 text-[#F31B17]">movie</span>
                    <h2 className="text-2xl font-black uppercase italic mb-2 text-white">Podcast AI Studio</h2>
                    <p className="text-slate-400 text-sm mb-8">Tải ảnh nhân vật, ghép trang phục và dán script để bắt đầu.</p>
                  </>
                )}
                
                <div className="text-left space-y-4">
                  <h3 className="text-sm font-black text-[#F31B17] uppercase tracking-wide">
                    Quy trình tạo clip ổn định nhất:
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl">
                      <span className="text-[#F31B17] font-bold shrink-0">1.</span> 
                      <span><b>Tải ảnh:</b> Tải ảnh nhân vật gốc (Face) và ảnh trang phục muốn mặc (Outfit).</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl">
                      <span className="text-[#F31B17] font-bold shrink-0">2.</span> 
                      <span><b>Ghép trang phục:</b> Bấm "Ghép nhân vật & đồ" để AI tạo ra 1 ảnh tham chiếu duy nhất giữ nguyên mặt nhưng đổi áo.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl">
                      <span className="text-[#F31B17] font-bold shrink-0">3.</span> 
                      <span><b>Tạo kịch bản:</b> Dán script và bấm "Bước 1". Ảnh đã ghép ở trên sẽ được dùng làm gốc cho mọi cảnh quay.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12">
              <header className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div>
                  <span className="text-[10px] bg-[#F31B17] text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">Phase {step}</span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase mt-2">{step === 1 ? 'Thiết kế cảnh quay' : 'Xuất bản Video'}</h2>
                </div>
                {step === 1 ? (
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                  >
                    Chốt kịch bản & Tiếp tục
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full md:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Quay lại chỉnh sửa
                  </button>
                )}
              </header>
              <div className="grid gap-6 pb-20">
                {step === 1 ? (
                  shots.map((shot, idx) => (
                    <ShotEditorCard 
                      key={idx} 
                      shot={shot} 
                      onChange={(updated) => setShots(prev => prev.map((s, i) => i === idx ? updated : s))}
                      aspectRatio={config.ratio}
                      charImage={forgedChar?.base64 || mainChar?.base64}
                    />
                  ))
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Tiến độ tạo</span>
                          <span className="text-xl font-black text-[#F31B17]">
                            {shots.filter(s => s.videoBase64).length} / {shots.length} Cảnh
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={handleGenerateAll}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-[#F31B17] hover:bg-[#d11713] rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
                        >
                          <span className="material-symbols-outlined">play_circle</span>
                          Tạo toàn bộ
                        </button>
                        <button 
                          onClick={handleMerge}
                          disabled={!shots.some(s => s.videoBase64 && s.isSelected)}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                        >
                          <span className="material-symbols-outlined">merge</span>
                          Ghép Video
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shots.map((shot, idx) => (
                        <ShotPreviewCard 
                          key={idx}
                          shot={shot}
                          aspectRatio={config.ratio}
                          onGenerate={() => generateSingleVideo(idx)}
                          onDownload={() => handleDownloadSingle(shot)}
                          onToggle={() => setShots(prev => prev.map((s, i) => i === idx ? {...s, isSelected: !s.isSelected} : s))}
                          onPreview={() => setPreviewShot(shot)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Video Zoom Overlay */}
      {previewShot && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewShot(null)}
        >
          <div className="relative max-w-full max-h-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewShot(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div 
              className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ 
                aspectRatio: config.ratio.replace(':', '/'),
                maxHeight: '80vh',
                width: 'auto'
              }}
            >
              <video 
                src={`data:video/mp4;base64,${previewShot.videoBase64}`} 
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-lg w-full">
              <span className="text-[10px] font-black uppercase text-[#F31B17]">Shot {previewShot.number} • {previewShot.duration}s</span>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{previewShot.transcript}</p>
            </div>
          </div>
        </div>
      )}
      {/* Image Zoom Overlay */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-full max-h-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div 
              className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ 
                aspectRatio: config.ratio.replace(':', '/'),
                maxHeight: '85vh',
                width: 'auto'
              }}
            >
              <img 
                src={zoomImage} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-[#F31B17] text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
              Nhân vật tham chiếu • {config.ratio}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// --- Sub-components ---
function ConfigButtonGroup({ label, icon, value, options, onChange }: { label: string; icon: string; value: string | number; options: readonly any[]; onChange: (v: any) => void }) {
  return (
    <div className="px-1">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="material-symbols-outlined text-[14px] text-slate-500">{icon}</span>}
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button 
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-md border transition-all ${value === opt ? 'bg-[#F31B17] border-red-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
function ShotEditorCard({ shot, onChange, aspectRatio, charImage }: { shot: Shot; onChange: (s: Shot) => void; aspectRatio: AspectRatio; charImage?: string }) {
  const [w, h] = aspectRatio.split(':').map(Number);
  
  return (
    <div className="bg-[#12101a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-red-500/20 transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 bg-slate-900 shrink-0 relative overflow-hidden flex items-center justify-center p-4">
          <div 
            className="w-full max-w-[120px] shadow-2xl rounded-lg border border-white/10 overflow-hidden bg-black"
            style={{ aspectRatio: `${w}/${h}` }}
          >
            {charImage ? (
              <img src={`data:image/jpeg;base64,${charImage}`} className="w-full h-full object-cover opacity-40 grayscale" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-700">image</span>
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-black">CẢNH {shot.number}</div>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Prompt (Hình ảnh)</label>
              <textarea 
                value={shot.prompt}
                onChange={e => onChange({...shot, prompt: e.target.value})}
                className="w-full h-24 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs focus:border-red-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Transcript (Lời thoại)</label>
              <textarea 
                value={shot.transcript}
                onChange={e => onChange({...shot, transcript: e.target.value})}
                className="w-full h-24 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs focus:border-red-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Thời lượng:</span>
              <select 
                value={shot.duration}
                onChange={e => onChange({...shot, duration: Number(e.target.value)})}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none"
              >
                {ALLOWED_DURATIONS.map(d => <option key={d} value={d}>{d}s</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ShotPreviewCard({ shot, aspectRatio, onGenerate, onDownload, onToggle, onPreview }: { shot: Shot; aspectRatio: AspectRatio; onGenerate: () => void; onDownload: () => void; onToggle: () => void; onPreview: () => void }) {
  const [w, h] = aspectRatio.split(':').map(Number);
  
  return (
    <div className={`bg-[#12101a] border rounded-3xl overflow-hidden transition-all ${shot.videoBase64 ? 'border-emerald-500/20' : 'border-white/5'}`}>
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={shot.isSelected} 
            onChange={onToggle}
            className="w-4 h-4 accent-emerald-500 cursor-pointer"
          />
          <span className="font-black text-xs uppercase opacity-40">Cảnh {shot.number}</span>
        </div>
        <div className="flex gap-2">
          {shot.videoBase64 && (
            <button 
              onClick={onDownload}
              className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          )}
          <button 
            disabled={shot.isGenerating}
            onClick={onGenerate}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${shot.videoBase64 ? 'bg-slate-800 text-slate-400 hover:bg-[#F31B17] hover:text-white' : 'bg-[#F31B17] text-white hover:bg-[#d11713]'}`}
          >
            {shot.videoBase64 ? 'Tạo lại' : 'Tạo Video'}
          </button>
        </div>
      </div>
      <div className="p-4 flex gap-4">
        <div 
          onClick={shot.videoBase64 ? onPreview : undefined}
          className={`w-32 shrink-0 bg-black rounded-xl border border-white/5 flex items-center justify-center overflow-hidden relative shadow-inner ${shot.videoBase64 ? 'cursor-zoom-in group' : ''}`}
          style={{ aspectRatio: `${w}/${h}` }}
        >
          {shot.isGenerating ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-red-500/20 border-t-[#F31B17] rounded-full animate-spin" />
              <span className="text-[8px] text-[#F31B17] uppercase font-black animate-pulse">Rendering</span>
            </div>
          ) : shot.videoBase64 ? (
            <>
              <video 
                src={`data:video/mp4;base64,${shot.videoBase64}`} 
                className="w-full h-full object-cover" 
                autoPlay 
                loop 
                muted 
                playsInline 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white">zoom_in</span>
              </div>
            </>
          ) : (
            <span className="material-symbols-outlined text-slate-800 text-3xl">videocam_off</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3 mb-2">{shot.transcript}</p>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400">{shot.duration}s</span>
            {shot.error && <span className="text-red-400 uppercase text-[9px]">{shot.error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}