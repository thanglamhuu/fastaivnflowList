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
        <a
          href="https://fastaivn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          title="Trang chủ FastAI VN (fastaivn.com)"
        >
          <img
            src="https://fastaivn.com/baner.png"
            alt="FastAI VN Logo"
            className="h-7 w-auto object-contain"
          />
        </a>
        <div className="h-6 w-[1px] bg-zinc-800 mx-1 hidden sm:block"></div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">
              FastAIVN Xưởng Review
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F31B17]/15 text-[#F31B17] border border-[#F31B17]/30">
              v1.11
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F31B17] animate-pulse"></span>
            <a
              href="https://fastaivn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F31B17] transition-colors font-semibold"
            >
              fastaivn.com
            </a>
          </div>
        </div>
      </div>
      {/* Top 4 Pipeline Action Buttons */}
      <div className="flex items-center gap-2">
        {/* 1. Tạo Lại 4 Ảnh */}
        <button
          type="button"
          onClick={onGenerate4Images}
          disabled={!canMakeImages || isGeneratingImages || isRenderingVideos}
          className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            canMakeImages && !isGeneratingImages
              ? 'bg-zinc-800 hover:bg-zinc-700 text-red-200 border border-[#F31B17]/40 hover:border-[#F31B17] active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Tạo 4 ảnh Keyframe 9:16 tại kho/xưởng ứng với 4 cảnh"
        >
          <span className={`material-symbols-outlined text-[16px] text-[#F31B17] ${isGeneratingImages ? 'animate-spin' : ''}`}>
            {isGeneratingImages ? 'sync' : 'auto_awesome'}
          </span>
          <span>{isGeneratingImages ? 'Đang tạo 4 ảnh...' : 'Tạo Lại 4 Ảnh'}</span>
        </button>
        {/* 2. Tạo Kịch Bản */}
        <button
          type="button"
          onClick={onGenerateScript}
          disabled={isGeneratingScript || isRenderingVideos}
          className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            !isGeneratingScript
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-[#F31B17] active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Dùng AI sinh lời thoại cho 4 cảnh dựa trên Mẫu Kịch Bản"
        >
          <span className={`material-symbols-outlined text-[16px] text-[#F31B17] ${isGeneratingScript ? 'animate-spin' : ''}`}>
            {isGeneratingScript ? 'sync' : 'description'}
          </span>
          <span>{isGeneratingScript ? 'Đang viết thoại...' : 'Tạo Kịch Bản'}</span>
        </button>
        {/* 3. Render 4 Cảnh */}
        <button
          type="button"
          onClick={onRender4Videos}
          disabled={!hasKeyframes || isRenderingVideos || isGeneratingImages}
          className={`h-9 px-4 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
            hasKeyframes && !isRenderingVideos
              ? 'bg-[#F31B17] hover:bg-[#d11713] text-white shadow-red-900/40 active:scale-95 cursor-pointer ring-1 ring-red-400/40'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title="Render video nói thoại 8s đa luồng tối đa 2 cảnh song song"
        >
          <span className={`material-symbols-outlined text-[17px] ${isRenderingVideos ? 'animate-spin' : ''}`}>
            {isRenderingVideos ? 'sync' : 'movie_filter'}
          </span>
          <span>
            {isRenderingVideos ? `Đang render (${activeVideoCount} chạy)...` : 'Render 4 Cảnh'}
          </span>
        </button>
        {/* 4. Ghép & Tải Video */}
        <button
          type="button"
          onClick={onOpenMergeModal}
          disabled={!hasEnoughVideosToMerge || isRenderingVideos}
          className={`h-9 px-4 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
            hasEnoughVideosToMerge && !isRenderingVideos
              ? 'bg-zinc-800 hover:bg-zinc-700 text-white active:scale-95 cursor-pointer border border-[#F31B17] shadow-red-950/40'
              : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
          }`}
          title={
            hasEnoughVideosToMerge
              ? 'Mở Bảng điều khiển Ghép & Tải phim hoàn chỉnh bằng FFmpeg WASM'
              : `Cần tối thiểu 2 clip đã hoàn thành để ghép (Hiện có: ${completedVideoCount}/4)`
          }
        >
          <span className="material-symbols-outlined text-[18px] text-[#F31B17]">
            video_library
          </span>
          <span>Ghép & Tải Video ({completedVideoCount}/4)</span>
        </button>
      </div>
    </header>
  );
};