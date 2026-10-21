import React from 'react';
import { Flow } from 'flow-sdk';
import { SceneData } from '../types';
interface RightProductionGridProps {
  scenes: SceneData[];
  onUpdateSceneDialogue: (sceneId: string, dialogue: string) => void;
  onUpdateScenePrompt: (sceneId: string, prompt: string) => void;
  onToggleCustomPrompt: (sceneId: string) => void;
  onRenderSingleScene: (scene: SceneData) => void;
  onSelectMasterScene: (index: number) => void;
  isRenderingVideos: boolean;
}
export const RightProductionGrid: React.FC<RightProductionGridProps> = ({
  scenes,
  onUpdateSceneDialogue,
  onUpdateScenePrompt,
  onToggleCustomPrompt,
  onRenderSingleScene,
  onSelectMasterScene,
  isRenderingVideos,
}) => {
  const completedCount = scenes.filter((s) => s.videoMedia).length;
  // Đọc thử lời thoại tiếng Việt bằng Web Speech API
  const handleSpeakDialogue = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ tổng hợp giọng nói trực tiếp.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };
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
    <section className="w-[500px] shrink-0 flex flex-col h-full bg-[#0a0b10] select-none overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
      {/* Header phụ */}
      <div className="h-10 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-[#0d0e14] sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-sm">dashboard</span>
          <span className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
            Khu Vực Sản Xuất (Lưới 2x2)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Song song tối đa: 2 cảnh
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {completedCount}/4 cảnh đã xong
          </span>
        </div>
      </div>
      {/* Lưới 2x2 hiển thị 4 Scene Card */}
      <div className="p-3 grid grid-cols-2 gap-3 flex-1">
        {scenes.map((sc, index) => {
          const isDone = !!sc.videoMedia;
          const isRendering = sc.status === 'generating_video';
          const isImageGen = sc.status === 'generating_image';
          return (
            <div
              key={sc.id}
              className={`rounded-xl border flex flex-col justify-between bg-zinc-950 p-3 transition-all relative shadow-lg ${
                isRendering
                  ? 'border-amber-500/80 ring-1 ring-amber-500/50'
                  : isDone
                  ? 'border-emerald-500/40 bg-[#0c120e]'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                {/* Header Thẻ: Mã SCENE_X, Tiêu đề cảnh & Badge trạng thái */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-400 block">
                      {sc.label}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-200 leading-snug">
                      {sc.stageName}
                    </h3>
                  </div>
                  {/* Badge trạng thái */}
                  <div>
                    {isRendering ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] animate-spin">sync</span>
                        Đang render...
                      </span>
                    ) : isDone ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">check</span>
                        ✓ Thành công
                      </span>
                    ) : isImageGen ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
                        Đang tạo ảnh...
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        Chờ tạo
                      </span>
                    )}
                  </div>
                </div>
                {/* Khu vực 🗣️ LỜI THOẠI KỊCH BẢN */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider text-zinc-300">
                      <span>🗣️</span> Lời thoại kịch bản
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakDialogue(sc.dialogue)}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                      title="Nghe thử giọng đọc trực tiếp trên trình duyệt"
                    >
                      <span className="material-symbols-outlined text-[12px]">volume_up</span>
                      Nghe thoại
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={sc.dialogue}
                    onChange={(e) => onUpdateSceneDialogue(sc.id, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-md p-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
                  />
                </div>
                {/* Nút ✏️ Chỉnh prompt */}
                <div className="mb-2">
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
                      placeholder="Mô tả hành động của người mẫu (bằng tiếng Anh)..."
                      className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded p-1.5 text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-mono"
                    />
                  )}
                </div>
              </div>
              {/* Footer Thẻ */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  {/* Thumbnail nhỏ */}
                  <div
                    onClick={() => onSelectMasterScene(index)}
                    className="w-10 h-14 rounded border border-zinc-700 bg-zinc-900 overflow-hidden cursor-pointer hover:border-amber-400 transition-all shrink-0 relative group"
                    title="Bấm để đưa lên Master Preview"
                  >
                    {sc.videoMedia ? (
                      <video
                        src={`data:${sc.videoMedia.mimeType};base64,${sc.videoMedia.base64}`}
                        className="w-full h-full object-cover"
                      />
                    ) : sc.keyframeMedia ? (
                      <img
                        src={`data:${sc.keyframeMedia.mimeType};base64,${sc.keyframeMedia.base64}`}
                        alt={sc.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <span className="material-symbols-outlined text-xs">image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold">
                      Xem
                    </div>
                  </div>
                  {/* Thông tin so khớp thoại & từ */}
                  <div className="flex-1 px-2 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">Độ dài từ:</span>
                      <span
                        className={`font-mono font-bold ${
                          sc.wordCount >= 22 && sc.wordCount <= 28
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {sc.wordCount} từ
                      </span>
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono">
                      {sc.wordCount >= 22 && sc.wordCount <= 28 ? (
                        <span className="text-emerald-400 font-semibold">✓ So khớp thoại chuẩn 8s</span>
                      ) : (
                        <span className="text-amber-400">Nên từ 22-28 từ để vừa 8s</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Các nút hành động: Tải & Render lại */}
                <div className="flex items-center gap-1.5">
                  {sc.videoMedia && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSceneVideo(sc)}
                      className="py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold flex items-center gap-1 transition-all"
                      title="Tải riêng video cảnh này"
                    >
                      <span className="material-symbols-outlined text-[12px]">download</span>
                      ⬇️ Tải
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRenderSingleScene(sc)}
                    disabled={isRendering || isRenderingVideos || !sc.keyframeMedia}
                    className={`flex-1 py-1 px-2 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                      sc.keyframeMedia && !isRendering
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95 cursor-pointer'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {isRendering ? 'sync' : 'refresh'}
                    </span>
                    {isDone ? '🔄 Render lại' : '🎬 Render Cảnh Này'}
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