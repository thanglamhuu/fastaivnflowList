import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
interface LightboxItem {
  id: string;
  imageUrl: string;
  label: string;
}
interface ImageLightboxProps {
  items: LightboxItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}
export const ImageLightbox: React.FC<ImageLightboxProps> = ({ items, activeIndex, onClose, onNavigate }) => {
  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasPrev) onNavigate(activeIndex - 1);
    if (e.key === 'ArrowRight' && hasNext) onNavigate(activeIndex + 1);
  }, [onClose, onNavigate, activeIndex, hasPrev, hasNext]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  if (!item) return null;
  return createPortal(
    <div
      className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all"
      >
        <Icon name="close" size={22} className="text-white/80" />
      </button>
      {/* Navigation: Previous */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all"
        >
          <Icon name="chevron_left" size={28} className="text-white/80" />
        </button>
      )}
      {/* Navigation: Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all"
        >
          <Icon name="chevron_right" size={28} className="text-white/80" />
        </button>
      )}
      {/* Image */}
      <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
        <img
          src={item.imageUrl}
          alt={item.label}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-white/80 font-sans">{item.label}</span>
          <span className="text-[13px] text-white/40 font-sans">{activeIndex + 1} / {items.length}</span>
        </div>
      </div>
    </div>,
    document.getElementById('story-studio-modal-root') || document.body
  );
};