import React from 'react';
import { Flow } from 'flow-sdk';
import { DramaProject, CharacterAsset } from '../types';
interface AssetLockerStepProps {
  project: DramaProject;
  updateProject: (updates: Partial<DramaProject>) => void;
  onExtractAssets: () => Promise<void>;
  onNext: () => void;
  loading: string | null;
}
export const AssetLockerStep: React.FC<AssetLockerStepProps> = ({
  project,
  updateProject,
  onExtractAssets,
  onNext,
  loading
}) => {
  const handleCharacterImageUpload = async (charId: string) => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      updateProject({
        characters: project.characters.map(c => 
          c.id === charId ? { 
            ...c, 
            mediaId: media.mediaId, 
            referenceImageUrl: `data:${media.mimeType};base64,${media.base64}` 
          } : c
        )
      });
    } catch (err) {
      console.error("Selection cancelled");
    }
  };
  const addCharacter = () => {
    const newChar: CharacterAsset = {
      id: `char-${Date.now()}`,
      name: "Nhân vật mới",
      physicalDescription: "Mô tả ngoại hình...",
      defaultOutfit: "Trang phục...",
      voiceTone: "Trầm ấm/Chua ngoa..."
    };
    updateProject({ characters: [...project.characters, newChar] });
  };
  const removeCharacter = (id: string) => {
    updateProject({ characters: project.characters.filter(c => c.id !== id) });
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 text-3xl">person_pin</span>
            Khóa Nhân Vật & Assets
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">
            Tải ảnh tham chiếu để AI giữ sự nhất quán hình ảnh
          </p>
        </div>
        <button
          onClick={onExtractAssets}
          disabled={!!loading}
          className="px-6 py-3 bg-slate-100 text-slate-950 font-black rounded-xl text-xs hover:bg-white flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'psychology'}</span>
          {loading || 'TỰ ĐỘNG BÓC TÁCH TỪ KỊCH BẢN'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.characters.map((char) => (
          <div key={char.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-600 transition-all shadow-lg">
            <div 
              className="h-56 bg-slate-950 flex items-center justify-center relative cursor-pointer group-hover:bg-slate-900 transition-colors"
              onClick={() => handleCharacterImageUpload(char.id)}
            >
              {char.referenceImageUrl ? (
                <img src={char.referenceImageUrl} alt={char.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center space-y-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Tải ảnh tham chiếu</p>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded uppercase shadow-lg">
                CHARACTER
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeCharacter(char.id); }}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
              <input 
                className="bg-transparent border-b border-transparent focus:border-red-500/30 text-lg font-black w-full focus:outline-none placeholder:text-slate-800 text-slate-100 pb-1"
                value={char.name}
                onChange={e => updateProject({
                  characters: project.characters.map(c => c.id === char.id ? {...c, name: e.target.value} : c)
                })}
                placeholder="Tên nhân vật..."
              />
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Đặc điểm nhận dạng</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs focus:border-red-500 outline-none h-24 resize-none text-slate-300 placeholder:text-slate-800"
                    placeholder="Mô tả chi tiết: tóc, mắt, chiều cao, trang phục mặc định..."
                    value={char.physicalDescription}
                    onChange={e => updateProject({
                      characters: project.characters.map(c => c.id === char.id ? {...c, physicalDescription: e.target.value} : c)
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={addCharacter}
          className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-red-500 hover:border-red-500/50 transition-all min-h-[350px] bg-slate-900/20"
        >
          <span className="material-symbols-outlined text-5xl">person_add</span>
          <span className="text-xs font-bold uppercase tracking-widest">Thêm nhân vật thủ công</span>
        </button>
      </div>
      {project.characters.length > 0 && (
        <div className="flex justify-center mt-12 pb-12">
          <button
            onClick={onNext}
            className="px-16 py-4 bg-red-600 text-white font-black rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            VÀO BÀN PHÂN CẢNH
            <span className="material-symbols-outlined">movie_filter</span>
          </button>
        </div>
      )}
    </div>
  );
};