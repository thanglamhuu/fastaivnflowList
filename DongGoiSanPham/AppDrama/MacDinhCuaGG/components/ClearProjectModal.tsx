import React from 'react';
import { Icon } from './Icon';
interface ClearProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const ClearProjectModal: React.FC<ClearProjectModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-sm rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
        <div>
          <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Clear Project?</h3>
          <p className="text-[14px] text-zinc-500 font-sans leading-relaxed">
            This will delete your entire script, asset library, and storyboard. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]"
          >
            Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
};