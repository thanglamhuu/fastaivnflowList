import React, { useState, useEffect, useCallback } from 'react';
import { ScriptProjectData, Shot, Character, Location, AspectRatio } from './types';
import { DEFAULT_PROJECT, normalizeProjectData } from './data/project';
import { ffmpegService } from './services/ffmpegService';
import Header from './components/Header';
import PreProduction from './components/PreProduction';
import Storyboard from './components/Storyboard';
import MergeModal from './components/MergeModal';
import Toast, { ToastItem, ToastType } from './components/Toast';
import { Flow } from 'flow-sdk';
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
import { LicenseStatus } from './components/LicenseStatus';
import { buildStoreZip } from './utils/zipBuilder';
/**
 * Chuyển Uint8Array sang Base64 một cách an toàn bằng FileReader
 * Tuyệt đối không dùng btoa(String.fromCharCode(...)) vì sẽ gây lỗi Call Stack Exceeded với video/zip
 */
function uint8ArrayToBase64(bytes: Uint8Array, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([bytes], { type: mimeType });
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
/** Làm sạch tên file trước khi tải về máy */
function sanitizeFileName(name: string, fallback: string, ext: string): string {
  const clean = (name || fallback)
    .replace(/\.[^.]*$/, '')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 35);
  return `${clean || fallback}.${ext}`;
}
/**
 * Hàm tải file chuẩn mực và an toàn tuyệt đối trong Flow Sandbox:
 * Môi trường iframe sandboxed chặn hoàn toàn `document.createElement('a').click()` và `URL.createObjectURL()`.
 * BẮT BUỘC phải dùng `Flow.download()` trực tiếp.
 */
