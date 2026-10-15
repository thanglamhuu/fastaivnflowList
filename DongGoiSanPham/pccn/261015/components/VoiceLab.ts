import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MATRIX_12_VOICES, VoiceOption } from '../constants/voicePresets';
interface Props {
  onConfirm: (voice: VoiceOption) => void;
  onBack: () => void;
}
export const VoiceLab: React.FC<Props> = ({ onConfirm, onBack }) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(MATRIX_12_VOICES[0]);
  const [filter, setFilter] = useState<'all' | 'podcast' | 'tiktok' | 'narrative'>('all');
  const filteredVoices = MATRIX_12_VOICES.filter(v => filter === 'all' || v.category === filter);
  return (
    <div className="flex flex-col h-full bg-[#08080a] text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-16">
        <div className="max-w-6xl mx-auto space-y-10 pb-48">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-2">
               <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none flex items-center gap-3">
                 <span className="material-symbols-outlined text-4xl text-orange-500">record_voice_over</span>
                 MA TRẬN 12 GIỌNG GỐC
               </h2>
               <div className="flex items-center gap-4">
                 <p className="text-[10px] text-orange-500 font-mono tracking-[0.4em] uppercase flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">graphic_eq</span>
                   TÁCH BIỆT ÂM HỌC VÀ CẢM XÚC
                 </p>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                 <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">fingerprint</span>
                   KHÓA VÂN GIỌNG BẤT BIẾN
                 </p>
               </div>
            </div>
            <button onClick={onBack} className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-[#14151b] hover:bg-white/10 transition-all self-start md:self-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Quay Lại</span>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500 text-xl transition-colors">close</span>
            </button>
          </header>
          <div className="space-y-8">
            {/* Bộ lọc thẻ */}
            <div className="flex items-center gap-3 bg-[#111217] p-2 rounded-2xl border border-white/5 w-fit">
              {(['all', 'podcast', 'tiktok', 'narrative'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${
                    filter === f ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'all' && <span className="material-symbols-outlined text-xs">apps</span>}
                  {f === 'podcast' && <span className="material-symbols-outlined text-xs">podcasts</span>}
                  {f === 'tiktok' && <span className="material-symbols-outlined text-xs">bolt</span>}
                  {f === 'narrative' && <span className="material-symbols-outlined text-xs">menu_book</span>}
                  {f === 'all' ? 'Tất Cả (12 Giọng)' : f === 'podcast' ? 'Podcast Trầm Ấm' : f === 'tiktok' ? 'TikTok Nhịp Nhanh' : 'Tản Văn & Kể Chuyện'}
                </button>
              ))}
            </div>
            {/* Lưới 12 Giọng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredVoices.map((voice) => {
                  const isSelected = voice.id === selectedVoice.id;
                  return (
                    <motion.div
                      key={voice.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedVoice(voice)}
                      className={`cursor-pointer rounded-[2rem] p-6 border-2 transition-all relative flex flex-col justify-between gap-6 group ${
                        isSelected
                          ? 'bg-orange-500/10 border-orange-500 shadow-[0_20px_50px_rgba(245,158,11,0.15)] scale-[1.02] z-10'
                          : 'bg-[#101117] border-white/5 hover:border-white/10 hover:bg-[#14151e]'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-black uppercase border ${voice.badgeColor}`}>
                            {voice.subLabel}
                          </span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-xl font-black uppercase italic transition-colors ${isSelected ? 'text-orange-400' : 'text-white group-hover:text-orange-200'}`}>
                            {voice.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">
                            {voice.acousticProfile}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">speed</span>
                            Tốc độ: <strong className="text-orange-400">{voice.speed}x</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">height</span>
                            Cao độ: <strong className="text-orange-400">{voice.pitch}</strong>
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 italic bg-black/40 p-2.5 rounded-xl border border-white/5">
                          "{voice.sampleSentence}"
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Thanh chân trang xác nhận */}
      <div className="p-8 bg-[#0a0a0f]/95 backdrop-blur-3xl border-t border-white/5 sticky bottom-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl text-orange-500">record_voice_over</span>
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">lock</span>
                Đang khóa vân giọng:
              </p>
              <h4 className="text-2xl font-black text-white italic uppercase">{selectedVoice.label}</h4>
            </div>
          </div>
          <button
            onClick={() => onConfirm(selectedVoice)}
            className="w-full sm:w-auto px-12 py-4.5 bg-orange-500 text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-orange-400 transition-all active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            KHÓA VÂN GIỌNG NÀY CHO DỰ ÁN
          </button>
        </div>
      </div>
    </div>
  );
};