import React from 'react';
import { MediaReference } from '../types';
interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaReference | null;
  type: 'image' | 'video';
  title: string;
  subtitle?: string;
  dialogue?: string;
}
export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  media,
  type,
  title,
}) => {
  if (!isOpen || !media) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Khung chứa Modal: Khóa cứng chuẩn tỷ lệ 9:16, tối đa chiều cao màn hình (92vh) không bị tràn */}
      <div
        className="relative h-[92vh] max-h-[92vh] max-w-[calc(92vh*9/16)] w-full aspect-[9/16] bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng nổi trực tiếp trên ảnh / video ở góc trên cùng bên phải */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-90 cursor-pointer"
          title="Đóng"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        {/* Badge Có Tiếng khi xem video */}
        {type === 'video' && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 pointer-events-none shadow-md">
            <span className="material-symbols-outlined text-[14px]">volume_up</span>
            <span>🔊 Có Tiếng</span>
          </div>
        )}
        {/* Nội dung Media: Tối ưu 100% không tràn ra ngoài */}
        <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
          {type === 'video' ? (
            <video
              src={`data:${media.mimeType};base64,${media.base64}`}
              controls
              autoPlay
              playsInline
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={`data:${media.mimeType};base64,${media.base64}`}
              alt={title}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};