import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flow } from 'flow-sdk';
import { ProjectState, GenrePreset, CameraRig, CameraRigMode } from '../types';
import { GENRE_PRESETS, CAMERA_RIG_SYSTEM } from '../constants';
import { MATRIX_12_VOICES } from '../constants/voicePresets';
import { generateAiscriptV4 } from '../services/directorService';
import { VoiceLab } from './VoiceLab';
import { LicenseStatus } from './LicenseStatus';
interface Props {
  onComplete: (project: ProjectState) => void;
}
export const ProjectWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [masterMedia, setMasterMedia] = useState<{ id: string; base64: string } | null>(null);
  
  const [numShots, setNumShots] = useState(2); // Số Shot cố định
  const [genre, setGenre] = useState<GenrePreset>(GENRE_PRESETS[0]);
  const [subNiche, setSubNiche] = useState('');
  
  // Điều phối Camera theo chuẩn Protocol: DYNAMIC_MULTI_CAM vs STATIC_LOCKED_OFF
  const [cameraRigMode, setCameraRigMode] = useState<CameraRigMode>('DYNAMIC_MULTI_CAM');
  const [fixedRigChoice, setFixedRigChoice] = useState<CameraRig>('CAM_FRONT_MCU');
  const [selectedVoiceId, setSelectedVoiceId] = useState(MATRIX_12_VOICES[0].id);
  const [showVoiceLab, setShowVoiceLab] = useState(false);
  const [script, setScript] = useState('');
  const [dramaHook, setDramaHook] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const currentVoice = MATRIX_12_VOICES.find(v => v.id === selectedVoiceId) || MATRIX_12_VOICES[0];
  const totalDuration = numShots * 8;
  const maxWords = numShots * 32;
  const handleSelectMedia = async (type: 'image', setter: any) => {
    const m = await Flow.media.select({ filter: type });
    if (m) setter({ id: m.mediaId, base64: m.base64 });
  };
  const handleAIScript = async () => {
    setIsGeneratingScript(true);
    try {
      const { script: s, hook: h } = await generateAiscriptV4(subNiche, genre, numShots);
      setScript(s);
      setDramaHook(h);
    } finally {
      setIsGeneratingScript(false);
    }
  };
  const launchStudio = () => {
    onComplete({
      model: 'Omni 1.1 Flash',
      resolution: '720p',
      aspectRatio: '9:16',
      masterMediaId: masterMedia?.id,
      masterBase64: masterMedia?.base64,
      selectedVoiceId,
      genre,
      currentTopic: subNiche || genre.name,
      subNiche,
      totalDuration,
      script,
      dramaHook,
      scenes: [],
      cameraRigMode,
      fixedRigChoice
    });
  };
  const StepHeader = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[40px] w-[120px] object-contain mb-1" />
        <a href="https://fastaivn.com" target="_blank" rel="noopener noreferrer" className="text-[9px] text-slate-500 hover:text-[#F31B17] mb-3 transition-colors">fastaivn.com</a>
        <h1 className="text-4xl font-black tracking-tighter text-white italic leading-none">KOCSTUDIO <span className="text-[#F31B17]">PRO</span></h1>
        <p className="text-[9px] font-bold text-[#F31B17]/80 tracking-[0.4em] uppercase mt-2">AI Podcast Prompt Director Protocol v4.1</p>
      </div>
      
      <div className="flex items-center gap-2 max-w-xs mx-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full bg-slate-900 overflow-hidden">
            <motion.div 
              initial={false}
              animate={{ width: step >= i ? '100%' : '0%' }}
              className={`h-full ${step >= i ? 'bg-[#F31B17]' : 'bg-transparent'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
  if (showVoiceLab) {
    return (
      <VoiceLab 
        onBack={() => setShowVoiceLab(false)} 
        onConfirm={(v) => { 
          setSelectedVoiceId(v.id); 
          setShowVoiceLab(false); 
        }} 
      />
    );
  }
  return (
    <div className="flex flex-col h-full bg-[#08080a] text-white">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 max-w-xl mx-auto w-full space-y-12 pt-12 pb-32">
        <StepHeader />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                  <label className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#F31B17]">lock</span>
                    1. MỎ NEO THAM CHIẾU [MASTER_REF_IMAGE]
                  </label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight opacity-75">
                    Gốc tọa độ nhận diện 1:1 • Khóa tỷ lệ xương mặt, mắt, gọng kính, trang phục & mic Shure
                  </p>
                </div>
                
                <button 
                  onClick={() => handleSelectMedia('image', setMasterMedia)}
                  className="w-full max-w-[340px] aspect-[9/16] bg-[#0d0d12] rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden hover:border-[#F31B17]/50 transition-all relative group shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
                >
                  {masterMedia ? (
                    <img src={`data:image/jpeg;base64,${masterMedia.base64}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-5 opacity-40 group-hover:opacity-80 transition-opacity">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                         <span className="material-symbols-outlined text-4xl text-[#F31B17]">add_a_photo</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Chọn Master Reference Anchor</span>
                    </div>
                  )}
                  
                  {masterMedia && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F31B17]/20 to-transparent pointer-events-none" />
                  )}
                </button>
              </div>
              <div className="p-4 bg-[#F31B17]/5 border border-[#F31B17]/20 rounded-2xl text-[9px] font-mono text-red-300/80 leading-relaxed space-y-1">
                <div>✓ Biometric Lock: Khóa khung xương mặt, cấm bóp cằm V-line, cấm đổi gọng kính.</div>
                <div>✓ Asset Lock: Cố định vải áo, logo ngực, micro Shure ở nửa PHẢI bàn thu (cấm lật trái).</div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!masterMedia}
                className="w-full py-6 bg-[#F31B17] text-white font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-[#d11713] transition-all shadow-[0_20px_50px_rgba(243,27,23,0.25)] flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95"
              >
                KHỞI TẠO CẤU HÌNH SHOT
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              
              {/* CÔNG THỨC MẬT ĐỘ TỪ & KIẾN TRÚC SHOT 8S */}
              <div className="p-6 bg-[#0f1016] border border-[#F31B17]/20 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#F31B17] text-sm">timer</span>
                      2. KIẾN TRÚC SHOT MODULE 8.0S
                    </label>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">Cố định 8.0s/Shot • Ngân sách tối đa 32 từ/Shot</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#F31B17] font-black px-2.5 py-1 bg-[#F31B17]/10 rounded-lg">
                    {numShots} Shot ({totalDuration}s)
                  </span>
                </div>
                <input 
                  type="range" min="1" max="40" step="1" 
                  value={numShots} onChange={e => setNumShots(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#F31B17]"
                />
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>Tổng ngân sách từ: ~{maxWords} từ</span>
                  <span>00:00-07.2s thoại • 07.2-08.0s tĩnh</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8, 12, 16, 24, 32].map(n => (
                    <button key={n} onClick={() => setNumShots(n)} className={`py-2 rounded-lg text-[9px] font-mono border transition-all ${numShots === n ? 'bg-[#F31B17] text-white border-[#F31B17] font-bold shadow-md shadow-red-900/30' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                      {n} Shot ({n * 8}s)
                    </button>
                  ))}
                </div>
              </div>
              {/* ĐIỀU PHỐI CAMERA: DYNAMIC MULTI-CAM vs STATIC LOCKED-OFF */}
              <div className="p-6 bg-[#0f1016] border border-[#F31B17]/20 rounded-3xl space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#F31B17] text-xl">videocam</span>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white">5. ĐIỀU PHỐI CAMERA CHUẨN GIAO DIỆN</h4>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">Lựa chọn chế độ điều phối góc máy cho từng shot 8.0s</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Dynamic Multi-Cam */}
                  <button
                    type="button"
                    onClick={() => setCameraRigMode('DYNAMIC_MULTI_CAM')}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                      cameraRigMode === 'DYNAMIC_MULTI_CAM'
                        ? 'bg-[#F31B17]/10 border-[#F31B17] text-white shadow-lg shadow-red-900/20'
                        : 'bg-[#14151e] border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-2xl text-[#F31B17]">movie</span>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${cameraRigMode === 'DYNAMIC_MULTI_CAM' ? 'bg-[#F31B17] text-white' : 'bg-white/5 text-slate-500'}`}>
                        MULTI-CAM
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase text-white tracking-wide">Dynamic Multi-Cam</div>
                      <p className="text-[9px] text-slate-400 font-medium mt-1 leading-relaxed">
                        Luân chuyển góc mỗi 4.0s (Cắt dứt khoát tại 04:00 giữa 2 góc). TUYỆT ĐỐI CẤM pan/drift.
                      </p>
                    </div>
                  </button>
                  {/* Static Locked-Off */}
                  <button
                    type="button"
                    onClick={() => setCameraRigMode('STATIC_LOCKED_OFF')}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                      cameraRigMode === 'STATIC_LOCKED_OFF'
                        ? 'bg-[#F31B17]/10 border-[#F31B17] text-white shadow-lg shadow-red-900/20'
                        : 'bg-[#14151e] border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-2xl text-amber-400">tripod</span>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${cameraRigMode === 'STATIC_LOCKED_OFF' ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-500'}`}>
                        TRIPOD LOCK
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase text-white tracking-wide">Static Locked-Off</div>
                      <p className="text-[9px] text-slate-400 font-medium mt-1 leading-relaxed">
                        Khóa Start Frame vào [MASTER_REF_IMAGE]. Máy quay đặt tĩnh 100% trên tripod không rung lắc.
                      </p>
                    </div>
                  </button>
                </div>
                {cameraRigMode === 'STATIC_LOCKED_OFF' && (
                  <div className="space-y-3 pt-3 border-t border-white/5 animate-in fade-in duration-300">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-[#F31B17]">photo_camera</span>
                      Góc máy Tripod tĩnh cố định xuyên suốt
                    </label>
                    <select
                      value={fixedRigChoice}
                      onChange={e => setFixedRigChoice(e.target.value as CameraRig)}
                      className="w-full bg-[#161720] border border-[#F31B17]/30 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-[#F31B17] transition-all cursor-pointer"
                    >
                      {CAMERA_RIG_SYSTEM.map(r => (
                        <option key={r.id} value={r.id}>{r.label} — {r.description}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {/* MA TRẬN PHONG CÁCH */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PHONG CÁCH PODCAST</label>
                <div className="grid grid-cols-2 gap-3">
                  {GENRE_PRESETS.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setGenre(p)}
                      className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all ${genre.id === p.id ? 'bg-white/5 border-[#F31B17] shadow-2xl' : 'bg-[#0d0d12] border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <span className="material-symbols-outlined text-[24px]" style={{ color: p.color }}>{p.icon}</span>
                      <span className="text-[10px] font-black uppercase italic leading-tight">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SUB-NICHE (NGÁCH NỘI DUNG)</label>
                <input 
                  type="text"
                  placeholder="VD: Tâm lý hẹn hò, Quản trị tài chính cá nhân..."
                  value={subNiche}
                  onChange={e => setSubNiche(e.target.value)}
                  className="w-full bg-[#0d0d12] border border-white/5 rounded-2xl px-6 py-5 text-sm outline-none focus:border-[#F31B17] transition-all font-medium"
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 border border-white/5 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-[10px]">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-6 bg-white text-black font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-slate-200 transition-colors">Tiếp tục: Giọng & Kịch bản</button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              
              {/* 4. MA TRẬN 12 GIỌNG GỐC */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    4. MA TRẬN 12 GIỌNG GỐC & KHÓA ÂM HỌC
                  </label>
                  <button onClick={() => setShowVoiceLab(true)} className="text-[10px] font-black uppercase text-[#F31B17] flex items-center gap-2 hover:underline">
                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                    CHỌN TỪ 12 GIỌNG GỐC
                  </button>
                </div>
                
                <div className="p-5 bg-[#0d0d12] border border-[#F31B17]/20 rounded-[2rem] flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#F31B17]/10 rounded-full flex items-center justify-center border border-[#F31B17]/20 shadow-inner">
                    <span className="material-symbols-outlined text-[#F31B17] text-3xl">mic</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic text-white">{currentVoice.label}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                      {currentVoice.subLabel} • Speed: {currentVoice.speed}x • Pitch: {currentVoice.pitch}
                    </p>
                    <p className="text-[8px] text-slate-500 mt-1 italic">{currentVoice.acousticProfile}</p>
                  </div>
                </div>
              </div>
              {/* 3. DRAMA HOOK & SCRIPT VERBATIM */}
              <div className="space-y-5 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    3. QUY TRÌNH DRAMA HOOK & THOẠI CHỮ THƯỜNG
                  </label>
                  <button 
                    onClick={handleAIScript}
                    disabled={isGeneratingScript}
                    className="px-6 py-2.5 bg-[#F31B17]/10 border border-[#F31B17]/30 rounded-xl text-[10px] font-black uppercase text-[#F31B17] flex items-center gap-2 hover:bg-[#F31B17]/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">{isGeneratingScript ? 'sync' : 'magic_button'}</span>
                    {isGeneratingScript ? 'ĐANG BIÊN TẬP...' : 'TỰ ĐỘNG VIẾT HOOK & SCRIPT'}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#F31B17]/80 uppercase tracking-[0.2em]">
                    Drama Hook (BẮT BUỘC ĐỌC ĐẦU SHOT 01 - Chữ thường, không in hoa bừa bãi)
                  </label>
                  <input 
                    type="text"
                    value={dramaHook}
                    onChange={e => setDramaHook(e.target.value)}
                    placeholder="ví dụ: 99% người làm nội dung thất bại vì không hiểu một bí mật đơn giản này..."
                    className="w-full bg-[#0d0d12] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#F31B17] outline-none font-medium text-slate-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Toàn bộ kịch bản nối tiếp ({numShots} shots, tối đa {maxWords} từ):
                  </label>
                  <textarea 
                    value={script}
                    onChange={e => setScript(e.target.value)}
                    placeholder="nhập nội dung podcast dạng chữ thường chuẩn chính tả tiếng việt..."
                    className="w-full h-48 bg-[#0d0d12] border border-white/10 rounded-3xl p-6 text-sm focus:border-[#F31B17] outline-none resize-none custom-scrollbar leading-relaxed font-medium text-slate-200"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-6 border border-white/5 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-[10px]">Back</button>
                <button 
                  onClick={launchStudio}
                  disabled={!script.trim()}
                  className="flex-1 py-6 bg-[#F31B17] hover:bg-[#d11713] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-all disabled:opacity-20 text-[10px]"
                >
                  BẮT ĐẦU DIRECT WORKSPACE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pt-8 border-t border-white/5">
          <LicenseStatus />
          <p className="text-[9px] text-center text-slate-600 mt-2">App version 1.0.2</p>
        </div>
      </div>
    </div>
  );
};