import React, { useState, useEffect } from 'react';
import { AssetType } from '../types';
import { PillButton } from './DesignSystem';
import { Icon } from './Icon';
interface Props {
  isOpen: boolean;
  assistType: AssetType | null;
  onClose: () => void;
  onGenerate: (config: {
    types: AssetType[];
    autoFill: boolean;
    autoGenerate: boolean;
  }) => void;
  isProcessing: boolean;
}
const assetTypeLabels: Record<string, string> = {
  character: 'Character',
  location: 'Location',
  prop: 'Prop',
};
const LoadingDots = () => (
  <div className="flex gap-1 items-center justify-center">
    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
    <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
  </div>
);
export const AssetAssistModal: React.FC<Props> = ({ isOpen, assistType, onClose, onGenerate, isProcessing }) => {
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([]);
  const [autoGenerate, setAutoGenerate] = useState(true);
  useEffect(() => {
    if (isOpen && assistType) {
      setSelectedTypes([assistType]);
    }
  }, [isOpen, assistType]);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-black border border-[rgba(218,220,224,0.15)] w-[360px] rounded-[24px] p-[12px] shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold flex items-center gap-2 font-sans text-white">
              <Icon name="auto_awesome" size={18} className="text-white" />
              {assistType ? `${assetTypeLabels[assistType]} Assist` : 'Asset Assist'}
            </h2>
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-all flex items-center">
              <Icon name="close" size={18} />
            </button>
          </div>
          <p className="text-[12px] text-zinc-500 font-sans px-1">
            Autofills descriptions and generates images for your assets.
          </p>
        </div>
        <div className="border-b border-[rgba(218,220,224,0.15)] -mx-[12px]"></div>
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'character' as AssetType, icon: 'person', label: 'Characters' },
              { type: 'location' as AssetType, icon: 'location_on', label: 'Locations' },
              { type: 'prop' as AssetType, icon: 'category', label: 'Props' },
            ].map(({ type, icon, label }) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => setSelectedTypes(prev => active ? prev.filter(t => t !== type) : [...prev, type])}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${active ? 'bg-[#969696] border-[#969696] text-black' : 'border-[#595959] text-[rgba(218,220,224,0.75)] hover:bg-white/5'}`}
                >
                  <Icon name={icon} size={24} />
                  <span className="text-[10px] font-bold">{label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-medium text-white font-sans">Automatically generate images</span>
            <label className="flex items-center cursor-pointer group">
              <div 
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`w-8 h-5 rounded-full relative transition-all flex-shrink-0 ${autoGenerate ? 'bg-white/40' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all ${autoGenerate ? 'translate-x-3 bg-white' : 'bg-white/50'}`} />
              </div>
            </label>
          </div>
        </div>
        <div className="pt-2 flex gap-3">
          <PillButton
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#595959] text-[rgba(218,220,224,0.9)] hover:border-zinc-400 h-11 font-bold"
          >
            Cancel
          </PillButton>
          <PillButton
            variant="solid"
            onClick={() => onGenerate({ types: selectedTypes, autoFill: true, autoGenerate })}
            disabled={isProcessing || selectedTypes.length === 0}
            className="flex-1 h-11 font-bold"
          >
            {isProcessing ? <LoadingDots /> : 'Process'}
          </PillButton>
        </div>
      </div>
    </div>
  );
};