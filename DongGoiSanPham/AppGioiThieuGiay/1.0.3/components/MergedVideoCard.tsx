import React from 'react';
import { MediaItem } from '../types';
import { ActionButton } from './Primitives';
interface Props {
  video: MediaItem | null;
  isMerging: boolean;
  isOutdated: boolean;
  progress: string;
  error?: string;
  onMerge: () => void;
  onDownload: () => void;
  onOpenLightbox: () => void;
}
export const MergedVideoCard: React.FC<Props> = ({ 
  video, 
  isMerging, 
  isOutdated, 
  progress, 
  error, 
  onMerge, 
  onDownload,
  onOpenLightbox
}) => {
  const videoSrc = video ? `data:${video.mimeType};base64,${video.base64}` : null;
  return (
    <div className="w-full flex flex-col gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Area - Now fully on top */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[28px] font-black tracking-tight text-[#1A1A1A]">Video ghép hoàn chỉnh</h2>
          {isOutdated && !isMerging && (
            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-tighter animate-pulse border border-amber-200">
              Có cập nhật mới
            </span>
          )}
        </div>
        
        {videoSrc && !isMerging && (
           <ActionButton 
            variant="solid" 
            icon="download" 
            className="h-[44px] px-6 !text-[14px] !rounded-[12px] shadow-lg shadow-[#F31B17]/20"
            onClick={onDownload}
          >
            Tải bản chính thức
          </ActionButton>
        )}
      </div>
      <div className="bg-white rounded-[24px] border border-[#E5E5EA] shadow-xl overflow-hidden flex flex-col lg:flex-row w-full min-h-[400px]">
        {/* Video Column (Left on Desktop) */}
        <div 
          className={`w-full lg:w-[60%] aspect-video bg-black flex items-center justify-center relative group ${videoSrc && !isMerging ? 'cursor-pointer' : ''}`}
          onClick={() => { if (videoSrc && !isMerging) onOpenLightbox(); }}
        >
          {videoSrc ? (
            <video src={videoSrc} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/30">
              <span className="material-symbols-outlined text-[80px]">movie_filter</span>
              <span className="text-[14px] font-bold tracking-widest uppercase">VIDEO CHƯA ĐƯỢC GHÉP</span>
            </div>
          )}
          
          {videoSrc && !isMerging && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[56px]">play_arrow</span>
              </div>
              <div className="absolute top-6 right-6 text-white bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-[28px]">open_in_full</span>
              </div>
            </div>
          )}
          {isMerging && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-10">
              <div className="w-20 h-20 border-4 border-[#F31B17]/20 border-t-[#F31B17] rounded-full animate-spin" />
              <div className="flex flex-col items-center gap-1.5 text-center px-4">
                <span className="text-white font-black text-[22px] tracking-tight">{progress}</span>
                <span className="text-white/60 text-[13px] font-bold uppercase tracking-widest">Đang xử lý hậu kỳ với FFmpeg...</span>
              </div>
            </div>
          )}
        </div>
        {/* Info & Controls Column (Right on Desktop) */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-8 bg-gradient-to-br from-white to-[#F9F9FB]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F31B17] text-[24px]">auto_awesome_motion</span>
              <span className="text-[12px] font-black text-[#8E8E93] uppercase tracking-widest">Post-Production</span>
            </div>
            <p className="text-[#1A1A1A]/80 text-[16px] leading-relaxed font-medium">
              Ghép nối tự động 6 cảnh quay chất lượng cao. Hệ thống sẽ tối ưu hóa định dạng MP4 để sẵn sàng cho các nền tảng mạng xã hội (TikTok, Reels, Shorts).
            </p>
          </div>
          {error && (
            <div className="px-5 py-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center gap-4">
              <span className="material-symbols-outlined text-[24px]">error</span>
              <span className="text-[14px] font-bold">{error}</span>
            </div>
          )}
          {isOutdated && videoSrc && !isMerging && (
            <div className="px-5 py-4 bg-red-50 text-[#F31B17] border border-[#F31B17]/20 rounded-2xl flex items-center gap-4">
              <span className="material-symbols-outlined text-[24px]">info</span>
              <span className="text-[14px] font-bold">Dữ liệu cảnh quay đã thay đổi. Vui lòng bấm Ghép lại để nhận bản video mới nhất.</span>
            </div>
          )}
          <div className="flex flex-col gap-4 mt-2">
            <ActionButton 
              variant="navy" 
              icon={videoSrc ? "refresh" : "merge"} 
              className="h-[60px] w-full !text-[16px] !rounded-[18px] shadow-lg"
              onClick={onMerge}
              disabled={isMerging}
            >
              {videoSrc ? "Ghép lại toàn bộ clip" : "Bắt đầu ghép clip ngay"}
            </ActionButton>
            
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-tighter">Định dạng: MP4 (H.264)</span>
              <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-tighter">Độ dài: ~30-48 giây</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};