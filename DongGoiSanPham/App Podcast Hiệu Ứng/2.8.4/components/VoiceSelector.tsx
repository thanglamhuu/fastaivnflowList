import React, { useState, useMemo } from 'react';
import { VoiceOption } from '../types/voice';
import { VOICE_PRESETS } from '../constants/voicePresets';
interface VoiceSelectorProps {
  selectedVoice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
}
export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Sắp xếp danh sách: Nữ/Nam -> Bắc/Bắc nhẹ/Trung/Nam/Toàn quốc/Gemini Default
  const sortedVoices = useMemo(() => {
    const regionOrder = ['Bắc', 'Bắc nhẹ', 'Trung', 'Nam', 'Toàn quốc', 'Gemini Default'];
    
    return [...VOICE_PRESETS].sort((a, b) => {
      // 1. Giới tính (Nữ trước, Nam sau)
      if (a.gender !== b.gender) {
        return a.gender === 'female' ? -1 : 1;
      }
      // 2. Vùng miền theo thứ tự định nghĩa
      const indexA = regionOrder.indexOf(a.region);
      const indexB = regionOrder.indexOf(b.region);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  }, []);
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-[#1c192b]/50 border border-white/5 rounded-xl px-2 py-1.5 shadow-inner">
        {/* Micro Icon */}
        <div className="flex items-center justify-center shrink-0 w-8">
          <span className="material-symbols-outlined text-[#F31B17] text-xl">mic</span>
        </div>
        {/* Compact Combobox */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-left hover:border-[#F31B17]/40 transition-all"
          >
            <div className="flex-1 overflow-hidden">
              <div className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                {selectedVoice.label}
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-500 text-[16px] ml-1">expand_more</span>
          </button>
          {isOpen && (
            <>
              {/* Portal-like Overlay */}
              <div 
                className="fixed inset-0 z-[100]" 
                onClick={() => setIsOpen(false)} 
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#12101a] border border-white/10 rounded-xl shadow-2xl z-[101] max-h-64 overflow-y-auto divide-y divide-white/5 backdrop-blur-2xl">
                {sortedVoices.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onVoiceChange(v);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between group ${
                      v.id === selectedVoice.id ? 'bg-[#F31B17]/10' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-tight ${v.id === selectedVoice.id ? 'text-[#F31B17]' : 'text-slate-200'}`}>
                          {v.label}
                        </span>
                        <span className="text-[8px] px-1 bg-white/5 text-slate-500 rounded font-bold uppercase">
                          {v.region}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 line-clamp-1 italic">{v.subLabel}</div>
                    </div>
                    <div className="text-[8px] font-black text-[#F31B17]/60 shrink-0">
                      {v.speed}x | {v.pitch}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};