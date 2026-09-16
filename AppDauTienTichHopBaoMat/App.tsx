import React, { useState, useEffect, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { ffmpegService } from './services/ffmpegService';
import { StorySegment, AppTab, StoryConfig, VisualProfile } from './types';
import { getStoredLicenseKey, verifyLicense } from './services/licenseService';
import { LicenseGate } from './components/LicenseGate';
// --- UI Components ---
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center px-2 mb-1">
    <span className="text-[10px] font-bold text-white/40 tracking-[1px] uppercase">
      {children}
    </span>
  </div>
);
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${className}`}>
    {children}
  </div>
);
const FloatingButton: React.FC<{
  icon?: string; children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost'; 
  onClick?: () => void; disabled?: boolean; loading?: boolean;
  className?: string;
}> = ({ icon, children, variant = 'primary', onClick, disabled, loading, className = '' }) => {
  const base = "relative flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-white/10",
    secondary: "bg-[#1a1a1a] text-white border border-white/10 hover:bg-[#252525]",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? (
        <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
      ) : icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};
// --- Selectors & Inputs ---
const ModernSelect: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);
  return (
    <div ref={ref} className="relative flex-1">
      <div className="text-[9px] font-bold text-white/30 uppercase ml-1 mb-1">{label}</div>
      <button onClick={() => setOpen(!open)} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 flex items-center justify-between hover:bg-white/10 transition-colors">
        <span className="text-[11px] font-medium truncate">{value}</span>
        <span className="material-symbols-outlined text-white/40 text-[18px]">expand_more</span>
      </button>
      {open && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-2">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} className={`w-full text-left px-3 py-2.5 text-[11px] hover:bg-white/5 transition-colors ${o === value ? 'text-white bg-white/10' : 'text-white/60'}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// --- Config ---
