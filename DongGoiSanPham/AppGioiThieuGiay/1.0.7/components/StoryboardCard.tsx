import React from 'react';
import { StoryboardCardData } from '../types';
import { SectionLabel, ActionButton, IconButton } from './Primitives';
interface Props {
  data: StoryboardCardData;
  onDraw: () => void;
  onAnimate: () => void;
  onDownload: () => void;
  onSave: () => void;
  onPromptChange: (val: string) => void;
  onRestorePrompt: () => void;
  onClearError: () => void;
  onOpenLightbox: () => void;
  isProcessing: boolean;
}
export const StoryboardCard: React.FC<Props> = ({ 
  data, onDraw, onAnimate, onDownload, onSave, onPromptChange, onRestorePrompt, onClearError, onOpenLightbox, isProcessing 
}) => {
  const imageSrc = data.image ? `data:${data.image.mimeType};base64,${data.image.base64}` : null;
  const videoSrc = data.video ? `data:${data.video.mimeType};base64,${data.video.base64}` : null;
  const hasPrompt = !!data.videoPrompt;
  const handleCopyPrompt = () => {
    if (data.videoPrompt) {
      navigator.clipboard.writeText(data.videoPrompt);
    }
  };
  return (
    <div className="w-full bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 h-full relative group/card">
      {/* Media Preview Area */}
      <div 
        className="relative w-full aspect-[4/5] bg-[#F2F2F7] overflow-hidden video-preview-container cursor-pointer group"
        onClick={(e) => {
          if (!data.isGeneratingImage && !data.isGeneratingVideo && !data.isAnalyzing && (imageSrc || videoSrc)) {
            onOpenLightbox();
          }
        }}
      >
        {data.isAnalyzing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm z-20">
            <span className="material-symbols-outlined text-[32px] text-white animate-spin">cyclone</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Đang phân tích...</span>
          </div>
        ) : null}
        {data.isGeneratingVideo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5 animate-pulse">
            <span className="material-symbols-outlined text-[32px] text-[#F31B17] animate-spin">history</span>
            <span className="text-[10px] font-bold text-[#F31B17]">ĐANG DỰNG PHIM...</span>
          </div>
        ) : videoSrc ? (
          <>
            <video src={videoSrc} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center hover-video-overlay">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[32px] translate-x-0.5">play_arrow</span>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-black text-white tracking-widest">
                08s
              </div>
            </div>
          </>
        ) : data.isGeneratingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5 animate-pulse">
            <span className="material-symbols-outlined text-[32px] text-[#22C55E] animate-spin">palette</span>
            <span className="text-[10px] font-bold text-[#22C55E]">ĐANG VẼ...</span>
          </div>
        ) : imageSrc ? (
          <img src={imageSrc} className="w-full h-full object-cover" alt={`Frame ${data.order}`} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-[#D1D1D6]">image</span>
          </div>
        )}
        {/* Hover Fullscreen Icon */}
        {(imageSrc || videoSrc) && !data.isGeneratingImage && !data.isGeneratingVideo && !data.isAnalyzing && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <span className="material-symbols-outlined text-[20px]">open_in_full</span>
          </div>
        )}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#D1D1D6]/30 flex items-center justify-center text-[14px] font-black text-[#1A1A1A] shadow-sm z-10">
          {data.order}
        </div>
      </div>
      {/* Prompt Area */}
      <div className="p-3 bg-[#F9F9FB] border-b border-[#E5E5EA]">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#8E8E93]">auto_awesome</span>
            <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-tighter">Video Prompt</span>
          </div>
          <div className="flex items-center gap-2">
            <IconButton 
              icon="content_copy" 
              onClick={handleCopyPrompt} 
              disabled={!hasPrompt} 
              title="Copy prompt"
              className="!w-5 !h-5"
            />
            {data.videoPrompt !== data.originalVideoPrompt && (
              <button 
                onClick={onRestorePrompt}
                className="text-[9px] font-bold text-[#F31B17] hover:underline"
              >
                Gốc
              </button>
            )}
          </div>
        </div>
        <div className="relative group">
          <textarea 
            value={data.videoPrompt || ''}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={!imageSrc || isProcessing}
            placeholder={imageSrc ? "Vui lòng bấm Phân tích ảnh..." : "Chưa có ảnh để phân tích"}
            className="w-full h-[80px] bg-white border border-[#D1D1D6] rounded-lg p-2 text-[11px] leading-relaxed text-[#1A1A1A] resize-none focus:border-[#F31B17] focus:ring-1 focus:ring-[#F31B17]/20 transition-all outline-none placeholder:text-[#D1D1D6] disabled:bg-gray-50/50"
          />
        </div>
      </div>
      {/* Controls Area */}
      <div className="p-3 flex flex-col gap-3 flex-1 bg-white">
        <div className="flex flex-col gap-1.5">
          <SectionLabel dotColor="bg-[#22C55E]">Sáng tạo hình ảnh</SectionLabel>
          <div className="flex gap-1">
            <ActionButton 
              variant="success" 
              icon="palette" 
              className="flex-1" 
              onClick={onDraw}
              disabled={isProcessing}
            >
              Vẽ lại
            </ActionButton>
            <ActionButton 
              icon="download" 
              onClick={onDownload} 
              disabled={!imageSrc || isProcessing} 
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <SectionLabel dotColor="bg-[#F31B17]">Dựng phim AI</SectionLabel>
          <div className="flex gap-1 group/btn">
            <ActionButton 
              variant="primary" 
              icon={videoSrc ? "history" : "movie"} 
              className="flex-1" 
              onClick={onAnimate}
              disabled={!hasPrompt || isProcessing}
              title={!hasPrompt ? "Vui lòng bấm Phân tích ảnh trước khi tạo video" : ""}
            >
              {videoSrc ? "Dựng lại" : "Dựng clip"}
            </ActionButton>
            <ActionButton 
              icon="save" 
              onClick={onSave} 
              disabled={!videoSrc || isProcessing} 
            />
          </div>
        </div>
      </div>
      
      {data.error && (
        <div className="absolute inset-x-0 bottom-0 bg-red-500 text-white text-[9px] px-2 py-1.5 flex items-center justify-between font-bold z-30">
          <span className="truncate pr-4">{data.error}</span>
          <button onClick={onClearError} className="hover:bg-white/20 rounded p-0.5">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};