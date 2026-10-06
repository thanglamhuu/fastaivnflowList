import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURATED_VOICE_PRESETS, RAW_GEMINI_BASE_VOICES, VoiceOption } from '../constants/voicePresets';
import { RawVoiceCustomizer } from './RawVoiceCustomizer';
interface Props {
  onConfirm: (voice: VoiceOption) => void;
  onBack: () => void;
}
export const VoiceLab: React.FC<Props> = ({ onConfirm, onBack }) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(CURATED_VOICE_PRESETS[0]);
  const [mainTab, setMainTab] = useState<'curated' | 'raw'>('curated');
  const [subCategory, setSubCategory] = useState<'all' | 'podcast' | 'tiktok'>('all');
  const displayedVoices = mainTab === 'raw' 
    ? RAW_GEMINI_BASE_VOICES 
    : CURATED_VOICE_PRESETS.filter(v => subCategory === 'all' || v.category === subCategory);
  const handleApplyCustom = (config: { baseVoice: string; speed: number; pitch: string; customPrompt: string }) => {
    const customVoice: VoiceOption = {
      id: `custom_${config.baseVoice.toLowerCase()}_${Date.now()}`,
      category: 'raw',
      label: `Tùy Biến: ${config.baseVoice}`,
      subLabel: config.customPrompt || `Cấu hình giọng ${config.baseVoice} được tinh chỉnh riêng.`,
      gender: selectedVoice.gender,
      region: 'Neural Lab',
      baseVoice: config.baseVoice as any,
      speed: config.speed,
      pitch: config.pitch,
      badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
      prompt: config.customPrompt || `A customized native Vietnamese voice based on ${config.baseVoice}.`,
      sampleSentence: ''
    };
    onConfirm(customVoice);
  };
  return (
    <div className="flex flex-col h-full bg-[#0d0d12] text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-16">
        <div className="max-w-6xl mx-auto space-y-10 pb-48">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-2">
               <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">VOICE STUDIO</h2>
               <div className="flex items-center gap-4">
                 <p className="text-[10px] text-amber-500 font-mono tracking-[0.5em] uppercase">NEURAL ENGINE V3.1</p>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                 <p className="text-[10px] text-slate-500 font-mono tracking-[0.5em] uppercase">DIRECTOR LOCK MODE</p>
               </div>
            </div>
            <button onClick={onBack} className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-[#18181f] hover:bg-white/10 transition-all self-start md:self-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Hủy & Quay Lại</span>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-red-500 text-xl transition-colors">close</span>
            </button>
          </header>
          <div className="space-y-12">
            {/* NAVIGATION TABS */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-[#111217] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
              <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 w-full lg:w-auto">
                <button
                  onClick={() => {
                    setMainTab('curated');
                    setSelectedVoice(CURATED_VOICE_PRESETS[0]);
                  }}
                  className={`flex-1 lg:flex-none px-10 py-4 rounded-xl text-[11px] font-black uppercase transition-all duration-300 ${mainTab === 'curated' ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Presets Tinh Chỉnh (12)
                </button>
                <button
                  onClick={() => {
                    setMainTab('raw');
                    setSelectedVoice(RAW_GEMINI_BASE_VOICES[0]);
                  }}
                  className={`flex-1 lg:flex-none px-10 py-4 rounded-xl text-[11px] font-black uppercase transition-all duration-300 ${mainTab === 'raw' ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Giọng Gốc Gemini (Raw)
                </button>
              </div>
              
              {mainTab === 'curated' && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                  {(['all', 'podcast', 'tiktok'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSubCategory(cat)}
                      className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
                        subCategory === cat ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-slate-600 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {cat === 'all' ? 'Tất cả' : cat === 'podcast' ? 'Podcast' : 'TikTok Viral'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* GRID HIỂN THỊ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              <AnimatePresence mode="popLayout">
                {displayedVoices.map((voice) => {
                  const isSelected = voice.id === selectedVoice.id;
                  return (
                    <motion.div
                      key={voice.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedVoice(voice)}
                      className={`cursor-pointer rounded-[2rem] p-7 border-2 transition-all relative flex flex-col justify-between gap-8 h-56 group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-[0_40px_80px_rgba(245,158,11,0.1)] scale-[1.03] z-10'
                          : 'bg-[#14151b] border-white/5 hover:border-white/10 hover:bg-[#181a22]'
                      }`}
                    >
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase border ${voice.badgeColor}`}>
                            {voice.category}
                          </div>
                          {isSelected && (
                            <div className="flex h-2.5 w-2.5 relative">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-2xl font-black uppercase italic leading-tight transition-colors ${isSelected ? 'text-amber-500' : 'text-white group-hover:text-amber-200'}`}>
                            {voice.label}
                          </h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tight mt-4 font-bold line-clamp-2 leading-relaxed opacity-80">
                            {voice.subLabel}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-slate-600">speed</span>
                            <span className="text-[10px] font-mono text-slate-500">{voice.speed}x</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 uppercase font-black">{voice.baseVoice}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {/* HIỂN THỊ PANEL TÙY BIẾN CHO TAB RAW */}
            <AnimatePresence mode="wait">
              {mainTab === 'raw' && (
                <motion.div
                  key={selectedVoice.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <RawVoiceCustomizer 
                    selectedBaseVoice={selectedVoice.baseVoice}
                    onApplyCustomVoice={handleApplyCustom}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* FOOTER ĐIỀU KHIỂN (Curated Tab) */}
      <AnimatePresence>
        {mainTab === 'curated' && (
          <motion.div 
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            className="fixed bottom-0 left-0 right-0 p-8 md:p-10 bg-[#0d0d12]/95 backdrop-blur-3xl border-t border-white/5 z-50 shadow-[0_-20px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                  <span className="material-symbols-outlined text-amber-500 text-4xl">keyboard_voice</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] leading-none mb-3 opacity-60">Selection Locked</p>
                  <div className="flex items-center gap-4">
                    <h3 className="text-4xl font-black uppercase italic text-white leading-none">{selectedVoice.label}</h3>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-emerald-500 text-[9px] font-black uppercase">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onConfirm(selectedVoice)}
                className="w-full md:w-auto px-16 py-5 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-[0_20px_60px_rgba(245,158,11,0.25)] active:scale-95 flex items-center justify-center gap-5 group"
              >
                TIẾP TỤC VỚI GIỌNG NÀY
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};