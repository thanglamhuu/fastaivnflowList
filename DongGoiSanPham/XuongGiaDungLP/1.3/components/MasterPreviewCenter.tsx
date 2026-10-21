import React, { useRef, useState, useEffect } from 'react';
import { SceneData } from '../types';
interface MasterPreviewCenterProps {
  scenes: SceneData[];
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
}
export const MasterPreviewCenter: React.FC<MasterPreviewCenterProps> = ({
  scenes,
  selectedSceneIndex,
  onSelectScene,
}) => {
  const activeScene = scenes[selectedSceneIndex] || scenes[0];
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, activeScene.videoMedia]);
  return (
    <section className="flex-1 flex flex-col h-full bg-[#050608] border-r border-zinc-800 select-none overflow-hidden">
      {/* Top Header */}
      <div className="h-10 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-[#08090d] shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-sm">desktop_windows</span>
          <span className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
            Master Preview (9:16)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
          Đang xem: {activeScene.label} - {activeScene.stageName}
        </span>
      </div>
      {/* Main 9:16 Frame Workspace */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden relative">
        <div className="relative h-full max-h-[580px] aspect-[9/16] bg-zinc-950 rounded-xl border-2 border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Top Left Badge: Có Tiếng */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-1 rounded bg-black/75 backdrop-blur border border-zinc-700 text-[10px] font-bold text-emerald-400">
            <span className="material-symbols-outlined text-[13px]">volume_up</span>
            <span>🔊 Có Tiếng</span>
          </div>
          {/* Top Right Scene Badge */}
          <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold shadow">
            {activeScene.label}
          </div>
          {/* Media Player Layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {activeScene.videoMedia ? (
              <video
                ref={videoRef}
                src={`data:${activeScene.videoMedia.mimeType};base64,${activeScene.videoMedia.base64}`}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : activeScene.keyframeMedia ? (
              <img
                src={`data:${activeScene.keyframeMedia.mimeType};base64,${activeScene.keyframeMedia.base64}`}
                alt={activeScene.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-600 gap-2">
                <span className="material-symbols-outlined text-4xl text-zinc-700">video_library</span>
                <span className="text-xs font-semibold text-zinc-400">Chưa có ảnh/video cho cảnh này</span>
                <p className="text-[10px] text-zinc-600 max-w-[200px]">
                  Bấm "✨ Tạo Lại 4 Ảnh" trên thanh trên cùng để xem trước khung hình.
                </p>
              </div>
            )}
          </div>
          {/* Phụ Đề Lời Thoại (Subtitle Box) ở phía dưới khung phát */}
          <div className="relative z-20 mt-auto m-2.5 p-2 rounded-lg bg-black/85 backdrop-blur border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-bold block mb-0.5">
              Phụ đề lời thoại (Subtitle)
            </span>
            <p className="text-xs font-medium text-white leading-relaxed line-clamp-3">
              "{activeScene.dialogue || 'Chưa nhập lời thoại cho cảnh này.'}"
            </p>
          </div>
        </div>
      </div>
      {/* Thanh điều khiển âm lượng */}
      <div className="h-10 border-t border-zinc-800/80 px-4 flex items-center justify-between bg-[#08090d] text-xs text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1 text-zinc-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">
              {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
            </span>
            <span className="text-[11px]">Âm thanh: {isMuted ? 'Tắt' : 'Bật'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono">{isMuted ? '0%' : `${volume}%`}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>
      </div>
      {/* Hàng dưới cùng: 4 KEYFRAME ĐÃ TẠO (4/4) */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#090a0f] shrink-0">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-amber-400 text-[14px]">grid_view</span>
            4 Keyframe Đã Tạo ({scenes.filter((s) => s.keyframeMedia).length}/4)
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Bấm để xem trên Master</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {scenes.map((sc, idx) => {
            const isSelected = selectedSceneIndex === idx;
            return (
              <div
                key={sc.id}
                onClick={() => onSelectScene(idx)}
                className={`relative aspect-[9/16] rounded-md overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30 scale-[1.02]'
                    : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950'
                }`}
              >
                {sc.keyframeMedia ? (
                  <img
                    src={`data:${sc.keyframeMedia.mimeType};base64,${sc.keyframeMedia.base64}`}
                    alt={sc.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600 text-[10px]">
                    <span className="material-symbols-outlined text-sm">image</span>
                    Trống
                  </div>
                )}
                <div className="absolute top-1 left-1 px-1 rounded bg-black/80 text-[8px] font-bold text-zinc-300">
                  #{idx + 1}
                </div>
                {sc.videoMedia && (
                  <div className="absolute bottom-1 right-1 p-0.5 rounded bg-emerald-500 text-black">
                    <span className="material-symbols-outlined text-[10px] block">videocam</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};import React, { useRef, useState, useEffect } from 'react';
import { SceneData } from '../types';
interface MasterPreviewCenterProps {
  scenes: SceneData[];
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
}
export const MasterPreviewCenter: React.FC<MasterPreviewCenterProps> = ({
  scenes,
  selectedSceneIndex,
  onSelectScene,
}) => {
  const activeScene = scenes[selectedSceneIndex] || scenes[0];
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, activeScene.videoMedia]);
  return (
    <section className="flex-1 flex flex-col h-full bg-[#050608] border-r border-zinc-800 select-none overflow-hidden">
      {/* Top Header */}
      <div className="h-10 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-[#08090d] shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-sm">desktop_windows</span>
          <span className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
            Master Preview (9:16)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
          Đang xem: {activeScene.label} - {activeScene.stageName}
        </span>
      </div>
      {/* Main 9:16 Frame Workspace */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden relative">
        <div className="relative h-full max-h-[580px] aspect-[9/16] bg-zinc-950 rounded-xl border-2 border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Top Left Badge: Có Tiếng */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-1 rounded bg-black/75 backdrop-blur border border-zinc-700 text-[10px] font-bold text-emerald-400">
            <span className="material-symbols-outlined text-[13px]">volume_up</span>
            <span>🔊 Có Tiếng</span>
          </div>
          {/* Top Right Scene Badge */}
          <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold shadow">
            {activeScene.label}
          </div>
          {/* Media Player Layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {activeScene.videoMedia ? (
              <video
                ref={videoRef}
                src={`data:${activeScene.videoMedia.mimeType};base64,${activeScene.videoMedia.base64}`}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : activeScene.keyframeMedia ? (
              <img
                src={`data:${activeScene.keyframeMedia.mimeType};base64,${activeScene.keyframeMedia.base64}`}
                alt={activeScene.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-600 gap-2">
                <span className="material-symbols-outlined text-4xl text-zinc-700">video_library</span>
                <span className="text-xs font-semibold text-zinc-400">Chưa có ảnh/video cho cảnh này</span>
                <p className="text-[10px] text-zinc-600 max-w-[200px]">
                  Bấm "✨ Tạo Lại 4 Ảnh" trên thanh trên cùng để xem trước khung hình.
                </p>
              </div>
            )}
          </div>
          {/* Phụ Đề Lời Thoại (Subtitle Box) ở phía dưới khung phát */}
          <div className="relative z-20 mt-auto m-2.5 p-2 rounded-lg bg-black/85 backdrop-blur border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-bold block mb-0.5">
              Phụ đề lời thoại (Subtitle)
            </span>
            <p className="text-xs font-medium text-white leading-relaxed line-clamp-3">
              "{activeScene.dialogue || 'Chưa nhập lời thoại cho cảnh này.'}"
            </p>
          </div>
        </div>
      </div>
      {/* Thanh điều khiển âm lượng */}
      <div className="h-10 border-t border-zinc-800/80 px-4 flex items-center justify-between bg-[#08090d] text-xs text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1 text-zinc-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">
              {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
            </span>
            <span className="text-[11px]">Âm thanh: {isMuted ? 'Tắt' : 'Bật'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono">{isMuted ? '0%' : `${volume}%`}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>
      </div>
      {/* Hàng dưới cùng: 4 KEYFRAME ĐÃ TẠO (4/4) */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#090a0f] shrink-0">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-amber-400 text-[14px]">grid_view</span>
            4 Keyframe Đã Tạo ({scenes.filter((s) => s.keyframeMedia).length}/4)
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Bấm để xem trên Master</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {scenes.map((sc, idx) => {
            const isSelected = selectedSceneIndex === idx;
            return (
              <div
                key={sc.id}
                onClick={() => onSelectScene(idx)}
                className={`relative aspect-[9/16] rounded-md overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30 scale-[1.02]'
                    : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950'
                }`}
              >
                {sc.keyframeMedia ? (
                  <img
                    src={`data:${sc.keyframeMedia.mimeType};base64,${sc.keyframeMedia.base64}`}
                    alt={sc.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600 text-[10px]">
                    <span className="material-symbols-outlined text-sm">image</span>
                    Trống
                  </div>
                )}
                <div className="absolute top-1 left-1 px-1 rounded bg-black/80 text-[8px] font-bold text-zinc-300">
                  #{idx + 1}
                </div>
                {sc.videoMedia && (
                  <div className="absolute bottom-1 right-1 p-0.5 rounded bg-emerald-500 text-black">
                    <span className="material-symbols-outlined text-[10px] block">videocam</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};