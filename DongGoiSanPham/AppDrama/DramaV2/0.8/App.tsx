import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScriptProjectData, Shot, Character, Location } from './types';
import { DEFAULT_PROJECT } from './data/project';
import { ffmpegService } from './services/ffmpegService';
import Header from './components/Header';
import PreProduction from './components/PreProduction';
import Storyboard from './components/Storyboard';
import { Flow } from 'flow-sdk';
export default function App() {
  const [projectData, setProjectData] = useState<ScriptProjectData>(DEFAULT_PROJECT);
  const [activeTab, setActiveTab] = useState<'pre' | 'story'>('pre');
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  useEffect(() => {
    // Initial FFmpeg load for merging
    ffmpegService.load().catch(err => console.error("FFmpeg Load Error:", err));
  }, []);
  const updateCharacter = (charId: string, updates: Partial<Character>) => {
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        characters: prev.project.characters.map(c => c.id === charId ? { ...c, ...updates } : c)
      }
    }));
  };
  const updateLocation = (locId: string, updates: Partial<Location>) => {
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        locations: prev.project.locations.map(l => l.id === locId ? { ...l, ...updates } : l)
      }
    }));
  };
  const updateShot = (shotId: string, updates: Partial<Shot>) => {
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        shots: prev.project.shots.map(s => s.id === shotId ? { ...s, ...updates } : s)
      }
    }));
  };
  const handleImport = (jsonData: ScriptProjectData) => {
    setProjectData(jsonData);
  };
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(projectData, null, 2);
    const bytes = new TextEncoder().encode(dataStr);
    const base64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
    
    Flow.download({
      base64,
      mimeType: 'application/json',
      filename: `${projectData.project.title.replace(/\s+/g, '_')}_script.json`
    });
  }, [projectData]);
  const handleDownloadClips = async () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia);
    if (shotsWithVideo.length === 0) {
      alert("Chưa có clip nào để tải xuống.");
      return;
    }
    alert(`Đang chuẩn bị tải xuống ${shotsWithVideo.length} clips...`);
    for (const shot of shotsWithVideo) {
      if (shot.videoMedia) {
        await Flow.download({
          base64: shot.videoMedia.base64,
          mimeType: 'video/mp4',
          filename: `Shot_${shot.shotNumber}_${shot.title.replace(/\s+/g, '_')}.mp4`
        });
      }
    }
  };
  const handleMergeVideo = async () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia);
    const clips = shotsWithVideo.map(s => s.videoMedia!);
    
    if (clips.length < 2) {
      alert("Cần ít nhất 2 clips đã tạo xong để ghép video.");
      return;
    }
    setIsMerging(true);
    setMergeProgress(0);
    try {
      await ffmpegService.load();
      const fileNames: string[] = [];
      for (let i = 0; i < clips.length; i++) {
        const name = `input_${i}.mp4`;
        fileNames.push(name);
        const bytes = Uint8Array.from(atob(clips[i].base64), c => c.charCodeAt(0));
        await ffmpegService.writeFile(name, bytes);
        setMergeProgress((i / clips.length) * 30);
      }
      const inputArgs: string[] = [];
      fileNames.forEach(name => inputArgs.push('-i', name));
      
      const filterInputs = fileNames.map((_, i) => `[${i}:v][${i}:a]`).join('');
      const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
      ffmpegService.onProgress(({ progress }) => {
        setMergeProgress(30 + (progress * 70));
      });
      await ffmpegService.exec([
        ...inputArgs,
        '-filter_complex', filterComplex,
        '-map', '[outv]',
        '-map', '[outa]',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-c:a', 'aac',
        '-pix_fmt', 'yuv420p',
        '-movflags', 'faststart',
        '-y', 'output_merged.mp4',
      ]);
      const outputData = await ffmpegService.readFile('output_merged.mp4') as Uint8Array;
      const base64 = btoa(Array.from(outputData).map(b => String.fromCharCode(b)).join(''));
      
      await Flow.download({
        base64,
        mimeType: 'video/mp4',
        filename: `${projectData.project.title.replace(/\s+/g, '_')}_Final.mp4`
      });
      // Cleanup FFmpeg virtual FS
      for (const name of fileNames) await ffmpegService.deleteFile(name);
      await ffmpegService.deleteFile('output_merged.mp4');
    } catch (error) {
      console.error("Merge error:", error);
      alert("Lỗi khi ghép video. Vui lòng kiểm tra lại định dạng các clips.");
    } finally {
      setIsMerging(false);
      setMergeProgress(0);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-[#070709] text-slate-200 overflow-hidden font-sans">
      <Header 
        project={projectData.project} 
        config={projectData.config}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onImport={handleImport}
        onExport={handleExport}
        onDownloadClips={handleDownloadClips}
        onMerge={handleMergeVideo}
        onConfigChange={(c) => setProjectData(prev => ({ ...prev, config: { ...prev.config, ...c } }))}
        isMerging={isMerging}
        mergeProgress={mergeProgress}
      />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
        {activeTab === 'pre' ? (
          <PreProduction 
            characters={projectData.project.characters}
            locations={projectData.project.locations}
            onUpdateCharacter={updateCharacter}
            onUpdateLocation={updateLocation}
            onNext={() => setActiveTab('story')}
          />
        ) : (
          <Storyboard 
            shots={projectData.project.shots}
            characters={projectData.project.characters}
            locations={projectData.project.locations}
            config={projectData.config}
            onUpdateShot={updateShot}
            aspectRatio={projectData.project.aspectRatio}
          />
        )}
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}