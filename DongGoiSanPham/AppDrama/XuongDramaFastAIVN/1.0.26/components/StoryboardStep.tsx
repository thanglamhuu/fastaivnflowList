import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import JSZip from 'jszip';
import { DramaProject, DramaShot, CharacterAsset, ProjectConfig } from '../types';
import { concatVideos, adjustClipSpeed } from '../services/video';
interface StoryboardStepProps {
  project: DramaProject;
  config: ProjectConfig;
  updateProject: (updates: Partial<DramaProject>) => void;
  onBreakdown: () => Promise<void>;
  onGenerateShot: (shotId: string) => Promise<void>;
  onSelectShotImage: (shotId: string) => Promise<void>;
  onGenerateVideo: (shotId: string) => Promise<void>;
  onBatchGenerate: () => Promise<void>;
  onBatchGenerateVideos: () => Promise<void>;
  onNext: () => void;
  loading: string | null;
  onSetLoading: (msg: string | null) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}
export const StoryboardStep: React.FC<StoryboardStepProps> = ({
  project,
  config,
  updateProject,
  onBreakdown,
  onGenerateShot,
  onSelectShotImage,
  onGenerateVideo,
  onBatchGenerate,
  onBatchGenerateVideos,
  onNext,
  loading,
  onSetLoading,
  onShowToast
}) => {
  const [viewMode, setViewMode] = useState<Record<string, 'image' | 'video'>>({});
  const [zoomedShotId, setZoomedShotId] = useState<string | null>(null);
  
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedMergeIds, setSelectedMergeIds] = useState<Set<string>>(new Set());
  const handleUpdateShot = (shotId: string, updates: Partial<DramaShot>) => {
    updateProject({
      shots: project.shots.map(s => s.id === shotId ? { ...s, ...updates } : s)
    });
  };
  const toggleView = (e: React.MouseEvent, shotId: string) => {
    e.stopPropagation();
    setViewMode(prev => ({
      ...prev,
      [shotId]: prev[shotId] === 'video' ? 'image' : 'video'
    }));
  };
  const getMatchedCharacters = (shot: DramaShot): CharacterAsset[] => {
    return project.characters.filter(c => {
      if (!c.name) return false;
      const charNameLower = c.name.toLowerCase();
      const isTagged = shot.characterNames?.some(name => {
        const sName = String(name).toLowerCase();
        return charNameLower.includes(sName) || sName.includes(charNameLower);
      });
      if (isTagged) return true;
      return (shot.visualPrompt || "").toLowerCase().includes(charNameLower);
    });
  };
  const handleDownloadVideosZip = async () => {
    const videoShots = project.shots.filter(s => !!s.videoUrl && !!s.videoMediaId);
    if (videoShots.length === 0) {
      return onShowToast("Chưa có video nào được sinh.", "error");
    }
    onSetLoading("Đang nén video vào file ZIP...");
    try {
      const zip = new JSZip();
      
      videoShots.forEach((s, idx) => {
        const base64 = s.videoUrl!.split(',')[1];
        const filename = `shot_${s.shotNumber}_${s.title.replace(/\s+/g, '_')}.mp4`;
        zip.file(filename, base64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await Flow.download({
          base64,
          mimeType: 'application/zip',
          filename: `${project.title.replace(/\s+/g, '_')}_videos.zip`
        });
        onShowToast("Đã tải xuống file ZIP videos!");
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Zip error", err);
      onShowToast("Lỗi khi tạo file ZIP.", "error");
    } finally {
      onSetLoading(null);
    }
  };
  const handleMergeVideosAction = async () => {
    const selectedShots = project.shots
      .filter(s => selectedMergeIds.has(s.id) && !!s.videoUrl)
      .sort((a, b) => a.shotNumber - b.shotNumber);
    if (selectedShots.length < 2) {
      return onShowToast("Vui lòng chọn ít nhất 2 shot để ghép.", "error");
    }
    setShowMergeDialog(false);
    onSetLoading(`Đang xử lý ghép video chất lượng ${config.resolution}...`);
    
    try {
      const speedFactor = parseFloat(config.speed.replace('x', ''));
      const processedVideos: string[] = [];
      for (const shot of selectedShots) {
        const base64 = shot.videoUrl!.split(',')[1];
        if (speedFactor !== 1) {
          const adjusted = await adjustClipSpeed(base64, speedFactor);
          processedVideos.push(adjusted);
        } else {
          processedVideos.push(base64);
        }
      }
      const result = await concatVideos(processedVideos, config.resolution, config.ratio);
      
      await Flow.download({
        base64: result.base64,
        mimeType: 'video/mp4',
        filename: `${project.title.replace(/\s+/g, '_')}_final_${config.resolution}_${Date.now()}.mp4`
      });
      onShowToast(`Đã ghép video ${config.resolution} và tải xuống thành công!`);
    } catch (err: any) {
      console.error("Merge error", err);
      onShowToast(`Lỗi ghép video: ${err.message}`, "error");
    } finally {
      onSetLoading(null);
    }
  };
  const toggleSelectAllForMerge = () => {
    const allVideoShotIds = project.shots.filter(s => !!s.videoUrl).map(s => s.id);
    if (selectedMergeIds.size === allVideoShotIds.length) {
      setSelectedMergeIds(new Set());
    } else {
      setSelectedMergeIds(new Set(allVideoShotIds));
    }
  };
  const toggleSelectMergeId = (id: string) => {
    const next = new Set(selectedMergeIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedMergeIds(next);
  };
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '9:16': return 'aspect-[9/16]';
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-[16/9]';
    }
  };
  const zoomedShot = project.shots.find(s => s.id === zoomedShotId);
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-3 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/10 rounded-lg">
            <span className="material-symbols-outlined text-red-500 text-xl">movie_filter</span>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">Story board</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              ({project.shots.length} shots)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onBatchGenerate}
            disabled={!!loading || project.shots.length === 0}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">collections</span>
            SINH TẤT CẢ ẢNH
          </button>
          <div className="flex items-center gap-1 flex-1 md:flex-none">
            <button
              onClick={onBatchGenerateVideos}
              disabled={!!loading || project.shots.length === 0}
              className="flex-1 px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-l-xl text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">movie_creation</span>
              SINH TẤT CẢ VIDEO
            </button>
            <button
              onClick={() => setShowMergeDialog(true)}
              disabled={!!loading || project.shots.filter(s => !!s.videoUrl).length < 2}
              className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white font-bold text-[10px] transition-all flex items-center justify-center border-l border-white/10 active:scale-95"
              title="Ghép các clip đã sinh"
            >
              <span className="material-symbols-outlined text-sm">merge</span>
              GHÉP VIDEO
            </button>
            <button
              onClick={handleDownloadVideosZip}
              disabled={!!loading || project.shots.filter(s => !!s.videoUrl).length === 0}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-r-xl text-[10px] transition-all flex items-center justify-center border-l border-white/10 active:scale-95"
              title="Tải tất cả video đã sinh"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              TẢI VIDEO
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-32">
        {project.shots.map((shot) => {
          const ratioClass = getAspectRatioClass(config.ratio);
          const currentMode = viewMode[shot.id] || (shot.videoUrl ? 'video' : 'image');
          const isVideoView = currentMode === 'video' && shot.videoUrl;
          const matchedChars = getMatchedCharacters(shot);
          
          return (
            <div 
              key={shot.id} 
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col group hover:border-red-500/30 transition-all shadow-xl hover:shadow-2xl"
            >
              <div 
                onClick={() => (shot.imageUrl || shot.videoUrl) && setZoomedShotId(shot.id)}
                className={`relative bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer group/media ${ratioClass}`}
              >
                {shot.isGeneratingVideo ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-mono text-red-500 animate-pulse uppercase">AI ĐANG DỰNG CLIP...</p>
                  </div>
                ) : isVideoView ? (
                  <div className="relative w-full h-full">
                    <video src={shot.videoUrl} className="w-full h-full object-cover opacity-80" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-6xl opacity-40 group-hover/media:opacity-100 transition-opacity">play_circle</span>
                    </div>
                  </div>
                ) : shot.imageUrl ? (
                  <img src={shot.imageUrl} alt={shot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                    {shot.isGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                        <p className="text-[9px] font-mono text-red-500 animate-pulse uppercase">AI ĐANG VẼ...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <button onClick={() => onGenerateShot(shot.id)} className="w-40 py-3 rounded-full bg-slate-800 hover:bg-red-600 transition-all text-white flex items-center justify-center gap-2 group/btn shadow-2xl">
                          <span className="material-symbols-outlined text-lg">photo_camera</span>
                          <span className="text-[10px] font-black uppercase">Tạo ảnh AI</span>
                        </button>
                        <button onClick={() => onSelectShotImage(shot.id)} className="w-40 py-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-all text-white flex items-center justify-center gap-2 group/btn shadow-2xl border border-slate-700">
                          <span className="material-symbols-outlined text-lg">collections</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter">Chọn ảnh thư viện</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {!shot.isGenerating && !shot.isGeneratingVideo && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
                     <span className="text-[10px] font-black text-white/60 uppercase tracking-widest pointer-events-none">Click để phóng to</span>
                     <div className="flex gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onGenerateShot(shot.id)} className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all">
                          <span className="material-symbols-outlined text-lg">refresh</span>
                        </button>
                        {shot.imageUrl && (
                          <button onClick={() => onGenerateVideo(shot.id)} className="px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center gap-2 hover:bg-red-500 transition-all shadow-xl">
                            <span className="material-symbols-outlined text-sm">movie_creation</span>
                            {shot.videoUrl ? 'LÀM LẠI CLIP' : 'TẠO CLIP'}
                          </button>
                        )}
                     </div>
                  </div>
                )}
                {shot.videoUrl && !shot.isGeneratingVideo && (
                  <button onClick={(e) => toggleView(e, shot.id)} className="absolute bottom-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-red-600 transition-colors z-30">
                    <span className="material-symbols-outlined text-sm">{isVideoView ? 'image' : 'play_circle'}</span>
                  </button>
                )}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
                  <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black border border-white/10 text-white flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    SHOT {shot.shotNumber < 10 ? `0${shot.shotNumber}` : shot.shotNumber}
                  </div>
                  <div className="px-2.5 py-1 bg-red-600 rounded-full text-[9px] font-black shadow-lg text-white uppercase">
                    {shot.cameraAngle}
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[8px] font-black text-slate-500 uppercase mr-1 pt-1">Nhân vật:</span>
                  {matchedChars.length > 0 ? matchedChars.map(c => (
                    <span key={c.id} className="px-2 py-0.5 bg-red-600/10 text-red-400 rounded text-[8px] font-bold uppercase border border-red-500/20 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                      {c.name}
                    </span>
                  )) : (
                    <span className="text-[8px] text-slate-600 italic">Không tìm thấy tham chiếu</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Mô tả hình ảnh (Visual Prompt)</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono leading-relaxed focus:border-red-500 outline-none h-20 resize-none text-slate-300"
                    value={shot.visualPrompt}
                    onChange={(e) => handleUpdateShot(shot.id, { visualPrompt: e.target.value })}
                  />
                </div>
                {shot.dialogue && (
                  <div className="space-y-1 p-2.5 bg-red-600/5 border border-red-500/10 rounded-xl">
                    <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">chat</span>
                      {shot.dialogue.characterName}
                    </span>
                    <p className="text-[11px] font-serif leading-snug text-slate-200">"{shot.dialogue.line}"</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {showMergeDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowMergeDialog(false)} />
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">merge</span>
                  Chọn Shot Để Ghép Clip
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Sắp xếp theo thứ tự Shot • Tốc độ: {config.speed}</p>
              </div>
              <button onClick={() => setShowMergeDialog(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            
            <div className="flex-1 overflow-auto p-6">
               <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={toggleSelectAllForMerge}
                    className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {selectedMergeIds.size === project.shots.filter(s => !!s.videoUrl).length ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    Chọn tất cả ({project.shots.filter(s => !!s.videoUrl).length})
                  </button>
                  <span className="text-[10px] font-mono text-red-500">Đã chọn: {selectedMergeIds.size}</span>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {project.shots.filter(s => !!s.videoUrl).map(shot => (
                    <button 
                      key={shot.id}
                      onClick={() => toggleSelectMergeId(shot.id)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedMergeIds.has(shot.id) ? 'border-red-600 scale-95' : 'border-transparent hover:border-slate-700'}`}
                    >
                      <img src={shot.imageUrl} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-left">
                        <div className="text-[9px] font-black text-white/40 uppercase">Shot {shot.shotNumber}</div>
                        <div className="text-[10px] font-bold text-white truncate">{shot.title}</div>
                      </div>
                      {selectedMergeIds.has(shot.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-xs text-white font-bold">check</span>
                        </div>
                      )}
                    </button>
                  ))}
               </div>
            </div>
            <footer className="p-6 border-t border-slate-800 flex gap-4">
               <button 
                 onClick={() => setShowMergeDialog(false)}
                 className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl text-xs uppercase"
               >
                 Hủy
               </button>
               <button 
                 onClick={handleMergeVideosAction}
                 disabled={selectedMergeIds.size < 2}
                 className="flex-[2] py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase shadow-lg shadow-red-600/20"
               >
                 Bắt đầu ghép {selectedMergeIds.size} clip
               </button>
            </footer>
          </div>
        </div>
      )}
      {zoomedShot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-10">
          <button onClick={() => setZoomedShotId(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all z-50 shadow-2xl">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="w-full h-full max-w-6xl flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className={`relative bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 max-h-[85vh] ${getAspectRatioClass(config.ratio)} ${config.ratio === '9:16' || config.ratio === '3:4' ? 'h-full' : 'w-full'}`}>
              {zoomedShot.videoUrl ? (
                <video src={zoomedShot.videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
              ) : (
                <img src={zoomedShot.imageUrl} className="w-full h-full object-contain" />
              )}
            </div>
            <div className="w-full md:w-80 shrink-0 space-y-6 text-left">
              <div className="space-y-1">
                <div className="text-red-500 font-black text-xs uppercase tracking-widest">Shot #{zoomedShot.shotNumber}</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{zoomedShot.cameraAngle}</h3>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Prompt</div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{zoomedShot.visualPrompt}"</p>
              </div>
              {zoomedShot.dialogue && (
                <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl space-y-2">
                   <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">chat</span>
                    {zoomedShot.dialogue.characterName}
                  </div>
                  <p className="text-sm font-serif text-white leading-relaxed italic">"{zoomedShot.dialogue.line}"</p>
                </div>
              )}
              <button onClick={() => setZoomedShotId(null)} className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">Đóng xem thử</button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={onNext}
          disabled={project.shots.length === 0}
          className="px-10 py-3 bg-slate-100 text-slate-950 font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 text-xs"
        >
          XUẤT GÓI SẢN XUẤT <span className="material-symbols-outlined text-sm">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};