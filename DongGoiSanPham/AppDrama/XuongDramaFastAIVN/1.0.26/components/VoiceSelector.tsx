import React from 'react';
import { CURATED_VOICE_PRESETS, RAW_BASE_VOICES, VoicePreset, RawBaseVoice } from '../services/voice';
interface VoiceSelectorProps {
  selectedId?: string;
  onSelect: (preset: VoicePreset | RawBaseVoice) => void;
  onClose: () => void;
}
export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedId, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">settings_voice</span>
              THƯ VIỆN GIỌNG NÓI AI
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Chuẩn ngữ âm vi-VN • Gemini TTS Engine</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Podcast Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Podcast & Kể Chuyện (8 Presets)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CURATED_VOICE_PRESETS.filter(p => p.category === 'podcast').map(preset => (
                <button
                  key={preset.id}
                  onClick={() => onSelect(preset)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                    selectedId === preset.id 
                      ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-black/20 ${selectedId === preset.id ? 'text-white' : 'text-slate-500 group-hover:text-red-500'}`}>
                    <span className="material-symbols-outlined">{preset.gender === 'female' ? 'female' : 'male'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">{preset.label}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${preset.badgeColor || 'bg-slate-800 text-slate-500'}`}>
                        {preset.region}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-60 leading-tight">{preset.subLabel}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          {/* TikTok Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Xu Hướng & Drama (4 Presets)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CURATED_VOICE_PRESETS.filter(p => p.category === 'tiktok').map(preset => (
                <button
                  key={preset.id}
                  onClick={() => onSelect(preset)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                    selectedId === preset.id 
                      ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-black/20 ${selectedId === preset.id ? 'text-white' : 'text-slate-500 group-hover:text-red-500'}`}>
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">{preset.label}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${preset.badgeColor || 'bg-slate-800 text-slate-500'}`}>
                        {preset.region}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-60 leading-tight">{preset.subLabel}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          {/* Raw Voices Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Giọng Gốc Nguyên Bản (Base Voices)</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {RAW_BASE_VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => onSelect(voice)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all text-center group ${
                    selectedId === voice.id 
                      ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-3 rounded-full bg-black/20 ${selectedId === voice.id ? 'text-white' : 'text-slate-600 group-hover:text-red-500'}`}>
                    <span className="material-symbols-outlined text-xl">{voice.gender === 'female' ? 'face_6' : 'face_3'}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{voice.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};