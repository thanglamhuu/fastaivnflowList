import React from 'react';
import { StoryboardFrame } from '../types';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
interface FrameCardProps {
  frame: StoryboardFrame;
  aspectRatio: '16:9' | '9:16';
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onGenerate: (id: string) => Promise<void>;
  isGenerating: boolean;
  isAutofilling?: boolean;
  onExpand?: () => void;
  generationFailed?: boolean;
  onStop?: () => void;
  onDismissFailure?: () => void;
}
export const FrameCard: React.FC<FrameCardProps> = ({
  frame,
  aspectRatio,
  isActive,
  onClick,
  onDelete,
  onGenerate,
  isGenerating,
  isAutofilling,
  onExpand,
  generationFailed,
  onStop,
  onDismissFailure
}) => {
  const aspectClass = aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]';
  
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex flex-col gap-1.5 cursor-pointer"
    >
      {/* Image Container */}
      <div className={`relative ${aspectClass} rounded-[4px] overflow-hidden border border-[#DADCE0]/[0.24] transition-all duration-200 ${
        isActive ? 'outline outline-2 outline-white shadow-[inset_0_0_0_2px_rgba(0,0,0,1)]' : 'group-hover:border-white/20'
      }`}>
        {frame.imageUrl ? (
          <img 
            src={frame.imageUrl} 
            alt={frame.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-[#DADCE0]/[0.04] flex flex-col items-center justify-center">
            <Icon name="image" size={40} className="opacity-[0.16]" />
          </div>
        )}
        {/* Loading Overlay */}
        {(isGenerating || isAutofilling) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2.5">
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
            {isGenerating && onStop && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onStop(); }}
                  className="px-3 py-1 rounded-full border border-[#DADCE0]/[0.24] text-[11px] font-bold text-white/80 hover:bg-white/10 transition-all font-sans"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        )}
        {/* Failed Overlay */}
        {generationFailed && !isGenerating && !isAutofilling && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2">
            {/* Dismiss button */}
            {onDismissFailure && (
              <button
                onClick={(e) => { e.stopPropagation(); onDismissFailure(); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-[12px] bg-black/40 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Icon name="close" size={16} />
              </button>
            )}
            <Icon name="error" size={24} className="opacity-[0.48]" />
            <span className="text-[11px] text-white/60 font-sans">Generation failed</span>
            <button
              onClick={(e) => { e.stopPropagation(); onGenerate(frame.id); }}
              className="mt-1 px-3 py-1 rounded-full border border-[#DADCE0]/[0.24] text-[11px] font-bold text-white/80 hover:bg-white/10 transition-all font-sans"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Hover Actions */}
        {!isGenerating && !isAutofilling && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
            {frame.imageUrl && onExpand && (
              <Tooltip text="View full size">
                <button 
                  onClick={(e) => { e.stopPropagation(); onExpand(); }}
                  className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-[12px] transition-all flex items-center justify-center shadow-lg"
                >
                  <Icon name="open_in_full" size={18} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
                </button>
              </Tooltip>
            )}
            <Tooltip text={!frame.visualDescription?.trim() ? 'Add a description first' : frame.imageUrl ? 'Regenerate image' : 'Create image'}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (frame.visualDescription?.trim()) onGenerate(frame.id);
                }}
                disabled={!frame.visualDescription?.trim()}
                className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-[12px] transition-all flex items-center justify-center shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="refresh" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
              </button>
            </Tooltip>
            <Tooltip text="Delete frame">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(frame.id);
                }}
                className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-[12px] transition-all flex items-center justify-center shadow-lg"
              >
                <Icon name="delete" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      
      {/* Label Area */}
      <div className="flex items-baseline gap-2.5 px-1 overflow-hidden w-full">
        <span className="text-[13px] font-bold text-[#DADCE0]/[0.48] font-sans shrink-0 leading-none">
          {frame.shotNumber.toString().padStart(2, '0')}
        </span>
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <h3 className="text-[14px] font-bold text-white/90 truncate font-sans leading-none">
            {frame.title || 'Frame title'}
          </h3>
          <Icon name="edit" size={26} className="opacity-0 group-hover:opacity-[0.48] transition-opacity flex-shrink-0 p-1" />
        </div>
      </div>
    </div>
  );
};