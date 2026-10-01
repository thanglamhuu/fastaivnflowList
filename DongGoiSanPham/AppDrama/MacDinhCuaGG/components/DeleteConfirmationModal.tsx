import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName: string;
}
export const DeleteConfirmationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, assetName }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onClose, onConfirm]);
  if (!isOpen) return null;
  return createPortal(
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto" onClick={onClose}>
      <div 
        className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-[380px] rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
        <div>
          <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Delete asset?</h3>
          <p className="text-[14px] text-zinc-500 font-sans leading-relaxed">
            Do you want to delete "{assetName}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]">Cancel</button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('story-studio-modal-root') || document.body
  );
};