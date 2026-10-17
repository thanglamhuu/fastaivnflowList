import React from 'react';
import { Character, Location } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
import { flowService } from '../services/flowService';
interface PreProductionProps {
  characters: Character[];
  locations: Location[];
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onAddCharacter: () => void;
  onRemoveCharacter: (id: string) => void;
  onUpdateLocation: (id: string, updates: Partial<Location>) => void;
  onAddLocation: () => void;
  onRemoveLocation: (id: string) => void;
  onNext: () => void;
}
export default function PreProduction({ 
  characters, 
  locations, 
  onUpdateCharacter, 
  onAddCharacter,
  onRemoveCharacter,
  onUpdateLocation, 
  onAddLocation,
  onRemoveLocation,
  onNext 
}: PreProductionProps) {
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
      const media = await flowService.generateImage(loc.description || loc.name, '16:9');
      if (media) onUpdateLocation(loc.id, { locationMedia: media });
    } finally {
      onUpdateLocation(loc.id, { isGeneratingImage: false });
    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* PHẦN BẢNG NHÂN VẬT */}
      <section>
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Bảng nhân vật</h2>
            <p className="text-sm text-slate-400">Thiết lập nhân vật, khóa nhận diện & trang phục xuyên suốt các phân cảnh.</p>
          </div>
          <button
            type="button"
            onClick={onAddCharacter}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Thêm nhân vật
          </button>
        </div>
        {characters.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-400 text-sm mb-3">Chưa có nhân vật nào trong dự án.</p>
            <button
              onClick={onAddCharacter}
              className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl"
            >
              + Thêm nhân vật đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(char => (
              <div key={char.id} className="relative bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col p-6 space-y-4 hover:border-amber-500/30 transition-all group shadow-xl">
                {/* Nút Xóa Nhân Vật */}
                <button
                  type="button"
                  onClick={() => onRemoveCharacter(char.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100"
                  title="Xóa nhân vật này"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="flex gap-4 pr-6">
                  {/* Khung Avatar Tham Chiếu */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div 
                      onClick={() => handlePickAvatar(char.id)}
                      className="w-24 h-32 bg-slate-950 rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-all overflow-hidden relative shadow-inner group/avatar"
                    >
                      {char.avatarMedia ? (
                        <img src={char.avatarMedia.url} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-slate-500 mb-1 text-2xl">person_add</span>
                          <span className="text-[10px] text-slate-500 font-black uppercase text-center px-1">Ảnh Mẫu</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] text-white font-bold uppercase bg-black/70 px-2 py-1 rounded">Đổi</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-amber-400 font-black uppercase tracking-tight text-center max-w-[100px] leading-tight">
                      🔒 Khóa mặt & Trang phục
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => onUpdateCharacter(char.id, { name: e.target.value })}
                      placeholder="Tên nhân vật..."
                      className="text-lg font-black text-white tracking-tight uppercase italic bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-500 focus:outline-none w-full"
                    />
                    
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Ghi chú kịch bản / Tone</p>
                      <input 
                        type="text"
                        value={char.voiceTone || ''}
                        onChange={(e) => onUpdateCharacter(char.id, { voiceTone: e.target.value })}
                        placeholder="Tính cách, giọng điệu..."
                        className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-white/20"
                      />
                    </div>
                    
                    <div className="pt-1">
                      <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">record_voice_over</span>
                        Chọn giọng
                      </p>
                      <select 
                        value={char.selectedVoiceId}
                        onChange={(e) => onUpdateCharacter(char.id, { selectedVoiceId: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 text-[11px] text-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                      >
                        <option value="">-- Chọn giọng --</option>
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
                    <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Mô tả ngoại hình (Visual Prompt)</label>
                    <textarea 
                      value={char.physicalDescription}
                      onChange={(e) => onUpdateCharacter(char.id, { physicalDescription: e.target.value })}
                      placeholder="Mô tả khuôn mặt, tuổi tác, vóc dáng, màu tóc..."
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-xs text-slate-300 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
                    />
                  </div>
                  {/* Ô nhập Trang phục cố định */}
                  <div>
                    <label className="text-[9px] text-amber-400 uppercase font-black tracking-widest block mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">checkroom</span>
                      Trang phục cố định (Giữ nguyên xuyên suốt các Shot)
                    </label>
                    <input 
                      type="text"
                      value={char.defaultOutfit}
                      onChange={(e) => onUpdateCharacter(char.id, { defaultOutfit: e.target.value })}
                      placeholder="VD: Váy dạ hội trắng tinh khôi / Suit đen cà vạt đỏ..."
                      className="w-full bg-slate-950/60 border border-amber-500/20 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* PHẦN BỐI CẢNH */}
      <section>
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Bối cảnh</h2>
            <p className="text-sm text-slate-400">Thiết lập không gian bối cảnh cho các phân đoạn video.</p>
          </div>
          <button
            type="button"
            onClick={onAddLocation}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            Thêm bối cảnh
          </button>
        </div>
        {locations.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-400 text-sm mb-3">Chưa có bối cảnh nào trong danh sách.</p>
            <button
              onClick={onAddLocation}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              + Thêm bối cảnh đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map(loc => (
              <div key={loc.id} className="relative bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col md:flex-row p-6 gap-8 hover:border-amber-500/20 transition-all shadow-xl group">
                {/* Nút Xóa Bối Cảnh */}
                <button
                  type="button"
                  onClick={() => onRemoveLocation(loc.id)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100"
                  title="Xóa bối cảnh này"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="w-full md:w-1/2 space-y-4">
                  <input
                    type="text"
                    value={loc.name}
                    onChange={(e) => onUpdateLocation(loc.id, { name: e.target.value })}
                    placeholder="Tên bối cảnh..."
                    className="text-2xl font-black text-white uppercase italic tracking-tighter bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-500 focus:outline-none w-full pr-8"
                  />
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Chi tiết không gian / Ánh sáng</label>
                    <textarea 
                      value={loc.description}
                      onChange={(e) => onUpdateLocation(loc.id, { description: e.target.value })}
                      placeholder="Mô tả bối cảnh xung quanh, thời gian, ánh sáng..."
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-xs text-slate-300 h-28 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handlePickLocation(loc.id)}
                      className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-black uppercase rounded-xl transition-all border border-white/5"
                    >
                      Chọn file ảnh
                    </button>
                    <button 
                      onClick={() => handleGenerateLocation(loc)}
                      disabled={loc.isGeneratingImage}
                      className="flex-1 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-[10px] text-amber-500 font-black uppercase rounded-xl transition-all border border-amber-500/30 disabled:opacity-50"
                    >
                      {loc.isGeneratingImage ? 'Đang tạo...' : 'AI Tạo ảnh'}
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-slate-950 rounded-2xl border border-white/5 aspect-video overflow-hidden relative shadow-inner">
                  {loc.locationMedia ? (
                    <img src={loc.locationMedia.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                      <span className="material-symbols-outlined text-5xl mb-2">landscape</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Chưa có ảnh bối cảnh</span>
                    </div>
                  )}
                  {loc.isGeneratingImage && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                      <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest animate-pulse">Đang xử lý...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* NÚT CHUYỂN SANG STORYBOARD */}
      <div className="flex justify-center pt-12 border-t border-white/5">
        <button 
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-full font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
        >
          Sang Storyboard
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}