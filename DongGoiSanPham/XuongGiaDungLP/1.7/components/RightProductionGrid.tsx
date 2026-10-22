import React from 'react';
import { Flow } from 'flow-sdk';
import { SceneData } from '../types';
interface RightProductionGridProps {
  scenes: SceneData[];
  onUpdateSceneDialogue: (sceneId: string, dialogue: string) => void;
  onUpdateScenePrompt: (sceneId: string, prompt: string) => void;
  onToggleCustomPrompt: (sceneId: string) => void;
  onRenderSingleScene: (scene: SceneData) => void;
  onOpenZoomMedia: (media: any, type: 'image' | 'video', title: string, subtitle?: string, dialogue?: string) => void;
  isRenderingVideos: boolean;
  selectedVoiceId?: string;
  hasInputImages: boolean;
}
export const RightProductionGrid: React.FC<RightProductionGridProps> = ({
  scenes,
  onUpdateSceneDialogue,
  onUpdateScenePrompt,
  onToggleCustomPrompt,
  onRenderSingleScene,
  onOpenZoomMedia,
  isRenderingVideos,
  hasInputImages,
}) => {
  const completedCount = scenes.filter((s) => s.videoMedia).length;
  // Tải riêng video của cảnh đó
  const handleDownloadSceneVideo = async (scene: SceneData) => {
    if (!scene.videoMedia) return;
    try {
      await Flow.download({
        base64: scene.videoMedia.base64,
        mimeType: 'video/mp4',
        filename: `${scene.id}_commercial_8s.mp4`,
      });
    } catch (e) {
      console.error('Tải video thất bại', e);
    }
  };
  return (
    <section className="flex-1 flex flex-col h-full bg-[#07080c] select-none overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
      {/* Header khu vực sản xuất */}
      <div className="h-12 border-b border-zinc-800/80 px-5 flex items-center justify-between bg-[#0b0c12] sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-base">dashboard_customize</span>
          <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase">
            Khu Vực Sản Xuất & Preview 4 Cảnh
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            R2V ĐA ẢNH (KHOÁ MẪU & SP)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Render tối đa: 2 cảnh song song
          </span>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {completedCount}/4 cảnh đã xong video
          </span>
        </div>
      </div>
      {/* Lưới 4 Phân Cảnh (2x2 grid đáp ứng rộng rãi, tích hợp Preview trực tiếp) */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {scenes.map((sc) => {
          const isDone = !!sc.videoMedia;
          const isRendering = sc.status === 'generating_video';
          const isImageGen = sc.status === 'generating_image';
          return (
            <div
              key={sc.id}
              className={`rounded-2xl border flex flex-col justify-between bg-zinc-950 p-4 transition-all relative shadow-xl ${
                isRendering
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : isDone
                  ? 'border-emerald-500/50 bg-[#0c120e]/90'
                  : 'border-zinc-800/90 hover:border-zinc-700 bg-zinc-950/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header Thẻ: SCENE, Tiêu đề cảnh & Badge trạng thái */}
                <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                  <div>
                    <span className="text-[11px] font-mono font-black text-amber-400 block tracking-wider">
                      {sc.label}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-100 leading-snug">
                      {sc.stageName}
                    </h3>
                  </div>
                  <div>
                    {isRendering ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] animate-spin">sync</span>
                        Đang render R2V...
                      </span>
                    ) : isDone ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">check_circle</span>
                        ✓ Video sẵn sàng
                      </span>
                    ) : isImageGen ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] animate-spin">sync</span>
                        Đang tạo ảnh...
                      </span>
                    ) : sc.keyframeMedia ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        Đã có ảnh mẫu
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                        Chờ tạo
                      </span>
                    )}
                  </div>
                </div>
                {/* KHU VỰC PREVIEW TRỰC TIẾP TÍCH HỢP TRONG SCENE CARD */}
                <div className="bg-[#0b0d13] rounded-xl p-2.5 border border-zinc-800/80 flex gap-3">
                  {/* Thumbnail Ảnh Keyframe */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">
                      1. Ảnh Keyframe
                    </span>
                    <div
                      onClick={() => {
                        if (sc.keyframeMedia) {
                          onOpenZoomMedia(sc.keyframeMedia, 'image', `${sc.label} - Keyframe`, sc.stageName, sc.dialogue);
                        }
                      }}
                      className={`w-16 h-24 rounded-lg overflow-hidden border relative flex items-center justify-center transition-all ${
                        sc.keyframeMedia
                          ? 'border-amber-500/50 hover:border-amber-400 cursor-pointer shadow-md group'
                          : 'border-dashed border-zinc-800 bg-zinc-900/60'
                      }`}
                      title={sc.keyframeMedia ? 'Nhấp để phóng to ảnh Keyframe' : 'Chưa có ảnh'}
                    >
                      {sc.keyframeMedia ? (
                        <>
                          <img
                            src={`data:${sc.keyframeMedia.mimeType};base64,${sc.keyframeMedia.base64}`}
                            alt={sc.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="material-symbols-outlined text-white text-[16px]">zoom_in</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-600 gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">image</span>
                          <span className="text-[8px]">Chờ ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Thumbnail Video Đã Render */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">
                      2. Video R2V (8s)
                    </span>
                    <div
                      onClick={() => {
                        if (sc.videoMedia) {
                          onOpenZoomMedia(sc.videoMedia, 'video', `${sc.label} - Video 8s`, sc.stageName, sc.dialogue);
                        }
                      }}
                      className={`w-16 h-24 rounded-lg overflow-hidden border relative flex items-center justify-center transition-all ${
                        sc.videoMedia
                          ? 'border-emerald-500/70 hover:border-emerald-400 cursor-pointer shadow-md group'
                          : 'border-dashed border-zinc-800 bg-zinc-900/60'
                      }`}
                      title={sc.videoMedia ? 'Nhấp để phóng to và phát video có tiếng' : 'Chưa có video'}
                    >
                      {sc.videoMedia ? (
                        <>
                          <video
                            src={`data:${sc.videoMedia.mimeType};base64,${sc.videoMedia.base64}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[7px] font-mono text-emerald-400 font-bold">
                            8s
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="material-symbols-outlined text-white text-[18px]">play_circle</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-600 gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">movie</span>
                          <span className="text-[8px]">Chờ render</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Thông tin trạng thái */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-400 leading-tight">
                        {sc.videoMedia
                          ? 'Clip video 8s đã hoàn tất. Có âm thanh & giọng đọc đồng bộ.'
                          : sc.keyframeMedia
                          ? 'Ảnh mẫu đã tạo. Bấm render để AI khoá người & sản phẩm tạo clip.'
                          : 'Chưa có dữ liệu. Hãy tạo ảnh hoặc render trực tiếp.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {sc.videoMedia && (
                        <button
                          type="button"
                          onClick={() => onOpenZoomMedia(sc.videoMedia, 'video', `${sc.label} - Video 8s`, sc.stageName, sc.dialogue)}
                          className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">fullscreen</span>
                          Xem to video
                        </button>
                      )}
                      {sc.keyframeMedia && (
                        <button
                          type="button"
                          onClick={() => onOpenZoomMedia(sc.keyframeMedia, 'image', `${sc.label} - Keyframe`, sc.stageName, sc.dialogue)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">zoom_in</span>
                          Xem ảnh
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Lời thoại kịch bản (Đã ẩn nút Nghe thoại theo yêu cầu) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider text-zinc-300">
                      <span>🗣️</span> Lời thoại kịch bản
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={sc.dialogue}
                    placeholder="Nhập lời thoại hoặc nhấn '📄 Tạo Kịch Bản'..."
                    onChange={(e) => onUpdateSceneDialogue(sc.id, e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed placeholder:text-zinc-600"
                  />
                </div>
                {/* Chỉnh visual prompt */}
                <div>
                  <button
                    type="button"
                    onClick={() => onToggleCustomPrompt(sc.id)}
                    className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px] text-amber-400">tune</span>
                    {sc.showCustomPrompt ? 'Ẩn Visual Prompt' : '✏️ Chỉnh prompt hành động'}
                  </button>
                  {sc.showCustomPrompt && (
                    <textarea
                      rows={2}
                      value={sc.actionPrompt}
                      onChange={(e) => onUpdateScenePrompt(sc.id, e.target.value)}
                      placeholder="Mô tả hành động của người mẫu (tiếng Anh)..."
                      className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded p-1.5 text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-mono"
                    />
                  )}
                </div>
              </div>
              {/* Footer thẻ: Đếm từ thoại & Các nút hành động */}
              <div className="pt-3 mt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Số lượng từ:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span
                      className={`font-bold ${
                        sc.wordCount >= 22 && sc.wordCount <= 28
                          ? 'text-emerald-400'
                          : sc.wordCount > 0
                          ? 'text-amber-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {sc.wordCount} từ
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      {sc.wordCount >= 22 && sc.wordCount <= 28 ? '(✓ Chuẩn 8s)' : '(Khuyên dùng 22-28 từ)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sc.videoMedia && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSceneVideo(sc)}
                      className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Tải video của cảnh này về máy"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      ⬇️ Tải
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRenderSingleScene(sc)}
                    disabled={isRendering || isRenderingVideos || !hasInputImages}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      hasInputImages && !isRendering
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95 cursor-pointer'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isRendering ? 'animate-spin' : ''}`}>
                      {isRendering ? 'sync' : isDone ? 'refresh' : 'movie_filter'}
                    </span>
                    {isDone ? '🔄 Render lại R2V' : '🎬 Render R2V Cảnh Này'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};