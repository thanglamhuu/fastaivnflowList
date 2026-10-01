import React, { useEffect, useState } from 'react';
interface GenerationQueueToastProps {
  completed: number;
  total: number;
  failed: number;
  onStop: () => void;
  onDismiss: () => void;
}
export const GenerationQueueToast: React.FC<GenerationQueueToastProps> = ({
  completed,
  total,
  failed,
  onStop,
  onDismiss
}) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isFinished = completed + failed >= total;
  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  // Auto-dismiss 2s after everything finishes
  useEffect(() => {
    if (!isFinished) return;
    const timer = setTimeout(() => {
      setIsDismissing(true);
      // Wait for fade-out animation before unmounting
      setTimeout(() => onDismiss(), 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isFinished, onDismiss]);
  const progress = total > 0 ? ((completed + failed) / total) * 100 : 0;
  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] transition-all duration-300 ${
        isVisible && !isDismissing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-4 bg-black border border-[#DADCE0]/[0.24] rounded-2xl px-5 py-3 shadow-2xl min-w-[280px]">
        {/* Progress indicator */}
        {!isFinished ? (
          <div className="flex gap-1 items-center shrink-0">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
          </div>
        ) : (
          <svg width={16} height={16} viewBox="0 0 16 16" className="shrink-0 text-white">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1z" fill="currentColor" />
          </svg>
        )}
        {/* Status text */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[13px] font-bold text-white font-sans whitespace-nowrap">
            {isFinished ? 'Complete' : 'Generating images'}
          </span>
          <span className="text-[13px] text-zinc-500 font-sans whitespace-nowrap">
            {completed}{failed > 0 ? ` · ${failed} failed` : ''} / {total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden shrink-0">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Stop / Done button */}
        {!isFinished && (
          <button
            onClick={(e) => { e.stopPropagation(); onStop(); }}
            className="text-[13px] font-bold text-zinc-400 hover:text-white transition-colors font-sans shrink-0 px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};