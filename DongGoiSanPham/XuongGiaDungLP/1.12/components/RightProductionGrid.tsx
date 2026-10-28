import React from 'react';
import { Flow } from 'flow-sdk';
import { SceneData } from '../types';
interface RightProductionGridProps {
  scenes: SceneData[];
  onUpdateSceneDialogue: (sceneId: string, dialogue: string) => void;
  onUpdateScenePrompt: (sceneId: string, prompt: string) => void;
  onToggleCustomPrompt: (sceneId: string) => void;
  onRenderSingleScene: (scene: SceneData) => void;
  onGenerateSingleImage?: (scene: SceneData) => void;
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
  onGenerateSingleImage,
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
      <div className="h-11 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-[#0b0c12] sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#F31B17] text-base">dashboard_customize</span>
          <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase">
            Khu Vực Sản Xuất & Preview 4 Cảnh
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F31B17]/15 text-[#F31B17] border border-[#F31B17]/30">
            ƯU TIÊN ẢNH CARD SCENE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
            Render tối đa: 2 cảnh song song
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F31B17]/15 text-red-300 border border-[#F31B17]/30">
            {completedCount}/4 cảnh đã xong video
          </span>
        </div>
      </div>
      {/* Lưới 4 Phân Cảnh */}
      <div className="p-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1">
        {scenes.map((sc) => {
          const isDone = !!sc.videoMedia;
          const isRendering = sc.status === 'generating_video';
          const isImageGen = sc.status === 'generating_image';
          const isOptimalWords = sc.wordCount >= 20 && sc.wordCount <= 25;
          const canRenderVideoThisCard = !!sc.keyframeMedia || hasInputImages;
          return (
            <div
              key={sc.id}
              className={`rounded-xl border flex flex-col justify-between bg-zinc-950 p-2.5 transition-all relative shadow-lg ${
                isRendering
                  ? 'border-[#F31B17] ring-1 ring-[#F31B17]/30'
                  : isDone
                  ? 'border-[#F31B17]/50 bg-[#120a0a]/90'
                  : 'border-zinc-800/90 hover:border-zinc-700 bg-zinc-950/80'
              }`}
            >
              <div className="space-y-2">
                {/* Header Thẻ: Tiêu đề giai đoạn và Badge trạng thái */}
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-1.5">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-100 leading-snug">
                      {sc.stageName}
                    </h3>
                  </div>
                  <div>
                    {isRendering ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F31B17]/20 text-red-300 border border-[#F31B17]/40 animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] animate-spin text-[#F31B17]">sync</span>
                        Đang tạo video...
                      </span>
                    ) : isDone ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F31B17]/20 text-red-200 border border-[#F31B17]/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] text-[#F31B17]">check_circle</span>
                        ✓ Video sẵn sàng
                      </span>
                    ) : isImageGen ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-red-200 border border-[#F31B17]/30 animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] animate-spin text-[#F31B17]">sync</span>
                        Đang tạo ảnh...
                      </span>
                    ) : sc.keyframeMedia ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        Đã có ảnh card
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                        Chờ tạo
                      </span>
                    )}
                  </div>
                </div>
                {/* KHU VỰC PREVIEW TRỰC TIẾP TÍCH HỢP TRONG SCENE CARD */}
                <div className="bg-[#0b0d13] rounded-lg p-2 border border-zinc-800/80 flex gap-2.5">
                  {/* Thumbnail Ảnh Keyframe - Click trực tiếp vào để xem to */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">
                      1. Ảnh Keyframe
                    </span>
                    <div
                      onClick={() => {
                        if (sc.keyframeMedia) {
                          onOpenZoomMedia(sc.keyframeMedia, 'image', `${sc.stageName} - Keyframe`, sc.stageName, sc.dialogue);
                        }
                      }}
                      className={`w-14 h-20 rounded-md overflow-hidden border relative flex items-center justify-center transition-all ${
                        sc.keyframeMedia
                          ? 'border-[#F31B17]/50 hover:border-[#F31B17] cursor-pointer shadow group'
                          : 'border-dashed border-zinc-800 bg-zinc-900/60'
                      }`}
                      title={sc.keyframeMedia ? 'Nhấp để xem to ảnh Keyframe' : 'Chưa có ảnh'}
                    >
                      {sc.keyframeMedia ? (
                        <>
                          <img
                            src={`data:${sc.keyframeMedia.mimeType};base64,${sc.keyframeMedia.base64}`}
                            alt={sc.stageName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="material-symbols-outlined text-white text-[15px]">zoom_in</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-600 gap-0.5">
                          <span className="material-symbols-outlined text-[15px] text-zinc-500">image</span>
                          <span className="text-[8px]">Chờ ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Thumbnail Video Đã Render - Click trực tiếp vào để xem to */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">
                      2. Video (8s)
                    </span>
                    <div
                      onClick={() => {
                        if (sc.videoMedia) {
                          onOpenZoomMedia(sc.videoMedia, 'video', `${sc.stageName} - Video 8s`, sc.stageName, sc.dialogue);
                        }
                      }}
                      className={`w-14 h-20 rounded-md overflow-hidden border relative flex items-center justify-center transition-all ${
                        sc.videoMedia
                          ? 'border-[#F31B17]/70 hover:border-[#F31B17] cursor-pointer shadow group'
                          : 'border-dashed border-zinc-800 bg-zinc-900/60'
                      }`}
                      title={sc.videoMedia ? 'Nhấp để xem to và phát video có tiếng' : 'Chưa có video'}
                    >
                      {sc.videoMedia ? (
                        <>
                          <video
                            src={`data:${sc.videoMedia.mimeType};base64,${sc.videoMedia.base64}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0.5 right-0.5 px-0.5 rounded bg-black/80 text-[7px] font-mono text-[#F31B17] font-bold">
                            8s
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="material-symbols-outlined text-white text-[16px]">play_circle</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-600 gap-0.5">
                          <span className="material-symbols-outlined text-[15px] text-zinc-500">movie</span>
                          <span className="text-[8px]">Chờ render</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* VỊ TRÍ HÀNG NÚT THAO TÁC */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-400 leading-tight">
                        {sc.videoMedia
                          ? 'Clip video 8s đã hoàn tất. Nhấp thumb để xem to.'
                          : sc.keyframeMedia
                          ? 'Đã có ảnh card. Bấm Tạo video để sinh clip từ ảnh này.'
                          : 'Chưa có dữ liệu. Bấm Tạo ảnh hoặc Tạo video trực tiếp.'}
                      </p>
                    </div>
                    {/* HÀNG CÁC NÚT TẢI, TẠO ẢNH, TẠO VIDEO */}
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      {/* 1. Nút Tải Video (nếu đã có video) */}
                      {sc.videoMedia && (
                        <button
                          type="button"
                          onClick={() => handleDownloadSceneVideo(sc)}
                          className="py-1 px-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer border border-zinc-700 hover:border-zinc-500 shrink-0"
                          title="Tải video của cảnh này về máy"
                        >
                          <span className="material-symbols-outlined text-[13px] text-[#F31B17]">download</span>
                          Tải
                        </button>
                      )}
                      {/* 2. Nút Tạo ảnh riêng cho cảnh này */}
                      {onGenerateSingleImage && (
                        <button
                          type="button"
                          onClick={() => onGenerateSingleImage(sc)}
                          disabled={isImageGen || isRendering || !hasInputImages}
                          className="py-1 px-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium flex items-center gap-1 transition-all border border-zinc-700 hover:border-[#F31B17] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                          title="Tạo riêng ảnh Keyframe cho cảnh này"
                        >
                          <span className={`material-symbols-outlined text-[12px] text-[#F31B17] ${isImageGen ? 'animate-spin' : ''}`}>
                            {isImageGen ? 'sync' : 'auto_awesome'}
                          </span>
                          <span>{isImageGen ? 'Đang tạo...' : 'Tạo ảnh'}</span>
                        </button>
                      )}
                      {/* 3. Nút Tạo video: Ưu tiên ảnh card nếu đã có ảnh */}
                      <button
                        type="button"
                        onClick={() => onRenderSingleScene(sc)}
                        disabled={isRendering || isRenderingVideos || !canRenderVideoThisCard}
                        className={`flex-1 min-w-[76px] py-1 px-2.5 rounded-md text-[11px] font-bold text-center transition-all shadow-sm ${
                          canRenderVideoThisCard && !isRendering
                            ? 'bg-[#F31B17] hover:bg-[#d11713] text-white active:scale-95 cursor-pointer shadow shadow-red-950/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        }`}
                        title={sc.keyframeMedia ? 'Tạo video 8s trực tiếp từ ảnh của card này' : 'Tạo video 8s cho cảnh này'}
                      >
                        {isRendering ? 'Đang tạo...' : 'Tạo video'}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Lời thoại kịch bản */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider text-zinc-300">
                      <span>🗣️</span> Lời thoại kịch bản
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={sc.dialogue}
                    placeholder="Nhập lời thoại hoặc nhấn 'Tạo Kịch Bản'..."
                    onChange={(e) => onUpdateSceneDialogue(sc.id, e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md p-1.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] resize-none leading-relaxed placeholder:text-zinc-600"
                  />
                </div>
                {/* Chỉnh visual prompt */}
                <div>
                  <button
                    type="button"
                    onClick={() => onToggleCustomPrompt(sc.id)}
                    className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#F31B17]">tune</span>
                    {sc.showCustomPrompt ? 'Ẩn Visual Prompt' : 'Chỉnh prompt hành động'}
                  </button>
                  {sc.showCustomPrompt && (
                    <textarea
                      rows={2}
                      value={sc.actionPrompt}
                      onChange={(e) => onUpdateScenePrompt(sc.id, e.target.value)}
                      placeholder="Mô tả hành động của người mẫu (tiếng Anh)..."
                      className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded p-1 text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#F31B17] resize-none font-mono"
                    />
                  )}
                </div>
              </div>
              {/* Footer thẻ */}
              <div className="pt-1.5 mt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                <span className="text-zinc-400">Số lượng từ:</span>
                <div className="flex items-center gap-1 font-mono">
                  <span
                    className={`font-bold ${
                      isOptimalWords
                        ? 'text-[#F31B17]'
                        : sc.wordCount > 0
                        ? 'text-amber-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {sc.wordCount} từ
                  </span>
                  <span className="text-zinc-500 text-[9px]">
                    {isOptimalWords ? '(✓ Chuẩn 8s)' : '(Khuyên dùng 20-25 từ)'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};