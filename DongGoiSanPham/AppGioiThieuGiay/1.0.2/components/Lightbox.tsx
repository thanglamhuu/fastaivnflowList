
import React, { useEffect, useRef } from 'react';
import { MediaItem, AspectRatio } from '../types';
import { Flow } from 'flow-sdk';
interface LightboxProps {
  media: MediaItem;
  aspectRatio: AspectRatio;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  title?: string;
}
export const Lightbox: React.FC<LightboxProps> = ({ 
  media, aspectRatio, onClose, onPrev, onNext, title 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSrc = `data:${media.mimeType};base64,${media.base64}`;
  const isVideo = media.mimeType.startsWith('video/');
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);
  const handleDownload = () => {
    const ext = media.mimeType.split('/')[1] || (isVideo ? 'mp4' : 'png');
    Flow.download({
      base64: media.base64,
      mimeType: media.mimeType,
      filename: `storyboard_export_${Date.now()}.${ext}`
    });
  };
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Backdrop Area */}
      <div className="absolute inset-0 z-0" />
      {/* Header Info */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Viewing Mode</span>
          <h4 className="text-white text-[18px] font-black tracking-tight drop-shadow-md">{title || 'Storyboard Scene'}</h4>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={handleDownload}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
            title="Tải xuống"
          >
            <span className="material-symbols-outlined text-[28px]">download</span>
          </button>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
        </div>
      </div>
      {/* Navigation Arrows */}
      {onPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 lg:left-8 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all active:scale-90 z-20"
        >
          <span className="material-symbols-outlined text-[40px] lg:text-[56px]">chevron_left</span>
        </button>
      )}
      {onNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 lg:right-8 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all active:scale-90 z-20"
        >
          <span className="material-symbols-outlined text-[40px] lg:text-[56px]">chevron_right</span>
        </button>
      )}
      {/* Media Container */}
      <div 
        className="relative z-10 flex items-center justify-center p-4 lg:p-12 w-full h-full pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className={`bg-black shadow-2xl overflow-hidden rounded-2xl pointer-events-auto transition-all duration-500 border border-white/10 ${
            aspectRatio === '16:9' ? 'aspect-video w-full max-w-[1280px]' : 'aspect-[9/16] h-full max-h-[90vh]'
          }`}
        >
          {isVideo ? (
            <video 
              ref={videoRef}
              src={mediaSrc} 
              className="w-full h-full object-contain" 
              autoPlay 
              controls 
              playsInline
            />
          ) : (
            <img 
              src={mediaSrc} 
              className="w-full h-full object-contain select-none" 
              alt="Expanded view" 
            />
          )}
        </div>
      </div>
      {/* Footer Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/30 text-[9px] font-black uppercase tracking-[0.3em] pointer-events-none hidden md:flex">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded border border-white/20 text-white/50">ESC</span>
          <span>Close</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded border border-white/20 text-white/50">L/R ARROWS</span>
          <span>Navigate</span>
        </div>
      </div>
    </div>
  );
};