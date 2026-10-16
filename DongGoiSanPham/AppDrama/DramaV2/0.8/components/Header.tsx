import React from 'react';
import { ScriptProjectData, VideoModel } from '../types';
interface HeaderProps {
  project: ScriptProjectData['project'];
  config: ScriptProjectData['config'];
  activeTab: 'pre' | 'story';
  onTabChange: (tab: 'pre' | 'story') => void;
  onImport: (data: ScriptProjectData) => void;
  onExport: () => void;
  onDownloadClips: () => void;
  onMerge: () => void;
  onConfigChange: (config: Partial<ScriptProjectData['config']>) => void;
  isMerging: boolean;
  mergeProgress: number;
}
export default function Header({ 
  project, config, activeTab, onTabChange, 
  onImport, onExport, onDownloadClips, onMerge, onConfigChange,
  isMerging, mergeProgress
}: HeaderProps) {
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
      } catch (err) {
        alert("Lỗi định dạng file JSON.");
      }
    };
    reader.readAsText(file);
  };
  const videoCount = project.shots.filter(s => s.videoMedia).length;
  return (
    <header className="flex flex-col border-b border-white/5 bg-[#070709] z-50">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="material-symbols-outlined text-black font-black text-2xl">movie_filter</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tighter uppercase italic">Flow AI Short Film Studio</h1>
            <div className="flex items-center gap-4 mt-0.5">
              <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Project: {project.title}</span>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{project.aspectRatio}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{project.duration}s</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Render Config</p>
            <select 
              value={config.model}
              onChange={(e) => onConfigChange({ model: e.target.value as VideoModel })}
              className="bg-slate-900 border border-white/5 text-[10px] text-slate-300 font-black uppercase tracking-widest rounded-lg px-3 py-2 focus:outline-none hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <option value="Omni 1.1 Flash">Omni 1.1 Flash</option>
              <option value="Veo 3.1 - Lite">Veo 3.1 - Lite</option>
              <option value="Veo 3.1 - Fast">Veo 3.1 - Fast</option>
              <option value="Veo 3.1 - Quality">Veo 3.1 - Quality</option>
            </select>
          </div>
          <div className="h-8 w-[1px] bg-white/5 mx-2" />
          <div className="flex items-center gap-2">
            <label className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl border border-white/5 cursor-pointer transition-all" title="Import JSON">
              <span className="material-symbols-outlined text-xl">upload_file</span>
              <input type="file" accept=".json" className="hidden" onChange={handleFileImport} />
            </label>
            <button onClick={onExport} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl border border-white/5 transition-all" title="Export JSON">
              <span className="material-symbols-outlined text-xl">save_as</span>
            </button>
            <button 
              onClick={onDownloadClips}
              disabled={videoCount === 0}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl border border-white/5 transition-all disabled:opacity-30" 
              title="Download All Clips"
            >
              <span className="material-symbols-outlined text-xl">file_download</span>
            </button>
          </div>
          <button 
            onClick={onMerge}
            disabled={videoCount < 2 || isMerging}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-black text-xs font-black uppercase tracking-tighter transition-all ${
              isMerging ? 'bg-amber-500/50 cursor-wait' : 'bg-amber-500 hover:bg-amber-400 shadow-xl shadow-amber-500/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{isMerging ? 'progress_activity' : 'auto_videocam'}</span>
            {isMerging ? `Merging ${Math.round(mergeProgress)}%` : 'Render Full Film'}
          </button>
        </div>
      </div>
      <div className="flex justify-center bg-[#0d0d12] border-t border-white/5">
        <div className="flex p-1 gap-1">
          <button 
            onClick={() => onTabChange('pre')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'pre' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-sm">palette</span>
            I. Pre-Production
          </button>
          <button 
            onClick={() => onTabChange('story')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'story' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-sm">movie_edit</span>
            II. Storyboard Studio
          </button>
        </div>
      </div>
    </header>
  );
}