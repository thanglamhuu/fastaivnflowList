import React, { useState } from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel, FlowMedia } from '../types';
import { flowService } from '../services/flowService';
import { Flow } from 'flow-sdk';
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
  const charAvatars = shot.characterNames.map(name => {
    return characters.find(c => c.name === name);
  }).filter(Boolean) as Character[];
  const handlePickStartFrame = async () => {
    const media = await flowService.selectMedia('image');
    if (media) onUpdate({ startFrameMedia: media });
  };
  const handleGenerateImage = async () => {
    onUpdate({ imageStatus: 'generating' });
    try {
      // Logic: Merge character and location descriptions if available
      let enrichedPrompt = shot.visualPrompt;
      const primaryChar = characters.find(c => shot.characterNames.includes(c.name));
      const refIds: string[] = [];
      
      if (primaryChar?.avatarMedia) refIds.push(primaryChar.avatarMedia.mediaId);
      
      const result = await flowService.generateImage(enrichedPrompt, aspectRatio, refIds);
      if (result) {
        onUpdate({ startFrameMedia: result, imageStatus: 'completed' });
      } else {
        onUpdate({ imageStatus: 'error' });
      }
    } catch (err) {
      onUpdate({ imageStatus: 'error' });
    }
  };
  const handleGenerateVideo = async () => {
    if (!shot.startFrameMedia) return;
    onUpdate({ videoStatus: 'generating' });
    try {
      const result = await flowService.generateVideo({
        prompt: `${shot.videoMotionPrompt}. ${shot.dialogue?.line || ''}`,
        firstFrameImageMediaId: shot.startFrameMedia.mediaId,
        modelDisplayName: config.model,
        aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '16:9',
        durationSeconds: shot.durationSeconds
      });
      if (result) {
        onUpdate({ videoMedia: result, videoStatus: 'completed' });
      } else {
        onUpdate({ videoStatus: 'error' });
      }
    } catch (err) {
      onUpdate({ videoStatus: 'error' });
    }
  };
  const handleDownload = async () => {
    if (!shot.videoMedia) return;
    await Flow.download({
      base64: shot.videoMedia.base64,
      mimeType: 'video/mp4',
      filename: `Shot_${shot.shotNumber}_${shot.title.replace(/\s+/g, '_')}.mp4`
    });
  };
  return (
    <div className="relative bg-slate-900/60 border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:bg-slate-900/80 transition-all group overflow-hidden">
      {/* Background Index Number */}
      <div className="absolute -top-10 -left-10 text-[10rem] font-black text-white/5 pointer-events-none select-none italic">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex-1 space-y-6 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-500/20">
                Shot #{shot.shotNumber}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {shot.durationSeconds}s • {shot.cameraAngle}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">{shot.title}</h3>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            {charAvatars.map(c => (
              <div key={c.id} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-900 overflow-hidden bg-slate-800" title={c.name}>
                {c.avatarMedia ? <img src={c.avatarMedia.url} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-500">{c.name[0]}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Thoại & Cảm xúc</p>
              {shot.dialogue ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{shot.dialogue.characterName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full font-bold">
                      {shot.dialogue.emotion}
                    </span>
                  </div>
                  <textarea 
                    value={shot.dialogue.line}
                    onChange={(e) => onUpdate({ dialogue: { ...shot.dialogue!, line: e.target.value } })}
                    className="w-full bg-transparent text-sm text-slate-200 resize-none focus:outline-none min-h-[60px]"
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-600 italic">Cảnh quay không lời thoại</p>
              )}
              {shot.sfxAudioCue && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-500">audio_file</span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-tight">{shot.sfxAudioCue}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
               <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Prompt Hình Ảnh</label>
               <textarea 
                 value={shot.visualPrompt}
                 onChange={(e) => onUpdate({ visualPrompt: e.target.value })}
                 className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
               />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Prompt Chuyển Động Video</label>
               <textarea 
                 value={shot.videoMotionPrompt}
                 onChange={(e) => onUpdate({ videoMotionPrompt: e.target.value })}
                 className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-white/10"
               />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleGenerateImage}
                disabled={shot.imageStatus === 'generating'}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black rounded-xl border border-white/10 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">{shot.imageStatus === 'generating' ? 'hourglass_top' : 'photo_spark'}</span>
                {shot.imageStatus === 'generating' ? 'Đang tạo ảnh...' : 'Tạo Start Frame'}
              </button>
              <button 
                onClick={handleGenerateVideo}
                disabled={!shot.startFrameMedia || shot.videoStatus === 'generating'}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-800"
              >
                <span className="material-symbols-outlined text-lg">{shot.videoStatus === 'generating' ? 'sync' : 'videocam'}</span>
                {shot.videoStatus === 'generating' ? 'Đang tạo video...' : 'Tạo Video AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[280px] flex flex-col gap-4">
        {/* Start Frame Preview */}
        <div className="relative group/media aspect-[9/16] bg-slate-950 rounded-2xl border border-white/5 overflow-hidden">
          {shot.startFrameMedia ? (
            <img src={shot.startFrameMedia.url} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
               <span className="material-symbols-outlined text-4xl mb-2">image</span>
               <span className="text-[10px] font-bold uppercase tracking-widest">Start Frame</span>
            </div>
          )}
          <button 
            onClick={handlePickStartFrame}
            className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur rounded-lg opacity-0 group-hover/media:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-white text-sm">upload_file</span>
          </button>
          {shot.imageStatus === 'generating' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
        {/* Video Preview */}
        <div className="relative group/video aspect-[9/16] bg-slate-950 rounded-2xl border border-indigo-500/20 overflow-hidden">
          {shot.videoMedia ? (
            <video 
              src={shot.videoMedia.url} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              muted
              autoPlay
              loop
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
               <span className="material-symbols-outlined text-4xl mb-2">movie</span>
               <span className="text-[10px] font-bold uppercase tracking-widest">Kết quả Video</span>
            </div>
          )}
          {shot.videoMedia && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center translate-y-full group-hover/video:translate-y-0 transition-transform">
               <button 
                onClick={() => setIsFullscreen(true)}
                className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20"
               >
                 <span className="material-symbols-outlined text-white text-sm">zoom_out_map</span>
               </button>
               <button 
                onClick={handleDownload}
                className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
               >
                 <span className="material-symbols-outlined text-white text-sm">download</span>
               </button>
            </div>
          )}
          {shot.videoStatus === 'generating' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest animate-pulse">Rendering Video...</span>
            </div>
          )}
        </div>
      </div>
      {/* Fullscreen Lightbox */}
      {isFullscreen && shot.videoMedia && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
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