import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Asset, AssetType, ImageHistoryItem } from '../types';
import { PillButton } from './DesignSystem';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
const assetTypeLabels: Record<AssetType, string> = {
  character: 'Character',
  location: 'Location',
  prop: 'Prop',
};
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
interface Props {
  asset: Asset | null;
  globalStyle: string;
  customStyleLibrary: Record<string, string>;
  onGlobalStyleChange?: (style: string) => void;
  onUpdate: (updates: Partial<Asset>) => void;
  onAutofill: () => void;
  onCreateImage: (style: string) => void;
  onClose?: () => void;
  onExpand?: () => void;
}
export const AssetEditPanel: React.FC<Props> = ({ asset, globalStyle, customStyleLibrary, onGlobalStyleChange, onUpdate, onAutofill, onCreateImage, onClose, onExpand }) => {
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const handlePromoteImage = (id: string) => onUpdate({ referenceImageId: id });
  const handleDeleteImage = (id: string) => {
    if (!asset) return;
    // Revoke the blob URL to free native memory immediately
    const toDelete = asset.supportingImages.find(img => img.id === id);
    if (toDelete?.dataUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(toDelete.dataUrl);
    }
    const newHistory = asset.supportingImages.filter(img => img.id !== id);
    const updates: Partial<Asset> = { supportingImages: newHistory };
    if (asset.referenceImageId === id) updates.referenceImageId = newHistory[0]?.id;
    onUpdate(updates);
  };
  if (!asset) return null;
  const heroImage = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
  return (
    <div className="w-full flex flex-col h-full relative z-50 bg-[#000000]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-all"
        title="Close panel"
      >
        <Icon name="close" size={20} className="opacity-[0.48]" />
      </button>
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-10 space-y-6 refined-scrollbar">
        <div className="flex justify-center pt-2">
          <button
            onClick={onAutofill}
            disabled={asset.isAutofilling}
            className="px-3 py-[0.4rem] rounded-[40px] bg-[#DADCE0]/[0.72] text-black/90 text-[13px] font-flex font-bold flex items-center gap-2 hover:bg-white transition-all disabled:opacity-50"
          >
            {asset.isAutofilling ? <Loader2 size={20} className="animate-spin" /> : <Icon name="astrophotography_mode" size={20} invert={false} className="opacity-90" />}
            Autofill {asset.type}
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">{assetTypeLabels[asset.type]} Name</label>
          <input
            value={asset.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-transparent border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] py-[0.4rem] px-3 text-[13px] font-flex text-white/90 focus:outline-none transition-all placeholder:text-white/[0.38]"
            placeholder="Asset name"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Visual Description</label>
          <textarea
            value={(asset as any).physicalCharacteristics || ''}
            onChange={(e) => onUpdate({ physicalCharacteristics: e.target.value } as any)}
            className="border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] w-full h-[200px] px-3 py-[0.4rem] resize-none bg-transparent text-[13px] font-flex text-white/90 focus:outline-none transition-colors leading-relaxed placeholder:text-white/[0.38]"
            placeholder="Add a visual description or use Autofill"
          />
        </div>
        {asset.type === 'character' && asset.clothingAccessories !== undefined && (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Clothing & Accessories</label>
              <textarea
                value={asset.clothingAccessories || ''}
                onChange={(e) => onUpdate({ clothingAccessories: e.target.value })}
                className="border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] w-full h-[80px] px-3 py-[0.4rem] resize-none bg-transparent text-[13px] font-flex text-white/90 focus:outline-none transition-colors leading-relaxed placeholder:text-white/[0.38]"
                placeholder="What are they wearing?"
              />
            </div>
          </>
        )}
        {asset.type === 'location' && asset.timeOfDay !== undefined && (
          <div className="flex flex-col gap-0.5">
            <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Time of Day</label>
            <input
              value={asset.timeOfDay || ''}
              onChange={(e) => onUpdate({ timeOfDay: e.target.value })}
              className="w-full bg-transparent border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] py-[0.4rem] px-3 text-[13px] font-flex text-white/90 focus:outline-none transition-all placeholder:text-white/[0.38]"
              placeholder="e.g. Golden Hour, Harsh Noon, Rainy Night"
            />
          </div>
        )}
        {/* Style + Image Generation + Thumbnails — combined section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onCreateImage(globalStyle)}
              disabled={asset.isGenerating}
              className="px-3 py-[0.4rem] rounded-[40px] border border-[#DADCE0]/[0.40] text-white/90 text-[13px] font-bold hover:bg-white/5 transition-all disabled:opacity-30 whitespace-nowrap font-sans active:scale-95"
            >
              {asset.isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Create image'}
            </button>
          </div>
          {/* Hero Image Preview */}
          <div className={`bg-[#DADCE0]/[0.04] border border-[#DADCE0]/[0.24] rounded-[12px] overflow-hidden flex items-center justify-center relative group aspect-video`}>
            {heroImage ? (
              <>
                <img src={heroImage.dataUrl} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 z-30">
                  {onExpand && (
                    <Tooltip text="View full size">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onExpand(); }}
                        className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md rounded-[12px] transition-all flex items-center justify-center shadow-lg"
                      >
                        <Icon name="open_in_full" size={18} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip text="Delete image">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setImageToDeleteId(heroImage.id); }}
                      className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-[12px] transition-all flex items-center justify-center shadow-lg"
                    >
                      <Icon name="delete" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <Icon name="image" size={40} className="opacity-[0.16]" />
            )}
            {(asset.isGenerating || asset.isAutofilling) && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[12px] z-20 flex items-center justify-center">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>
          {/* Image History Thumbnails */}
          {asset.supportingImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {asset.supportingImages.map(img => {
                const isActive = asset.referenceImageId === img.id;
                return (
                  <div
                    key={img.id}
                    className={`relative h-[60px] aspect-video rounded-[12px] overflow-hidden transition-all group cursor-pointer ${isActive ? 'border-2 border-white opacity-100' : 'opacity-60 hover:opacity-100 border border-[#DADCE0]/[0.24]'}`}
                  >
                    <button onClick={() => handlePromoteImage(img.id)} className="w-full h-full">
                      <img src={img.dataUrl} className="w-full h-full object-contain bg-zinc-900 rounded-[6px]" />
                    </button>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setImageToDeleteId(img.id); }}
                        className="group/btn w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-[12px] flex items-center justify-center transition-all shadow-lg"
                      >
                        <Icon name="delete" size={20} className="opacity-[0.48] group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {imageToDeleteId && createPortal(
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto" onClick={() => setImageToDeleteId(null)}>
          <div className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-[380px] rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
            <div>
              <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Delete image</h3>
              <p className="text-[14px] text-zinc-500 font-sans">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setImageToDeleteId(null)} className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]">Cancel</button>
              <button onClick={() => { handleDeleteImage(imageToDeleteId); setImageToDeleteId(null); }} className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]">Delete</button>
            </div>
          </div>
        </div>,
        document.getElementById('story-studio-modal-root') || document.body
      )}
    </div>
  );
};