const DIRECTORS = ['None', 'Christopher Nolan', 'Wes Anderson', 'Quentin Tarantino', 'Hayao Miyazaki', 'Tim Burton', 'Greta Gerwig', 'Denis Villeneuve', 'David Fincher', 'Stanley Kubrick', 'Bong Joon-ho'];
const GENRES = ['Drama', 'Mystery', 'Crime', 'Horror', 'Psychological', 'Action Thriller', 'Sci-Fi', 'Romance', 'Historical'];
const STYLES = ['Cinematic', 'Realistic', 'Ghibli Anime', 'American Comic', 'Japanese Anime', 'Pixar 3D', 'Claymation', 'Blackboard Chalk', 'Stickman Sketch', 'Oil Painting', 'Cyberpunk'];
const LANGUAGES = ['Tiếng Việt', 'English', 'Japanese', 'Korean', 'French', 'Spanish'];
export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('story');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(32);
  const [config, setConfig] = useState<StoryConfig>({
    imageModel: '🍌 Nano Banana Pro',
    videoModel: 'Veo 3.1 - Lite',
    language: 'Tiếng Việt',
    style: 'Cinematic',
    director: 'None',
    genre: 'Drama',
    profiles: []
  });
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [finalVideo, setFinalVideo] = useState<string | null>(null);
  // License State
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  useEffect(() => {
    const id = 'custom-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        html, body, #root { height: 100%; background: #050505; color: white; font-family: 'Google Sans Text', sans-serif; }
        .dark-scrollbar::-webkit-scrollbar { width: 4px; }
        .dark-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .skeleton { background: linear-gradient(90deg, #111 25%, #222 50%, #111 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `;
      document.head.appendChild(style);
    }
    ffmpegService.load();
    // Check license on mount
    checkAppLicense();
  }, []);
  const checkAppLicense = async () => {
    const storedKey = getStoredLicenseKey();
    if (!storedKey) {
      setIsLicensed(false);
      return;
    }
    
    // Always call getDocFromServer to verify
    const isValid = await verifyLicense(storedKey);
    setIsLicensed(isValid);
  };
  if (isLicensed === null) {
    return (
      <div className="h-full w-full bg-[#050505] flex items-center justify-center">
        <span className="animate-spin material-symbols-outlined text-white/20 text-[48px]">progress_activity</span>
      </div>
    );
  }
  if (isLicensed === false) {
    return <LicenseGate onVerified={() => setIsLicensed(true)} />;
  }
  // --- Identity Logic ---
  const addProfile = async (type: 'character' | 'location') => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      const newProfile: VisualProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: type === 'character' ? 'New Character' : 'New Location',
        description: '',
        base64: media.base64,
        mediaId: media.mediaId,
        type
      };
      setConfig(prev => ({ ...prev, profiles: [...prev.profiles, newProfile] }));
    } catch (e) {}
  };
  const updateProfile = (id: string, updates: Partial<VisualProfile>) => {
    setConfig(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };
  const removeProfile = (id: string) => {
    setConfig(prev => ({ ...prev, profiles: prev.profiles.filter(p => p.id !== id) }));
  };
  // --- Story Logic ---
  const generateStoryboard = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    setStatus('Drafting screenplay with visual consistency...');
    try {
      const numShots = Math.ceil(duration / 8);
      const characterContext = config.profiles.filter(p => p.type === 'character').map(p => `${p.name}: ${p.description}`).join('\n');
      const locationContext = config.profiles.filter(p => p.type === 'location').map(p => `${p.name}: ${p.description}`).join('\n');
      const systemInstruction = `You are a world-class film director. 
      Break the story into ${numShots} distinct shots (8s each).
      
      CONSISTENCY RULES:
      - For every shot, you MUST specify:
        1. timeOfDay: (e.g., Golden Hour, Midnight, Rainy Morning)
        2. setting: Precise location description.
        3. outfit: Specific clothing and hairstyle for characters.
      - imagePrompt: Create a high-detail prompt for an image generator. Include the character's physical features, the setting, time of day, and EXACT outfit/hair for this specific moment. 
      - videoPrompt: Describe the cinematic camera motion (e.g., Dolly zoom, slow pan left, handheld tracking).
      - Ensure the style strictly matches: ${config.style}, directed by ${config.director}, Genre: ${config.genre}.
      
      CHARACTERS: ${characterContext}
      LOCATIONS: ${locationContext}
      
      Return JSON array of objects with keys: script, imagePrompt, videoPrompt, timeOfDay, setting, outfit. Language: ${config.language}.`;
      const { text } = await Flow.generate.text(prompt, { 
        systemInstruction, 
        thinkingLevel: 'high',
        images: config.profiles.filter(p => p.base64).map(p => ({ base64: p.base64!, mimeType: 'image/jpeg' }))
      });
      const json = JSON.parse(text.substring(text.indexOf('['), text.lastIndexOf(']') + 1));
      setSegments(json.map((s: any, i: number) => ({
        ...s,
        id: `seg-${i}`,
        status: 'idle'
      })));
      setActiveTab('timeline');
    } catch (err) {
      setStatus(`Drafting failed: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const generateShot = async (id: string) => {
    const seg = segments.find(s => s.id === id);
    if (!seg) return;
    
    updateSegment(id, { status: 'generating-image', error: undefined });
    try {
      const charRefIds = config.profiles.filter(p => p.type === 'character' && p.mediaId).map(p => p.mediaId!);
      const locRefIds = config.profiles.filter(p => p.type === 'location' && p.mediaId).map(p => p.mediaId!);
      
      const img = await Flow.generate.image({
        prompt: seg.imagePrompt,
        modelDisplayName: config.imageModel,
        aspectRatio: '16:9',
        referenceImageMediaIds: [...charRefIds, ...locRefIds].slice(0, 10)
      });
      
      updateSegment(id, { imageBase64: img.base64, imageMediaId: img.mediaId, status: 'ready-image' });
      
      updateSegment(id, { status: 'generating-video' });
      const vid = await Flow.generate.video({
        prompt: seg.videoPrompt,
        firstFrameImageMediaId: img.mediaId,
        modelDisplayName: config.videoModel,
        durationSeconds: 8,
        aspectRatio: '16:9'
      });
      
      updateSegment(id, { videoBase64: vid.base64, videoMediaId: vid.mediaId, status: 'ready-video' });
    } catch (err) {
      updateSegment(id, { status: 'error', error: String(err) });
    }
  };
  const updateSegment = (id: string, updates: Partial<StorySegment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const renderTabIcon = (tab: AppTab, icon: string, label: string) => (
    <button onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1.5 py-4 transition-all ${activeTab === tab ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {activeTab === tab && <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />}
    </button>
  );
  return (
    <div className="flex h-full w-full bg-[#050505] overflow-hidden">
      {/* 3D Sidebar Tabs */}
      <div className="w-20 h-full border-r border-white/5 flex flex-col bg-white/[0.02] backdrop-blur-3xl relative z-10">
        <div className="flex-1 flex flex-col pt-8">
          {renderTabIcon('story', 'movie_edit', 'Story')}
          {renderTabIcon('identity', 'face_6', 'Identity')}
          {renderTabIcon('timeline', 'view_timeline', 'Timeline')}
          {renderTabIcon('export', 'ios_share', 'Export')}
        </div>
        <div className="p-4 border-t border-white/5 flex flex-col gap-4">
           <span className="material-symbols-outlined text-white/20 text-center">settings</span>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto dark-scrollbar p-8">
        
        {/* TAB 1: STORY SETUP */}
        {activeTab === 'story' && (
          <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4">
             <header>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Director's Script</h1>
                <p className="text-white/40 text-sm">Define your vision. AI will handle the technical cinematography.</p>
             </header>
             <GlassCard className="p-6 space-y-8">
                <div className="space-y-4">
                  <SectionLabel>Conceptual Idea</SectionLabel>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe your story idea... (e.g., A detective finds a mysterious glowing box in a dark Tokyo alleyway)"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white/20 outline-none transition-all resize-none placeholder-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ModernSelect label="Director Style" value={config.director} options={DIRECTORS} onChange={v => setConfig({...config, director: v})} />
                  <ModernSelect label="Visual Style" value={config.style} options={STYLES} onChange={v => setConfig({...config, style: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ModernSelect label="Genre" value={config.genre} options={GENRES} onChange={v => setConfig({...config, genre: v})} />
                  <div className="flex-1">
                    <div className="text-[9px] font-bold text-white/30 uppercase ml-1 mb-1">Duration</div>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 h-11">
                       <input type="range" min={8} max={120} step={8} value={duration} onChange={e => setDuration(Number(e.target.value))} className="flex-1" />
                       <span className="text-xs font-mono w-8 text-right">{duration}s</span>
                    </div>
                  </div>
                </div>
                <FloatingButton onClick={generateStoryboard} loading={isProcessing} className="w-full py-4 text-sm font-bold uppercase tracking-widest">
                  Generate Screenplay
                </FloatingButton>
             </GlassCard>
          </div>
        )}
        {/* TAB 2: IDENTITY MANAGEMENT */}
        {activeTab === 'identity' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4">
             <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">Visual Identity</h1>
                  <p className="text-white/40 text-sm">Define characters and locations to ensure consistency across shots.</p>
                </div>
                <div className="flex gap-2">
                   <FloatingButton variant="secondary" icon="person_add" onClick={() => addProfile('character')}>Character</FloatingButton>
                   <FloatingButton variant="secondary" icon="add_location" onClick={() => addProfile('location')}>Location</FloatingButton>
                </div>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.profiles.map(p => (
                  <GlassCard key={p.id} className="p-4 flex gap-4 group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative">
                       {p.base64 ? <img src={`data:image/jpeg;base64,${p.base64}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><span className="material-symbols-outlined text-[32px]">{p.type === 'character' ? 'person' : 'landscape'}</span></div>}
                    </div>
                    <div className="flex-1 space-y-2">
                       <input value={p.name} onChange={e => updateProfile(p.id, { name: e.target.value })} className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" placeholder="Name..." />
                       <textarea value={p.description} onChange={e => updateProfile(p.id, { description: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg p-2 text-[11px] w-full h-12 resize-none text-white/60 outline-none" placeholder="Features, clothing, traits..." />
                       <button onClick={() => removeProfile(p.id)} className="text-[10px] text-red-500/50 hover:text-red-500 flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                       </button>
                    </div>
                  </GlassCard>
                ))}
                {config.profiles.length === 0 && <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/10"><span className="material-symbols-outlined text-[48px] block mb-2">diversity_3</span>Add characters or locations to begin</div>}
             </div>
          </div>
        )}
        {/* TAB 3: TIMELINE / STORYBOARD */}
        {activeTab === 'timeline' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4">
             <header className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Timeline Master</h1>
                  <p className="text-white/40 text-sm">Review, edit prompts, and generate shots.</p>
                </div>
                <FloatingButton variant="secondary" onClick={() => segments.forEach(s => generateShot(s.id))}>Generate All Sequences</FloatingButton>
             </header>
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {segments.map((seg, i) => (
                  <div key={seg.id} className="group flex flex-col gap-4">
                    <div className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative shadow-2xl transition-transform hover:scale-[1.02]">
                       {seg.videoBase64 ? (
                         <video src={`data:video/mp4;base64,${seg.videoBase64}`} controls loop className="w-full h-full object-cover" />
                       ) : seg.imageBase64 ? (
                         <img src={`data:image/jpeg;base64,${seg.imageBase64}`} className="w-full h-full object-cover" />
                       ) : (
                         <div className={`w-full h-full flex items-center justify-center ${seg.status.includes('generating') ? 'skeleton' : ''}`}>
                            <span className="material-symbols-outlined text-white/5 text-[64px]">movie</span>
                         </div>
                       )}
                       
                       <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Shot {i+1}</span>
                          <span className="bg-black/80 backdrop-blur-md text-white/60 text-[10px] px-2 py-1 rounded-md border border-white/10">{seg.timeOfDay}</span>
                       </div>
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FloatingButton onClick={() => generateShot(seg.id)} loading={seg.status.includes('generating')} icon="refresh" variant="secondary" className="w-10 h-10 p-0 rounded-full" children="" />
                       </div>
                    </div>
                    <GlassCard className="p-5 space-y-4">
                       <div className="flex flex-col gap-1">
                          <SectionLabel>Screenplay Script</SectionLabel>
                          <p className="text-sm italic text-white/80">"{seg.script}"</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <SectionLabel>Image Prompt (Visual Identity)</SectionLabel>
                             <textarea value={seg.imagePrompt} onChange={e => updateSegment(seg.id, { imagePrompt: e.target.value })} className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white/60 focus:border-white/40 outline-none resize-none" />
                          </div>
                          <div className="space-y-1.5">
                             <SectionLabel>Video Prompt (Motion)</SectionLabel>
                             <textarea value={seg.videoPrompt} onChange={e => updateSegment(seg.id, { videoPrompt: e.target.value })} className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white/60 focus:border-white/40 outline-none resize-none" />
                          </div>
                       </div>
                       
                       {seg.error && <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] text-red-400">{seg.error}</div>}
                    </GlassCard>
                  </div>
                ))}
             </div>
          </div>
        )}
        {/* TAB 4: EXPORT / STITCHING */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full gap-10">
             {finalVideo ? (
               <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="aspect-video rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10 relative bg-black">
                     <video src={finalVideo} controls className="w-full h-full" />
                  </div>
                  <div className="flex justify-center gap-4">
                    <FloatingButton onClick={async () => {
                      const res = await fetch(finalVideo);
                      const blob = await res.blob();
                      const b64 = await new Promise<string>(r => {
                         const reader = new FileReader();
                         reader.onloadend = () => r((reader.result as string).split(',')[1]);
                         reader.readAsDataURL(blob);
                      });
                      await Flow.download({ base64: b64, mimeType: 'video/mp4', filename: 'ai_production.mp4' });
                    }} icon="download">Download Master Copy</FloatingButton>
                    <FloatingButton variant="secondary" onClick={() => setFinalVideo(null)}>Re-stitch</FloatingButton>
                  </div>
               </div>
             ) : (
               <div className="text-center space-y-8">
                  <span className="material-symbols-outlined text-[100px] text-white/5">auto_videocam</span>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Ready for Master Export?</h2>
                    <p className="text-white/40 text-sm">Ensure all sequences in the timeline are "Ready Video".</p>
                  </div>
                  <FloatingButton onClick={async () => {
                    setIsProcessing(true);
                    setStatus('Stitching final masterpiece...');
                    try {
                      const videos = segments.filter(s => s.videoBase64).map(s => s.videoBase64!);
                      let list = '';
                      for(let i=0; i<videos.length; i++) {
                        const name = `f${i}.mp4`;
                        await ffmpegService.writeFile(name, Uint8Array.from(atob(videos[i]), c => c.charCodeAt(0)));
                        list += `file '${name}'\n`;
                      }
                      await ffmpegService.writeFile('list.txt', new TextEncoder().encode(list));
                      await ffmpegService.exec(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', 'out.mp4']);
                      const data = await ffmpegService.readFile('out.mp4') as Uint8Array;
                      setFinalVideo(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
                    } catch(e) { console.error(e); }
                    setIsProcessing(false);
                  }} loading={isProcessing} className="px-12 py-4">Process Master Stitch</FloatingButton>
               </div>
             )}
          </div>
        )}
      </div>
      {/* Global Status HUD */}
      {status && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-10">
          <GlassCard className="px-4 py-3 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
             <span className="text-xs font-medium tracking-tight">{status}</span>
             <button onClick={() => setStatus('')} className="material-symbols-outlined text-[16px] text-white/20 hover:text-white">close</button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}