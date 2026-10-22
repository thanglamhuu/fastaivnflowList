import React from 'react';
interface TopActionBarProps {
  onGenerate4Images: () => void;
  onGenerateScript: () => void;
  onRender4Videos: () => void;
  onOpenMergeModal: () => void;
  isGeneratingImages: boolean;
  isGeneratingScript: boolean;
  isRenderingVideos: boolean;
  canMakeImages: boolean;
  hasKeyframes: boolean;
  hasEnoughVideosToMerge: boolean;
  completedVideoCount: number;
  activeVideoCount: number;
}
export const TopActionBar: React.FC<TopActionBarProps> = ({
  onGenerate4Images,
  onGenerateScript,
  onRender4Videos,
  onOpenMergeModal,
  isGeneratingImages,
  isGeneratingScript,
  isRenderingVideos,
  canMakeImages,
  hasKeyframes,
  hasEnoughVideosToMerge,
  completedVideoCount,
  activeVideoCount,
}) => {
  return (
    <header className="h-14 border-b border-zinc-800 bg-[#0d0e12] px-4 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black shadow-md shadow-amber-500/20">
          <span className="material-symbols-outlined text-[20px]">movie_edit</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">
              Studio Sản Xuất Video Bán Hàng 4 Cảnh
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              E-COM 9:16
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Trạng thái: Sẵn sàng</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">FFmpeg WASM & Omni 1.1 Flash</span>
          </div>
        </div>
      </div>
      {/* Top 4 Pipeline Action Buttons */}
      <div className="flex items-center gap-2">
        {/* 1. ✨ Tạo Lại 4 Ảnh */}
        <button
          type="button"
          onClick={onGenerate4Images}
          disabled={!canMakeImages || isGeneratingImages || isRenderingVideos}
          className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            canMakeImages && !isGeneratingImages
              ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Tạo 4 ảnh Keyframe 9:16 tại kho/xưởng ứng với 4 cảnh"
        >
          <span className={`material-symbols-outlined text-[16px] ${isGeneratingImages ? 'animate-spin' : ''}`}>
            {isGeneratingImages ? 'sync' : 'auto_awesome'}
          </span>
          <span>{isGeneratingImages ? 'Đang tạo 4 ảnh...' : '✨ Tạo Lại 4 Ảnh'}</span>
        </button>
        {/* 2. 📄 Tạo Kịch Bản */}
        <button
          type="button"
          onClick={onGenerateScript}
          disabled={isGeneratingScript || isRenderingVideos}
          className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            !isGeneratingScript
              ? 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Dùng Flow.generate.text sinh lời thoại cho 4 cảnh dựa trên Mẫu Kịch Bản"
        >
          <span className={`material-symbols-outlined text-[16px] ${isGeneratingScript ? 'animate-spin' : ''}`}>
            {isGeneratingScript ? 'sync' : 'description'}
          </span>
          <span>{isGeneratingScript ? 'Đang viết thoại...' : '📄 Tạo Kịch Bản'}</span>
        </button>
        {/* 3. 🎬 Render 4 Cảnh */}
        <button
          type="button"
          onClick={onRender4Videos}
          disabled={!hasKeyframes || isRenderingVideos || isGeneratingImages}
          className={`h-9 px-4 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
            hasKeyframes && !isRenderingVideos
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/25 active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Render video nói thoại 8s đa luồng tối đa 2 cảnh song song"
        >
          <span className={`material-symbols-outlined text-[17px] ${isRenderingVideos ? 'animate-spin' : ''}`}>
            {isRenderingVideos ? 'sync' : 'movie_filter'}
          </span>
          <span>
            {isRenderingVideos ? `Đang render (${activeVideoCount} chạy)...` : '🎬 Render 4 Cảnh'}
          </span>
        </button>
        {/* 4. 🎞️ Ghép & Tải Video (Yêu cầu tối thiểu 2 clip) */}
        <button
          type="button"
          onClick={onOpenMergeModal}
          disabled={!hasEnoughVideosToMerge || isRenderingVideos}
          className={`h-9 px-4 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
            hasEnoughVideosToMerge && !isRenderingVideos
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black active:scale-95 cursor-pointer shadow-emerald-500/25 ring-1 ring-emerald-400/50'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title={
            hasEnoughVideosToMerge
              ? 'Mở Bảng điều khiển Ghép & Tải phim hoàn chỉnh bằng FFmpeg WASM'
              : `Cần tối thiểu 2 clip đã hoàn thành để ghép (Hiện có: ${completedVideoCount}/4)`
          }
        >
          <span className="material-symbols-outlined text-[18px]">
            video_library
          </span>
          <span>🎞️ Ghép & Tải Video ({completedVideoCount}/4)</span>
        </button>
      </div>
    </header>
  );
};