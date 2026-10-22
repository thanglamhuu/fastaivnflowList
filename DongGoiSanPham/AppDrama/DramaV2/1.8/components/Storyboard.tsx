import React, { useState, useRef } from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel, VisualArtStyle, FlowMedia } from '../types';
import ShotCard from './ShotCard';
import { flowService, extractLastFrameFromVideo } from '../services/flowService';
import { MATRIX_12_VOICES } from '../voicePresets';
import { getCharactersInShot, getShotReferenceMedias, buildConsistentImagePrompt } from '../utils/promptHelper';
interface StoryboardProps {
  shots: Shot[];
  characters: Character[];
  locations: Location[];
  config: { model: VideoModel; resolution: '360p' | '720p'; visualStyle?: VisualArtStyle };
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
        const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc, config.visualStyle);
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
        if (err?.message?.includes('bất thường') || err?.message?.includes('tiện ích')) {
          onToast?.('Hệ thống đang điều tiết tốc độ gọi AI, đang tạm dừng 4 giây...', 'warning');
          await new Promise(r => setTimeout(r, 4000));
        }
      }
      // Giãn cách 2.5s giữa các shot
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
      let currentStartFrameMedia = shot.startFrameMedia;
      if (!currentStartFrameMedia?.mediaId) {
        onToast?.(`Phân cảnh #${shot.shotNumber} chưa có Start Frame, đang tự tạo ảnh khóa nhân vật trước...`, 'info');
        onUpdateShot(shot.id, { imageStatus: 'generating' });
        try {
          const shotChars = getCharactersInShot(shot, characters);
          const shotLoc = locations[0];
          const refMedias = getShotReferenceMedias(shotChars, shotLoc);
          const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc, config.visualStyle);
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
        await new Promise(r => setTimeout(r, 2000));
      }
      onUpdateShot(shot.id, { videoStatus: 'generating' });
      try {
        const chosenDuration = Number(shot.durationSeconds) || 6;
        let videoPrompt = shot.videoMotionPrompt || '';
        if (config.visualStyle) {
          videoPrompt += ` [Style: ${config.visualStyle}]`;
        }
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
      if (i < shots.length - 1 && !abortBatch.current) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    setIsBatchGeneratingVideos(false);
    if (!abortBatch.current) {
      onToast?.(`Đã hoàn thành tạo video: ${successCount}/${shots.length} thành công${errorCount > 0 ? `, ${errorCount} lỗi` : ''}!`, successCount > 0 ? 'success' : 'error');
    }
  };
  /**
   * DÂY CHUYỀN ALL SHOT:
   * Chạy tự động tạo clip nối tiếp từ đầu đến cuối kịch bản:
   * Shot này tạo xong sẽ tự động trích xuất endframe làm Start Frame cho shot tiếp theo và tạo tiếp clip.
   */
  const handleGenerateAllChainedVideos = async () => {
    if (isBatchGeneratingImages || isBatchGeneratingVideos) return;
    if (shots.length === 0) {
      onToast?.('Chưa có phân cảnh nào trong Storyboard.', 'warning');
      return;
    }
    setIsBatchGeneratingVideos(true);
    abortBatch.current = false;
    setBatchProgress({ current: 0, total: shots.length, title: 'Bắt đầu dây chuyền All shot...' });
    onToast?.(`Khởi động dây chuyền tự động tạo clip nối tiếp từ đầu đến cuối kịch bản (${shots.length} phân cảnh)...`, 'info');
    let currentStartFrameMedia: FlowMedia | undefined = undefined;
    for (let i = 0; i < shots.length; i++) {
      if (abortBatch.current) {
        onToast?.('Đã dừng dây chuyền All shot.', 'warning');
        break;
      }
      const shot = shots[i];
      setBatchProgress({
        current: i + 1,
        total: shots.length,
        title: `Đang tạo clip Shot #${shot.shotNumber}: ${shot.title || 'Video'}`
      });
      // 1. Kiểm tra ảnh Start Frame
      if (i === 0) {
        if (shot.startFrameMedia && shot.startFrameMedia.mediaId) {
          currentStartFrameMedia = shot.startFrameMedia;
        } else {
          onToast?.(`Shot #1 chưa có Start Frame, đang tự tạo ảnh khóa nhân vật trước...`, 'info');
          onUpdateShot(shot.id, { imageStatus: 'generating' });
          try {
            const shotChars = getCharactersInShot(shot, characters);
            const shotLoc = locations[0];
            const refMedias = getShotReferenceMedias(shotChars, shotLoc);
            const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc, config.visualStyle);
            const imgResult = await flowService.generateImage(consistentPrompt, aspectRatio, refMedias);
            if (imgResult) {
              currentStartFrameMedia = imgResult;
              onUpdateShot(shot.id, { startFrameMedia: imgResult, imageStatus: 'completed' });
            } else {
              onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
              onToast?.('Không thể tạo ảnh Start Frame cho Shot #1. Dây chuyền All shot dừng lại.', 'error');
              break;
            }
          } catch (imgErr: any) {
            console.error('Lỗi tạo ảnh shot 1 trong All shot:', imgErr);
            onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
            onToast?.('Lỗi tạo ảnh Shot #1: ' + (imgErr?.message || 'Thử lại'), 'error');
            break;
          }
          await new Promise(r => setTimeout(r, 2000));
        }
      } else {
        // Với shot thứ 2 trở đi, nếu chưa có currentStartFrameMedia từ endframe của shot trước thì kiểm tra shot hiện tại
        if (!currentStartFrameMedia) {
          currentStartFrameMedia = shot.startFrameMedia;
        }
        if (!currentStartFrameMedia?.mediaId) {
          onToast?.(`Shot #${shot.shotNumber} chưa có ảnh Start Frame. Đang tạo ảnh theo kịch bản...`, 'info');
          onUpdateShot(shot.id, { imageStatus: 'generating' });
          try {
            const shotChars = getCharactersInShot(shot, characters);
            const shotLoc = locations[0];
            const refMedias = getShotReferenceMedias(shotChars, shotLoc);
            const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc, config.visualStyle);
            const imgResult = await flowService.generateImage(consistentPrompt, aspectRatio, refMedias);
            if (imgResult) {
              currentStartFrameMedia = imgResult;
              onUpdateShot(shot.id, { startFrameMedia: imgResult, imageStatus: 'completed' });
            } else {
              onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
              onToast?.(`Không thể tạo ảnh Start Frame cho Shot #${shot.shotNumber}. Dừng dây chuyền.`, 'error');
              break;
            }
          } catch (imgErr: any) {
            console.error(`Lỗi tạo ảnh shot #${shot.shotNumber}:`, imgErr);
            onUpdateShot(shot.id, { imageStatus: 'error', videoStatus: 'error' });
            onToast?.(`Lỗi tạo ảnh Shot #${shot.shotNumber}: ${imgErr?.message || 'Thử lại'}`, 'error');
            break;
          }
          await new Promise(r => setTimeout(r, 2000));
        }
      }
      if (abortBatch.current) break;
      // 2. Tạo video cho shot hiện tại
      onUpdateShot(shot.id, { videoStatus: 'generating' });
      let videoResult: FlowMedia | null = null;
      try {
        const chosenDuration = Number(shot.durationSeconds) || 6;
        let videoPrompt = shot.videoMotionPrompt || '';
        if (config.visualStyle) {
          videoPrompt += ` [Style: ${config.visualStyle}]`;
        }
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
        videoResult = await flowService.generateVideo({
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
        } else {
          onUpdateShot(shot.id, { videoStatus: 'error' });
          onToast?.(`Tạo video Shot #${shot.shotNumber} thất bại. Dừng dây chuyền All shot.`, 'error');
          break;
        }
      } catch (videoErr: any) {
        console.error(`Lỗi tạo video shot #${shot.shotNumber}:`, videoErr);
        onUpdateShot(shot.id, { videoStatus: 'error' });
        onToast?.(`Lỗi tạo video Shot #${shot.shotNumber}: ${videoErr?.message || 'Thử lại'}. Dừng dây chuyền.`, 'error');
        break;
      }
      if (abortBatch.current) break;
      // 3. Tách End Frame và truyền sang Shot tiếp theo nếu chưa phải shot cuối
      if (i < shots.length - 1 && !abortBatch.current && videoResult) {
        const nextShot = shots[i + 1];
        setBatchProgress({
          current: i + 1,
          total: shots.length,
          title: `Đang trích xuất End Frame từ Shot #${shot.shotNumber} sang Shot #${nextShot.shotNumber}...`
        });
        try {
          const extractedEndFrame = await extractLastFrameFromVideo(videoResult);
          onUpdateShot(nextShot.id, { startFrameMedia: extractedEndFrame, imageStatus: 'completed' });
          currentStartFrameMedia = extractedEndFrame;
          onToast?.(`Đã tách End Frame từ Shot #${shot.shotNumber} sang Shot #${nextShot.shotNumber}!`, 'info');
        } catch (frameErr: any) {
          console.warn(`Lỗi tách frame từ video shot #${shot.shotNumber}:`, frameErr);
          onToast?.(`Không thể trích xuất endframe của Shot #${shot.shotNumber}, chuyển sang dùng Start Frame sẵn có hoặc tạo mới...`, 'warning');
          currentStartFrameMedia = undefined;
        }
        // Giãn cách an toàn 2000ms trước khi tạo shot tiếp theo
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    setIsBatchGeneratingVideos(false);
    if (!abortBatch.current) {
      onToast?.('Dây chuyền All shot đã hoàn tất toàn bộ các phân cảnh trong kịch bản!', 'success');
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
            <span className="px-2.5 py-0.5 bg-[#F31B17]/10 text-[#F31B17] rounded-full text-[10px] font-black uppercase border border-[#F31B17]/20">
              {shots.length} Phân cảnh
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Đã sẵn sàng: <span className="text-[#F31B17] font-bold">{readyImagesCount}/{shots.length} Ảnh</span> • <span className="text-[#F31B17] font-bold">{readyVideosCount}/{shots.length} Video</span>
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
                ? 'bg-[#F31B17]/30 text-red-300 border border-[#F31B17]/50 cursor-wait'
                : isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-[#F31B17] hover:bg-[#d11713] text-white shadow-red-950/20'
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
                ? 'bg-[#F31B17]/60 text-white border border-[#F31B17] cursor-wait'
                : isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-[#F31B17] hover:bg-[#d11713] text-white shadow-red-950/30'
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
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#F31B17]/20 text-[#F31B17]`}>
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
              className="h-full transition-all duration-300 bg-[#F31B17]"
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
            isFirstShot={index === 0}
            isLastShot={index === shots.length - 1}
            previousShotVideo={index > 0 ? shots[index - 1].videoMedia : undefined}
            onUpdateNextShot={index < shots.length - 1 ? (updates) => onUpdateShot(shots[index + 1].id, updates) : undefined}
            onToast={onToast}
            onRunAllChain={index === 0 ? handleGenerateAllChainedVideos : undefined}
            isAllChainRunning={isBatchGeneratingVideos}
          />
        ))}
      </div>
    </div>
  );
}