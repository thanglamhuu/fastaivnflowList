import React, { useState, useMemo } from 'react';
import { Shot } from '../types';
interface MergeModalProps {
  shots: Shot[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedShots: Shot[]) => void;
  isMerging: boolean;
  mergeProgress: number;
}
export default function MergeModal({
  shots,
  isOpen,
  onClose,
  onConfirm,
  isMerging,
  mergeProgress
}: MergeModalProps) {
  // Chỉ lấy các shot đã có videoMedia với dữ liệu base64
  const completedShots = useMemo(() => {
    return shots.filter(s => s.videoMedia && s.videoMedia.base64);
  }, [shots]);
  // Danh sách ID các shot đang được tích chọn (mặc định chọn tất cả khi khởi tạo/mở modal)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => completedShots.map(s => s.id));
  // Khi danh sách completedShots thay đổi hoặc modal mở, đồng bộ lại nếu chưa có lựa chọn
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(completedShots.map(s => s.id));
    }
  }, [isOpen, completedShots]);
  if (!isOpen) return null;
  const toggleShot = (id: string) => {
    if (isMerging) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (isMerging) return;
    if (selectedIds.length === completedShots.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(completedShots.map(s => s.id));
    }
  };
  // Giữ nguyên thứ tự shotNumber của kịch bản
  const selectedShots = completedShots
    .filter(s => selectedIds.includes(s.id))
    .sort((a, b) => a.shotNumber - b.shotNumber);
  const totalDuration = selectedShots.reduce((acc, s) => acc + (Number(s.durationSeconds) || 6), 0);
  const isAllSelected = completedShots.length > 0 && selectedIds.length === completedShots.length;
  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0f0e15] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F31B17]/20 border border-[#F31B17]/40 rounded-2xl flex items-center justify-center text-[#F31B17]">
              <span className="material-symbols-outlined text-2xl">movie_filter</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase italic tracking-tight">
                Chọn Phân Cảnh Để Ghép Phim
              </h2>
              <p className="text-xs text-slate-400">
                Lựa chọn các cảnh bạn muốn nối vào video hoàn chỉnh theo thứ tự kịch bản.
              </p>
            </div>
          </div>
          {!isMerging && (
            <button 
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
        {/* Thanh công cụ: Chọn tất cả + Thống kê */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-1 border-b border-white/5 text-xs">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={isMerging || completedShots.length === 0}
            className="flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-base text-[#F31B17]">
              {isAllSelected ? 'check_box' : selectedIds.length > 0 ? 'indeterminate_check_box' : 'check_box_outline_blank'}
            </span>
            <span>{isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</span>
          </button>
          <div className="flex items-center gap-3 font-medium">
            <span className="text-slate-400">
              Đã chọn: <strong className="text-[#F31B17] font-black">{selectedShots.length}</strong>/{completedShots.length} clips
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="text-slate-400">
              Tổng thời lượng dự kiến: <strong className="text-white font-black">{totalDuration}s</strong>
            </span>
          </div>
        </div>
        {/* Danh sách các Shot có thể chọn */}
        <div className="flex-1 overflow-y-auto custom-scrollbar my-3 pr-1 space-y-2.5">
          {completedShots.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Chưa có phân cảnh nào có video clip hoàn thiện để ghép.
            </div>
          ) : (
            completedShots.map((shot) => {
              const isChecked = selectedIds.includes(shot.id);
              return (
                <div
                  key={shot.id}
                  onClick={() => toggleShot(shot.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-slate-900/90 border-[#F31B17]/60 shadow-lg shadow-[#F31B17]/5'
                      : 'bg-slate-950/40 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="shrink-0">
                    <span className={`material-symbols-outlined text-xl ${isChecked ? 'text-[#F31B17]' : 'text-slate-600'}`}>
                      {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  {/* Thumbnail Clip */}
                  <div className="w-16 h-12 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                    {shot.videoMedia?.url ? (
                      <video 
                        src={shot.videoMedia.url} 
                        className="w-full h-full object-cover" 
                        muted 
                        loop
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-base">movie</span>
                      </div>
                    )}
                  </div>
                  {/* Thông tin Shot */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#F31B17] bg-[#F31B17]/10 px-1.5 py-0.2 rounded border border-[#F31B17]/30">
                        #{shot.shotNumber}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {shot.title || `Cảnh quay ${shot.shotNumber}`}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono ml-auto shrink-0 bg-slate-800/80 px-2 py-0.5 rounded-full">
                        {shot.durationSeconds || 6}s
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {shot.dialogue?.line ? (
                        <span className="italic">"{shot.dialogue.line}"</span>
                      ) : (
                        <span className="text-slate-500">{shot.visualPrompt || 'Không có thoại'}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Thanh tiến trình khi đang ghép video */}
        {isMerging && (
          <div className="mb-4 bg-slate-950 border border-white/10 p-3 rounded-2xl animate-in fade-in space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#F31B17]/20 border-t-[#F31B17] rounded-full animate-spin" />
                Đang chuẩn hóa & ghép {selectedShots.length} cảnh (FPS=30, PTS, Scale)...
              </span>
              <span className="text-[#F31B17] font-black">{Math.round(mergeProgress)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F31B17] transition-all duration-300"
                style={{ width: `${Math.max(5, mergeProgress)}%` }}
              />
            </div>
          </div>
        )}
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isMerging}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-40"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedShots)}
            disabled={isMerging || selectedShots.length < 2}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all active:scale-95 disabled:active:scale-100 ${
              isMerging 
                ? 'bg-[#F31B17]/60 cursor-wait'
                : selectedShots.length < 2
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-[#F31B17] hover:bg-[#d11713] shadow-lg shadow-[#F31B17]/25'
            }`}
          >
            {isMerging && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            <span>
              {isMerging 
                ? `Đang ghép ${Math.round(mergeProgress)}%` 
                : `Bắt đầu Ghép & Tải (${selectedShots.length} cảnh)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}