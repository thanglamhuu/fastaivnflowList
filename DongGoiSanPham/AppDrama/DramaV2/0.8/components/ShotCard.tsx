import React, { useState, useRef } from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel } from '../types';
import { flowService } from '../services/flowService';
import { Flow } from 'flow-sdk';
import { MATRIX_12_VOICES } from '../voicePresets';
interface ShotCardProps {
  shot: Shot;
  index: number;
  characters: Character[];
  locations: Location[];
  config: { model: VideoModel; resolution: '360p' | '720p' };
  onUpdate: (updates: Partial<Shot>) => void;
  aspectRatio: AspectRatio;
}
export default function ShotCard({ shot, index, characters, locations, config, onUpdate, aspectRatio }: ShotCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Request IDs for cancellation / latest click tracking
  const imageReqIdRef = useRef<number>(0);
  const videoReqIdRef = useRef<number>(0);
  // Identify character who is speaking
  const speakingChar = characters.find(c => c.name === shot.dialogue?.characterName);
  const characterVoice = MATRIX_12_VOICES.find(v => v.id === speakingChar?.selectedVoiceId);
  const charAvatars = shot.characterNames.map(name => {
    return characters.find(c => c.name === name);
  }).filter(Boolean) as Character[];
  const handlePickStartFrame = async () => {
    const media = await flowService.selectMedia('image');
    if (media) onUpdate({ startFrameMedia: media, imageStatus: 'completed' });
  };
  // Enrich prompt with location and character descriptions
  const handleEnrichPrompt = () => {
    let extra = '';
    const shotChars = characters.filter(c => shot.characterNames.includes(c.name));
    if (shotChars.length > 0) {
      extra += ' [Nhân vật: ' + shotChars.map(c => `${c.name}: ${c.physicalDescription} (${c.defaultOutfit})`).join('; ') + ']';
    }
    const shotLoc = locations[0]; // Primary scene environment
    if (shotLoc && shotLoc.description) {
      extra += ` [Bối cảnh: ${shotLoc.name} - ${shotLoc.description}]`;
    }
    onUpdate({ visualPrompt: (shot.visualPrompt + ' ' + extra).trim() });
  };
  // Generate Image: Không disable nút, người dùng bấm lại sẽ hủy kết quả cũ
  const handleGenerateImage = async () => {
    const currentReqId = ++imageReqIdRef.current;
    setErrorMessage(null);
    onUpdate({ imageStatus: 'generating' });
    try {
      const refIds: string[] = [];
      const primaryChar = characters.find(c => shot.characterNames.includes(c.name));
      if (primaryChar?.avatarMedia?.mediaId) {
        refIds.push(primaryChar.avatarMedia.mediaId);
      }
      const result = await flowService.generateImage(shot.visualPrompt, aspectRatio, refIds);
      if (currentReqId === imageReqIdRef.current) {
        if (result) {
          onUpdate({ startFrameMedia: result, imageStatus: 'completed' });
        } else {
          onUpdate({ imageStatus: 'error' });
          setErrorMessage('Không nhận được hình ảnh từ model. Vui lòng thử lại.');
        }
      }
    } catch (err: any) {
      if (currentReqId === imageReqIdRef.current) {
        onUpdate({ imageStatus: 'error' });
        setErrorMessage(err?.message || 'Lỗi khi tạo ảnh.');
      }
    }
  };
  // Generate Video: Gắn thông tin thời lượng shot.durationSeconds và resolution vào SDK call
  const handleGenerateVideo = async () => {
    const currentReqId = ++videoReqIdRef.current;
    setErrorMessage(null);
    onUpdate({ videoStatus: 'generating' });
    try {
      const chosenDuration = Number(shot.durationSeconds) || 6;
      // Xây dựng prompt kèm thông số thời lượng chính xác
      let videoPrompt = shot.videoMotionPrompt || '';
      videoPrompt += ` [Duration: ${chosenDuration}s]`;
      
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
      const result = await flowService.generateVideo({
        prompt: videoPrompt.trim(),
        firstFrameImageMediaId: shot.startFrameMedia?.mediaId,
        startFrameBase64: shot.startFrameMedia?.base64,
        startFrameMimeType: shot.startFrameMedia?.mimeType,
        modelDisplayName: config.model,
        aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '9:16',
        durationSeconds: chosenDuration,
        resolution: config.resolution || '720p'
      });
      if (currentReqId === videoReqIdRef.current) {
        if (result) {
          onUpdate({ videoMedia: result, videoStatus: 'completed' });
        } else {
          onUpdate({ videoStatus: 'error' });
          setErrorMessage('Không nhận được video trả về. Vui lòng bấm thử lại.');
        }
      }
    } catch (err: any) {
      if (currentReqId === videoReqIdRef.current) {
        onUpdate({ videoStatus: 'error' });
        setErrorMessage(err?.message || 'Lỗi khi tạo video.');
      }
    }
  };
  const handleDownload = async () => {
    if (!shot.videoMedia) return;
    await Flow.download({
      base64: shot.videoMedia.base64,
      mimeType: 'video/mp4',
      filename: `Shot_${shot.shotNumber}_${shot.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.mp4`
    });
  };
  const isLandscape = aspectRatio === '16:9';
  const previewRatioClass = isLandscape ? 'aspect-video' : 'aspect-[9/16]';
  return (
    <div className="relative bg-slate-900/60 border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between hover:bg-slate-900/80 transition-all group overflow-hidden shadow-lg">
      {/* Background Index Number */}
      <div className="absolute -top-6 -left-6 text-7xl font-black text-white/5 pointer-events-none select-none italic">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="space-y-4 relative z-10">
        {/* Header thông tin phân cảnh */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider border border-amber-500/20">
                #{shot.shotNumber}
              </span>
              {/* Lựa chọn thời lượng */}
              <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10" title="Chọn thời lượng video">
                <span className="material-symbols-outlined text-xs text-amber-400">timer</span>
                <select
                  value={shot.durationSeconds || 6}
                  onChange={(e) => onUpdate({ durationSeconds: Number(e.target.value) })}
                  className="bg-transparent text-amber-400 text-[11px] font-black rounded focus:outline-none cursor-pointer"
                >
                  <option value={2} className="bg-slate-900">2s</option>
                  <option value={4} className="bg-slate-900">4s</option>
                  <option value={6} className="bg-slate-900">6s</option>
                  <option value={8} className="bg-slate-900">8s</option>
                  <option value={10} className="bg-slate-900">10s</option>
                </select>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[130px]">
                • {shot.cameraAngle}
              </span>
            </div>
            <h3 className="text-base font-black text-white leading-snug uppercase tracking-tight line-clamp-1">{shot.title}</h3>
          </div>
          <div className="flex -space-x-2 overflow-hidden shrink-0">
            {charAvatars.map(c => (
              <div key={c.id} className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 overflow-hidden bg-slate-800" title={c.name}>
                {c.avatarMedia?.url ? (
                  <img src={c.avatarMedia.url} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[9px] text-slate-400 font-bold">{c.name[0]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        {errorMessage && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span className="text-[11px]">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        )}
        {/* Cụm nhập liệu: Thoại, Prompt hình ảnh, Prompt chuyển động */}
        <div className="space-y-3">
          {/* Ô thoại & giọng đọc */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Thoại & Giọng</p>
              {characterVoice && (
                <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold border ${characterVoice.badgeColor}`}>
                  {characterVoice.label}
                </span>
              )}
            </div>
            {shot.dialogue ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300 truncate max-w-[150px]">{shot.dialogue.characterName}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-semibold">
                    {shot.dialogue.emotion}
                  </span>
                </div>
                <textarea 
                  value={shot.dialogue.line}
                  onChange={(e) => onUpdate({ dialogue: { ...shot.dialogue!, line: e.target.value } })}
                  className="w-full bg-slate-900/40 p-2 rounded-lg text-xs text-slate-200 resize-none focus:outline-none border border-white/5 min-h-[44px]"
                  placeholder="Lời thoại của nhân vật..."
                />
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic py-0.5">Cảnh quay không lời thoại</p>
            )}
            {shot.sfxAudioCue && (
              <div className="pt-1 border-t border-white/5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-amber-500">volume_up</span>
                <span className="text-[9px] text-amber-400 font-bold uppercase tracking-tight truncate">{shot.sfxAudioCue}</span>
              </div>
            )}
          </div>
          {/* Ô Prompt hình ảnh */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prompt Hình Ảnh</label>
              <button 
                onClick={handleEnrichPrompt}
                className="text-[9px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors"
                title="Nối thêm thông tin bối cảnh và ngoại hình nhân vật"
              >
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                Nối Bối cảnh & NV
              </button>
            </div>
            <textarea 
              value={shot.visualPrompt}
              onChange={(e) => onUpdate({ visualPrompt: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              placeholder="Mô tả phân cảnh..."
            />
          </div>
          {/* Ô Prompt Chuyển động */}
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prompt Chuyển Động & Camera</label>
            <textarea 
              value={shot.videoMotionPrompt}
              onChange={(e) => onUpdate({ videoMotionPrompt: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 h-14 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Chuyển động camera, hành động..."
            />
          </div>
          {/* Hàng nút bấm Tạo ảnh & Tạo video */}
          <div className="flex gap-2 pt-1">
            <button 
              onClick={handleGenerateImage}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all shadow active:scale-95 ${
                shot.imageStatus === 'generating'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
              }`}
              title="Tạo ảnh"
            >
              <span className={`material-symbols-outlined text-base ${shot.imageStatus === 'generating' ? 'animate-spin text-amber-400' : ''}`}>
                {shot.imageStatus === 'generating' ? 'refresh' : 'photo_spark'}
              </span>
              <span>Tạo ảnh</span>
            </button>
            <button 
              onClick={handleGenerateVideo}
              disabled={!shot.startFrameMedia}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-white text-[11px] font-black uppercase tracking-wider transition-all shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                shot.videoStatus === 'generating'
                  ? 'bg-indigo-600/60 border border-indigo-400 hover:bg-indigo-600'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
              title={!shot.startFrameMedia ? 'Vui lòng tạo hoặc chọn ảnh trước' : 'Tạo Video AI'}
            >
              <span className={`material-symbols-outlined text-base ${shot.videoStatus === 'generating' ? 'animate-spin' : ''}`}>
                {shot.videoStatus === 'generating' ? 'sync' : 'videocam'}
              </span>
              <span>{shot.videoStatus === 'generating' ? 'Tạo lại Video' : 'Tạo Video AI'}</span>
            </button>
          </div>
        </div>
        {/* Hàng hiển thị Ảnh và Video nhỏ gọn nằm ngang hàng nhau phía dưới */}
        <div className="pt-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Start Frame Preview (Ảnh nhỏ) */}
            <div className={`relative group/media ${previewRatioClass} max-h-44 bg-slate-950 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center`}>
              {shot.startFrameMedia?.url ? (
                <img src={shot.startFrameMedia.url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center">
                  <span className="material-symbols-outlined text-2xl mb-1">image</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Ảnh ({aspectRatio})</span>
                </div>
              )}
              <button 
                onClick={handlePickStartFrame}
                className="absolute bottom-1.5 right-1.5 p-1 bg-black/70 backdrop-blur rounded opacity-0 group-hover/media:opacity-100 transition-opacity hover:bg-black/90"
                title="Tải ảnh từ máy"
              >
                <span className="material-symbols-outlined text-white text-xs">upload_file</span>
              </button>
              {shot.imageStatus === 'generating' && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                  <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
                  <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider animate-pulse">Đang tạo...</span>
                </div>
              )}
            </div>
            {/* Video Preview (Video nhỏ) */}
            <div className={`relative group/video ${previewRatioClass} max-h-44 bg-slate-950 rounded-xl border border-indigo-500/20 overflow-hidden flex items-center justify-center`}>
              {shot.videoMedia?.url ? (
                <video 
                  src={shot.videoMedia.url} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center">
                  <span className="material-symbols-outlined text-2xl mb-1">movie</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Video ({shot.durationSeconds || 6}s)</span>
                </div>
              )}
              {shot.videoMedia && (
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-center translate-y-full group-hover/video:translate-y-0 transition-transform">
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className="p-1 bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                    title="Xem toàn màn hình"
                  >
                    <span className="material-symbols-outlined text-white text-xs">zoom_out_map</span>
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-1 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
                    title="Tải clip về máy"
                  >
                    <span className="material-symbols-outlined text-white text-xs">download</span>
                  </button>
                </div>
              )}
              {shot.videoStatus === 'generating' && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5">
                  <div className="w-7 h-7 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider animate-pulse">Đang tạo video...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Fullscreen Lightbox */}
      {isFullscreen && shot.videoMedia && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className={`relative w-full ${isLandscape ? 'max-w-4xl aspect-video' : 'max-w-lg aspect-[9/16]'} bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10`}>
            <video src={shot.videoMedia.url} className="w-full h-full object-contain" controls autoPlay loop />
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}