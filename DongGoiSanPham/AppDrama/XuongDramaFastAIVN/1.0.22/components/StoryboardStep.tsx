import React, { useState } from 'react';
import { DramaProject, DramaShot } from '../types';
interface StoryboardStepProps {
  project: DramaProject;
  updateProject: (updates: Partial<DramaProject>) => void;
  onBreakdown: () => Promise<void>;
  onGenerateShot: (shotId: string) => Promise<void>;
  onBatchGenerate: () => Promise<void>;
  onNext: () => void;
  loading: string | null;
}
export const StoryboardStep: React.FC<StoryboardStepProps> = ({
  project,
  updateProject,
  onBreakdown,
  onGenerateShot,
  onBatchGenerate,
  onNext,
  loading
}) => {
  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const handleUpdateShot = (shotId: string, updates: Partial<DramaShot>) => {
    updateProject({
      shots: project.shots.map(s => s.id === shotId ? { ...s, ...updates } : s)
    });
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm thông báo "Đã copy" nếu cần
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-20 bg-slate-950/90 backdrop-blur-md z-40 py-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">movie_filter</span>
            Storyboard Sản Xuất
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Bàn phân cảnh kịch tính ({project.shots.length} shots)</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={onBreakdown}
            disabled={!!loading}
            className="flex-1 md:flex-none px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <span className="material-symbols-outlined text-sm">splitscreen</span>
            PHÂN RÃ SHOT
          </button>
          <button
            onClick={onBatchGenerate}
            disabled={!!loading || project.shots.length === 0}
            className="flex-1 md:flex-none px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            <span className="material-symbols-outlined text-sm">collections</span>
            SINH TẤT CẢ ẢNH
          </button>
        </div>
      </div>
      {/* Shots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
        {project.shots.map((shot) => {
          const is916 = project.aspectRatio === '9:16';
          return (
            <div 
              key={shot.id} 
              className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col group hover:border-red-500/30 transition-all shadow-xl hover:shadow-2xl ${editingShotId === shot.id ? 'ring-2 ring-red-500' : ''}`}
            >
              {/* Media Preview */}
              <div 
                className={`relative bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer ${is916 ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}
                onClick={() => onGenerateShot(shot.id)}
              >
                {shot.imageUrl ? (
                  <img src={shot.imageUrl} alt={shot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="flex flex-col items-center gap-4 group/btn">
                    {shot.isGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-mono text-red-500 animate-pulse">AI ĐANG VẼ...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover/btn:bg-red-600 transition-all text-white shadow-2xl">
                          <span className="material-symbols-outlined text-2xl">photo_camera</span>
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-500 group-hover/btn:text-slate-300">Tạo ảnh khung hình</p>
                      </>
                    )}
                  </div>
                )}
                
                {/* Badge Info */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black border border-white/10 text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    SHOT {shot.shotNumber < 10 ? `0${shot.shotNumber}` : shot.shotNumber} • {shot.durationSeconds}S
                  </div>
                  <div className="px-3 py-1 bg-red-600 rounded-full text-[10px] font-black shadow-lg text-white">
                    {shot.cameraAngle.toUpperCase()}
                  </div>
                </div>
              </div>
              {/* Shot Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                {/* Video Motion Prompt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Video Motion Prompt</label>
                    <button 
                      onClick={() => copyToClipboard(shot.videoMotionPrompt)}
                      className="text-[10px] text-slate-600 hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[12px]">content_copy</span> Copy
                    </button>
                  </div>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono leading-relaxed focus:border-red-500 outline-none h-20 resize-none text-slate-300"
                    value={shot.videoMotionPrompt}
                    onChange={(e) => handleUpdateShot(shot.id, { videoMotionPrompt: e.target.value })}
                  />
                </div>
                {/* Dialogue Section */}
                {shot.dialogue && (
                  <div className="space-y-1.5 p-3 bg-red-600/5 border border-red-500/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">chat</span>
                        {shot.dialogue.characterName} ({shot.dialogue.emotion})
                      </span>
                    </div>
                    <textarea 
                      className="w-full bg-transparent border-none p-0 text-xs font-serif leading-snug focus:ring-0 outline-none resize-none text-slate-200"
                      rows={2}
                      value={shot.dialogue.line}
                      onChange={(e) => handleUpdateShot(shot.id, { 
                        dialogue: { ...shot.dialogue!, line: e.target.value } 
                      })}
                    />
                  </div>
                )}
                {/* SFX Cue */}
                <div className="mt-auto pt-3 border-t border-slate-800 flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                  <input 
                    className="flex-1 bg-transparent text-[10px] font-bold uppercase focus:outline-none placeholder:text-slate-800"
                    value={shot.sfxAudioCue}
                    placeholder="SFX Cue..."
                    onChange={(e) => handleUpdateShot(shot.id, { sfxAudioCue: e.target.value })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={onNext}
          disabled={project.shots.length === 0}
          className="px-12 py-4 bg-slate-100 text-slate-950 font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          XUẤT GÓI SẢN XUẤT <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};