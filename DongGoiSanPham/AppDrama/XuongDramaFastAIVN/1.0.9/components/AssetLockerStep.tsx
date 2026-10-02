import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { DramaProject, CharacterAsset, LocationAsset, PropAsset } from '../types';
interface AssetLockerStepProps {
  project: DramaProject;
  updateProject: (updates: Partial<DramaProject>) => void;
  onExtractAssets: () => Promise<boolean>;
  onNext: () => void;
  loading: string | null;
}
type AssetTab = 'characters' | 'locations' | 'props';
export const AssetLockerStep: React.FC<AssetLockerStepProps> = ({
  project,
  updateProject,
  onExtractAssets,
  onNext,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<AssetTab>('characters');
  const handleAssetImageUpload = async (id: string, type: AssetTab) => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      const updates: Partial<DramaProject> = {};
      
      if (type === 'characters') {
        updates.characters = project.characters.map(c => 
          c.id === id ? { ...c, mediaId: media.mediaId, referenceImageUrl: `data:${media.mimeType};base64,${media.base64}` } : c
        );
      } else if (type === 'locations') {
        updates.locations = project.locations.map(l => 
          l.id === id ? { ...l, mediaId: media.mediaId, referenceImageUrl: `data:${media.mimeType};base64,${media.base64}` } : l
        );
      } else if (type === 'props') {
        updates.props = project.props.map(p => 
          p.id === id ? { ...p, mediaId: media.mediaId, referenceImageUrl: `data:${media.mimeType};base64,${media.base64}` } : p
        );
      }
      
      updateProject(updates);
    } catch (err) {
      console.error("Selection cancelled");
    }
  };
  const addAsset = () => {
    const id = `${activeTab}-${Date.now()}`;
    if (activeTab === 'characters') {
      const newChar: CharacterAsset = { id, name: "Nhân vật mới", physicalDescription: "", defaultOutfit: "", voiceTone: "" };
      updateProject({ characters: [...project.characters, newChar] });
    } else if (activeTab === 'locations') {
      const newLoc: LocationAsset = { id, name: "Bối cảnh mới", description: "" };
      updateProject({ locations: [...project.locations, newLoc] });
    } else {
      const newProp: PropAsset = { id, name: "Đạo cụ mới", description: "" };
      updateProject({ props: [...project.props, newProp] });
    }
  };
  const removeAsset = (id: string, type: AssetTab) => {
    if (type === 'characters') {
      updateProject({ characters: project.characters.filter(c => c.id !== id) });
    } else if (type === 'locations') {
      updateProject({ locations: project.locations.filter(l => l.id !== id) });
    } else {
      updateProject({ props: project.props.filter(p => p.id !== id) });
    }
  };
  const renderCharacterCard = (char: CharacterAsset) => (
    <div key={char.id} className="bg-slate-900  border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-red-500/30 transition-all shadow-lg">
      <div 
        className="h-48 bg-slate-950 flex items-center justify-center relative cursor-pointer"
        onClick={() => handleAssetImageUpload(char.id, 'characters')}
      >
        {char.referenceImageUrl ? (
          <img src={char.referenceImageUrl} alt={char.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center space-y-1 opacity-30 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl">add_a_photo</span>
            <p className="text-[9px] font-bold uppercase tracking-widest">Tải ảnh tham chiếu</p>
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); removeAsset(char.id, 'characters'); }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-xs">delete</span>
        </button>
      </div>
      <div className="p-4 space-y-3">
        <input 
          className="bg-transparent border-b border-transparent focus:border-red-500/30 text-base font-black w-full focus:outline-none text-slate-100"
          value={char.name}
          onChange={e => updateProject({
            characters: project.characters.map(c => c.id === char.id ? {...c, name: e.target.value} : c)
          })}
          placeholder="Tên nhân vật..."
        />
        <div className="space-y-2">
          <textarea 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] focus:border-red-500 outline-none h-16 resize-none text-slate-300"
            placeholder="Ngoại hình: tóc, tuổi..."
            value={char.physicalDescription}
            onChange={e => updateProject({
              characters: project.characters.map(c => c.id === char.id ? {...c, physicalDescription: e.target.value} : c)
            })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[9px] focus:border-red-500 outline-none text-slate-400"
              placeholder="Trang phục..."
              value={char.defaultOutfit}
              onChange={e => updateProject({
                characters: project.characters.map(c => c.id === char.id ? {...c, defaultOutfit: e.target.value} : c)
              })}
            />
            <input 
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[9px] focus:border-red-500 outline-none text-slate-400"
              placeholder="Chất giọng..."
              value={char.voiceTone}
              onChange={e => updateProject({
                characters: project.characters.map(c => c.id === char.id ? {...c, voiceTone: e.target.value} : c)
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
  const renderSimpleAssetCard = (asset: LocationAsset | PropAsset, type: 'locations' | 'props') => (
    <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-red-500/30 transition-all shadow-lg">
      <div 
        className="h-40 bg-slate-950 flex items-center justify-center relative cursor-pointer"
        onClick={() => handleAssetImageUpload(asset.id, type)}
      >
        {asset.referenceImageUrl ? (
          <img src={asset.referenceImageUrl} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center space-y-1 opacity-30 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl">add_a_photo</span>
            <p className="text-[9px] font-bold uppercase tracking-widest">Tải ảnh {type === 'locations' ? 'bối cảnh' : 'đạo cụ'}</p>
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); removeAsset(asset.id, type); }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-xs">delete</span>
        </button>
      </div>
      <div className="p-4 space-y-2">
        <input 
          className="bg-transparent border-b border-transparent focus:border-red-500/30 text-sm font-black w-full focus:outline-none text-slate-100"
          value={asset.name}
          onChange={e => {
            const list = type === 'locations' ? project.locations : project.props;
            const updated = list.map(item => item.id === asset.id ? { ...item, name: e.target.value } : item);
            updateProject({ [type]: updated });
          }}
          placeholder="Tên..."
        />
        <textarea 
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] focus:border-red-500 outline-none h-20 resize-none text-slate-300"
          placeholder="Mô tả chi tiết..."
          value={asset.description}
          onChange={e => {
            const list = type === 'locations' ? project.locations : project.props;
            const updated = list.map(item => item.id === asset.id ? { ...item, description: e.target.value } : item);
            updateProject({ [type]: updated });
          }}
        />
      </div>
    </div>
  );
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-3xl">inventory</span>
              Quản Lý Tài Nguyên
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">Xác thực nhân vật & đạo cụ đồng nhất</p>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['characters', 'locations', 'props'] as AssetTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                  activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'characters' ? 'Nhân vật' : tab === 'locations' ? 'Bối cảnh' : 'Đạo cụ'}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onExtractAssets}
          disabled={!!loading}
          className="px-6 py-3 bg-white text-slate-950 font-black rounded-xl text-[10px] hover:bg-slate-100 flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'psychology'}</span>
          {loading || 'TỰ ĐỘNG BÓC TÁCH LẠI'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'characters' && project.characters.map(renderCharacterCard)}
        {activeTab === 'locations' && project.locations.map(l => renderSimpleAssetCard(l, 'locations'))}
        {activeTab === 'props' && project.props.map(p => renderSimpleAssetCard(p, 'props'))}
        
        <button 
          onClick={addAsset}
          className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-red-500 hover:border-red-500/50 transition-all min-h-[300px] bg-slate-900/20"
        >
          <span className="material-symbols-outlined text-4xl">add_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Thêm {activeTab === 'characters' ? 'nhân vật' : activeTab === 'locations' ? 'bối cảnh' : 'đạo cụ'}</span>
        </button>
      </div>
      <div className="flex justify-center mt-12 pb-12">
        <button
          onClick={onNext}
          className="px-16 py-4 bg-red-600 text-white font-black rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          VÀO BÀN PHÂN CẢNH
          <span className="material-symbols-outlined">movie_filter</span>
        </button>
      </div>
    </div>
  );
};