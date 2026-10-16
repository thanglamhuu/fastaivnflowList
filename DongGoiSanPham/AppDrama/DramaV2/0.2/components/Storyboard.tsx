import React from 'react';
import { Shot, Character, Location, AspectRatio, VideoModel } from '../types';
import ShotCard from './ShotCard';
interface StoryboardProps {
  shots: Shot[];
  characters: Character[];
  locations: Location[];
  config: { model: VideoModel; resolution: '360p' | '720p' };
  onUpdateShot: (id: string, updates: Partial<Shot>) => void;
  aspectRatio: AspectRatio;
}
export default function Storyboard({ shots, characters, locations, config, onUpdateShot, aspectRatio }: StoryboardProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Storyboard Studio</h2>
          <p className="text-sm text-slate-400">Xây dựng từng thước phim từ prompt và AI.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase border border-indigo-500/20">
             {shots.length} Phân cảnh
           </span>
        </div>
      </div>
      <div className="space-y-12">
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