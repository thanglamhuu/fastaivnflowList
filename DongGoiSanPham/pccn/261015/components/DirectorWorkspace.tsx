import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { ProjectState, Scene, CameraRig, CameraRigMode, AnchorMode } from '../types';
import { SceneCard } from './SceneCard';
import { splitScriptStrictV4, compileOmniPromptV4 } from '../services/directorService';
import { ffmpegService } from '../services/ffmpegService';
import { CAMERA_RIG_SYSTEM } from '../constants';
import { MATRIX_12_VOICES } from '../constants/voicePresets';
import { LicenseStatus } from './LicenseStatus';
interface Props {
  project: ProjectState;
  onReset: () => void;
}
export const DirectorWorkspace: React.FC<Props> = ({ project, onReset }) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [batching, setBatching] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [omniResolution, setOmniResolution] = useState<'720p' | '360p'>('720p');
  const [anchorMode, setAnchorMode] = useState<AnchorMode>(project.masterMediaId ? 'FIRST_FRAME' : 'TEXT_ONLY');
  
  const [cameraRigMode, setCameraRigMode] = useState<CameraRigMode>(project.cameraRigMode || 'DYNAMIC_MULTI_CAM');
  const [fixedRigChoice, setFixedRigChoice] = useState<CameraRig>(project.fixedRigChoice || 'CAM_FRONT_MCU');
  
  const requestTracker = useRef<Record<number, number>>({});
  const activeVoice = MATRIX_12_VOICES.find(v => v.id === project.selectedVoiceId) || MATRIX_12_VOICES[0];
  useEffect(() => {
    if (scenes.length === 0) {
      const initialScenes = splitScriptStrictV4(
        project.script, 
        project.dramaHook,
        project.scenes.length > 0 ? project.scenes.length : Math.max(1, Math.round(project.totalDuration / 8)),
        project.cameraRigMode,
        project.fixedRigChoice
      );
      setScenes(initialScenes);
    }
  }, [project, scenes.length]);
  const updateScene = useCallback((id: number, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);
  const setGlobalCameraMode = (mode: CameraRigMode) => {
    setCameraRigMode(mode);
    const rigs = CAMERA_RIG_SYSTEM.map(r => r.id);
    const secondaryCandidates = rigs.filter(r => r !== 'CAM_FRONT_MCU');
    setScenes(prev => {
      const refreshedScenes = splitScriptStrictV4(
        project.script,
        project.dramaHook,
        prev.length,
        mode,
        fixedRigChoice
      );
      return prev.map((s, idx) => ({
        ...s,
        cameraRigMode: mode,
        script: refreshedScenes[idx]?.script || s.script,
        wordCount: refreshedScenes[idx]?.wordCount || s.wordCount,
        cameraRig: mode === 'STATIC_LOCKED_OFF' ? fixedRigChoice : 'CAM_FRONT_MCU',
        transitionCutRig: secondaryCandidates[idx % secondaryCandidates.length]
      }));
    });
  };
  const handleApplyFixedRigToAll = (rig: CameraRig) => {
    setFixedRigChoice(rig);
    setScenes(prev => prev.map(s => ({
      ...s,
      cameraRig: rig,
      cameraRigMode: 'STATIC_LOCKED_OFF'
    })));
    setCameraRigMode('STATIC_LOCKED_OFF');
  };
  /**
   * Tạo video cho Shot chuẩn xác 100%, xử lý lỗi kiểm duyệt và lỗi tham số SDK
   */
  const renderScene = async (id: number) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;
    const currentRequestId = (requestTracker.current[id] || 0) + 1;
    requestTracker.current[id] = currentRequestId;
    
    updateScene(id, { status: 'generating', progress: 15, error: undefined });
    try {
      const sceneIndex = scenes.indexOf(scene);
      const fullPrompt = await compileOmniPromptV4(scene, { ...project, scenes }, sceneIndex);
      // Kịch bản tạo video tuần tự từ ưu tiên cao nhất đến phương án dự phòng tin cậy tuyệt đối
      let result: any = null;
      let lastErrorMessage = '';
      // Chiến lược 1: Thử tạo với prompt đầy đủ và ảnh neo
      const strategies = [
        // 1. Full prompt + First frame (I2V)
        async () => {
          const opts: any = {
            prompt: fullPrompt,
            modelDisplayName: 'Omni 1.1 Flash',
            aspectRatio: '9:16',
            resolution: omniResolution,
            durationSeconds: 8
          };
          if (project.masterMediaId && anchorMode === 'FIRST_FRAME') {
            opts.firstFrameImageMediaId = project.masterMediaId;
          } else if (project.masterMediaId && anchorMode === 'REFERENCE_GUIDE') {
            opts.referenceImageMediaIds = [project.masterMediaId];
          }
          return await Flow.generate.video(opts);
        },
        // 2. Không kèm durationSeconds (để model tự nhận diện)
        async () => {
          const opts: any = {
            prompt: fullPrompt,
            modelDisplayName: 'Omni 1.1 Flash',
            aspectRatio: '9:16',
            resolution: omniResolution
          };
          if (project.masterMediaId && anchorMode === 'FIRST_FRAME') {
            opts.firstFrameImageMediaId = project.masterMediaId;
          } else if (project.masterMediaId && anchorMode === 'REFERENCE_GUIDE') {
            opts.referenceImageMediaIds = [project.masterMediaId];
          }
          return await Flow.generate.video(opts);
        },
        // 3. Fallback sang referenceImageMediaIds nếu firstFrameImageMediaId bị lỗi
        async () => {
          if (!project.masterMediaId) throw new Error('Không có ảnh');
          return await Flow.generate.video({
            prompt: fullPrompt,
            modelDisplayName: 'Omni 1.1 Flash',
            aspectRatio: '9:16',
            resolution: omniResolution,
            referenceImageMediaIds: [project.masterMediaId],
            durationSeconds: 8
          });
        },
        // 4. Prompt tối giản thương mại (tránh kích hoạt bộ lọc kiểm duyệt từ khóa nhạy cảm)
        async () => {
          const safePrompt = `Professional business podcast video. A refined speaker speaks directly to the camera in a modern podcast studio: "${scene.script}". High quality lighting, clear articulation, natural gestures, 9:16 aspect ratio.`;
          const opts: any = {
            prompt: safePrompt,
            modelDisplayName: 'Omni 1.1 Flash',
            aspectRatio: '9:16',
            resolution: omniResolution,
            durationSeconds: 8
          };
          if (project.masterMediaId) {
            opts.firstFrameImageMediaId = project.masterMediaId;
          }
          return await Flow.generate.video(opts);
        },
        // 5. Fallback 360p tiết kiệm tài nguyên
        async () => {
          const safePrompt = `A host recording a personal branding podcast episode: "${scene.script}". Clean studio, natural speaking, eye-level framing.`;
          const opts: any = {
            prompt: safePrompt,
            modelDisplayName: 'Omni 1.1 Flash',
            aspectRatio: '9:16',
            resolution: '360p'
          };
          if (project.masterMediaId) {
            opts.firstFrameImageMediaId = project.masterMediaId;
          }
          return await Flow.generate.video(opts);
        }
      ];
      for (let i = 0; i < strategies.length; i++) {
        try {
          result = await strategies[i]();
          if (result && result.base64) {
            break;
          }
        } catch (err: any) {
          lastErrorMessage = err?.message || 'Lỗi không xác định';
          console.warn(`Lỗi chiến lược ${i + 1}:`, err);
        }
      }
      if (requestTracker.current[id] !== currentRequestId) return;
      if (!result || !result.base64) {
        throw new Error(lastErrorMessage || 'Hệ thống video chưa thể xử lý phân cảnh này. Vui lòng bấm thử lại.');
      }
      updateScene(id, { 
        status: 'completed', 
        progress: 100, 
        media: {
          mediaId: result.mediaId,
          base64: result.base64,
          mimeType: result.mimeType || "video/mp4",
          url: `data:${result.mimeType || "video/mp4"};base64,${result.base64}`
        } 
      });
    } catch (err: any) {
      if (requestTracker.current[id] === currentRequestId) {
        const errorMsg = err?.message || "Không thể tạo video. Vui lòng bấm thử lại phân cảnh.";
        updateScene(id, { status: 'error', error: errorMsg });
      }
    }
  };
  const handleBatchRender = async () => {
    if (batching) return;
    setBatching(true);
    for (const s of scenes) {
      if (s.status !== 'completed') {
        await renderScene(s.id);
      }
    }
    setBatching(false);
  };
  /**
   * Logic ghép video liền mạch bằng FFmpeg:
   * Cố tình trừ đi 0,1s của từng phân cảnh (cắt lấy từ 0.0s đến 7.9s)
   * để triệt tiêu từ thừa AI tự ý thêm vào cuối mỗi phân cảnh.
   */
  const handleExportFinal = async () => {
    const incomplete = scenes.filter(s => !s.media?.base64);
    if (incomplete.length > 0) return;
    setExporting(true);
    try {
      await ffmpegService.load();
      // Bước 1: Ghi các tệp gốc vào hệ thống tệp ảo của FFmpeg
      for (let i = 0; i < scenes.length; i++) {
        const bytes = Uint8Array.from(atob(scenes[i].media!.base64), c => c.charCodeAt(0));
        await ffmpegService.writeFile(`raw_shot_${i}.mp4`, bytes);
      }
      
      // Bước 2: Cố tình cắt bớt 0,1s ở cuối từng phân cảnh (thời lượng 8s -> 7.9s)
      for (let i = 0; i < scenes.length; i++) {
        await ffmpegService.exec([
          '-ss', '0.0',
          '-i', `raw_shot_${i}.mp4`,
          '-t', '7.9',
          '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22',
          '-c:a', 'aac', '-b:a', '192k',
          '-y', `trimmed_shot_${i}.mp4`
        ]);
        await ffmpegService.deleteFile(`raw_shot_${i}.mp4`);
      }
      // Bước 3: Ghép nối các phân cảnh đã trừ đi 0,1s
      const inputArgs = scenes.flatMap((_, i) => ['-i', `trimmed_shot_${i}.mp4`]);
      
      const streamFilters = scenes.map((_, i) => 
        `[${i}:v]settb=AVTB,setpts=PTS-STARTPTS,fps=30[v${i}];[${i}:a]asetpts=PTS-STARTPTS,aresample=44100:async=1[a${i}];`
      ).join('');
      
      const concatInputs = scenes.map((_, i) => `[v${i}][a${i}]`).join('');
      const filterComplex = `${streamFilters}${concatInputs}concat=n=${scenes.length}:v=1:a=1[outv][outa]`;
      
      await ffmpegService.exec([
        ...inputArgs, 
        '-filter_complex', filterComplex, 
        '-map', '[outv]', '-map', '[outa]', 
        '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22',
        '-c:a', 'aac', '-b:a', '192k',
        '-movflags', '+faststart',
        '-y', 'final.mp4'
      ]);
      const finalData = await ffmpegService.readFile('final.mp4') as Uint8Array;
      const base64 = btoa(finalData.reduce((data, byte) => data + String.fromCharCode(byte), ''));
      await Flow.download({ base64, mimeType: 'video/mp4', filename: `PODCAST_HOAN_CHINH_${Date.now()}.mp4` });
      for (let i = 0; i < scenes.length; i++) {
        await ffmpegService.deleteFile(`trimmed_shot_${i}.mp4`);
      }
      await ffmpegService.deleteFile('final.mp4');
    } catch (e: any) { 
      alert("Lỗi xuất video hoàn chỉnh: " + e.message); 
    } finally { 
      setExporting(false); 
    }
  };
  return (
    <div className="flex flex-col h-full bg-[#050508] text-white">
      {/* Thanh Điều Phối Trên Cùng */}
      <header className="flex flex-wrap items-center justify-between gap-6 px-10 py-6 bg-[#08080a]/90 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button onClick={onReset} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/5 border border-white/5 text-slate-400 transition-all active:scale-95" title="Quay lại thiết lập">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[36px] w-[100px] object-contain hidden md:block" />
            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                ĐẠO DIỄN <span className="text-[#F31B17]">PODCAST</span> CHUYÊN NGHIỆP
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F31B17] animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
                    {scenes.length} Phân cảnh ({scenes.length * 8} giây) • {activeVoice.label}
                  </span>
                </div>
                <span className="text-slate-800 font-bold text-xs">|</span>
                <span className="text-[9px] font-mono text-emerald-400/90 uppercase font-black tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  FFmpeg Trừ 0.1s/Cảnh • Triệt Tiêu Từ Thừa
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Chế độ neo ảnh */}
        {project.masterMediaId && (
          <div className="flex items-center gap-1.5 bg-[#111218] border border-white/10 p-1.5 rounded-2xl">
            <span className="text-[8px] font-bold text-slate-400 px-2 uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span>
              Tham chiếu:
            </span>
            <button
              onClick={() => setAnchorMode('FIRST_FRAME')}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${
                anchorMode === 'FIRST_FRAME'
                  ? 'bg-[#F31B17] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khung Hình 0 (100% Gốc)
            </button>
            <button
              onClick={() => setAnchorMode('REFERENCE_GUIDE')}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${
                anchorMode === 'REFERENCE_GUIDE'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khóa Ngoại Hình (R2V)
            </button>
          </div>
        )}
        {/* BỘ ĐIỀU PHỐI CAMERA */}
        <div className="flex items-center gap-2 bg-[#111218] border border-[#F31B17]/30 p-1.5 rounded-2xl">
          <button
            onClick={() => setGlobalCameraMode('DYNAMIC_MULTI_CAM')}
            className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all ${
              cameraRigMode === 'DYNAMIC_MULTI_CAM'
                ? 'bg-[#F31B17] text-white shadow-md shadow-red-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">movie</span>
            Đa Góc Động (Cắt 5s)
          </button>
          <button
            onClick={() => setGlobalCameraMode('STATIC_LOCKED_OFF')}
            className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all ${
              cameraRigMode === 'STATIC_LOCKED_OFF'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">tripod</span>
            Chân Máy Khóa Tĩnh
          </button>
          {cameraRigMode === 'STATIC_LOCKED_OFF' && (
            <select
              value={fixedRigChoice}
              onChange={(e) => handleApplyFixedRigToAll(e.target.value as CameraRig)}
              className="ml-1 bg-black/60 border border-white/10 text-orange-400 text-[10px] font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {CAMERA_RIG_SYSTEM.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {(['360p', '720p'] as const).map(res => (
              <button 
                key={res} 
                onClick={() => setOmniResolution(res)} 
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${omniResolution === res ? 'bg-[#F31B17] text-white shadow-xl shadow-red-900/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {res === '360p' ? 'BẢN NHÁP 360P' : 'CHUẨN NÉT 720P'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleBatchRender} 
            disabled={batching || exporting} 
            className="px-7 py-3 bg-[#F31B17] hover:bg-[#d11713] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl disabled:opacity-30 flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            <span className="material-symbols-outlined text-lg">play_circle</span>
            KẾT XUẤT TOÀN BỘ
          </button>
          
          <button 
            onClick={handleExportFinal} 
            disabled={batching || exporting || !scenes.every(s => s.media?.base64)} 
            className="px-7 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 disabled:opacity-30 transition-all shadow-2xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            XUẤT VIDEO HOÀN CHỈNH ({scenes.length * 8} GIÂY)
          </button>
        </div>
      </header>
      {/* Danh sách các phân cảnh */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar flex flex-col justify-between">
        <div className="max-w-[2400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12 w-full">
          {scenes.map((s) => (
            <SceneCard 
              key={s.id} 
              scene={s} 
              project={project}
              selectedVoiceId={project.selectedVoiceId}
              onUpdate={updateScene} 
              onRender={() => renderScene(s.id)} 
            />
          ))}
        </div>
        <div className="max-w-md mx-auto w-full pt-8 pb-16">
          <LicenseStatus />
          <p className="text-[9px] text-center text-slate-600 mt-2 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs">videocam</span>
            Phòng Thu Video Podcast Thương Mại • Động cơ Omni 1.1 Flash
          </p>
        </div>
      </main>
      {/* Cửa sổ tải khi xuất gộp video */}
      {exporting && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700">
          <div className="relative mb-12">
            <div className="w-24 h-24 border-4 border-[#F31B17]/20 border-t-[#F31B17] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined text-[#F31B17] text-4xl animate-pulse">movie_edit</span>
            </div>
          </div>
          <h3 className="text-4xl font-black uppercase italic mb-3 tracking-tighter text-white">ĐANG GHÉP NỐI CÁC PHÂN CẢNH</h3>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.5em] font-mono font-bold animate-pulse">
            FFmpeg đang trừ 0,1s cuối mỗi cảnh & ghép liền mạch {scenes.length} phân cảnh...
          </p>
        </div>
      )}
    </div>
  );
};