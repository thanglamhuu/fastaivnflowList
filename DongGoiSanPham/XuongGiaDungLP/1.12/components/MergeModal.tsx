import React, { useState, useMemo } from 'react';
import { Flow } from 'flow-sdk';
import { SceneData } from '../types';
import { mergeScenesToFullVideo, MergeProgressInfo } from '../services/videoMerger';
interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: SceneData[];
  projectName: string;
}
export const MergeModal: React.FC<MergeModalProps> = ({
  isOpen,
  onClose,
  scenes,
  projectName,
}) => {
  // Lọc các phân cảnh đã có clip video
  const availableScenes = useMemo(() => {
    return scenes.filter((s) => !!s.videoMedia?.base64);
  }, [scenes]);
  // Trạng thái tích chọn các phân cảnh (mặc định chọn tất cả phân cảnh đã có clip)
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    scenes.forEach((s) => {
      if (s.videoMedia?.base64) {
        init[s.id] = true;
      }
    });
    return init;
  });
  // Trạng thái xử lý ghép nối
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<MergeProgressInfo | null>(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedBase64, setMergedBase64] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloadingFallback, setIsDownloadingFallback] = useState<boolean>(false);
  if (!isOpen) return null;
  // Danh sách các cảnh được tích chọn theo đúng thứ tự kịch bản
  const activeSelectedScenes = availableScenes.filter((s) => selectedIds[s.id]);
  const totalDurationEstimate = activeSelectedScenes.length * 8; // mỗi cảnh Omni 8s
  const isAllSelected =
    availableScenes.length > 0 &&
    availableScenes.every((s) => selectedIds[s.id]);
  // Chọn / Bỏ chọn tất cả
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds({});
    } else {
      const all: Record<string, boolean> = {};
      availableScenes.forEach((s) => {
        all[s.id] = true;
      });
      setSelectedIds(all);
    }
  };
  const handleToggleScene = (id: string) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  // Làm sạch tên file không chứa ký tự đặc biệt
  const getCleanFileName = () => {
    const cleanProject = (projectName || 'Video_Affiliate_Production')
      .replace(/\.[^.]*$/, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 35);
    return `${cleanProject || 'Movie'}_Full.mp4`;
  };
  // Bắt đầu ghép nối qua FFmpeg
  const handleStartMerge = async () => {
    if (activeSelectedScenes.length < 2) {
      alert('Vui lòng chọn tối thiểu từ 2 phân cảnh trở lên để ghép thành phim.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    setMergedBlobUrl(null);
    setMergedBase64(null);
    try {
      const uint8Array = await mergeScenesToFullVideo(
        activeSelectedScenes,
        (info) => {
          setProgressInfo(info);
        }
      );
      // Tạo Blob & Data URL an toàn không dùng btoa kích thước lớn
      const blob = new Blob([uint8Array.buffer], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);
      setMergedBlobUrl(blobUrl);
      // Chuyển sang base64 an toàn qua FileReader để chuẩn bị tải / lưu
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        const b64 = resultString.split(',')[1];
        setMergedBase64(b64);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Lỗi quy trình ghép FFmpeg:', err);
      setErrorMsg(
        err?.message ||
          'Không thể hoàn thành ghép video. Thiết bị có thể bị giới hạn bộ nhớ WebAssembly.'
      );
    } finally {
      setIsProcessing(false);
    }
  };
  // Tải file ghép hoàn chỉnh về máy
  const handleDownloadMerged = async () => {
    if (!mergedBase64) return;
    try {
      await Flow.download({
        base64: mergedBase64,
        mimeType: 'video/mp4',
        filename: getCleanFileName(),
      });
    } catch (err: any) {
      console.error('Lỗi khi tải file qua Flow.download:', err);
      alert('Tải file thất bại: ' + (err?.message || 'Lỗi không xác định'));
    }
  };
  // Lưu file video hoàn chỉnh vào Media Gallery của Flow
  const handleSaveToGallery = async () => {
    if (!mergedBase64) return;
    try {
      await Flow.save({
        base64: mergedBase64,
        mimeType: 'video/mp4',
        name: getCleanFileName().replace('.mp4', ''),
      });
      alert('Đã lưu thành công video hoàn chỉnh vào Thư viện Flow!');
    } catch (err: any) {
      console.error('Lưu vào Gallery thất bại:', err);
      alert('Không thể lưu vào thư viện: ' + (err?.message || 'Lỗi'));
    }
  };
  // Cơ chế dự phòng an toàn (Fallback): Tải lần lượt từng clip thành phần
  const handleDownloadFallback = async () => {
    setIsDownloadingFallback(true);
    try {
      for (let i = 0; i < activeSelectedScenes.length; i++) {
        const sc = activeSelectedScenes[i];
        if (sc.videoMedia?.base64) {
          const partName = `${sc.id}_Part_${i + 1}_${sc.stageName.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
          await Flow.download({
            base64: sc.videoMedia.base64,
            mimeType: 'video/mp4',
            filename: partName,
          });
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải dự phòng:', err);
    } finally {
      setIsDownloadingFallback(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1017] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#12141d] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F31B17] flex items-center justify-center text-white font-black shadow-lg shadow-red-950/40">
              <span className="material-symbols-outlined text-2xl">movie_filter</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide uppercase">
                  Ghép & Tải Video (Video Merge & Export)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F31B17]/20 text-red-200 border border-[#F31B17]/40">
                  FFMPEG WASM ENGINE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Chuẩn hóa tỷ lệ khung hình 9:16 (720x1280), đồng bộ 30fps, reset PTS và khử lỗi đứng hình hoàn toàn trực tiếp trên trình duyệt.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        {/* Thống kê thời gian thực & Quick Controls */}
        <div className="px-6 py-3 bg-[#151824] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-700/80">
              <span className="text-zinc-400">Số clip được chọn:</span>
              <span className="font-mono font-bold text-[#F31B17] text-sm">
                {activeSelectedScenes.length} / {availableScenes.length} clip
              </span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-700/80">
              <span className="text-zinc-400">Thời lượng dự kiến:</span>
              <span className="font-mono font-bold text-white text-sm">
                ~{totalDurationEstimate} giây ({Math.floor(totalDurationEstimate / 60)}m{totalDurationEstimate % 60}s)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#F31B17] animate-pulse"></span>
              Độ phân giải: 720x1280 (HD 9:16 Lanczos)
            </div>
          </div>
          {/* Nút Chọn Nhanh: Chọn tất cả / Bỏ chọn */}
          <button
            type="button"
            onClick={handleToggleSelectAll}
            disabled={isProcessing}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-[#F31B17]">
              {isAllSelected ? 'check_box' : 'check_box_outline_blank'}
            </span>
            {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả (Select All)'}
          </button>
        </div>
        {/* Nội dung chính Modal: Danh sách phân cảnh và Kết quả */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Cảnh báo lỗi & Khuyến nghị */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-[#F31B17]">
                <span className="material-symbols-outlined">error</span>
                Gặp sự cố khi ghép nối tự động
              </div>
              <p className="text-zinc-300 leading-relaxed">{errorMsg}</p>
              <div className="pt-2 border-t border-red-500/20 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Bạn có thể sử dụng chế độ dự phòng an toàn để tải về các clip thành phần:
                </span>
                <button
                  type="button"
                  onClick={handleDownloadFallback}
                  disabled={isDownloadingFallback}
                  className="px-3 py-1.5 rounded-lg bg-[#F31B17] hover:bg-[#d11713] text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  {isDownloadingFallback ? 'Đang tải lần lượt...' : 'Tải lần lượt các clip'}
                </button>
              </div>
            </div>
          )}
          {/* Khi đã ghép thành công: Hiển thị Khung phát video hoàn chỉnh */}
          {mergedBlobUrl && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-[#F31B17]/50 flex flex-col md:flex-row items-center gap-5">
              <div className="w-36 aspect-[9/16] rounded-lg overflow-hidden border-2 border-[#F31B17] shadow-xl bg-black shrink-0">
                <video
                  src={mergedBlobUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                  <span className="material-symbols-outlined text-[#F31B17]">check_circle</span>
                  Video Đã Ghép Hoàn Chỉnh Thành Công!
                </div>
                <p className="text-xs text-zinc-300">
                  Tên file: <code className="text-red-200 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">{getCleanFileName()}</code>
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Video đã được xử lý mượt mà, đồng bộ luồng âm thanh 192kbps AAC, chuẩn tỷ lệ 9:16 và tích hợp cờ <span className="text-[#F31B17] font-mono">faststart</span> sẵn sàng đăng ngay lên TikTok / Facebook Reels / YouTube Shorts.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadMerged}
                    className="px-4 py-2 rounded-lg bg-[#F31B17] hover:bg-[#d11713] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Tải Phim Về Máy (.mp4)
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToGallery}
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark</span>
                    Lưu vào Thư viện Flow
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Thanh Tiến Trình FFmpeg (Progress Bar) khi đang render - Áp dụng #F31B17 */}
          {isProcessing && progressInfo && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-[#F31B17]/40 space-y-2.5 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F31B17] flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  {progressInfo.stage}
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {progressInfo.percent}%
                </span>
              </div>
              {/* Progress Track với màu chính #F31B17 */}
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-[#F31B17] to-red-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressInfo.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>{progressInfo.detail}</span>
                <span className="text-zinc-500">Bộ nhớ ảo WebAssembly</span>
              </div>
            </div>
          )}
          {/* Danh Sách Các Phân Cảnh Để Tích Chọn */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F31B17] text-[16px]">format_list_bulleted</span>
              Danh Sách Phân Cảnh Video Trong Kịch Bản
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableScenes.map((sc) => {
                const isSelected = !!selectedIds[sc.id];
                return (
                  <div
                    key={sc.id}
                    onClick={() => !isProcessing && handleToggleScene(sc.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#F31B17]/80 bg-zinc-900/90 shadow-md ring-1 ring-[#F31B17]/30'
                        : 'border-zinc-800 bg-zinc-950/60 opacity-60 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center shrink-0">
                      <span
                        className={`material-symbols-outlined text-2xl transition-colors ${
                          isSelected ? 'text-[#F31B17]' : 'text-zinc-600'
                        }`}
                      >
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                    {/* Thumbnail video clip */}
                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-black border border-zinc-700 shrink-0 relative group">
                      <video
                        src={`data:${sc.videoMedia!.mimeType};base64,${sc.videoMedia!.base64}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-mono text-red-200">
                        8s
                      </div>
                    </div>
                    {/* Chi tiết kịch bản */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black text-[#F31B17] uppercase">
                          #{sc.label}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {sc.wordCount} từ thoại
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 truncate">
                        {sc.stageName}
                      </h4>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 italic leading-relaxed">
                        "{sc.dialogue}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#12141d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadFallback}
              disabled={isProcessing || isDownloadingFallback || activeSelectedScenes.length === 0}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              title="Tải lần lượt từng clip riêng rẽ nếu máy yếu không đủ RAM chạy FFmpeg"
            >
              <span className="material-symbols-outlined text-[16px] text-[#F31B17]">file_download</span>
              {isDownloadingFallback ? 'Đang tải từng clip...' : 'Cơ chế dự phòng: Tải từng clip'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all disabled:opacity-50"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleStartMerge}
              disabled={isProcessing || activeSelectedScenes.length < 2}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                activeSelectedScenes.length >= 2 && !isProcessing
                  ? 'bg-[#F31B17] hover:bg-[#d11713] text-white shadow-red-950/40 active:scale-95 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'sync' : 'auto_fix_high'}
              </span>
              <span>
                {isProcessing
                  ? 'Đang ghép nối các clip...'
                  : `Bắt Đầu Ghép Nối (${activeSelectedScenes.length} Cảnh)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};