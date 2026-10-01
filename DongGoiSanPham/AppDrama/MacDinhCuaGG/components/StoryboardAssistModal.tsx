import React, { useState } from 'react';
import { ParsedScene } from '../types';
import { PillButton } from './DesignSystem';
import { Icon } from './Icon';
interface StoryboardAssistModalProps {
  scene: ParsedScene | null;
  sceneNumber?: string;
  onClose: () => void;
  onGenerate: (selections: { sceneId: string, frameCount: number }[], autoGenerateImages: boolean, overwrite: boolean) => void;
  isProcessing: boolean;
}
const LoadingDots = () => (
  <div className="flex gap-1 items-center justify-center">
    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
    <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
  </div>
);
export const StoryboardAssistModal: React.FC<StoryboardAssistModalProps> = ({ 
  scene, 
  sceneNumber,
  onClose, 
  onGenerate,
  isProcessing 
}) => {
  const [frameCount, setFrameCount] = useState<number>(scene?.suggestedFrameCount || 3);
  const [autoGenerateImages, setAutoGenerateImages] = useState(true);
  if (!scene) return null;
  const handleGenerate = () => {
    onGenerate([{ sceneId: scene.id, frameCount }], autoGenerateImages, false);
  };
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
              Scene Assist
            </h2>
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-all flex items-center">
              <Icon name="close" size={18} />
            </button>
          </div>
          <p className="text-[12px] text-zinc-500 font-sans px-1">
            Drafts frame and visual descriptions from your script.
          </p>
        </div>
        <div className="border-b border-[rgba(218,220,224,0.15)] -mx-[12px]"></div>
        <div className="space-y-4 px-1">
          <div className="space-y-1">
            <span className="text-[12px] font-medium text-[rgba(255,255,255,0.35)] font-sans block">Scene {sceneNumber}</span>
            <h4 className="font-bold text-[15px] text-white font-sans truncate">{scene.title}</h4>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col space-y-1">
              <span className="text-[13px] font-medium text-white font-sans">Number of Frames</span>
              <span className="text-[12px] text-zinc-500 font-sans">Suggested: {scene.suggestedFrameCount}</span>
            </div>
            <input 
              type="number"
              value={frameCount}
              onChange={(e) => setFrameCount(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 20))}
              className="w-16 h-9 bg-transparent border border-[#595959] rounded-lg text-center text-[13px] font-bold focus:outline-none focus:border-white/20 transition-all text-white font-sans"
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-medium text-white font-sans">Automatically generate images</span>
            <label className="flex items-center cursor-pointer group">
              <div 
                onClick={() => setAutoGenerateImages(!autoGenerateImages)}
                className={`w-8 h-5 rounded-full relative transition-all flex-shrink-0 ${autoGenerateImages ? 'bg-white/40' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all ${autoGenerateImages ? 'translate-x-3 bg-white' : 'bg-white/50'}`} />
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
            onClick={handleGenerate}
            disabled={isProcessing}
            className="flex-1 h-11 font-bold"
          >
            {isProcessing ? <LoadingDots /> : 'Generate Scene'}
          </PillButton>
        </div>
      </div>
    </div>
  );
};