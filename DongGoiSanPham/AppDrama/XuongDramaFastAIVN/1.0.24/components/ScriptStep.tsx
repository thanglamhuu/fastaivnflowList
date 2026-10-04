import React, { useState, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { DramaProject, DramaStyle, DramaDuration, CharacterAsset, LocationAsset } from '../types';
import { VoiceSelector } from './VoiceSelector';
import { VoicePreset, RawBaseVoice } from '../services/voice';
import { analyzeCharacterImage } from '../services/ai';
interface ScriptStepProps {
  project: DramaProject;
  updateProject: (updates: Partial<DramaProject>) => void;
  updateCharacter: (id: string, updates: Partial<CharacterAsset>) => void;
  updateLocation: (id: string, updates: Partial<LocationAsset>) => void;
  onGenerateScript: () => Promise<void>;
  onNext: () => void;
  loading: string | null;
}
export const ScriptStep: React.FC<ScriptStepProps> = ({
  project,
  updateProject,
  updateCharacter,
  updateLocation,
  onGenerateScript,
  onNext,
  loading
}) => {
  const [showVoicePicker, setShowVoicePicker] = useState<string | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeAssetRef = useRef<{ id: string, type: 'char' | 'loc' } | null>(null);
  const addCharacter = () => {
    const newChar: CharacterAsset = {
      id: `char-${Date.now()}`,
      name: "Nhân vật " + (project.characters.length + 1),
      physicalDescription: "",
      defaultOutfit: "",
      voiceTone: ""
    };
    updateProject({ characters: [...project.characters, newChar] });
  };
  const addLocation = () => {
    const newLoc: LocationAsset = {
      id: `loc-${Date.now()}`,
      name: "Bối cảnh " + (project.locations.length + 1),
      description: ""
    };
    updateProject({ locations: [...project.locations, newLoc] });
  };
  const handleVoiceSelect = (charId: string, preset: VoicePreset | RawBaseVoice) => {
    const voiceUpdates: Partial<CharacterAsset> = {
      voicePresetId: preset.id,
      voiceTone: preset.label
    };
    if ('name' in preset) {
      voiceUpdates.baseVoice = preset.name;
    } else {
      voiceUpdates.baseVoice = (preset as VoicePreset).baseVoice;
    }
    updateCharacter(charId, voiceUpdates);
    setShowVoicePicker(null);
  };
  const processImageAnalysis = async (id: string, base64: string, mimeType: string) => {
    setAnalyzingIds(prev => new Set(prev).add(id));
    try {
      const analysis = await analyzeCharacterImage(base64, mimeType);
      if (analysis) {
        updateCharacter(id, {
          physicalDescription: analysis.physicalDescription,
          defaultOutfit: analysis.defaultOutfit
        });
      }
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = activeAssetRef.current;
    if (!file || !target) return;
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1];
        const uploadResult = await Flow.upload({
          base64,
          mimeType: file.type as any,
          name: `Ref_${target.id}`
        });
        if (target.type === 'char') {
          updateCharacter(target.id, {
            mediaId: uploadResult.mediaId,
            referenceImageUrl: result
          });
          processImageAnalysis(target.id, base64, file.type);
        } else {
          updateLocation(target.id, {
            mediaId: uploadResult.mediaId,
            referenceImageUrl: result
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error", err);
    }
    e.target.value = '';
  };
  const handleSelectFromGallery = async (id: string, type: 'char' | 'loc') => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        const url = `data:${media.mimeType};base64,${media.base64}`;
        if (type === 'char') {
          updateCharacter(id, {
            mediaId: media.mediaId,
            referenceImageUrl: url
          });
          processImageAnalysis(id, media.base64, media.mimeType);
        } else {
          updateLocation(id, {
            mediaId: media.mediaId,
            referenceImageUrl: url
          });
        }
      }
    } catch (err) {}
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <div className="space-y-6">
        {/* Step 2: Removed duplicated config UI, keeping only the Premise input */}
        <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">auto_awesome</span>
            Ý tưởng kịch bản (Prompt)
          </h3>
          
          <div>
            <textarea
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-500 outline-none resize-none text-slate-200"
              placeholder="VD: Một vụ ly hôn kịch tính giữa giám đốc và thư ký..."
              value={project.premise}
              onChange={e => updateProject({ premise: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Phong cách kể chuyện</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-red-500 outline-none text-slate-200"
                value={project.style}
                onChange={e => updateProject({ style: e.target.value as DramaStyle })}
              >
                {['Cinematic Photorealistic', '3D Pixar', 'Anime Drama', 'K-Drama Tone'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Thời lượng mong muốn</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-red-500 outline-none text-slate-200"
                value={project.duration}
                onChange={e => updateProject({ duration: e.target.value as DramaDuration })}
              >
                {['15s', '30s', '45s', '60s', '90s', '180s'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
        {/* Tài nguyên tham chiếu */}
        <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">face</span>
              Nhân vật & Bối cảnh
            </h3>
            <div className="flex gap-2">
              <button onClick={addCharacter} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white" title="Thêm nhân vật">
                <span className="material-symbols-outlined text-sm">person_add</span>
              </button>
              <button onClick={addLocation} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white" title="Thêm bối cảnh">
                <span className="material-symbols-outlined text-sm">add_location_alt</span>
              </button>
            </div>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {project.characters.map((char) => {
              const isAnalyzing = analyzingIds.has(char.id);
              return (
                <div key={char.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-4 animate-in slide-in-from-left-4 group/card hover:border-red-500/30 transition-colors">
                  <div className="w-24 h-24 bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center relative border border-slate-800 shrink-0 group">
                    {char.referenceImageUrl ? (
                      <img src={char.referenceImageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-700 text-3xl">person</span>
                    )}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">AI Scanning...</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button onClick={() => handleSelectFromGallery(char.id, 'char')} className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all" title="Chọn từ thư viện">
                        <span className="material-symbols-outlined text-xl">collections</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        className="bg-transparent border-b border-slate-800 text-xs font-bold w-full focus:outline-none focus:border-red-500"
                        value={char.name}
                        onChange={e => updateCharacter(char.id, { name: e.target.value })}
                        placeholder="Tên nhân vật..."
                      />
                      <button onClick={() => updateProject({ characters: project.characters.filter(c => c.id !== char.id)})} className="text-slate-600 hover:text-red-500">
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                    {/* Voice Selector Integration */}
                    <button 
                      onClick={() => setShowVoicePicker(char.id)}
                      className="w-full py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between px-3 hover:border-red-500/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500 text-[14px]">mic</span>
                        <span className="text-[9px] font-black uppercase text-slate-400">{char.voiceTone || 'Chọn giọng TTS'}</span>
                      </div>
                      <span className="material-symbols-outlined text-slate-700 text-[14px]">expand_more</span>
                    </button>
                  </div>
                  {showVoicePicker === char.id && (
                    <VoiceSelector 
                      selectedId={char.voicePresetId} 
                      onSelect={(p) => handleVoiceSelect(char.id, p)}
                      onClose={() => setShowVoicePicker(null)} 
                    />
                  )}
                </div>
              );
            })}
            {/* Locations List */}
            {project.locations.map((loc) => (
              <div key={loc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-4 animate-in slide-in-from-right-4 hover:border-slate-700 transition-colors">
                <div className="w-24 h-24 bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center relative border border-slate-800 shrink-0 group">
                  {loc.referenceImageUrl ? (
                    <img src={loc.referenceImageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-700 text-3xl">landscape</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button onClick={() => handleSelectFromGallery(loc.id, 'loc')} className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all" title="Chọn từ thư viện">
                      <span className="material-symbols-outlined text-xl">collections</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      className="bg-transparent border-b border-slate-800 text-xs font-bold w-full focus:outline-none focus:border-red-500"
                      value={loc.name}
                      onChange={e => updateLocation(loc.id, { name: e.target.value })}
                      placeholder="Tên bối cảnh..."
                    />
                    <button onClick={() => updateProject({ locations: project.locations.filter(l => l.id !== loc.id)})} className="text-slate-600 hover:text-red-500">
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onGenerateScript}
            disabled={!!loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-[0_4px_20_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
              {loading ? 'sync' : 'auto_fix_high'}
            </span>
            {loading ? loading : 'SÁNG TÁC KỊCH BẢN AI'}
          </button>
        </section>
      </div>
      <div className="flex flex-col h-full">
        <section className="flex-1 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">description</span>
              Nội Dung Kịch Bản
            </h3>
          </div>
          
          <textarea
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 text-sm font-serif leading-relaxed focus:border-red-500 outline-none resize-none text-slate-200"
            placeholder="Kịch bản AI sẽ xuất hiện tại đây sau khi bạn nhấn nút Sáng tác..."
            value={project.scriptMarkdown}
            onChange={e => updateProject({ scriptMarkdown: e.target.value })}
          />
          
          {project.scriptMarkdown && (
            <button
              onClick={onNext}
              disabled={!!loading}
              className="w-full py-4 bg-white text-slate-950 border border-slate-200 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 hover:bg-slate-100 hover:scale-[1.02] active:scale-95 shadow-2xl"
            >
              TIẾP TỤC STORYBOARD
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </section>
      </div>
    </div>
  );
};