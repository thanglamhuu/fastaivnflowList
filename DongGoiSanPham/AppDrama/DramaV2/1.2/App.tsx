import React, { useState, useEffect, useCallback } from 'react';
import { ScriptProjectData, Shot, Character, Location, AspectRatio } from './types';
import { DEFAULT_PROJECT, normalizeProjectData } from './data/project';
import { ffmpegService } from './services/ffmpegService';
import Header from './components/Header';
import PreProduction from './components/PreProduction';
import Storyboard from './components/Storyboard';
import Toast, { ToastItem, ToastType } from './components/Toast';
import { Flow } from 'flow-sdk';
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
import { LicenseStatus } from './components/LicenseStatus';
/** Chuyển Uint8Array sang Base64 một cách an toàn mà không bị văng RangeError: Maximum call stack size exceeded */
function uint8ArrayToBase64(bytes: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([bytes], { type: 'video/mp4' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      const commaIdx = res.indexOf(',');
      if (commaIdx !== -1) {
        resolve(res.substring(commaIdx + 1));
      } else {
        resolve(res);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}
/** Chuyển base64 sang Uint8Array an toàn theo từng khối tránh tràn heap/stack */
function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
export default function App() {
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  const [projectData, setProjectData] = useState<ScriptProjectData>(DEFAULT_PROJECT);
  const [activeTab, setActiveTab] = useState<'pre' | 'story'>('pre');
  const [isMerging, setIsMerging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => {
    // Kiểm tra trạng thái kích hoạt license
    checkLicense().then(result => setIsLicensed(result.valid));
    // Khởi tạo trước ffmpegService nếu có thể
    ffmpegService.load().catch(err => {
      console.warn("Khởi động nền FFmpeg Service:", err?.message || err);
    });
  }, []);
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    const timeout = type === 'error' ? 7000 : 4500;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, timeout);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
  const addCharacter = () => {
    const newId = `char-${Date.now()}`;
    const newChar: Character = {
      id: newId,
      name: `Nhân vật mới ${projectData.project.characters.length + 1}`,
      physicalDescription: '',
      defaultOutfit: '',
      voiceTone: '',
      selectedVoiceId: 'voice_05'
    };
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        characters: [...prev.project.characters, newChar]
      }
    }));
    addToast('Đã thêm nhân vật mới', 'success');
  };
  const removeCharacter = (charId: string) => {
    const charToRemove = projectData.project.characters.find(c => c.id === charId);
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        characters: prev.project.characters.filter(c => c.id !== charId)
      }
    }));
    addToast(`Đã xóa nhân vật ${charToRemove?.name || ''}`, 'info');
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
  const addLocation = () => {
    const newId = `loc-${Date.now()}`;
    const newLoc: Location = {
      id: newId,
      name: `Bối cảnh mới ${projectData.project.locations.length + 1}`,
      description: ''
    };
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        locations: [...prev.project.locations, newLoc]
      }
    }));
    addToast('Đã thêm bối cảnh mới', 'success');
  };
  const removeLocation = (locId: string) => {
    const locToRemove = projectData.project.locations.find(l => l.id === locId);
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        locations: prev.project.locations.filter(l => l.id !== locId)
      }
    }));
    addToast(`Đã xóa bối cảnh ${locToRemove?.name || ''}`, 'info');
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
  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setProjectData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        aspectRatio: ratio
      },
      config: {
        ...prev.config,
        ratio: ratio
      }
    }));
    addToast(`Đã chuyển tỉ lệ khung hình sang ${ratio}`, 'info');
  };
  const handleImport = (rawJson: any) => {
    try {
      const normalized = normalizeProjectData(rawJson);
      setProjectData(normalized);
      addToast(`Đã import và chuẩn hóa dự án "${normalized.project.title}"!`, 'success');
    } catch (err: any) {
      console.error('Import normalization error:', err);
      addToast('Không thể chuẩn hóa file JSON: ' + (err?.message || 'Lỗi cấu trúc dữ liệu'), 'error');
    }
  };
  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const bytes = new TextEncoder().encode(dataStr);
      const base64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
      
      Flow.download({
        base64,
        mimeType: 'application/json',
        filename: `${projectData.project.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_script.json`
      });
      addToast('Đã xuất file kịch bản JSON thành công!', 'success');
    } catch (err: any) {
      addToast('Lỗi khi xuất file: ' + (err?.message || 'Vui lòng thử lại.'), 'error');
    }
  }, [projectData, addToast]);
  const handleDownloadZip = async () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia && s.videoMedia.base64);
    if (shotsWithVideo.length === 0) {
      addToast("Chưa có video clip nào được tạo để tải về.", 'warning');
      return;
    }
    setIsZipping(true);
    try {
      addToast(`Bắt đầu tải ${shotsWithVideo.length} clips về máy...`, 'info');
      for (let i = 0; i < shotsWithVideo.length; i++) {
        const shot = shotsWithVideo[i];
        if (shot.videoMedia?.base64) {
          const cleanTitle = (shot.title || 'Shot').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 25);
          await Flow.download({
            base64: shot.videoMedia.base64,
            mimeType: 'video/mp4',
            filename: `Shot_${String(shot.shotNumber).padStart(2, '0')}_${cleanTitle}.mp4`
          });
        }
      }
      addToast(`Đã tải thành công toàn bộ ${shotsWithVideo.length} clips!`, 'success');
    } catch (err: any) {
      console.error('Error downloading clips:', err);
      addToast('Lỗi khi tải clips: ' + (err?.message || 'Vui lòng kiểm tra quyền tải.'), 'error');
    } finally {
      setIsZipping(false);
    }
  };
  /**
   * Ghép & Tải Video với nhiều lớp chiến lược bảo đảm thành công
   */
  const handleMergeVideo = async () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia && s.videoMedia.base64);
    
    if (shotsWithVideo.length < 2) {
      addToast("Cần ít nhất 2 clips video đã tạo xong để ghép thành phim hoàn chỉnh.", 'warning');
      return;
    }
    setIsMerging(true);
    setMergeProgress(5);
    addToast(`Đang chuẩn bị ghép ${shotsWithVideo.length} clips video...`, 'info');
    const fileNames: string[] = [];
    const outputFileName = 'output_merged.mp4';
    const concatListFileName = 'concat_list.txt';
    try {
      setMergeProgress(10);
      await ffmpegService.load((msg) => {
        console.log('[FFmpeg Log]', msg);
      });
      setMergeProgress(20);
      // Ghi các file clip vào Virtual FS
      for (let i = 0; i < shotsWithVideo.length; i++) {
        const name = `clip_${i}.mp4`;
        fileNames.push(name);
        const base64Data = shotsWithVideo[i].videoMedia!.base64;
        const bytes = base64ToUint8Array(base64Data);
        await ffmpegService.writeFile(name, bytes);
        setMergeProgress(20 + Math.round(((i + 1) / shotsWithVideo.length) * 20));
      }
      ffmpegService.onProgress(({ progress }) => {
        setMergeProgress(40 + Math.round(progress * 45));
      });
      let mergeSuccess = false;
      // === CHIẾN LƯỢC 1: Concat Demuxer (-c copy) ===
      try {
        console.log('[Ghép Video] Đang thử phương án 1: Concat Demuxer (Stream copy)...');
        const listContent = fileNames.map(f => `file '${f}'`).join('\n');
        await ffmpegService.writeFile(concatListFileName, new TextEncoder().encode(listContent));
        await ffmpegService.exec([
          '-f', 'concat',
          '-safe', '0',
          '-i', concatListFileName,
          '-c', 'copy',
          '-movflags', 'faststart',
          '-y', outputFileName,
        ]);
        mergeSuccess = true;
        console.log('[Ghép Video] Ghép thành công bằng Concat Demuxer!');
      } catch (concatErr) {
        console.warn('[Ghép Video] Concat Demuxer không thành công, chuyển sang Filter Complex:', concatErr);
      }
      // === CHIẾN LƯỢC 2: Filter Complex Video + Audio ===
      if (!mergeSuccess) {
        try {
          console.log('[Ghép Video] Đang thử phương án 2: Filter Complex (Video + Audio)...');
          const inputArgs: string[] = [];
          fileNames.forEach(name => inputArgs.push('-i', name));
          const filterInputs = fileNames.map((_, i) => `[${i}:v][${i}:a]`).join('');
          const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
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
            '-y', outputFileName,
          ]);
          mergeSuccess = true;
        } catch (audioErr) {
          console.warn('[Ghép Video] Lỗi ghép audio (có thể có clip không có tiếng):', audioErr);
        }
      }
      // === CHIẾN LƯỢC 3: Filter Complex Video Only ===
      if (!mergeSuccess) {
        console.log('[Ghép Video] Đang thử phương án 3: Filter Complex (Video Only)...');
        const inputArgs: string[] = [];
        fileNames.forEach(name => inputArgs.push('-i', name));
        const filterInputs = fileNames.map((_, i) => `[${i}:v]`).join('');
        const filterComplex = `${filterInputs}concat=n=${fileNames.length}:v=1:a=0[outv]`;
        await ffmpegService.exec([
          ...inputArgs,
          '-filter_complex', filterComplex,
          '-map', '[outv]',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-movflags', 'faststart',
          '-an',
          '-y', outputFileName,
        ]);
        mergeSuccess = true;
      }
      setMergeProgress(90);
      addToast("Đang chuẩn bị file video hoàn chỉnh...", 'info');
      // Đọc file kết quả
      const outputData = await ffmpegService.readFile(outputFileName) as Uint8Array;
      if (!outputData || outputData.length === 0) {
        throw new Error("Dữ liệu video xuất ra rỗng.");
      }
      const base64Merged = await uint8ArrayToBase64(outputData);
      setMergeProgress(98);
      const cleanProjectTitle = (projectData.project.title || 'Phim_AI')
        .replace(/[^a-zA-Z0-9_\-]/g, '_')
        .slice(0, 30);
      await Flow.download({
        base64: base64Merged,
        mimeType: 'video/mp4',
        filename: `${cleanProjectTitle}_Full.mp4`
      });
      addToast(`Ghép thành công ${shotsWithVideo.length} phân cảnh và đã tải video về máy!`, 'success');
    } catch (error: any) {
      console.error("Lỗi khi Ghép & Tải video:", error);
      
      addToast(
        "Trình duyệt gặp sự cố bộ nhớ khi ghép WASM. Đang kích hoạt chế độ tự động tải riêng từng clip cho bạn...",
        'warning'
      );
      try {
        for (let i = 0; i < shotsWithVideo.length; i++) {
          const shot = shotsWithVideo[i];
          if (shot.videoMedia?.base64) {
            const cleanTitle = (shot.title || 'Shot').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 25);
            await Flow.download({
              base64: shot.videoMedia.base64,
              mimeType: 'video/mp4',
              filename: `Shot_${String(shot.shotNumber).padStart(2, '0')}_${cleanTitle}.mp4`
            });
          }
        }
        addToast("Đã tải đầy đủ các clips về máy thành công!", 'success');
      } catch (fallbackErr: any) {
        addToast(
          "Không thể tải video: " + (fallbackErr?.message || error?.message || "Vui lòng thử lại."),
          'error'
        );
      }
    } finally {
      // Dọn dẹp Virtual FS
      for (const name of fileNames) {
        try { await ffmpegService.deleteFile(name); } catch (_) {}
      }
      try { await ffmpegService.deleteFile(outputFileName); } catch (_) {}
      try { await ffmpegService.deleteFile(concatListFileName); } catch (_) {}
      setIsMerging(false);
      setMergeProgress(0);
    }
  };
  // Khóa luồng Render chính
  if (isLicensed === null) return null;
  if (isLicensed === false) return <LicenseGate onSuccess={() => setIsLicensed(true)} />;
  return (
    <div className="flex flex-col h-screen bg-[#070709] text-slate-200 overflow-hidden font-sans">
      <Header 
        project={projectData.project} 
        config={projectData.config}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onImport={handleImport}
        onExport={handleExport}
        onDownloadZip={handleDownloadZip}
        onMerge={handleMergeVideo}
        onConfigChange={(c) => setProjectData(prev => ({ ...prev, config: { ...prev.config, ...c } }))}
        onAspectRatioChange={handleAspectRatioChange}
        onErrorToast={(msg) => addToast(msg, 'error')}
        isMerging={isMerging}
        isZipping={isZipping}
        mergeProgress={mergeProgress}
      />
      
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
        {activeTab === 'pre' ? (
          <PreProduction 
            characters={projectData.project.characters}
            locations={projectData.project.locations}
            onUpdateCharacter={updateCharacter}
            onAddCharacter={addCharacter}
            onRemoveCharacter={removeCharacter}
            onUpdateLocation={updateLocation}
            onAddLocation={addLocation}
            onRemoveLocation={removeLocation}
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
            onToast={addToast}
          />
        )}
      </main>
      <footer className="border-t border-white/5 bg-[#09080e] px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[28px] w-[80px] object-contain" />
          <a href="https://fastaivn.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-[#F31B17] transition-colors">
            fastaivn.com
          </a>
        </div>
        <div className="flex items-center gap-4">
          <LicenseStatus />
          <p className="text-[9px] text-slate-600">App version 1.0.2</p>
        </div>
      </footer>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}