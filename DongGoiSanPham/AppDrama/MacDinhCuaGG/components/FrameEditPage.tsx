import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StoryboardFrame, Asset, VisualStyle, CharacterAsset, LocationAsset, PropAsset } from '../types';
import { Icon } from './Icon';
import { PillButton } from './DesignSystem';
import { Tooltip } from './Tooltip';
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
/** Returns the best available thumbnail URL for an asset */
const getAssetThumbnail = (asset: Asset): string | undefined => {
  const hero = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
  return hero?.dataUrl || asset.imageUrl;
};
/** Icon name for the asset type fallback */
const assetTypeIcon = (type: Asset['type']): string =>
  type === 'location' ? 'map' : type === 'prop' ? 'deployed_code' : 'person';
interface FrameEditPanelProps {
  frame: StoryboardFrame | null;
  frames: StoryboardFrame[];
  assets: Asset[];
  script?: string;
  style: VisualStyle;
  customStyleLibrary: Record<string, string>;
  onStyleChange: (style: VisualStyle) => void;
  aspectRatio: '16:9' | '9:16';
  onUpdate: (id: string, updates: Partial<StoryboardFrame>) => void;
  onDelete: (id: string) => void;
  onGenerate: (id: string, forcedFrame?: StoryboardFrame, forcedStyle?: VisualStyle) => Promise<void>;
  onSelectFrame: (id: string | null) => void;
  isGenerating: boolean;
  onOpenCustomStyleModal?: (editingName?: string) => void;
  onRemoveCustomStyle?: (name: string) => void;
  onExpand?: () => void;
}
export const FrameEditPanel: React.FC<FrameEditPanelProps> = ({
  frame, assets, script = '', style, customStyleLibrary, onStyleChange, aspectRatio, onUpdate, onDelete, onGenerate, onSelectFrame, isGenerating, onOpenCustomStyleModal, onRemoveCustomStyle, onExpand
}) => {
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [assetPickerPosition, setAssetPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [isRefreshingAssets, setIsRefreshingAssets] = useState(false);
  const [imageToDeleteUrl, setImageToDeleteUrl] = useState<string | null>(null);
  const addAssetButtonRef = useRef<HTMLButtonElement>(null);
  const assetPickerRef = useRef<HTMLDivElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  // Close asset picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        showAssetPicker &&
        assetPickerRef.current && !assetPickerRef.current.contains(e.target as Node) &&
        (!portalContentRef.current || !portalContentRef.current.contains(e.target as Node))
      ) {
        setShowAssetPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAssetPicker]);
  // Close on scroll to prevent disconnected positioning (but allow internal scrolling)
  useEffect(() => {
    if (!showAssetPicker) return;
    const handleScroll = (e: Event) => {
      if (portalContentRef.current && portalContentRef.current.contains(e.target as Node)) {
        return;
      }
      setShowAssetPicker(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showAssetPicker]);
  const handleToggleAssetPicker = () => {
    if (!showAssetPicker && addAssetButtonRef.current) {
      const rect = addAssetButtonRef.current.getBoundingClientRect();
      const popupWidth = 300;
      const modalRoot = document.getElementById('story-studio-modal-root');
      const rootRect = modalRoot ? modalRoot.getBoundingClientRect() : { top: 0, left: 0 };
      // Anchor below-right of the button, clamped to viewport
      const left = Math.min(rect.right - popupWidth, window.innerWidth - popupWidth - 12);
      setAssetPickerPosition({ top: rect.bottom + 8 - rootRect.top, left: Math.max(12, left) - rootRect.left });
    }
    setShowAssetPicker(prev => !prev);
  };
  const handleRefreshAssets = async () => {
    if (!frame || !script.trim()) return;
    setIsRefreshingAssets(true);
    try {
      // Analyze the script context for the current frame to detect mentioned assets
      const lowerVisual = (frame.visualDescription || '').toLowerCase();
      const lowerTitle = (frame.title || '').toLowerCase();
      const newlyDetectedIds = assets
        .filter(asset => {
          const name = asset.name.toLowerCase();
          return lowerVisual.includes(name) || lowerTitle.includes(name);
        })
        .map(a => a.id);
      // Add a small delay so the user can see the spin effect (purely for UX feedback)
      await new Promise(resolve => setTimeout(resolve, 800));
      if (newlyDetectedIds.length > 0) {
        const currentIds = frame.linkedAssetIds || [];
        const merged = Array.from(new Set([...currentIds, ...newlyDetectedIds]));
        onUpdate(frame.id, { linkedAssetIds: merged });
      }
    } finally {
      setIsRefreshingAssets(false);
    }
  };
  const handleDeleteImage = (url: string) => {
    if (!frame) return;
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    const newHistory = frame.imageHistory?.filter(u => u !== url) || [];
    onUpdate(frame.id, { imageHistory: newHistory });
    if (frame.imageUrl === url) {
      onUpdate(frame.id, { imageUrl: newHistory[0] || '' });
    }
  };
  const promoteImage = (url: string) => {
    if (!frame) return;
    onUpdate(frame.id, { imageUrl: url });
  };
  const linkedAssets = useMemo(() => {
    if (!frame) return [];
    return assets.filter(a => frame.linkedAssetIds?.includes(a.id));
  }, [assets, frame?.linkedAssetIds]);
  if (!frame) return null;
  return (
    <div className="w-full flex flex-col h-full relative z-50 bg-[#000000]">
      <button
        onClick={() => onSelectFrame(null)}
        className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-all"
        title="Close panel"
      >
        <Icon name="close" size={20} className="opacity-[0.48]" />
      </button>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-10 space-y-6 refined-scrollbar">
        <div className="flex flex-col gap-0.5">
          <label className="text-[11px] font-medium text-[#DADCE0]/[0.48] font-sans px-1">
            Scene {frame.sceneNumber} • Frame {frame.shotNumber}
          </label>
          <input
            value={frame.title}
            onChange={(e) => onUpdate(frame.id, { title: e.target.value })}
            className="w-full bg-transparent border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] py-[0.4rem] px-3 text-[13px] font-flex text-white/90 focus:outline-none transition-all placeholder:text-white/[0.38]"
            placeholder="Frame title"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Frame Description</label>
          <textarea
            value={frame.visualDescription}
            onChange={(e) => onUpdate(frame.id, { visualDescription: e.target.value })}
            className="border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] w-full h-[140px] px-3 py-[0.4rem] resize-none bg-transparent text-[13px] font-flex text-white/90 focus:outline-none transition-colors leading-relaxed placeholder:text-white/[0.38]"
            placeholder="Describe the visual composition..."
          />
        </div>
        <div className="flex flex-col gap-0.5" ref={assetPickerRef}>
          <div className="flex items-center justify-between px-1">
            <label className="text-[12px] font-medium text-[#DADCE0]/[0.48] font-sans">Reference Assets</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshAssets}
                disabled={isRefreshingAssets}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
                title="Auto-detect from script"
              >
                <Icon name="refresh" size={20} className={`opacity-[0.48] ${isRefreshingAssets ? 'animate-spin' : ''}`} />
              </button>
              <button
                ref={addAssetButtonRef}
                onClick={handleToggleAssetPicker}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showAssetPicker ? 'bg-white/10' : 'hover:bg-white/5'}`}
                title="Add Asset"
              >
                <Icon name="add" size={20} className="opacity-[0.48]" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {linkedAssets.length === 0 ? (
              <div className="w-full flex items-center justify-center text-[12px] text-white/[0.38] font-medium italic py-4">
                No assets selected
              </div>
            ) : (
              linkedAssets.map(asset => {
                const thumb = getAssetThumbnail(asset);
                return (
                  <div key={asset.id} className="h-[36px] border border-[#DADCE0]/[0.40] rounded-lg flex items-center gap-2 group hover:border-[#DADCE0]/[0.60] transition-all overflow-hidden">
                    <div className="h-full aspect-video bg-white/10 flex items-center justify-center overflow-hidden border-r border-[#DADCE0]/[0.16]">
                      {thumb ? (
                        <img src={thumb} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name={assetTypeIcon(asset.type)} size={20} className="opacity-[0.48]" />
                      )}
                    </div>
                    <span className="text-[13px] font-medium text-white/90 px-1">{asset.name}</span>
                    <button
                      onClick={() => onUpdate(frame.id, { linkedAssetIds: (frame.linkedAssetIds || []).filter(id => id !== asset.id) })}
                      className="opacity-40 hover:opacity-100 transition-opacity mr-2"
                    >
                      <Icon name="close" size={20} className="opacity-[0.48]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Style + Image Generation + Thumbnails — combined section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-3">
            <PillButton
              variant="outline"
              onClick={() => onGenerate(frame.id, undefined, style)}
              disabled={isGenerating}
              className="border-[#DADCE0]/[0.40] text-white/90 font-bold px-3 py-[0.4rem] text-[13px]"
            >
              Create image
            </PillButton>
          </div>
          {/* Hero Image Preview */}
          <div className={`bg-[#DADCE0]/[0.04] border border-[#DADCE0]/[0.24] rounded-[12px] overflow-hidden flex items-center justify-center relative group shadow-inner ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
            {frame.imageUrl ? (
              <>
                <img src={frame.imageUrl} className="w-full h-full object-cover" />
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
                      onClick={(e) => { e.stopPropagation(); setImageToDeleteUrl(frame.imageUrl!); }}
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
            {isGenerating && (
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
          {frame.imageHistory && frame.imageHistory.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {frame.imageHistory.map((url, idx) => {
                const isActive = frame.imageUrl === url;
                return (
                  <div
                    key={idx}
                    className={`relative h-[60px] aspect-video rounded-[12px] overflow-hidden transition-all group cursor-pointer ${isActive ? 'border-2 border-white opacity-100' : 'opacity-60 hover:opacity-100 border border-[#DADCE0]/[0.24]'}`}
                  >
                    <button onClick={() => promoteImage(url)} className="w-full h-full">
                      <img src={url} className="w-full h-full object-contain bg-zinc-900 rounded-[6px]" />
                    </button>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setImageToDeleteUrl(url); }}
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
      {/* Asset Picker Popup (portal-based, matching StyleSelector pattern) */}
      {showAssetPicker && assetPickerPosition && createPortal(
        <div className="absolute inset-0 z-[200] pointer-events-auto" onClick={() => setShowAssetPicker(false)}>
        <div
          ref={portalContentRef}
          style={{ top: assetPickerPosition.top, left: assetPickerPosition.left }}
          className="absolute w-[300px] bg-[#000000] border border-[#DADCE0]/[0.24] rounded-[12px] shadow-2xl z-[200] animate-dropdown origin-top-right py-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 pt-2 pb-1">
            <span className="text-[12px] font-bold text-white/50 font-sans tracking-wider">Select Assets</span>
          </div>
          <div className="max-h-[320px] overflow-y-auto refined-scrollbar">
            {assets.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-white/[0.38] font-sans italic">
                No assets available
              </div>
            ) : (
              (['character', 'location', 'prop'] as const).map(type => {
                const filteredAssets = assets.filter(a => a.type === type);
                if (filteredAssets.length === 0) return null;
                
                const typeLabels: Record<string, string> = {
                  character: 'Characters',
                  location: 'Locations',
                  prop: 'Props'
                };
                
                return (
                  <div key={type} className="space-y-1 mb-3 last:mb-1">
                    <div className="px-4 py-1 bg-white/[0.02]">
                      <span className="text-[11px] font-bold text-white/30 font-sans tracking-wider">{typeLabels[type]}</span>
                    </div>
                    {filteredAssets.map(asset => {
                      const isChecked = frame.linkedAssetIds?.includes(asset.id) ?? false;
                      const thumb = getAssetThumbnail(asset);
                      return (
                        <label
                          key={asset.id}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all hover:bg-white/5 ${isChecked ? 'bg-white/[0.03]' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const current = frame.linkedAssetIds || [];
                              const next = e.target.checked ? [...current, asset.id] : current.filter(id => id !== asset.id);
                              onUpdate(frame.id, { linkedAssetIds: next });
                            }}
                            className="w-[18px] h-[18px] accent-white rounded border-white/10 bg-transparent flex-shrink-0"
                          />
                          <div className="w-[64px] h-[36px] rounded-[4px] bg-white/5 border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {thumb ? (
                              <img src={thumb} className="w-full h-full object-cover" />
                            ) : (
                              <Icon name={assetTypeIcon(asset.type)} size={20} className="opacity-[0.38]" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-medium text-white/90 font-sans truncate">{asset.name}</span>
                            <span className="text-[11px] text-white/[0.38] font-sans capitalize">{asset.type}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>,
        document.getElementById('story-studio-modal-root') || document.body
      )}
      {imageToDeleteUrl && createPortal(
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto" onClick={() => setImageToDeleteUrl(null)}>
          <div className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-[380px] rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
            <div>
              <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Delete image</h3>
              <p className="text-[14px] text-zinc-500 font-sans">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setImageToDeleteUrl(null)} className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]">Cancel</button>
              <button 
                onClick={() => { handleDeleteImage(imageToDeleteUrl); setImageToDeleteUrl(null); }} 
                className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('story-studio-modal-root') || document.body
      )}
    </div>
  );
};