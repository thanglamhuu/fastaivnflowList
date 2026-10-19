import React, { useState, useRef } from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel, VisualArtStyle } from '../types';
import { flowService } from '../services/flowService';
import { Flow } from 'flow-sdk';
import { MATRIX_12_VOICES } from '../voicePresets';
import { getCharactersInShot, getShotReferenceMedias, buildConsistentImagePrompt } from '../utils/promptHelper';
interface ShotCardProps {
  shot: Shot;
  index: number;
  characters: Character[];
  locations: Location[];
  config: { model: VideoModel; resolution: '360p' | '720p'; visualStyle?: VisualArtStyle };
  onUpdate: (updates: Partial<Shot>) => void;
  aspectRatio: AspectRatio;
}
export default function ShotCard({ shot, index, characters, locations, config, onUpdate, aspectRatio }: ShotCardProps) {
  const [zoomMediaType, setZoomMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imageReqIdRef = useRef<number>(0);
  const videoReqIdRef = useRef<number>(0);
  const shotChars = getCharactersInShot(shot, characters);
  const shotLoc = locations[0];
  const refMedias = getShotReferenceMedias(shotChars, shotLoc);
  const speakingChar = characters.find(c => c.name === shot.dialogue?.characterName);
  const characterVoice = MATRIX_12_VOICES.find(v => v.id === speakingChar?.selectedVoiceId);
  const handlePickStartFrame = async () => {
    const media = await flowService.selectMedia('image');
    if (media) onUpdate({ startFrameMedia: media, imageStatus: 'completed' });
  };
  const handleEnrichPrompt = () => {
    let extra = '';
    if (shotChars.length > 0) {
      extra += ' [Nhân vật: ' + shotChars.map(c => `${c.name}: ${c.physicalDescription} (${c.defaultOutfit})`).join('; ') + ']';
    }
    if (shotLoc && shotLoc.description) {
      extra += ` [Bối cảnh: ${shotLoc.name} - ${shotLoc.description}]`;
    }
    onUpdate({ visualPrompt: (shot.visualPrompt + ' ' + extra).trim() });
  };
  const handleGenerateImage = async () => {
    const currentReqId = ++imageReqIdRef.current;
    setErrorMessage(null);
    onUpdate({ imageStatus: 'generating' });
    try {
      const consistentPrompt = buildConsistentImagePrompt(shot.visualPrompt, shotChars, shotLoc, config.visualStyle);
      const result = await flowService.generateImage(consistentPrompt, aspectRatio, refMedias);
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
  const handleGenerateVideo = async () => {
    const currentReqId = ++videoReqIdRef.current;
    setErrorMessage(null);
    onUpdate({ videoStatus: 'generating' });
    try {
      const chosenDuration = Number(shot.durationSeconds) || 6;
      let videoPrompt = shot.videoMotionPrompt || '';
      if (config.visualStyle) {
        videoPrompt += ` [Style: ${config.visualStyle}]`;
      }
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
  const handleDownloadVideo = async () => {
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
    <div className="relative bg-slate-900/60 border border-white rounded-2xl p-3.5 md:p-4 flex flex-col justify-between hover:bg-slate-900/80 transition-all group overflow-hidden shadow-lg">
      <div className="space-y-3 relative z-10">
        {/* Header: Số thứ tự to gấp đôi + Tên cảnh cùng dòng */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-xl md:text-2xl font-black text-[#F31B17] bg-[#F31B17]/10 px-2.5 py-0.5 rounded-lg border border-[#F31B17]/30 leading-none shrink-0">
              #{shot.shotNumber}
            </span>
            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight truncate flex-1">
              {shot.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10" title="Chọn thời lượng video">
              <span className="material-symbols-outlined text-xs text-[#F31B17]">timer</span>
              <select
                value={shot.durationSeconds || 6}
                onChange={(e) => onUpdate({ durationSeconds: Number(e.target.value) })}
                className="bg-transparent text-[#F31B17] text-[11px] font-black rounded focus:outline-none cursor-pointer"
              >
                <option value={2} className="bg-slate-900">2s</option>
                <option value={4} className="bg-slate-900">4s</option>
                <option value={6} className="bg-slate-900">6s</option>
                <option value={8} className="bg-slate-900">8s</option>
                <option value={10} className="bg-slate-900">10s</option>
              </select>
            </div>
            <div className="flex -space-x-1.5 overflow-hidden">
              {shotChars.map(c => (
                <div key={c.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 overflow-hidden bg-slate-800" title={c.name}>
                  {c.avatarMedia?.url ? (
                    <img src={c.avatarMedia.url} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[9px] text-slate-400 font-bold">{c.name[0]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {errorMessage && (
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-center justify-between">
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
        <div className="space-y-2.5">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                {shot.dialogue?.characterName ? (
                  <span className="font-black text-white bg-[#F31B17]/30 px-1.5 py-0.5 rounded border border-[#F31B17]/40">
                    {shot.dialogue.characterName}
                  </span>
                ) : null}
                <span className="text-slate-400 font-bold uppercase tracking-wider">Thoại & Giọng</span>
                {shot.dialogue?.emotion && (
                  <span className="px-1.5 py-0.2 bg-[#F31B17]/15 text-red-300 rounded font-semibold text-[9px] border border-[#F31B17]/30">
                    {shot.dialogue.emotion}
                  </span>
                )}
              </div>
              {characterVoice && (
                <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold border truncate max-w-[120px] ${characterVoice.badgeColor}`}>
                  {characterVoice.label}
                </span>
              )}
            </div>
            {shot.dialogue ? (
              <textarea 
                value={shot.dialogue.line}
                onChange={(e) => onUpdate({ dialogue: { ...shot.dialogue!, line: e.target.value } })}
                className="w-full bg-slate-900/40 p-2 rounded-lg text-xs text-slate-200 resize-none focus:outline-none border border-white/5 min-h-[38px]"
                placeholder="Lời thoại của nhân vật..."
              />
            ) : (
              <p className="text-[10px] text-slate-500 italic py-0.5">Cảnh quay không lời thoại</p>
            )}
            {shot.sfxAudioCue && (
              <div className="pt-1 border-t border-white/5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#F31B17]">volume_up</span>
                <span className="text-[9px] text-[#F31B17] font-bold uppercase tracking-tight truncate">{shot.sfxAudioCue}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prompt Hình Ảnh</label>
              <button 
                onClick={handleEnrichPrompt}
                className="text-[9px] text-[#F31B17] hover:text-red-400 flex items-center gap-0.5 transition-colors"
                title="Nối thêm thông tin bối cảnh và ngoại hình nhân vật"
              >
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                Nối Bối cảnh & NV
              </button>
            </div>
            <textarea 
              value={shot.visualPrompt}
              onChange={(e) => onUpdate({ visualPrompt: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 h-14 resize-none focus:outline-none focus:ring-1 focus:ring-[#F31B17]/30"
              placeholder="Mô tả phân cảnh..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prompt Chuyển Động & Camera</label>
            <textarea 
              value={shot.videoMotionPrompt}
              onChange={(e) => onUpdate({ videoMotionPrompt: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 h-12 resize-none focus:outline-none focus:ring-1 focus:ring-[#F31B17]/30"
              placeholder="Chuyển động camera, hành động..."
            />
          </div>
        </div>
        {/* 3 Cột: Cột 1 (Nút Tạo), Cột 2 (Ảnh), Cột 3 (Video) */}
        <div className="pt-2 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="flex flex-col gap-2 h-full justify-center">
              <button 
                type="button"
                onClick={handleGenerateImage}
                disabled={shot.imageStatus === 'generating'}
                className={`w-full py-2 px-1 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all text-center active:scale-95 ${
                  shot.imageStatus === 'generating'
                    ? 'bg-[#F31B17]/20 text-red-300 border-[#F31B17]/40 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow'
                }`}
                title="Tạo ảnh phân cảnh"
              >
                {shot.imageStatus === 'generating' ? 'Đang tạo...' : 'Tạo ảnh'}
              </button>
              <button 
                type="button"
                onClick={handleGenerateVideo}
                disabled={!shot.startFrameMedia || shot.videoStatus === 'generating'}
                className={`w-full py-2 px-1 rounded-lg text-white text-[11px] font-black uppercase tracking-wider transition-all text-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  shot.videoStatus === 'generating'
                    ? 'bg-[#F31B17]/60 border border-[#F31B17] animate-pulse'
                    : 'bg-[#F31B17] hover:bg-[#d11713] shadow-red-950/30'
                }`}
                title={!shot.startFrameMedia ? 'Cần có ảnh trước khi tạo video' : 'Tạo video phân cảnh'}
              >
                {shot.videoStatus === 'generating' ? 'Đang tạo...' : 'Tạo video'}
              </button>
            </div>
            {/* Cột 2: Ảnh */}
            <div className={`relative group/media ${previewRatioClass} max-h-36 bg-slate-950 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center`}>
              {shot.startFrameMedia?.url ? (
                <img 
                  src={shot.startFrameMedia.url} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
                  onClick={() => setZoomMediaType('image')}
                  title="Click để phóng to ảnh"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-1 text-center">
                  <span className="material-symbols-outlined text-xl mb-0.5">image</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Chưa có ảnh</span>
                </div>
              )}
              
              <button 
                onClick={handlePickStartFrame}
                className="absolute bottom-1 right-1 p-1 bg-black/70 backdrop-blur rounded opacity-0 group-hover/media:opacity-100 transition-opacity hover:bg-black/90"
                title="Tải ảnh từ máy"
              >
                <span className="material-symbols-outlined text-white text-xs">upload_file</span>
              </button>
              {shot.imageStatus === 'generating' && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                  <div className="w-5 h-5 border-2 border-[#F31B17]/20 border-t-[#F31B17] rounded-full animate-spin" />
                  <span className="text-[9px] text-red-300 font-bold uppercase tracking-wider animate-pulse">Đang tạo...</span>
                </div>
              )}
            </div>
            {/* Cột 3: Video */}
            <div className={`relative group/video ${previewRatioClass} max-h-36 bg-slate-950 rounded-xl border border-[#F31B17]/30 overflow-hidden flex items-center justify-center`}>
              {shot.videoMedia?.url ? (
                <video 
                  src={shot.videoMedia.url} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setZoomMediaType('video')}
                  title="Click để phóng to video"
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-1 text-center">
                  <span className="material-symbols-outlined text-xl mb-0.5">movie</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Chưa có video</span>
                </div>
              )}
              {shot.videoMedia && (
                <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-center translate-y-full group-hover/video:translate-y-0 transition-transform">
                  <button 
                    onClick={() => setZoomMediaType('video')}
                    className="p-1 bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                    title="Phóng to video"
                  >
                    <span className="material-symbols-outlined text-white text-xs">zoom_in</span>
                  </button>
                  <button 
                    onClick={handleDownloadVideo}
                    className="p-1 bg-[#F31B17] rounded hover:bg-[#d11713] transition-colors"
                    title="Tải clip về máy"
                  >
                    <span className="material-symbols-outlined text-white text-xs">download</span>
                  </button>
                </div>
              )}
              {shot.videoStatus === 'generating' && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                  <div className="w-5 h-5 border-2 border-[#F31B17]/20 border-t-[#F31B17] rounded-full animate-spin" />
                  <span className="text-[9px] text-red-300 font-bold uppercase tracking-wider animate-pulse">Đang tạo...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MODAL ZOOM */}
      {zoomMediaType !== 'none' && (
        <div 
          onClick={() => setZoomMediaType('none')}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center justify-center max-w-[85vw] max-h-[85vh] bg-slate-950 p-2 sm:p-3 rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="w-full flex justify-between items-center pb-2 px-1 border-b border-white/10 mb-2">
              <span className="text-xs font-black text-[#F31B17] uppercase tracking-wider">
                {zoomMediaType === 'video' ? `Phân cảnh #${shot.shotNumber} - Video` : `Phân cảnh #${shot.shotNumber} - Ảnh Start Frame`}
              </span>
              <button 
                type="button"
                onClick={() => setZoomMediaType('none')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all border border-white/20 active:scale-95"
                title="Đóng xem thử"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex items-center justify-center overflow-hidden max-h-[72vh] max-w-[80vw]">
              {zoomMediaType === 'video' && shot.videoMedia?.url && (
                <video 
                  src={shot.videoMedia.url} 
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-lg" 
                  controls 
                  autoPlay 
                  loop 
                />
              )}
              {zoomMediaType === 'image' && shot.startFrameMedia?.url && (
                <img 
                  src={shot.startFrameMedia.url} 
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-lg" 
                  alt={shot.title}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}