async function downloadViaFlow(bytes: Uint8Array, filename: string, mimeType: any) {
  const base64 = await uint8ArrayToBase64(bytes, mimeType);
  return await Flow.download({
    base64,
    mimeType,
    filename
  });
}
export default function App() {
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  const [projectData, setProjectData] = useState<ScriptProjectData>(DEFAULT_PROJECT);
  const [activeTab, setActiveTab] = useState<'pre' | 'story'>('pre');
  
  // Trạng thái modal ghép và tiến trình
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
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
    const timeout = type === 'error' ? 8000 : 5000;
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
  const handleExport = useCallback(async () => {
    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const bytes = new TextEncoder().encode(dataStr);
      const filename = sanitizeFileName(projectData.project.title, 'script_project', 'json');
      
      await downloadViaFlow(bytes, filename, 'application/json');
      addToast('Đã xuất file kịch bản JSON thành công!', 'success');
    } catch (err: any) {
      addToast('Lỗi khi xuất file: ' + (err?.message || 'Vui lòng thử lại.'), 'error');
    }
  }, [projectData, addToast]);
  /**
   * HẠNG MỤC: TẢI TOÀN BỘ CLIPS
   * Lưu ý quan trọng: Flow.download chỉ hỗ trợ các định dạng được phép (MP4, PNG, JSON,... KHÔNG cho phép ZIP).
   * Do đó: Tải lần lượt từng clip .mp4 qua Flow.download để đảm bảo 100% người dùng nhận được file trong thư mục Downloads của máy tính!
   */
  const handleDownloadZip = async () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia && s.videoMedia.base64);
    if (shotsWithVideo.length === 0) {
      addToast("Chưa có video clip nào được tạo để tải về.", 'warning');
      return;
    }
    setIsZipping(true);
    addToast(`Đang bắt đầu tải ${shotsWithVideo.length} clips về máy tính của bạn...`, 'info');
    try {
      let downloadedCount = 0;
      for (let i = 0; i < shotsWithVideo.length; i++) {
        const shot = shotsWithVideo[i];
        const cleanTitle = (shot.title || 'Shot').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 20);
        const fileName = sanitizeFileName(`Shot_${String(shot.shotNumber).padStart(2, '0')}_${cleanTitle}`, `clip_${i + 1}`, 'mp4');
        
        const cleanBase64 = shot.videoMedia!.base64.includes(',') 
          ? shot.videoMedia!.base64.split(',')[1] 
          : shot.videoMedia!.base64;
        await Flow.download({
          base64: cleanBase64,
          mimeType: 'video/mp4',
          filename: fileName
        });
        downloadedCount++;
        // Nghỉ một chút giữa các file để trình duyệt ghi file mượt mà
        if (i < shotsWithVideo.length - 1) {
          await new Promise(r => setTimeout(r, 600));
        }
      }
      addToast(`Đã tải thành công toàn bộ ${downloadedCount} clips về máy tính!`, 'success');
    } catch (err: any) {
      console.error('Lỗi khi tải clips:', err);
      addToast('Lỗi khi tải file: ' + (err?.message || 'Vui lòng thử lại.'), 'error');
    } finally {
      setIsZipping(false);
    }
  };
  /**
   * Mở Modal chọn các Shot cần ghép khi bấm "Ghép & Tải"
   */
  const handleOpenMergeModal = () => {
    const shotsWithVideo = projectData.project.shots.filter(s => s.videoMedia && s.videoMedia.base64);
    if (shotsWithVideo.length < 2) {
      addToast("Cần ít nhất 2 clips video đã tạo xong để ghép thành phim hoàn chỉnh.", 'warning');
      return;
    }
    setIsMergeModalOpen(true);
  };
  /**
   * HẠNG MỤC: Ghép video chuẩn hóa:
   * - Quy tắc FFmpeg filter concat: xen kẽ [v0][a0][v1][a1]...[vn][an]concat=n=N:v=1:a=1[outv][outa]
   * - Reset timestamp với setpts=PTS-STARTPTS và asetpts=PTS-STARTPTS
   * - Tải video hoàn chỉnh qua Flow.download({ mimeType: 'video/mp4' })
   */
  const handleMergeSelectedVideos = async (selectedShots: Shot[]) => {
    if (selectedShots.length < 2) {
      addToast("Vui lòng chọn ít nhất 2 phân cảnh để ghép phim.", 'warning');
      return;
    }
    setIsMerging(true);
    setMergeProgress(5);
    addToast(`Đang chuẩn hóa và ghép ${selectedShots.length} phân cảnh...`, 'info');
    const fileNames: string[] = [];
    const outputFileName = 'output_merged.mp4';
    // Xác định kích thước chuẩn theo aspectRatio và resolution
    const is916 = projectData.project.aspectRatio === '9:16';
    const is720p = projectData.config.resolution !== '360p';
    let targetW = 1280;
    let targetH = 720;
    if (is916) {
      targetW = is720p ? 720 : 360;
      targetH = is720p ? 1280 : 640;
    } else {
      targetW = is720p ? 1280 : 640;
      targetH = is720p ? 720 : 360;
    }
    try {
      setMergeProgress(10);
      await ffmpegService.load((msg) => {
        console.log('[FFmpeg Log]', msg);
      });
      setMergeProgress(18);
      // 1. Ghi các file clip vào Virtual FS
      for (let i = 0; i < selectedShots.length; i++) {
        const name = `clip_${i}.mp4`;
        fileNames.push(name);
        const base64Data = selectedShots[i].videoMedia!.base64;
        const bytes = base64ToUint8Array(base64Data);
        await ffmpegService.writeFile(name, bytes);
        setMergeProgress(18 + Math.round(((i + 1) / selectedShots.length) * 22));
      }
      ffmpegService.onProgress(({ progress }) => {
        setMergeProgress(40 + Math.round(progress * 48));
      });
      const inputArgs: string[] = [];
      fileNames.forEach(name => inputArgs.push('-i', name));
      let mergeSuccess = false;
      // === CHIẾN LƯỢC 1 (Chính): Chuẩn hóa Video + Audio với thứ tự xen kẽ [v0][a0][v1][a1]... ===
      try {
        console.log(`[Ghép Video] Đang chuẩn hóa Video & Audio (${targetW}x${targetH}, 30fps, reset PTS)...`);
        
        const filterParts: string[] = [];
        let concatInterleavedInputs = '';
        for (let i = 0; i < fileNames.length; i++) {
          filterParts.push(
            `[${i}:v]scale=${targetW}:${targetH}:force_original_aspect_ratio=decrease,pad=${targetW}:${targetH}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p,setpts=PTS-STARTPTS[v${i}]`
          );
          filterParts.push(
            `[${i}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,asetpts=PTS-STARTPTS[a${i}]`
          );
          concatInterleavedInputs += `[v${i}][a${i}]`;
        }
        const concatLine = `${concatInterleavedInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
        const fullFilter = `${filterParts.join(';')};${concatLine}`;
        await ffmpegService.exec([
          ...inputArgs,
          '-filter_complex', fullFilter,
          '-map', '[outv]',
          '-map', '[outa]',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-r', '30',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-ar', '44100',
          '-ac', '2',
          '-movflags', '+faststart',
          '-y', outputFileName,
        ]);
        mergeSuccess = true;
        console.log('[Ghép Video] Ghép thành công bằng Filter Complex Video + Audio (đủ tiếng)!');
      } catch (audioFilterErr: any) {
        console.warn('[Ghép Video] Thử ghép kèm Audio lỗi (có thể có clip không có âm thanh). Tự động fallback sang Video Only:', audioFilterErr?.message || audioFilterErr);
      }
      // === CHIẾN LƯỢC 2 (Fallback): Chuẩn hóa Video Only nếu có clip không chứa Audio stream ===
      if (!mergeSuccess) {
        console.log(`[Ghép Video] Fallback chuẩn hóa Video Only (${targetW}x${targetH}, 30fps, reset PTS)...`);
        
        const filterParts: string[] = [];
        let concatVideoInputs = '';
        for (let i = 0; i < fileNames.length; i++) {
          filterParts.push(
            `[${i}:v]scale=${targetW}:${targetH}:force_original_aspect_ratio=decrease,pad=${targetW}:${targetH}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p,setpts=PTS-STARTPTS[v${i}]`
          );
          concatVideoInputs += `[v${i}]`;
        }
        const concatLine = `${concatVideoInputs}concat=n=${fileNames.length}:v=1:a=0[outv]`;
        const fullFilter = `${filterParts.join(';')};${concatLine}`;
        await ffmpegService.exec([
          ...inputArgs,
          '-filter_complex', fullFilter,
          '-map', '[outv]',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-r', '30',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          '-an',
          '-y', outputFileName,
        ]);
        mergeSuccess = true;
        console.log('[Ghép Video] Ghép thành công bằng Filter Complex Video Only!');
      }
      setMergeProgress(90);
      addToast("Đang chuẩn bị file tải xuống máy tính...", 'info');
      // Đọc file kết quả từ FFmpeg virtual fs
      const outputData = await ffmpegService.readFile(outputFileName);
      if (!outputData || outputData.length === 0) {
        throw new Error("Dữ liệu video xuất ra rỗng.");
      }
      setMergeProgress(95);
      const filename = sanitizeFileName(projectData.project.title, 'Phim_AI_Full', 'mp4');
      
      // BẮT BUỘC dùng Flow.download() vì đây là cổng tải file hợp lệ duy nhất của Flow sandbox
      await downloadViaFlow(outputData, filename, 'video/mp4');
      setMergeProgress(100);
      addToast(`Ghép thành công ${selectedShots.length} phân cảnh và đã tải video hoàn chỉnh về máy!`, 'success');
      setIsMergeModalOpen(false);
    } catch (error: any) {
      console.error("Lỗi khi Ghép & Tải video:", error);
      addToast("Không thể ghép video: " + (error?.message || "Vui lòng thử lại."), 'error');
    } finally {
      // Dọn dẹp Virtual FS
      for (const name of fileNames) {
        try { await ffmpegService.deleteFile(name); } catch (_) {}
      }
      try { await ffmpegService.deleteFile(outputFileName); } catch (_) {}
      setIsMerging(false);
      setMergeProgress(0);
    }
  };
  // Khóa luồng Render chính nếu chưa qua License
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
        onMerge={handleOpenMergeModal}
        onConfigChange={(c) => setProjectData(prev => ({ ...prev, config: { ...prev.config, ...c } }))}
        onAspectRatioChange={handleAspectRatioChange}
        onErrorToast={(msg) => addToast(msg, 'error')}
        isMerging={isMerging}
        isZipping={isZipping}
        mergeProgress={mergeProgress}
      />
      
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
      {/* Modal Chọn Phân Cảnh Để Ghép */}
      <MergeModal 
        shots={projectData.project.shots}
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        onConfirm={handleMergeSelectedVideos}
        isMerging={isMerging}
        mergeProgress={mergeProgress}
      />
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
          <p className="text-[9px] text-slate-600">App version 1.3</p>
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