import React, { useState, useRef, useEffect } from 'react';
import { Flow } from 'flow-sdk';
import { 
  DramaProject, 
  DramaStyle, 
  AspectRatio, 
  DramaDuration,
  DramaShot,
  CharacterAsset,
  LocationAsset,
  ProjectConfig
} from './types';
import { 
  generateDramaScript, 
  extractDramaAssets, 
  breakdownScriptToShots,
  generateShotImage,
  generateShotVideo
} from './services/ai';
// Components
import { ScriptStep } from './components/ScriptStep';
import { StoryboardStep } from './components/StoryboardStep';
import { ExportStep } from './components/ExportStep';
import { ConfigControls } from './components/ConfigControls';
const initialProject: DramaProject = {
  title: "Drama Mới",
  style: 'Cinematic Photorealistic',
  aspectRatio: '9:16',
  duration: '30s',
  premise: "",
  scriptMarkdown: "",
  characters: [],
  locations: [],
  props: [],
  shots: []
};
const initialConfig: ProjectConfig = {
  ratio: '9:16',
  speed: '1x',
  model: 'Omni 1.1 Flash',
  threads: 2,
  resolution: '360p'
};
type Step = 'setup' | 'shots' | 'export';
export default function App() {
  const [project, setProject] = useState<DramaProject>(initialProject);
  const [config, setConfig] = useState<ProjectConfig>(initialConfig);
  const [activeStep, setActiveStep] = useState<Step>('setup');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const updateProject = (updates: Partial<DramaProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };
  const updateCharacter = (id: string, updates: Partial<CharacterAsset>) => {
    setProject(prev => ({
      ...prev,
      characters: prev.characters.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };
  const updateLocation = (id: string, updates: Partial<LocationAsset>) => {
    setProject(prev => ({
      ...prev,
      locations: prev.locations.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });
  const processInParallel = async <T,>(
    items: T[], 
    limit: number, 
    callback: (item: T) => Promise<void>
  ) => {
    const executing = new Set<Promise<any>>();
    for (const item of items) {
      const p = callback(item).then(() => executing.delete(p));
      executing.add(p);
      if (executing.size >= limit) {
        await Promise.race(executing);
      }
    }
    await Promise.all(executing);
  };
  const handleGenerateScriptAction = async () => {
    if (!project.premise) return showToast("Vui lòng nhập ý tưởng.", "error");
    setLoading("Đang sáng tác kịch bản...");
    try {
      const script = await generateDramaScript({
        premise: project.premise,
        duration: project.duration,
        style: project.style,
        characters: project.characters,
        locations: project.locations
      });
      if (!script) throw new Error("AI không trả về nội dung.");
      updateProject({ scriptMarkdown: script });
      showToast("Đã soạn xong kịch bản!");
    } catch (err: any) {
      console.error("Script gen error:", err);
      showToast(`Lỗi: ${err.message || "Không thể sinh kịch bản"}`, "error");
    } finally {
      setLoading(null);
    }
  };
  const handleExtractAndNext = async () => {
    if (!project.scriptMarkdown) {
      return showToast("Vui lòng sinh kịch bản trước khi tiếp tục.", "error");
    }
    setLoading("Đang phân tích kịch bản & storyboard...");
    try {
      const assets = await extractDramaAssets(project.scriptMarkdown);
      const shots = await breakdownScriptToShots(project.scriptMarkdown, project.duration, project.characters);
      
      updateProject({
        characters: project.characters.length > 0 ? project.characters : assets.characters.map((c: any) => ({ ...c, id: `char-${Date.now()}-${Math.random()}` })),
        locations: project.locations.length > 0 ? project.locations : assets.locations.map((l: any) => ({ ...l, id: `loc-${Date.now()}-${Math.random()}` })),
        props: assets.props.map((p: any) => ({ ...p, id: `prop-${Date.now()}-${Math.random()}` })),
        shots
      });
      
      setActiveStep('shots');
      showToast("Đã sẵn sàng Storyboard");
      if (window.innerWidth < 1024) setSidebarOpen(false);
    } catch (err: any) {
      console.error("Storyboard extract error:", err);
      showToast(`Lỗi: ${err.message || "Không thể xử lý storyboard"}`, "error");
    } finally {
      setLoading(null);
    }
  };
  const handleBreakdownShotsAction = async () => {
    if (!project.scriptMarkdown) return showToast("Không có kịch bản để phân rã.", "error");
    setLoading("Đang phân rã kịch bản thành các shot...");
    try {
      const shots = await breakdownScriptToShots(project.scriptMarkdown, project.duration, project.characters);
      updateProject({ shots });
      showToast("Đã cập nhật danh sách shot.");
    } catch (err: any) {
      console.error("Breakdown error:", err);
      showToast(`Lỗi: ${err.message || "Không thể phân rã shot"}`, "error");
    } finally {
      setLoading(null);
    }
  };
  const handleGenerateShotAction = async (shotId: string) => {
    const shot = project.shots.find(s => s.id === shotId);
    if (!shot) return;
    setProject(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === shotId ? { 
        ...s, 
        isGenerating: true,
        imageUrl: undefined,
        imageMediaId: undefined,
        videoUrl: undefined,
        videoMediaId: undefined
      } : s)
    }));
    try {
      const result = await generateShotImage(
        shot, 
        project.characters, 
        project.locations, 
        project.style, 
        config.ratio
      );
      
      if (!result || !result.base64) {
        throw new Error("Không nhận được dữ liệu ảnh từ AI.");
      }
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { 
          ...s, 
          imageUrl: `data:${result.mimeType};base64,${result.base64}`,
          imageMediaId: result.mediaId,
          isGenerating: false 
        } : s)
      }));
    } catch (err: any) {
      console.error(`Shot ${shot.shotNumber} Gen Error:`, err);
      const errorMessage = err.message || "Lỗi máy chủ AI hoặc kết nối mạng.";
      showToast(`Shot ${shot.shotNumber}: ${errorMessage}`, "error");
      
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { ...s, isGenerating: false } : s)
      }));
    }
  };
  const handleSelectShotImage = async (shotId: string) => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        setProject(prev => ({
          ...prev,
          shots: prev.shots.map(s => s.id === shotId ? { 
            ...s, 
            imageUrl: `data:${media.mimeType};base64,${media.base64}`,
            imageMediaId: media.mediaId,
            videoUrl: undefined,
            videoMediaId: undefined
          } : s)
        }));
        showToast("Đã cập nhật ảnh cho shot.");
      }
    } catch (err) {
      console.error("Select shot image error", err);
    }
  };
  const handleGenerateShotVideoAction = async (shotId: string) => {
    const shot = project.shots.find(s => s.id === shotId);
    if (!shot || !shot.imageMediaId) return showToast("Cần có ảnh tĩnh trước.", "error");
    setProject(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === shotId ? { 
        ...s, 
        isGeneratingVideo: true,
        videoUrl: undefined,
        videoMediaId: undefined 
      } : s)
    }));
    try {
      const result = await generateShotVideo({
        shot,
        characters: project.characters,
        aspectRatio: config.ratio,
        model: config.model,
        resolution: config.resolution
      });
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { 
          ...s, 
          videoUrl: `data:${result.mimeType};base64,${result.base64}`,
          videoMediaId: result.mediaId,
          isGeneratingVideo: false 
        } : s)
      }));
    } catch (err: any) {
      console.error(`Video ${shot.shotNumber} Gen Error:`, err);
      const errorMsg = err.message || "Lỗi khi sinh video.";
      showToast(`Shot ${shot.shotNumber}: ${errorMsg}`, "error");
      
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { ...s, isGeneratingVideo: false } : s)
      }));
    }
  };
  const handleBatchGenerateVideos = async () => {
    const targetShots = project.shots.filter(s => !!s.imageMediaId);
    if (targetShots.length === 0) return showToast("Không có shot nào có ảnh để sinh video.", "error");
    
    setLoading(`Đang sinh hàng loạt video (${config.threads} luồng)...`);
    try {
      await processInParallel(targetShots, config.threads, async (shot) => {
        await handleGenerateShotVideoAction(shot.id);
      });
      showToast("Hoàn thành hàng đợi video.");
    } catch (err: any) {
      showToast(`Lỗi: ${err.message || "Quá trình sinh hàng loạt bị gián đoạn"}`, "error");
    } finally {
      setLoading(null);
    }
  };
  const handleBatchGenerateImages = async () => {
    setLoading(`Đang sinh hàng loạt ảnh (${config.threads} luồng)...`);
    try {
      await processInParallel(project.shots, config.threads, async (shot) => {
        await handleGenerateShotAction(shot.id);
      });
      showToast("Hoàn thành hàng đợi ảnh.");
    } catch (err: any) {
      showToast(`Lỗi: ${err.message || "Quá trình sinh hàng loạt bị gián đoạn"}`, "error");
    } finally {
      setLoading(null);
    }
  };
  const handleNewProject = () => {
    if (confirm("Tạo dự án mới? Dữ liệu cũ sẽ bị xóa.")) {
      setProject(initialProject);
      setConfig(initialConfig);
      setActiveStep('setup');
      if (window.innerWidth < 1024) setSidebarOpen(false);
    }
  };
  const handleSaveProject = async () => {
    const data = JSON.stringify({ project, config }, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(data)));
    await Flow.download({
      base64,
      mimeType: 'application/json',
      filename: `drama_${Date.now()}.json`
    });
    showToast("Đã lưu dự án.");
  };
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={(e) => {
         const file = e.target.files?.[0];
         if (!file) return;
         const reader = new FileReader();
         reader.onload = (ev) => {
           try {
             const loaded = JSON.parse(ev.target?.result as string);
             if (loaded.project) {
               setProject(loaded.project);
               if (loaded.config) setConfig(loaded.config);
             } else {
               setProject(loaded);
             }
             showToast("Đã nạp dự án.");
           } catch {
             showToast("Lỗi nạp file.", "error");
           }
         };
         reader.readAsText(file);
      }} className="hidden" accept=".json" />
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 text-3xl hidden sm:block">movie_edit</span>
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  autoFocus
                  className="bg-slate-900 border border-red-500/50 rounded px-2 py-1 text-sm font-bold w-32 sm:w-48"
                  value={project.title}
                  onChange={e => updateProject({ title: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-lg font-black tracking-tighter uppercase cursor-pointer truncate max-w-[120px] sm:max-w-none" onClick={() => setIsEditingTitle(true)}>
                    {project.title}
                  </h1>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">1.0.24</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={handleNewProject} className="p-2 text-slate-400 hover:text-white"><span className="material-symbols-outlined text-xl sm:text-2xl">add_circle</span></button>
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-white"><span className="material-symbols-outlined text-xl sm:text-2xl">folder_open</span></button>
          <button onClick={handleSaveProject} className="ml-1 sm:ml-2 px-3 sm:px-4 py-2 bg-white text-slate-950 rounded-lg font-bold text-[10px] sm:text-xs">LƯU DỰ ÁN</button>
        </div>
      </header>
      {/* Layout Wrap */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-full w-[320px] bg-[#12101a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}>
          <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Cấu hình sản xuất</h3>
              <ConfigControls config={config} onChange={setConfig} />
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Quy trình sản xuất</h3>
            <nav className="space-y-2">
              {[
                { id: 'setup', icon: 'description', label: 'Kịch bản & Nhân vật' },
                { id: 'shots', icon: 'movie_filter', label: 'Storyboard' }
              ].map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStep(s.id as Step);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${
                    activeStep === s.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`material-symbols-outlined ${activeStep === s.id ? 'text-white' : 'text-slate-500 group-hover:text-red-500'}`}>{s.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Bước {idx + 1}</span>
                    <span className="text-xs font-bold">{s.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-red-900/10 transition-all duration-300 p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {activeStep === 'setup' && (
              <ScriptStep 
                project={project} 
                updateProject={updateProject} 
                updateCharacter={updateCharacter}
                updateLocation={updateLocation}
                onGenerateScript={handleGenerateScriptAction}
                onNext={handleExtractAndNext}
                loading={loading}
              />
            )}
            {activeStep === 'shots' && (
              <StoryboardStep
                project={project}
                config={config}
                updateProject={updateProject}
                onBreakdown={handleBreakdownShotsAction}
                onGenerateShot={handleGenerateShotAction}
                onSelectShotImage={handleSelectShotImage}
                onGenerateVideo={handleGenerateShotVideoAction}
                onBatchGenerate={handleBatchGenerateImages}
                onBatchGenerateVideos={handleBatchGenerateVideos}
                onNext={() => setActiveStep('export')}
                loading={loading}
                onSetLoading={setLoading}
                onShowToast={showToast}
              />
            )}
            {activeStep === 'export' && (
              <ExportStep project={project} onShowToast={showToast} />
            )}
          </div>
        </main>
      </div>
      {toast && (
        <div className="fixed top-24 right-6 z-[60] animate-in slide-in-from-right fade-in">
          <div className={`${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold min-w-[280px] max-w-[400px]`}>
            <span className="material-symbols-outlined shrink-0">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span className="flex-1">{toast.msg}</span>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-4 text-center p-6">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-sm font-black uppercase tracking-widest text-red-500">{loading}</p>
        </div>
      )}
    </div>
  );
}