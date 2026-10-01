import React from 'react';
import { Asset } from '../types';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
const typeIcon: Record<string, string> = {
  character: 'person',
  location: 'map',
  prop: 'deployed_code',
};
interface Props {
  asset: Asset;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onGenerate: () => void;
  onExpand?: () => void;
  generationFailed?: boolean;
  onStop?: () => void;
  onDismissFailure?: () => void;
}
export const AssetGridCard: React.FC<Props> = ({ asset, isActive, onClick, onDelete, onGenerate, onExpand, generationFailed, onStop, onDismissFailure }) => {
  const thumbnail = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
  
  const displayUrl = thumbnail?.dataUrl || null;
  return (
    <div 
      className="group flex flex-col gap-1.5 cursor-pointer transition-all"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Image Container */}
      <div className={`relative aspect-video w-full rounded-[4px] overflow-hidden border border-[#DADCE0]/[0.24] transition-all duration-200 ${
        isActive ? 'outline outline-2 outline-white shadow-[inset_0_0_0_2px_rgba(0,0,0,1)]' : 'group-hover:border-white/20'
      }`}>
        {displayUrl ? (
          <img src={displayUrl} className="w-full h-full object-cover" alt={asset.name} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#DADCE0]/[0.04]">
             <Icon name="image" size={40} className="opacity-[0.16]" />
          </div>
        )}
        {/* Loading Overlay */}
        {(asset.isGenerating || asset.isAutofilling) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2.5">
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
            {asset.isGenerating && onStop && (
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
        {generationFailed && !asset.isGenerating && !asset.isAutofilling && (
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
              onClick={(e) => { e.stopPropagation(); onGenerate(); }}
              className="mt-1 px-3 py-1 rounded-full border border-[#DADCE0]/[0.24] text-[11px] font-bold text-white/80 hover:bg-white/10 transition-all font-sans"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Hover Actions */}
        {!asset.isGenerating && !asset.isAutofilling && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
            {displayUrl && onExpand && (
              <Tooltip text="View full size">
                <button 
                  onClick={(e) => { e.stopPropagation(); onExpand(); }}
                  className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md rounded-[12px] transition-all flex items-center justify-center shadow-lg"
                >
                  <Icon name="open_in_full" size={18} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
                </button>
              </Tooltip>
            )}
            <Tooltip text={!asset.physicalCharacteristics?.trim() ? 'Add a description first' : displayUrl ? 'Regenerate image' : 'Create image'}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (asset.physicalCharacteristics?.trim()) onGenerate();
                }}
                disabled={!asset.physicalCharacteristics?.trim()}
                className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md rounded-[12px] transition-all flex items-center justify-center shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="refresh" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
              </button>
            </Tooltip>
            <Tooltip text="Delete asset">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(); 
                }}
                className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md rounded-[12px] transition-all flex items-center justify-center shadow-lg"
              >
                <Icon name="delete" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      {/* Label Area */}
      <div className="flex items-center gap-2.5 px-1 overflow-hidden w-full">
        <Icon name={typeIcon[asset.type] || 'category'} size={20} className="opacity-[0.48] shrink-0" />
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <h3 className="text-[14px] font-bold text-white/90 truncate font-sans">
            {asset.name}
          </h3>
          <Icon name="edit" size={26} className="opacity-0 group-hover:opacity-[0.48] transition-opacity flex-shrink-0 p-1" />
        </div>
      </div>
    </div>
  );
};