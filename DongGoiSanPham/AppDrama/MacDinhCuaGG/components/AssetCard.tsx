import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Asset } from '../types';
import { Flow } from 'flow-sdk';
import { Icon } from './Icon';
import { PillButton } from './DesignSystem';
interface AssetCardProps {
  asset: Asset;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
}
export const AssetCard: React.FC<AssetCardProps> = ({ asset, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelectFromGrid = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const media = await Flow.media.select({ filter: 'image' });
      onUpdate(asset.id, { imageUrl: media.dataUrl });
    } catch (err) {
      console.error("Selection cancelled", err);
    }
  };
  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(asset.id, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div 
        onClick={() => setIsEditing(true)}
        className="group relative bg-transparent border border-[#595959] rounded-lg overflow-hidden hover:border-zinc-400 transition-all cursor-pointer flex items-center p-2 gap-3"
      >
        <div className={`h-12 -my-2 -ml-2 bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${asset.imageUrl ? 'w-auto' : 'aspect-video'}`}>
          {asset.imageUrl ? (
            <img src={asset.imageUrl} alt={asset.name} className="h-full w-auto" />
          ) : (
            <Icon name="image" size={18} className="text-zinc-700" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col pr-8">
          <p className="text-[13px] font-medium text-white truncate">{asset.name || 'Untitled'}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset.id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-[12px] flex items-center justify-center bg-transparent hover:bg-red-500 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      {isEditing && createPortal(
        <div 
          className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 pointer-events-auto"
          onClick={() => setIsEditing(false)}
        >
          <div 
            className="w-full max-w-sm bg-black border border-[rgba(218,220,224,0.15)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[rgba(218,220,224,0.15)] flex items-center justify-between">
              <h2 className="text-[17px] font-bold flex items-center gap-2 font-sans text-white">
                Edit Asset
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-zinc-500 hover:text-white transition-all flex items-center">
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                <div className={`h-20 bg-zinc-900 rounded-lg border border-[rgba(218,220,224,0.15)] flex-shrink-0 overflow-hidden flex items-center justify-center ${asset.imageUrl ? 'w-auto' : 'aspect-video'}`}>
                   {asset.imageUrl ? <img src={asset.imageUrl} alt={asset.name} className="h-full w-auto" /> : <Icon name="image" size={24} className="text-zinc-800" />}
                </div>
                <div className="flex-1 space-y-2">
                   <PillButton 
                     variant="outline" 
                     icon={<Icon name="grid_view" size={16} />} 
                     onClick={handleSelectFromGrid} 
                     className="w-full h-[34px] border-[#595959] text-[rgba(218,220,224,0.9)] hover:border-zinc-400 font-bold"
                   >
                     Grid
                   </PillButton>
                   <PillButton 
                     variant="outline" 
                     icon={<Icon name="upload" size={16} />} 
                     onClick={() => fileInputRef.current?.click()} 
                     className="w-full h-[34px] border-[#595959] text-[rgba(218,220,224,0.9)] hover:border-zinc-400 font-bold"
                   >
                     Upload
                   </PillButton>
                   <input type="file" ref={fileInputRef} onChange={handleLocalUpload} className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-[rgba(255,255,255,0.35)]">Asset Name</p>
                <input 
                  value={asset.name}
                  onChange={(e) => onUpdate(asset.id, { name: e.target.value })}
                  className="w-full bg-transparent border border-[#595959] rounded-lg py-[10px] px-[12px] text-[13px] text-white focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-[rgba(255,255,255,0.35)]">Description</p>
                <textarea 
                  value={asset.description}
                  onChange={(e) => onUpdate(asset.id, { description: e.target.value })}
                  className="w-full h-24 bg-transparent border border-[#595959] rounded-lg py-[10px] px-[12px] text-[13px] text-white focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => { onDelete(asset.id); setIsEditing(false); }}
                  className="px-4 h-[34px] border border-red-900/50 text-red-400 rounded-lg text-[13px] hover:bg-red-950/20 flex items-center justify-center"
                >
                  <Icon name="delete" size={18} />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-[34px] bg-white text-black font-medium rounded-lg text-[13px] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="check" size={16} /> Done
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.getElementById('story-studio-modal-root') || document.body
      )}
    </>
  );
};