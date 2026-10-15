import React, { useState, useEffect } from 'react';
interface RawVoiceCustomizerProps {
  selectedBaseVoice: string;
  onApplyCustomVoice: (config: {
    baseVoice: string;
    speed: number;
    pitch: string;
    customPrompt: string;
  }) => void;
}
export const RawVoiceCustomizer: React.FC<RawVoiceCustomizerProps> = ({
  selectedBaseVoice,
  onApplyCustomVoice
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [testScript, setTestScript] = useState('Chào mừng bạn đến với Studio Đạo diễn Podcast. Đây là đoạn đọc thử để kiểm tra cấu hình giọng nói tùy biến của bạn. Bắt buộc phát âm tiếng Việt chuẩn xác.');
  const [speed, setSpeed] = useState<number>(1.1);
  const [pitch, setPitch] = useState<number>(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  useEffect(() => {
    setCustomPrompt('');
  }, [selectedBaseVoice]);
  const handlePreview = () => {
    if (!testScript.trim()) return;
    setIsPreviewing(true);
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(testScript);
    
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi-VN') || v.lang.includes('vi_VN'));
    if (viVoice) utterance.voice = viVoice;
    utterance.lang = 'vi-VN';
    utterance.rate = speed;
    utterance.pitch = 1 + (pitch / 40);
    utterance.onend = () => setIsPreviewing(false);
    utterance.onerror = () => setIsPreviewing(false);
    window.speechSynthesis.speak(utterance);
    
    setTimeout(() => setIsPreviewing(false), 8000);
  };
  return (
    <div className="mt-8 bg-[#0e0f14] border-2 border-amber-500/30 rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Huy hiệu bảng */}
      <div className="absolute -top-4 left-10 bg-amber-500 text-black px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-xl shadow-amber-500/20 flex items-center gap-2">
        <span className="material-symbols-outlined text-[14px]">neurology</span>
        ĐỘNG CƠ TINH CHỈNH Nơ-ron
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/5 gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            Tùy Biến Giọng Gốc: <span className="text-amber-500">{selectedBaseVoice}</span>
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold opacity-60">Cấu hình tham số giọng đọc AI v1.1</p>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <span className="material-symbols-outlined text-xs">translate</span>
             Ngôn ngữ: Tiếng Việt (vi-VN)
           </div>
           <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <span className="material-symbols-outlined text-xs">graphic_eq</span>
             Tần số lấy mẫu: 24kHz
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
        {/* CỘT TRÁI */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-amber-500">description</span>
                Mô tả chất giọng (Chỉ thị câu lệnh)
              </label>
              <span className="text-[9px] text-slate-600 font-mono">TÙY CHỌN</span>
            </div>
            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ví dụ: Giọng nữ Hà Nội trầm ấm, khoảng 30 tuổi, độ khàn nhẹ, ngắt nghỉ dứt khoát như biên tập viên truyền hình..."
              className="w-full bg-[#15161e] border border-white/5 rounded-2xl p-5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all resize-none leading-relaxed custom-scrollbar shadow-inner"
            />
          </div>
          <div className="bg-[#13141b] p-8 rounded-[2rem] border border-white/5 space-y-8">
            <div className="space-y-5">
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <span className="text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">speed</span>
                  Tốc độ đọc
                </span>
                <span className="text-amber-500 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[8px] font-mono text-slate-700 uppercase font-bold px-1">
                <span>Chậm (0.8)</span>
                <span>Mặc định (1.0)</span>
                <span>Nhanh (1.3)</span>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <span className="text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">height</span>
                  Độ cao giọng (Pitch Shift)
                </span>
                <span className="text-amber-500 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded">{pitch > 0 ? `+${pitch}` : pitch}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="2"
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[8px] font-mono text-slate-700 uppercase font-bold px-1">
                <span>Trầm (-20%)</span>
                <span>0%</span>
                <span>Bổng (+20%)</span>
              </div>
            </div>
          </div>
        </div>
        {/* CỘT PHẢI */}
        <div className="flex flex-col gap-8 h-full">
          <div className="space-y-4 flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-amber-500">campaign</span>
              Đoạn văn đọc thử (Tiếng Việt)
            </label>
            <textarea
              rows={4}
              value={testScript}
              onChange={(e) => setTestScript(e.target.value)}
              className="w-full h-full min-h-[160px] bg-[#15161e] border border-white/5 rounded-2xl p-6 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all resize-none leading-relaxed custom-scrollbar shadow-inner"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handlePreview}
              disabled={isPreviewing || !testScript.trim()}
              className="py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95 group"
            >
              {isPreviewing ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-amber-500 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-4 bg-amber-500 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-3 bg-amber-500 animate-bounce"></div>
                  <span className="ml-2 font-mono">ĐANG PHÁT...</span>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">volume_up</span>
                  Nghe Thử Giọng Này
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onApplyCustomVoice({
                baseVoice: selectedBaseVoice,
                speed,
                pitch: `${pitch >= 0 ? '+' : ''}${pitch}%`,
                customPrompt
              })}
              className="py-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-3"
            >
              Dùng Giọng Này
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </button>
          </div>
          
          <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-4">
            <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
            <p className="text-[10px] text-amber-200/50 leading-relaxed uppercase font-bold tracking-tight">
              Bản kết xuất cuối cùng sẽ bắt buộc phát âm 100% tiếng Việt bản xứ, chuẩn toàn bộ dấu thanh điệu theo chỉ thị câu lệnh bạn đã thiết lập.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};