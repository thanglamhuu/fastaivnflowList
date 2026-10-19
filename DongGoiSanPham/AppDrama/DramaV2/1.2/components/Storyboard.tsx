import React, { useState, useRef } from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel } from '../types';
import ShotCard from './ShotCard';
import { flowService } from '../services/flowService';
import { MATRIX_12_VOICES } from '../voicePresets';
import { getCharactersInShot, getShotReferenceMedias, buildConsistentImagePrompt } from '../utils/promptHelper';
interface StoryboardProps {
  shots: Shot[];
  characters: Character[];
  locations: Location[];
  config: { model: VideoModel; resolution: '360p' | '720p' };
  onUpdateShot: (id: string, updates: Partial<Shot>) => void;
  aspectRatio: AspectRatio;
  onToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}
export default function Storyboard({ shots, characters, locations, config, onUpdateShot, aspectRatio, onToast }: StoryboardProps) {
  const [isBatchGeneratingImages, setIsBatchGeneratingImages] = useState(false);
  const [isBatchGeneratingVideos, setIsBatchGeneratingVideos] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string }>({ current: 0, total: 0, title: '' });
  // Dùng ref để hỗ trợ dừng tiến trình hàng loạt nếu cần
  const abortBatch = useRef<boolean>(false);
  // Dừng tiến trình batch
  const handleStopBatch = () => {
    abortBatch.current = true;
    onToast?.('Đang yêu cầu dừng tiến trình tạo hàng loạt...', 'warning');
  };
  /**
   * Tạo tất cả ảnh (Start Frame):
   * Lần lượt duyệt qua từng shot, có delay an toàn giữa các request
   */
  const handleGenerateAllImages = async () => {
    if (isBatchGeneratingImages || isBatchGeneratingVideos) return;
    if (shots.length === 0) {
      onToast?.('Chưa có phân cảnh nào trong Storyboard.', 'warning');
      return;
    }
    setIsBatchGeneratingImages(true);
    abortBatch.current = false;
    setBatchProgress({ current: 0, total: shots.length, title: 'Bắt đầu tạo tất cả ảnh...' });
    onToast?.(`Bắt đầu lần lượt tạo Start Frame (khóa mặt & trang phục) cho ${shots.length} phân cảnh...`, 'info');
    let successCount = 0;
    let errorCount = 0;
    for (let i = 0; i < shots.length; i++) {
      if (abortBatch.current) {
        onToast?.('Đã dừng tiến trình tạo ảnh hàng loạt.', 'warning');
        break;
      }
      const shot = shots[i];
      setBatchProgress({
        current: i + 1,
        total: shots.length,
        title: `Phân cảnh #${shot.shotNumber}: ${shot.title || 'Start Frame'}`
      });
      onUpdateShot(shot.id, { imageStatus: 'generating' });
      try {
        const shotChars = getCharactersInShot(shot, characters);
        const shotLoc = locations[0];
        const refMedias = getShotReferenceMedias(shotChars, shotLoc);
        const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc);
        const result = await flowService.generateImage(consistentPrompt, aspectRatio, refMedias);
        if (result) {
          onUpdateShot(shot.id, { startFrameMedia: result, imageStatus: 'completed' });
          successCount++;
        } else {
          onUpdateShot(shot.id, { imageStatus: 'error' });
          errorCount++;
        }
      } catch (err: any) {
        console.error(`Lỗi tạo ảnh shot #${shot.shotNumber}:`, err);
        onUpdateShot(shot.id, { imageStatus: 'error' });
        errorCount++;
        // Nếu thông báo dính cờ bot detection hoặc extension, cho nghỉ 4s trước khi sang shot kế tiếp
        if (err?.message?.includes('bất thường') || err?.message?.includes('tiện ích')) {
          onToast?.('Hệ thống đang điều tiết tốc độ gọi AI, đang tạm dừng 4 giây...', 'warning');
          await new Promise(r => setTimeout(r, 4000));
        }
      }
      // Giãn cách 2.5s giữa các shot để không bị coi là spam request
      if (i < shots.length - 1 && !abortBatch.current) {
        await new Promise(r => setTimeout(r, 2500));
      }
    }
    setIsBatchGeneratingImages(false);
    if (!abortBatch.current) {
      onToast?.(`Đã hoàn tất tạo ảnh: ${successCount}/${shots.length} thành công${errorCount > 0 ? `, ${errorCount} lỗi` : ''}!`, successCount > 0 ? 'success' : 'error');
    }
  };
  /**
   * Tạo tất cả video:
   * Lần lượt duyệt qua từng shot trong storyboard có pacing an toàn.
   */
  const handleGenerateAllVideos = async () => {
    if (isBatchGeneratingImages || isBatchGeneratingVideos) return;
    if (shots.length === 0) {
      onToast?.('Chưa có phân cảnh nào trong Storyboard.', 'warning');
      return;
    }
    setIsBatchGeneratingVideos(true);
    abortBatch.current = false;
    setBatchProgress({ current: 0, total: shots.length, title: 'Bắt đầu tạo tất cả video...' });
    onToast?.(`Bắt đầu chu trình tự động tạo video cho ${shots.length} phân cảnh...`, 'info');
    let successCount = 0;
    let errorCount = 0;
    for (let i = 0; i < shots.length; i++) {
      if (abortBatch.current) {
        onToast?.('Đã dừng chu trình tạo video hàng loạt.', 'warning');
        break;
      }
      const shot = shots[i];
      setBatchProgress({
        current: i + 1,
        total: shots.length,
        title: `Phân cảnh #${shot.shotNumber}: ${shot.title || 'Video AI'}`
      });
      // Kiểm tra nếu shot chưa có Start Frame: Tự động tạo Start Frame khóa mặt & trang phục trước
      let currentStartFrameMedia = shot.startFrameMedia;
      if (!currentStartFrameMedia?.mediaId) {
        onToast?.(`Phân cảnh #${shot.shotNumber} chưa có Start Frame, đang tự tạo ảnh khóa nhân vật trước...`, 'info');
        onUpdateShot(shot.id, { imageStatus: 'generating' });
        try {
          const shotChars = getCharactersInShot(shot, characters);
          const shotLoc = locations[0];
          const refMedias = getShotReferenceMedias(shotChars, shotLoc);
          const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc);
          const imgResult = await flowService.generateImage(consistentPrompt, aspectRatio, refMedias);
          if (imgResult) {
            currentStartFrameMedia = imgResult;
            onUpdateShot(shot.id, { startFrameMedia: imgResult, imageStatus: 'completed' });
          } else {
            onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
            errorCount++;
            continue;
          }
        } catch (imgErr) {
          console.error(`Không thể tạo start frame cho shot #${shot.shotNumber}:`, imgErr);
          onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
          errorCount++;
          continue;
        }
        // Nghỉ 2s sau khi tạo ảnh trước khi tạo video
        await new Promise(r => setTimeout(r, 2000));
      }
      // Tiến hành tạo video cho shot hiện tại
      onUpdateShot(shot.id, { videoStatus: 'generating' });
      try {
        const chosenDuration = Number(shot.durationSeconds) || 6;
        let videoPrompt = shot.videoMotionPrompt || '';
        videoPrompt += ` [Duration: ${chosenDuration}s]`;
        const speakingChar = characters.find(c => c.name === shot.dialogue?.characterName);
        const characterVoice = MATRIX_12_VOICES.find(v => v.id === speakingChar?.selectedVoiceId);
        if (shot.dialogue && shot.dialogue.line) {
          let voiceInfo = '';
          if (characterVoice) {
            voiceInfo = `[Voice Profile: ${characterVoice.label} (${characterVoice.subLabel}), Base Voice: ${characterVoice.baseVoice}, Gender: ${characterVoice.gender}, Speed: ${characterVoice.speed}, Pitch: ${characterVoice.pitch}, Acoustic: ${characterVoice.acousticProfile}, Emotion: ${shot.dialogue.emotion || 'Natural'}]`;
          }
          videoPrompt += ` ${voiceInfo} ${shot.dialogue.characterName} nói: "${shot.dialogue.line}"`;
        }
        if (shot.sfxAudioCue) {
          videoPrompt += ` [SFX: ${shot.sfxAudioCue}]`;
        }
        const videoResult = await flowService.generateVideo({
          prompt: videoPrompt.trim(),
          firstFrameImageMediaId: currentStartFrameMedia?.mediaId,
          startFrameBase64: currentStartFrameMedia?.base64,
          startFrameMimeType: currentStartFrameMedia?.mimeType,
          modelDisplayName: config.model,
          aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '9:16',
          durationSeconds: chosenDuration,
          resolution: config.resolution || '720p'
        });
        if (videoResult) {
          onUpdateShot(shot.id, { videoMedia: videoResult, videoStatus: 'completed' });
          successCount++;
        } else {
          onUpdateShot(shot.id, { videoStatus: 'error' });
          errorCount++;
        }
      } catch (videoErr: any) {
        console.error(`Lỗi tạo video shot #${shot.shotNumber}:`, videoErr);
        onUpdateShot(shot.id, { videoStatus: 'error' });
        errorCount++;
      }
      // Giãn cách giữa các lần tạo video
      if (i < shots.length - 1 && !abortBatch.current) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    setIsBatchGeneratingVideos(false);
    if (!abortBatch.current) {
      onToast?.(`Đã hoàn thành tạo video: ${successCount}/${shots.length} thành công${errorCount > 0 ? `, ${errorCount} lỗi` : ''}!`, successCount > 0 ? 'success' : 'error');
    }
  };
  const isBusy = isBatchGeneratingImages || isBatchGeneratingVideos;
  const readyImagesCount = shots.filter(s => s.startFrameMedia && s.startFrameMedia.mediaId).length;
  const readyVideosCount = shots.filter(s => s.videoMedia && s.videoMedia.mediaId).length;
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header & Batch Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">Storyboard Studio</h2>
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase border border-indigo-500/20">
              {shots.length} Phân cảnh
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Đã sẵn sàng: <span className="text-amber-400 font-bold">{readyImagesCount}/{shots.length} Ảnh</span> • <span className="text-indigo-400 font-bold">{readyVideosCount}/{shots.length} Video</span>
          </p>
        </div>
        {/* 2 Nút tạo hàng loạt */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isBusy && (
            <button
              onClick={handleStopBatch}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all active:scale-95"
              title="Dừng tiến trình tự động hiện tại"
            >
              <span className="material-symbols-outlined text-base">stop_circle</span>
              <span>Dừng lại</span>
            </button>
          )}
          {/* Nút Tạo tất cả ảnh */}
          <button
            onClick={handleGenerateAllImages}
            disabled={isBusy}
            title="Lần lượt tự động tạo ảnh cho tất cả các phân cảnh, khóa 100% nhận diện và trang phục từ ảnh tham chiếu"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              isBatchGeneratingImages
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 cursor-wait'
                : isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isBatchGeneratingImages ? 'animate-spin' : ''}`}>
              {isBatchGeneratingImages ? 'progress_activity' : 'photo_library'}
            </span>
            <span>
              {isBatchGeneratingImages
                ? `Tạo ảnh (${batchProgress.current}/${batchProgress.total})`
                : 'Tạo tất cả ảnh'}
            </span>
          </button>
          {/* Nút Tạo tất cả video */}
          <button
            onClick={handleGenerateAllVideos}
            disabled={isBusy}
            title="Tự động lần lượt tạo video cho từng phân cảnh, xong phân cảnh này sẽ tự chạy phân cảnh kế tiếp"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              isBatchGeneratingVideos
                ? 'bg-indigo-600/60 text-white border border-indigo-400 cursor-wait'
                : isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isBatchGeneratingVideos ? 'animate-spin' : ''}`}>
              {isBatchGeneratingVideos ? 'sync' : 'auto_videocam'}
            </span>
            <span>
              {isBatchGeneratingVideos
                ? `Tạo video (${batchProgress.current}/${batchProgress.total})`
                : 'Tạo tất cả video'}
            </span>
          </button>
        </div>
      </div>
      {/* Progress banner khi đang chạy batch */}
      {isBusy && (
        <div className="bg-slate-950/80 border border-white/10 p-3.5 rounded-xl flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isBatchGeneratingImages ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              <span className="material-symbols-outlined text-base animate-spin">
                {isBatchGeneratingImages ? 'photo_spark' : 'sync'}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {isBatchGeneratingImages ? 'Đang lần lượt tạo ảnh (Khóa mặt & trang phục)...' : 'Đang tự động lần lượt tạo Video AI...'}
              </p>
              <p className="text-[10px] text-slate-400">
                {batchProgress.title} ({batchProgress.current}/${batchProgress.total})
              </p>
            </div>
          </div>
          <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden shrink-0">
            <div 
              className={`h-full transition-all duration-300 ${isBatchGeneratingImages ? 'bg-amber-400' : 'bg-indigo-500'}`}
              style={{ width: `${(batchProgress.current / (batchProgress.total || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
      {/* Danh sách từng phân cảnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {shots.map((shot, index) => (
          <ShotCard 
            key={shot.id}
            shot={shot}
            index={index}
            characters={characters}
            locations={locations}
            config={config}
            onUpdate={(updates) => onUpdateShot(shot.id, updates)}
            aspectRatio={aspectRatio}
          />
        ))}
      </div>
    </div>
  );
}