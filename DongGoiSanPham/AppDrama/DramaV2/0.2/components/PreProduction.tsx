import React from 'react';
import { Character, Location } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
import { flowService } from '../services/flowService';
interface PreProductionProps {
  characters: Character[];
  locations: Location[];
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onUpdateLocation: (id: string, updates: Partial<Location>) => void;
  onNext: () => void;
}
export default function PreProduction({ characters, locations, onUpdateCharacter, onUpdateLocation, onNext }: PreProductionProps) {
  const handlePickAvatar = async (charId: string) => {
    const media = await flowService.selectMedia('image');
    if (media) onUpdateCharacter(charId, { avatarMedia: media });
  };
  const handlePickLocation = async (locId: string) => {
    const media = await flowService.selectMedia('image');
    if (media) onUpdateLocation(locId, { locationMedia: media });
  };
  const handleGenerateLocation = async (loc: Location) => {
    onUpdateLocation(loc.id, { isGeneratingImage: true });
    try {
      const media = await flowService.generateImage(loc.description, '16:9');
      if (media) onUpdateLocation(loc.id, { locationMedia: media });
    } finally {
      onUpdateLocation(loc.id, { isGeneratingImage: false });
    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Cast Matrix</h2>
            <p className="text-sm text-slate-400">Thiết lập nhân vật và gán giọng đọc từ thư viện Matrix-12.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map(char => (
            <div key={char.id} className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col p-6 space-y-4 hover:border-amber-500/30 transition-all group shadow-xl">
              <div className="flex gap-4">
                <div 
                  onClick={() => handlePickAvatar(char.id)}
                  className="w-24 h-32 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-all overflow-hidden relative shadow-inner"
                >
                  {char.avatarMedia ? (
                    <img src={char.avatarMedia.url} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-600 mb-1">person_add</span>
                      <span className="text-[10px] text-slate-600 font-black uppercase">Avatar</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] text-white font-bold uppercase bg-black/60 px-2 py-1 rounded">Update</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase italic">{char.name}</h3>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Script Note</p>
                    <p className="text-[11px] text-slate-400 italic line-clamp-2">{char.voiceTone}</p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest mb-1">Matrix Voice AI</p>
                    <select 
                      value={char.selectedVoiceId}
                      onChange={(e) => onUpdateCharacter(char.id, { selectedVoiceId: e.target.value })}
                      className="w-full bg-slate-950 border border-white/5 text-[11px] text-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
                    >
                      <option value="">-- Select Voice --</option>
                      <optgroup label="Nam (Male)">
                        {MATRIX_12_VOICES.filter(v => v.gender === 'male').map(v => (
                          <option key={v.id} value={v.id}>{v.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Nữ (Female)">
                        {MATRIX_12_VOICES.filter(v => v.gender === 'female').map(v => (
                          <option key={v.id} value={v.id}>{v.label}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Visual Prompt</label>
                  <textarea 
                    value={char.physicalDescription}
                    onChange={(e) => onUpdateCharacter(char.id, { physicalDescription: e.target.value })}
                    placeholder="Physical appearance..."
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-xs text-slate-300 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Scene Environments</h2>
          <p className="text-sm text-slate-400">Thiết lập không gian bối cảnh cho các phân đoạn video.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map(loc => (
            <div key={loc.id} className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col md:flex-row p-6 gap-8 hover:border-amber-500/20 transition-all shadow-xl">
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{loc.name}</h3>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Environment Details</label>
                  <textarea 
                    value={loc.description}
                    onChange={(e) => onUpdateLocation(loc.id, { description: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-xs text-slate-300 h-28 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handlePickLocation(loc.id)}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-black uppercase rounded-xl transition-all border border-white/5"
                  >
                    Select File
                  </button>
                  <button 
                    onClick={() => handleGenerateLocation(loc)}
                    disabled={loc.isGeneratingImage}
                    className="flex-1 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-[10px] text-amber-500 font-black uppercase rounded-xl transition-all border border-amber-500/30 disabled:opacity-50"
                  >
                    {loc.isGeneratingImage ? 'Rendering...' : 'AI Generate'}
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2 bg-slate-950 rounded-2xl border border-white/5 aspect-video overflow-hidden relative shadow-inner">
                {loc.locationMedia ? (
                  <img src={loc.locationMedia.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                    <span className="material-symbols-outlined text-5xl mb-2">landscape</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">No Environment Set</span>
                  </div>
                )}
                {loc.isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest animate-pulse">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-center pt-12 border-t border-white/5">
        <button 
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-full font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
        >
          Go to Storyboard Studio
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}