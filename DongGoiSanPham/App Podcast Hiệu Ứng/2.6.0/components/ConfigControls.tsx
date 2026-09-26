import { ASPECT_RATIOS, VIDEO_MODELS, THREAD_OPTIONS, SPEEDS, RESOLUTIONS } from '../constants';
interface ConfigControlsProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}
export const ConfigControls: React.FC<ConfigControlsProps> = ({ config, onChange }) => {
  const updateConfig = (key: keyof ProjectConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };
  return (
    <div className="space-y-2 bg-white/[0.02] rounded-xl p-1 border border-white/5 shadow-inner">
      {/* Aspect Ratio Grid */}
      <div className="grid grid-cols-5 gap-1">
        {ASPECT_RATIOS.map(r => (
          <button 
            key={r}
            onClick={() => updateConfig('ratio', r)}
            className={`py-1.5 text-[9px] font-black rounded-md border transition-all ${config.ratio === r ? 'bg-[#F31B17] border-red-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            {r}
          </button>
        ))}
      </div>
      {/* Model Selection - Row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-[14px] text-slate-500">model_training</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Model</span>
        </div>
        <select 
          value={config.model} 
          onChange={e => updateConfig('model', e.target.value)}
          className="bg-[#1c192b] border border-slate-800 rounded-lg px-2 py-1 text-[9px] focus:border-[#F31B17] outline-none cursor-pointer flex-1 text-right"
        >
          {VIDEO_MODELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Threads - Row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-[14px] text-slate-500">bolt</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Luồng</span>
        </div>
        <div className="flex gap-1">
          {THREAD_OPTIONS.map(opt => (
            <button 
              key={opt}
              onClick={() => updateConfig('threads', opt)}
              className={`w-8 py-1 text-[9px] font-black rounded-md border transition-all ${config.threads === opt ? 'bg-[#F31B17] border-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {/* Speed - Row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-[14px] text-slate-500">speed</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Tốc độ</span>
        </div>
        <div className="flex gap-1">
          {SPEEDS.map(opt => (
            <button 
              key={opt}
              onClick={() => updateConfig('speed', opt)}
              className={`px-2 py-1 text-[9px] font-black rounded-md border transition-all ${config.speed === opt ? 'bg-[#F31B17] border-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {/* Quality - Row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-[14px] text-slate-500">high_quality</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Chất lượng</span>
        </div>
        <div className="flex gap-1">
          {RESOLUTIONS.map(opt => (
            <button 
              key={opt}
              onClick={() => updateConfig('resolution', opt)}
              className={`px-2 py-1 text-[9px] font-black rounded-md border transition-all ${config.resolution === opt ? 'bg-[#F31B17] border-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};