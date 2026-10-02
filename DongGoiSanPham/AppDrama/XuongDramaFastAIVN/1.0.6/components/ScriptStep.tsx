import React from 'react';
import { DramaProject, DramaStyle, AspectRatio, DramaDuration } from '../types';
interface ScriptStepProps {
  project: DramaProject;
  updateProject: (updates: Partial<DramaProject>) => void;
  onGenerateScript: () => Promise<void>;
  onNext: () => void;
  loading: string | null;
}
export const ScriptStep: React.FC<ScriptStepProps> = ({
  project,
  updateProject,
  onGenerateScript,
  onNext,
  loading
}) => {
  const durations: DramaDuration[] = ['15s', '30s', '45s', '60s', '90s', '180s'];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">settings_suggest</span>
            Cấu Hình Sản Xuất
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Phong cách Drama</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none text-slate-200"
                value={project.style}
                onChange={e => updateProject({ style: e.target.value as DramaStyle })}
              >
                {['Cinematic Photorealistic', '3D Pixar', 'Anime Drama', 'K-Drama Tone'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tỷ lệ khung hình</label>
                <div className="flex gap-2">
                  {(['9:16', '16:9'] as AspectRatio[]).map(r => (
                    <button
                      key={r}
                      onClick={() => updateProject({ aspectRatio: r })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        project.aspectRatio === r 
                          ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Thời lượng</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none text-slate-200"
                  value={project.duration}
                  onChange={e => updateProject({ duration: e.target.value as DramaDuration })}
                >
                  {durations.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ý tưởng cốt truyện (Premise)</label>
              <textarea
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-500 outline-none resize-none text-slate-200 placeholder:text-slate-700"
                placeholder="VD: Mẹ chồng nàng dâu..."
                value={project.premise}
                onChange={e => updateProject({ premise: e.target.value })}
              />
            </div>
            <button
              onClick={onGenerateScript}
              disabled={!!loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'auto_fix_high'}
              </span>
              {loading ? loading : 'SÁNG TÁC KỊCH BẢN AI'}
            </button>
          </div>
        </section>
      </div>
      <div className="flex flex-col h-full">
        <section className="flex-1 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">description</span>
              Nội Dung Kịch Bản
            </h3>
          </div>
          
          <textarea
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 text-sm font-serif leading-relaxed focus:border-red-500 outline-none resize-none text-slate-200"
            placeholder="Kịch bản chi tiết..."
            value={project.scriptMarkdown}
            onChange={e => updateProject({ scriptMarkdown: e.target.value })}
          />
          
          {project.scriptMarkdown && (
            <button
              onClick={onNext}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-white"
            >
              CHỐT KỊCH BẢN & BÓC TÁCH ASSET
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </section>
      </div>
    </div>
  );
};