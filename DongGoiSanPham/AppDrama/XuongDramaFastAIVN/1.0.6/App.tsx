import React, { useState, useRef, useEffect } from 'react';
import { Flow } from 'flow-sdk';
import { 
  DramaProject, 
  DramaStyle, 
  AspectRatio, 
  DramaDuration
} from './types';
import { 
  generateDramaScript, 
  extractDramaAssets, 
  breakdownScriptToShots,
  generateShotImage
} from './services/ai';
// Components
import { ScriptStep } from './components/ScriptStep';
import { AssetLockerStep } from './components/AssetLockerStep';
import { StoryboardStep } from './components/StoryboardStep';
import { ExportStep } from './components/ExportStep';
const initialProject: DramaProject = {
  title: "Drama Mới Không Tên",
  style: 'Cinematic Photorealistic',
  aspectRatio: '9:16',
  duration: '15s',
  premise: "",
  scriptMarkdown: "",
  characters: [],
  locations: [],
  props: [],
  shots: []
};
type Step = 'setup' | 'assets' | 'shots' | 'export';
export default function App() {
  const [project, setProject] = useState<DramaProject>(initialProject);
  const [activeStep, setActiveStep] = useState<Step>('setup');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const updateProject = (updates: Partial<DramaProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };
  const showToast = (msg: string) => setToast(msg);
  const handleNewProject = () => {
    if (confirm("Bạn có chắc muốn tạo dự án mới? Toàn bộ dữ liệu chưa lưu sẽ mất.")) {
      setProject(initialProject);
      setActiveStep('setup');
      showToast("Đã khởi tạo dự án mới");
    }
  };
  const handleSaveProject = async () => {
    const data = JSON.stringify(project, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(data)));
    await Flow.download({
      base64,
      mimeType: 'application/json',
      filename: `${project.title.replace(/\s+/g, '_')}_drama.json`
    });
    showToast("Đã lưu dự án vào máy");
  };
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const loadedProject = JSON.parse(content);
        setProject(loadedProject);
        setActiveStep('setup');
        showToast("Đã nạp dự án thành công");
      } catch (err) {
        showToast("Lỗi khi đọc file dự án!");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };
  const handleGenerateScriptAction = async () => {
    if (!project.premise) return showToast("Vui lòng nhập ý tưởng kịch bản.");
    setLoading("Đang sáng tác kịch bản...");
    try {
      const script = await generateDramaScript({
        premise: project.premise,
        duration: project.duration,
        style: project.style,
        characters: project.characters
      });
      updateProject({ scriptMarkdown: script });
      showToast("Đã soạn xong kịch bản!");
    } catch (err) {
      showToast("Lỗi khi sinh kịch bản.");
    } finally {
      setLoading(null);
    }
  };
  const handleExtractAssetsAction = async () => {
    if (!project.scriptMarkdown) return showToast("Vui lòng sinh kịch bản trước.");
    setLoading("Đang bóc tách nhân vật...");
    try {
      const assets = await extractDramaAssets(project.scriptMarkdown);
      updateProject({
        characters: assets.characters.map((c: any) => ({ ...c, id: `char-${Date.now()}-${Math.random()}` })),
        locations: assets.locations.map((l: any) => ({ ...l, id: `loc-${Date.now()}-${Math.random()}` })),
        props: assets.props.map((p: any) => ({ ...p, id: `prop-${Date.now()}-${Math.random()}` })),
      });
      showToast("Bóc tách tài nguyên hoàn tất");
    } catch (err) {
      showToast("Lỗi khi bóc tách tài nguyên.");
    } finally {
      setLoading(null);
    }
  };
  const handleBreakdownShotsAction = async () => {
    if (!project.scriptMarkdown) return showToast("Vui lòng có kịch bản trước.");
    setLoading("Đang phân chia storyboard...");
    try {
      const shots = await breakdownScriptToShots(project.scriptMarkdown, project.duration, project.characters);
      updateProject({ shots });
      showToast("Phân rã shot thành công");
    } catch (err) {
      showToast("Lỗi khi chia shot.");
    } finally {
      setLoading(null);
    }
  };
  const handleGenerateShotAction = async (shotId: string) => {
    const shot = project.shots.find(s => s.id === shotId);
    if (!shot) return;
    setProject(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === shotId ? { ...s, isGenerating: true } : s)
    }));
    try {
      const result = await generateShotImage(
        shot, 
        project.characters, 
        project.locations, 
        project.style, 
        project.aspectRatio
      );
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { 
          ...s, 
          imageUrl: `data:${result.mimeType};base64,${result.base64}`,
          isGenerating: false 
        } : s)
      }));
    } catch (err) {
      showToast("Lỗi khi sinh ảnh.");
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shotId ? { ...s, isGenerating: false } : s)
      }));
    }
  };
  const handleBatchGenerateImages = async () => {
    const pendingShots = project.shots.filter(s => !s.imageUrl);
    if (pendingShots.length === 0) return showToast("Toàn bộ shots đã có ảnh.");
    
    setLoading(`Đang sinh ${pendingShots.length} ảnh...`);
    for (const shot of pendingShots) {
      await handleGenerateShotAction(shot.id);
    }
    setLoading(null);
    showToast("Đã sinh xong toàn bộ ảnh");
  };
  const renderStepNav = () => (
    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 mb-8 max-w-4xl w-full mx-auto shadow-2xl sticky top-20 z-40 bg-slate-950/80 backdrop-blur-md">
      {[
        { id: 'setup', icon: 'stylus', label: '1. Kịch Bản' },
        { id: 'assets', icon: 'person_add', label: '2. Tài Nguyên' },
        { id: 'shots', icon: 'movie_filter', label: '3. Storyboard' },
        { id: 'export', icon: 'package_2', label: '4. Xuất Gói' }
      ].map((step) => {
        const isActive = activeStep === step.id;
        return (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id as Step)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">{step.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30">
      <input type="file" ref={fileInputRef} onChange={handleLoadProject} className="hidden" accept=".json" />
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-3xl">movie_edit</span>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tighter uppercase leading-tight">Xưởng Drama</h1>
              <span className="text-[8px] font-mono text-slate-500 tracking-[0.3em]">FastAIVN PRODUCTION</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 group">
            {isEditingTitle ? (
              <input
                autoFocus
                className="bg-slate-900 border border-red-500/50 rounded px-2 py-1 text-sm font-bold focus:outline-none"
                value={project.title}
                onChange={e => updateProject({ title: e.target.value })}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
              />
            ) : (
              <h2 className="text-sm font-bold text-slate-300 cursor-pointer hover:text-white transition-colors flex items-center gap-2" onClick={() => setIsEditingTitle(true)}>
                {project.title}
                <span className="material-symbols-outlined text-xs text-slate-600 group-hover:text-red-500">edit</span>
              </h2>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleNewProject} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all" title="Tạo mới">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all" title="Mở dự án">
            <span className="material-symbols-outlined">folder_open</span>
          </button>
          <button onClick={handleSaveProject} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-950 rounded-lg font-bold text-xs hover:bg-white transition-all shadow-lg active:scale-95">
            <span className="material-symbols-outlined text-sm">download</span>
            LƯU DỰ ÁN
          </button>
        </div>
      </header>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-[60] animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {toast}
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {renderStepNav()}
        <div className="max-w-6xl mx-auto">
          
          {activeStep === 'setup' && (
            <ScriptStep 
              project={project} 
              updateProject={updateProject} 
              onGenerateScript={handleGenerateScriptAction}
              onNext={() => setActiveStep('assets')}
              loading={loading}
            />
          )}
          {activeStep === 'assets' && (
            <AssetLockerStep 
              project={project} 
              updateProject={updateProject} 
              onExtractAssets={handleExtractAssetsAction}
              onNext={() => setActiveStep('shots')}
              loading={loading}
            />
          )}
          {activeStep === 'shots' && (
            <StoryboardStep
              project={project}
              updateProject={updateProject}
              onBreakdown={handleBreakdownShotsAction}
              onGenerateShot={handleGenerateShotAction}
              onBatchGenerate={handleBatchGenerateImages}
              onNext={() => setActiveStep('export')}
              loading={loading}
            />
          )}
          {activeStep === 'export' && (
            <ExportStep 
              project={project} 
              onShowToast={showToast} 
            />
          )}
        </div>
      </main>
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            <span className="material-symbols-outlined text-red-500 text-3xl absolute inset-0 flex items-center justify-center animate-pulse">movie</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-black tracking-widest uppercase">{loading}</p>
            <p className="text-[10px] text-slate-500 font-mono">Đang kết nối với hệ thống FastAIVN...</p>
          </div>
        </div>
      )}
      {/* Footer Info */}
      <footer className="px-6 py-2 border-t border-slate-900 bg-slate-950/90 text-[10px] font-mono flex items-center justify-between text-slate-500 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            VER: <span className="text-red-500 font-black">1.0.6</span>
          </span>
          <span>STYLE: <span className="text-slate-300 font-bold">{project.style}</span></span>
          <span>ASPECT: <span className="text-slate-300 font-bold">{project.aspectRatio}</span></span>
          <span>PROJECT: <span className="text-slate-300 font-bold">{project.title}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          {loading ? loading.toUpperCase() : 'PRODUCTION SYSTEM ONLINE'}
        </div>
      </footer>
    </div>
  );
}