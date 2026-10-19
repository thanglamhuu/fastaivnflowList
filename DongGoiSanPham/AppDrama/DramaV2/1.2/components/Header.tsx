import React from 'react';
import { ScriptProjectData, VideoModel, AspectRatio } from '../types';
interface HeaderProps {
  project: ScriptProjectData['project'];
  config: ScriptProjectData['config'];
  activeTab: 'pre' | 'story';
  onTabChange: (tab: 'pre' | 'story') => void;
  onImport: (data: any) => void;
  onExport: () => void;
  onDownloadZip: () => void;
  onMerge: () => void;
  onConfigChange: (config: Partial<ScriptProjectData['config']>) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onErrorToast?: (msg: string) => void;
  isMerging: boolean;
  isZipping: boolean;
  mergeProgress: number;
}
export default function Header({ 
  project, config, activeTab, onTabChange, 
  onImport, onExport, onDownloadZip, onMerge, onConfigChange, onAspectRatioChange,
  onErrorToast,
  isMerging, isZipping, mergeProgress
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
        const errMsg = "Lỗi định dạng file JSON: " + (err instanceof Error ? err.message : 'File không hợp lệ');
        if (onErrorToast) {
          onErrorToast(errMsg);
        } else {
          console.error(errMsg);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const videoCount = project.shots.filter(s => s.videoMedia && s.videoMedia.base64).length;
  return (
    <header className="flex flex-col border-b border-white/5 bg-[#070709] z-50">
      <div className="flex flex-wrap items-center justify-between px-6 py-3.5 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <span className="material-symbols-outlined text-black font-black text-2xl">movie_filter</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-white tracking-tighter uppercase italic">Flow AI Short Film Studio</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[200px]">
                {project.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="text-[10px] text-slate-400 font-black">{project.duration}s</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="text-[10px] text-indigo-400 font-black">{videoCount}/{project.shots.length} Clips</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Cụm 2 nút nhỏ Tỉ lệ (9:16 và 16:9) */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-lg p-0.5" title="Chọn tỉ lệ khung hình (Aspect Ratio)">
            <button
              type="button"
              onClick={() => onAspectRatioChange('9:16')}
              className={`px-2 py-1 rounded text-[11px] font-black transition-all ${
                project.aspectRatio === '9:16'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              9:16
            </button>
            <button
              type="button"
              onClick={() => onAspectRatioChange('16:9')}
              className={`px-2 py-1 rounded text-[11px] font-black transition-all ${
                project.aspectRatio === '16:9'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              16:9
            </button>
          </div>
          {/* Cụm 2 nút nhỏ Độ phân giải (360p và 720p) */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-lg p-0.5" title="Chọn độ phân giải video (Resolution)">
            <button
              type="button"
              onClick={() => onConfigChange({ resolution: '360p' })}
              className={`px-2 py-1 rounded text-[11px] font-black transition-all ${
                config.resolution === '360p'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              360p
            </button>
            <button
              type="button"
              onClick={() => onConfigChange({ resolution: '720p' })}
              className={`px-2 py-1 rounded text-[11px] font-black transition-all ${
                config.resolution === '720p'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              720p
            </button>
          </div>
          <div className="flex flex-col items-end">
            <select 
              value={config.model}
              onChange={(e) => onConfigChange({ model: e.target.value as VideoModel })}
              className="bg-slate-900 border border-white/10 text-[10px] text-slate-200 font-black uppercase tracking-widest rounded-lg px-2.5 py-1.5 focus:outline-none hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <option value="Veo 3.1 - Fast">Veo 3.1 - Fast (Khuyên dùng)</option>
              <option value="Omni 1.1 Flash">Omni 1.1 Flash</option>
              <option value="Veo 3.1 - Lite">Veo 3.1 - Lite</option>
              <option value="Veo 3.1 - Quality">Veo 3.1 - Quality</option>
            </select>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-0.5 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <label className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-white/5 cursor-pointer transition-all flex items-center justify-center" title="Import file JSON kịch bản">
              <span className="material-symbols-outlined text-lg">upload_file</span>
              <input type="file" accept=".json" className="hidden" onChange={handleFileImport} />
            </label>
            <button onClick={onExport} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-white/5 transition-all flex items-center justify-center" title="Export kịch bản JSON">
              <span className="material-symbols-outlined text-lg">save_as</span>
            </button>
            <button 
              onClick={onDownloadZip}
              disabled={videoCount === 0 || isZipping}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-white/5 transition-all text-xs font-bold disabled:opacity-30 ${isZipping ? 'animate-pulse' : ''}`}
              title="Tải tất cả các clips đã tạo"
            >
              <span className={`material-symbols-outlined text-base ${isZipping ? 'animate-spin' : ''}`}>
                {isZipping ? 'hourglass_top' : 'folder_zip'}
              </span>
              <span className="hidden sm:inline text-[11px]">{isZipping ? 'Nén...' : 'Tải Clips'}</span>
            </button>
          </div>
          {/* Nút Ghép & Tải (Đổi từ Render Full) */}
          <button 
            onClick={onMerge}
            disabled={videoCount < 2 || isMerging}
            title={videoCount < 2 ? "Cần tạo ít nhất 2 clips để ghép thành phim hoàn chỉnh" : "Ghép tất cả các clip thành 1 video duy nhất và tải về máy"}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-black text-xs font-black uppercase tracking-tight transition-all active:scale-95 disabled:active:scale-100 ${
              isMerging 
                ? 'bg-amber-500/70 cursor-wait' 
                : videoCount < 2 
                  ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isMerging ? 'animate-spin' : ''}`}>
              {isMerging ? 'progress_activity' : 'video_merge'}
            </span>
            <span>{isMerging ? `Đang xử lý ${Math.round(mergeProgress)}%` : 'Ghép & Tải'}</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center bg-[#0d0d12] border-t border-white/5">
        <div className="flex p-1 gap-1">
          <button 
            onClick={() => onTabChange('pre')}
            className={`flex items-center gap-2 px-8 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'pre' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">palette</span>
            I. Tiền kỳ & Nhân vật
          </button>
          <button 
            onClick={() => onTabChange('story')}
            className={`flex items-center gap-2 px-8 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'story' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-slate-200'
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