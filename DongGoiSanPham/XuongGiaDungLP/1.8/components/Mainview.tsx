import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { AspectRatioType, SlotItem } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
interface MainViewProps {
  slots: SlotItem[];
  aspectRatio: AspectRatioType;
  selectedVoiceId?: string;
  onRetrySlot: (slot: SlotItem) => void;
  onGenerateVideoForSlot: (slot: SlotItem) => void;
  onToggleMediaView: (slotId: string) => void;
}
export const MainView: React.FC<MainViewProps> = ({
  slots,
  aspectRatio,
  selectedVoiceId,
  onRetrySlot,
  onGenerateVideoForSlot,
  onToggleMediaView,
}) => {
  const [lightboxSlot, setLightboxSlot] = useState<SlotItem | null>(null);
  const [savedSlotIds, setSavedSlotIds] = useState<Record<string, boolean>>({});
  const [downloadingSlotIds, setDownloadingSlotIds] = useState<Record<string, boolean>>({});
  // Dynamic Aspect Ratio classes
  const aspectClassMap: Record<AspectRatioType, string> = {
    '9:16': 'aspect-[9/16]',
    '4:5': 'aspect-[4/5]',
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
  };
  const gridColsClass =
    aspectRatio === '16:9'
      ? 'grid-cols-1 lg:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  const handleSaveToFlow = async (slot: SlotItem) => {
    if (!slot.media) return;
    try {
      setSavedSlotIds((prev) => ({ ...prev, [slot.id]: true }));
      await Flow.save({
        base64: slot.media.base64,
        mimeType: slot.media.mimeType as 'image/png' | 'image/jpeg',
        name: `Factory_Director_${slot.index + 1}_${slot.cameraAngle}`,
      });
    } catch (e) {
      console.error('Save to Flow failed', e);
      setSavedSlotIds((prev) => ({ ...prev, [slot.id]: false }));
    }
  };
  const handleDownloadSingle = async (slot: SlotItem) => {
    if (!slot.media) return;
    try {
      setDownloadingSlotIds((prev) => ({ ...prev, [slot.id]: true }));
      const isVideoActive = slot.showVideo && slot.videoMedia;
      const targetMedia = isVideoActive ? slot.videoMedia! : slot.media;
      const ext = isVideoActive ? 'mp4' : 'png';
      const cleanName = `Factory_Scene_${slot.index + 1}_${slot.cameraAngle.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
      await Flow.download({
        base64: targetMedia.base64,
        mimeType: targetMedia.mimeType as any,
        filename: cleanName,
      });
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setDownloadingSlotIds((prev) => ({ ...prev, [slot.id]: false }));
    }
  };
  return (
    <main className="h-full flex flex-col bg-[#050505] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {/* Top Banner / Director HUD */}
      <div className="h-12 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-[#08080a] sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-400 text-lg">local_movies</span>
            <span className="text-xs font-bold text-zinc-200 tracking-wider">
              STUDIO PHIM TRƯỜNG KHO VẬN & NHÀ MÁY
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            {aspectRatio}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
            v1.2
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span>TỔNG CẢNH: {slots.length}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400">
            HOÀN THÀNH: {slots.filter((s) => s.status === 'success').length}
          </span>
        </div>
      </div>
      {/* Grid Canvas */}
      <div className="flex-1 p-4 md:p-6">
        {slots.length === 0 ? (
          <div className="h-full min-h-[460px] flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/40 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-black">
              <span className="material-symbols-outlined text-3xl">video_camera_front</span>
            </div>
            <h2 className="text-base font-bold text-zinc-200 tracking-wide mb-1">
              Sẵn sàng Đạo Diễn Cảnh Quay
            </h2>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed mb-6">
              Tải lên ảnh <strong>Người mẫu</strong> & <strong>Sản phẩm</strong> tại cột trái,
              chọn giọng đọc trong <strong>"Matrix 12 Voices"</strong> rồi bấm <strong>"Tạo các cảnh quay"</strong>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                Giữ nguyên chân dung & bao bì
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                Tích hợp Matrix 12 Voices (Omni 1.1)
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-sm">check_circle</span>
                Đa dạng góc máy kho vận thực tế
              </span>
            </div>
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-4 md:gap-5`}>
            {slots.map((slot) => {
              const isSaved = !!savedSlotIds[slot.id];
              const isDownloading = !!downloadingSlotIds[slot.id];
              const slotVoiceId = slot.selectedVoiceId || selectedVoiceId;
              const voiceObj = MATRIX_12_VOICES.find((v) => v.id === slotVoiceId);
              return (
                <div
                  key={slot.id}
                  className={`group relative rounded-xl border transition-all overflow-hidden flex flex-col bg-zinc-900/40 shadow-xl ${
                    slot.status === 'generating'
                      ? 'border-amber-500/70 shadow-amber-500/10'
                      : slot.status === 'error'
                      ? 'border-red-500/50 bg-red-950/10'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {/* Media Frame */}
                  <div
                    className={`relative w-full ${aspectClassMap[aspectRatio]} bg-zinc-950 flex items-center justify-center overflow-hidden`}
                  >
                    {/* Status: Generating */}
                    {slot.status === 'generating' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center bg-zinc-950/90 z-10">
                        <div className="relative">
                          <span className="material-symbols-outlined text-4xl text-amber-400 animate-spin">
                            progress_activity
                          </span>
                          <span className="material-symbols-outlined text-sm text-amber-300 absolute inset-0 m-auto flex items-center justify-center">
                            videocam
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block animate-pulse">
                            Đang Đạo Diễn Cảnh {slot.index + 1}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {slot.cameraAngle}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Status: Pending */}
                    {slot.status === 'pending' && (
                      <div className="flex flex-col items-center justify-center gap-2 text-zinc-600 p-4">
                        <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
                        <span className="text-[11px] font-mono">Đang trong hàng đợi...</span>
                      </div>
                    )}
                    {/* Status: Error */}
                    {slot.status === 'error' && (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <span className="material-symbols-outlined text-3xl text-red-400">
                          error
                        </span>
                        <span className="text-xs font-semibold text-red-300">
                          Không thể tạo cảnh này
                        </span>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 max-w-[200px]">
                          {slot.errorMessage || 'Lỗi kết nối tạo ảnh'}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRetrySlot(slot)}
                          className="mt-2 py-1 px-3 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">refresh</span>
                          Thử lại (Retry)
                        </button>
                      </div>
                    )}
                    {/* Status: Success */}
                    {slot.status === 'success' && slot.media && (
                      <>
                        {slot.showVideo && slot.videoMedia ? (
                          <video
                            src={`data:${slot.videoMedia.mimeType};base64,${slot.videoMedia.base64}`}
                            controls
                            loop
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={`data:${slot.media.mimeType};base64,${slot.media.base64}`}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Top Badge: Camera Angle */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 backdrop-blur border border-zinc-700/80 text-zinc-200 uppercase tracking-wider">
                            #{slot.index + 1} {slot.cameraAngle}
                          </span>
                        </div>
                        {/* Video Available Switch Badge */}
                        {slot.videoMedia && (
                          <button
                            type="button"
                            onClick={() => onToggleMediaView(slot.id)}
                            className="absolute top-2 right-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-black flex items-center gap-1 shadow-md hover:bg-amber-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {slot.showVideo ? 'photo' : 'movie'}
                            </span>
                            {slot.showVideo ? 'Xem Ảnh' : 'Xem Video'}
                          </button>
                        )}
                        {/* Video Generating Overlay */}
                        {slot.videoStatus === 'generating' && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                            <span className="material-symbols-outlined text-3xl text-amber-400 animate-spin">
                              sync
                            </span>
                            <span className="text-[11px] font-bold text-amber-300">
                              Đang tạo Video (Omni 1.1 + Voice)...
                            </span>
                          </div>
                        )}
                        {/* Hover Overlay Toolbar */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-3 gap-2 z-10">
                          {/* Top Quick Actions */}
                          <div className="flex items-center justify-center gap-2">
                            {/* Make Video Button */}
                            {!slot.videoMedia && slot.videoStatus !== 'generating' && (
                              <button
                                type="button"
                                onClick={() => onGenerateVideoForSlot(slot)}
                                className="py-1.5 px-3 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-[11px] font-bold flex items-center gap-1 shadow-lg active:scale-95 transition-all"
                                title="Tạo chuyển động video điện ảnh 4s kèm thông số Voice"
                              >
                                <span className="material-symbols-outlined text-[15px]">movie</span>
                                Tạo Video
                              </button>
                            )}
                          </div>
                          {/* Secondary Utility Controls */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => setLightboxSlot(slot)}
                              className="p-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                              title="Phóng to ảnh"
                            >
                              <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                            </button>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveToFlow(slot)}
                                className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                                  isSaved
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                                }`}
                                title="Lưu vào thư viện Flow"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isSaved ? 'check' : 'bookmark'}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadSingle(slot)}
                                disabled={isDownloading}
                                className="p-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                                title="Tải xuống máy"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isDownloading ? 'sync' : 'download'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Scene Card Voice & Acoustic Info Footer */}
                  {voiceObj && (
                    <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/80 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${voiceObj.badgeColor}`}
                        >
                          {voiceObj.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {voiceObj.subLabel}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-400 font-mono line-clamp-1">
                        Acoustic: {voiceObj.acousticProfile}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Lightbox Modal */}
      {lightboxSlot && lightboxSlot.media && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxSlot(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-2 text-zinc-300 text-xs">
              <span className="font-bold uppercase tracking-wider text-amber-400">
                Cảnh #{lightboxSlot.index + 1}: {lightboxSlot.cameraAngle}
              </span>
              <button
                type="button"
                onClick={() => setLightboxSlot(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {lightboxSlot.showVideo && lightboxSlot.videoMedia ? (
              <video
                src={`data:${lightboxSlot.videoMedia.mimeType};base64,${lightboxSlot.videoMedia.base64}`}
                controls
                autoPlay
                loop
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-zinc-800"
              />
            ) : (
              <img
                src={`data:${lightboxSlot.media.mimeType};base64,${lightboxSlot.media.base64}`}
                alt={lightboxSlot.label}
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-zinc-800 object-contain"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
};