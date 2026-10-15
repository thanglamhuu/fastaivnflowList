import React, { useState } from 'react';
import { Scene, CameraRig, ProjectState, CameraRigMode } from '../types';
import { CAMERA_RIG_SYSTEM } from '../constants';
import { compileOmniPromptV4, sanitizeDialogue } from '../services/directorService';
interface Props {
  scene: Scene;
  selectedVoiceId?: string;
  project: ProjectState;
  onUpdate: (id: number, updates: Partial<Scene>) => void;
  onRender: (id: number) => void;
}
export const SceneCard: React.FC<Props> = ({ scene, project, onUpdate, onRender }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState('');
  
  const isError = scene.status === 'error';
  const isGenerating = scene.status === 'generating';
  const isCompleted = scene.status === 'completed';
  const isShot01 = scene.id === 1;
  const currentWords = scene.script.split(/\s+/).filter(Boolean).length;
  // Bắt buộc mỗi phân cảnh phải đủ 32 từ để tránh thừa thời gian AI tự nói thêm từ ngoài kịch bản
  const isExact32 = currentWords === 32;
  const isOver32 = currentWords > 32;
  const isUnder32 = currentWords < 32;
  const handleToggleRigMode = () => {
    const nextMode: CameraRigMode = scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' ? 'STATIC_LOCKED_OFF' : 'DYNAMIC_MULTI_CAM';
    onUpdate(scene.id, { cameraRigMode: nextMode });
  };
  const handleViewPrompt = async () => {
    const p = await compileOmniPromptV4(scene, project, scene.id - 1);
    setCompiledPrompt(p);
    setShowPrompt(true);
  };
  return (
    <div className={`group relative flex flex-col bg-[#0d0d12] border rounded-[2.5rem] overflow-hidden transition-all duration-500 h-[860px] ${
      isGenerating ? 'border-[#F31B17] shadow-[0_0_80px_rgba(243,27,23,0.15)] scale-[1.01]' : 
      isError ? 'border-red-500/30' : 'border-white/5'
    }`}>
      {/* Đầu thẻ */}
      <div className="px-7 py-5 bg-[#131318]/70 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-mono font-black uppercase tracking-[0.25em] ${isError ? 'text-red-500' : 'text-[#F31B17]'}`}>
            PHÂN CẢNH {scene.id.toString().padStart(2, '0')}
          </span>
          <div className="px-2 py-0.5 bg-white/5 rounded border border-white/10">
            <span className="text-[8px] text-slate-400 font-mono font-bold">8.0 GIÂY</span>
          </div>
          {isShot01 && (
            <div className="px-2 py-0.5 bg-[#F31B17]/20 text-[#F31B17] rounded border border-[#F31B17]/30 text-[8px] font-black uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">campaign</span>
              MỞ ĐẦU 00:00
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Nút Tạo lại nhanh ở góc trên nếu phân cảnh đã hoàn thành */}
          {isCompleted && (
            <button
              onClick={() => onRender(scene.id)}
              disabled={isGenerating}
              title="Tạo lại phân cảnh này"
              className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase bg-[#F31B17]/10 hover:bg-[#F31B17]/20 text-[#F31B17] border border-[#F31B17]/30 flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[13px]">refresh</span>
              TẠO LẠI
            </button>
          )}
          {/* Chuyển đổi chế độ máy quay */}
          <button
            onClick={handleToggleRigMode}
            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 transition-all ${
              scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' 
                ? 'bg-[#F31B17]/20 text-red-400 border border-[#F31B17]/40' 
                : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' ? 'movie' : 'tripod'}
            </span>
            {scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' ? 'CẮT DỨT KHOÁT 5S' : 'CHÂN MÁY KHÓA TĨNH'}
          </button>
          <button 
            onClick={handleViewPrompt}
            title="Xem DUY NHẤT 1 câu lệnh render 8.0s gửi tới Omni"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#F31B17] hover:border-[#F31B17]/50 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col overflow-hidden">
        {/* Nhập lời thoại */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#F31B17]/70">record_voice_over</span>
              LỜI THOẠI ĐỌC (KHỚP KHẨU HÌNH THẬT)
            </span>
            <span className={`font-mono px-2 py-0.5 rounded text-[8px] font-bold ${
              isExact32 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 
              isOver32 ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 
              'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            }`}>
              {currentWords}/32 TỪ {isExact32 ? '✓ ĐỦ CHUẨN' : isUnder32 ? `(THIẾU ${32 - currentWords} TỪ)` : `(THỪA ${currentWords - 32} TỪ)`}
            </span>
          </div>
          <textarea
            value={scene.script}
            onChange={(e) => onUpdate(scene.id, { 
              script: sanitizeDialogue(e.target.value).toLowerCase(),
              wordCount: e.target.value.split(/\s+/).filter(Boolean).length
            })}
            placeholder="Mỗi phân cảnh bắt buộc phải đủ đúng 32 từ để tránh thừa thời gian AI tự nói thêm từ không có trong kịch bản..."
            className={`w-full bg-black/40 border rounded-2xl p-4 text-[12px] text-slate-200 h-24 outline-none transition-all resize-none custom-scrollbar leading-relaxed font-medium ${
              isOver32 ? 'border-red-500/50' : isUnder32 ? 'border-amber-500/30' : 'border-emerald-500/30 focus:border-emerald-500'
            }`}
          />
        </div>
        {/* Lựa chọn góc máy quay & Ghi chú cấm sinh chữ */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">videocam</span>
              GÓC MÁY QUAY ĐẠO DIỄN
            </span>
            <span className="font-mono text-[#F31B17]/80 text-[8px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] text-emerald-400">verified</span>
              {scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' ? 'Cắt 05:00 (Cấm sinh chữ)' : 'Chân máy khóa tĩnh (Cấm chữ)'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <select
              value={scene.cameraRig}
              onChange={(e) => onUpdate(scene.id, { cameraRig: e.target.value as CameraRig })}
              className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase text-slate-200 outline-none hover:border-[#F31B17]/40 transition-all cursor-pointer"
            >
              {CAMERA_RIG_SYSTEM.map(r => (
                <option key={r.id} value={r.id}>{r.label} — {r.description}</option>
              ))}
            </select>
            {scene.cameraRigMode === 'DYNAMIC_MULTI_CAM' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[8px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">content_cut</span>
                  Góc cắt tại 05:00:
                </span>
                <select
                  value={scene.transitionCutRig || 'CAM_SIDE_45'}
                  onChange={(e) => onUpdate(scene.id, { transitionCutRig: e.target.value as CameraRig })}
                  className="flex-1 bg-[#15151c] border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-bold text-red-400 outline-none"
                >
                  {CAMERA_RIG_SYSTEM.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {/* Khung xem trước video */}
        <div className="relative flex-1 bg-black rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-white/10 transition-all">
          {scene.media?.url ? (
            <video src={scene.media.url} className="w-full h-full object-contain" controls />
          ) : isGenerating ? (
            <div className="text-center space-y-6 p-8">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-2 border-[#F31B17]/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-t-[#F31B17] rounded-full animate-spin"></div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-[#F31B17] uppercase tracking-[0.3em] flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs animate-spin">refresh</span>
                  ĐANG KẾT XUẤT OMNI 8.0 GIÂY
                </div>
                <div className="text-[8px] text-slate-500 font-mono uppercase">Quy trình V4.1 Khớp Khẩu Hình (Đủ 32 Từ • Cấm Sinh Chữ)</div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 opacity-25">
              <span className="material-symbols-outlined text-6xl font-light">videocam</span>
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Phân Cảnh Sẵn Sàng</p>
            </div>
          )}
          
          {isError && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
              <span className="material-symbols-outlined text-red-500 text-4xl mb-3">gpp_maybe</span>
              <h4 className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mb-1">Lỗi Kết Xuất</h4>
              <p className="text-[9px] text-slate-400 font-bold leading-relaxed max-w-[200px]">
                {scene.error}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Chân thẻ hành động: Nút Kết xuất & Nút Tạo lại từng phân cảnh */}
      <div className="p-6 bg-[#131318]/50 border-t border-white/5 flex gap-2">
        {isCompleted ? (
          <>
            <button
              onClick={() => onRender(scene.id)}
              disabled={isGenerating || isOver32}
              className="flex-1 py-4 bg-[#F31B17] hover:bg-[#d11713] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-900/20 disabled:opacity-30"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">replay</span>
              )}
              TẠO LẠI PHÂN CẢNH NÀY
            </button>
          </>
        ) : (
          <button
            onClick={() => onRender(scene.id)}
            disabled={isGenerating || isOver32}
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 ${
              isError ? 'bg-red-600 text-white' : 
              'bg-[#F31B17] text-white hover:bg-[#d11713] active:scale-95 shadow-xl shadow-red-900/20'
            } disabled:opacity-30`}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">
                {isError ? 'refresh' : 'electric_bolt'}
              </span>
            )}
            {isError ? 'THỬ LẠI PHÂN CẢNH' : 'KẾT XUẤT PHÂN CẢNH (8.0S • 32 TỪ)'}
          </button>
        )}
      </div>
      {/* Cửa sổ hiển thị câu lệnh Prompt */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-8 flex items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-[#0d0d12] border border-[#F31B17]/20 rounded-[2.5rem] flex flex-col h-[85vh] shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#F31B17]">terminal</span>
                  CÂU LỆNH KẾT XUẤT DUY NHẤT CHO PHÂN CẢNH {scene.id.toString().padStart(2, '0')}
                </h3>
                <p className="text-[9px] text-[#F31B17] font-mono uppercase tracking-[0.3em] mt-1">
                  Quy trình Đạo diễn Omni V4.1 • Phân cảnh 8.0s (Khóa chuẩn kịch bản 32 từ • Tuyệt đối không sinh chữ)
                </p>
              </div>
              <button onClick={() => setShowPrompt(false)} className="w-12 h-12 rounded-full hover:bg-white/5 text-slate-400 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-black/60 p-6 rounded-2xl border border-white/5 select-all">
                 {compiledPrompt}
               </pre>
            </div>
            <div className="p-8 border-t border-white/5 flex justify-end gap-4">
               <button 
                 onClick={() => { navigator.clipboard.writeText(compiledPrompt); setShowPrompt(false); }}
                 className="px-10 py-3.5 bg-[#F31B17] hover:bg-[#d11713] text-white font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-95 transition-all flex items-center gap-2"
               >
                 <span className="material-symbols-outlined text-sm">content_copy</span>
                 SAO CHÉP CÂU LỆNH
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};