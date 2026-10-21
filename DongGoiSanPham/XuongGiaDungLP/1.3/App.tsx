import React, { useEffect, useState, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { MediaReference, SceneData, StudioConfig } from './types';
import { DEFAULT_SCENES } from './constants';
import {
  countWords,
  generateKeyframeImage,
  generateScript4Scenes,
  renderSceneVideo,
} from './services/studioAi';
import { TopActionBar } from './components/TopActionBar';
import { LeftConfigPanel } from './components/LeftConfigPanel';
import { MasterPreviewCenter } from './components/MasterPreviewCenter';
import { RightProductionGrid } from './components/RightProductionGrid';
import { MergeModal } from './components/MergeModal';
const INITIAL_CONFIG: StudioConfig = {
  productNameAndSpecs: 'Mũ Cối Cao Cấp Chống Nước - nhựa cứng phíp tàu, màu xanh bộ đội',
  bgSetting: 'Kho hàng tổng rộng lớn với giá kệ kim loại nhiều tầng',
  customBgSetting: 'sản phẩm dải đầy trên kệ đằng sau lưng',
  cameraAngle: 'Ngang mắt trung cảnh',
  outfit: 'Giữ nguyên trang phục gốc',
  scriptTemplate: 'Bằng vài cốc trà đá',
  voiceActor: 'Giọng Bắc chuẩn (Nữ)',
  filterNoise: true,
};
export default function App() {
  const [config, setConfig] = useState<StudioConfig>(INITIAL_CONFIG);
  const [modelMedia, setModelMedia] = useState<MediaReference | null>(null);
  const [productMedia, setProductMedia] = useState<MediaReference | null>(null);
  const [scenes, setScenes] = useState<SceneData[]>(DEFAULT_SCENES);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  // Loading States
  const [isGeneratingImages, setIsGeneratingImages] = useState<boolean>(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [isRenderingVideos, setIsRenderingVideos] = useState<boolean>(false);
  const [activeVideoCount, setActiveVideoCount] = useState<number>(0);
  // Trạng thái hiển thị Merge Modal
  const [isMergeModalOpen, setIsMergeModalOpen] = useState<boolean>(false);
  const configRef = useRef(config);
  configRef.current = config;
  const scenesRef = useRef(scenes);
  scenesRef.current = scenes;
  const modelMediaRef = useRef(modelMedia);
  modelMediaRef.current = modelMedia;
  const productMediaRef = useRef(productMedia);
  productMediaRef.current = productMedia;
  // Tải Google Font Material Symbols
  useEffect(() => {
    const linkId = 'flow-material-symbols-font';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
      document.head.appendChild(link);
    }
  }, []);
  const handleChangeConfig = (newCfg: Partial<StudioConfig>) => {
    setConfig((prev) => ({ ...prev, ...newCfg }));
  };
  // Cập nhật lời thoại và tự động đếm từ
  const handleUpdateSceneDialogue = (sceneId: string, dialogue: string) => {
    const wc = countWords(dialogue);
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              dialogue,
              wordCount: wc,
              isWordCountValid: wc >= 20 && wc <= 30,
            }
          : s
      )
    );
  };
  const handleUpdateScenePrompt = (sceneId: string, actionPrompt: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, actionPrompt } : s))
    );
  };
  const handleToggleCustomPrompt = (sceneId: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, showCustomPrompt: !s.showCustomPrompt } : s))
    );
  };
  // 1. ✨ TẠO LẠI 4 ẢNH (Nano Banana Pro)
  const handleGenerate4Images = async () => {
    const model = modelMediaRef.current;
    const prod = productMediaRef.current;
    if (!model || !prod || isGeneratingImages) return;
    setIsGeneratingImages(true);
    setScenes((prev) =>
      prev.map((s) => ({ ...s, status: 'generating_image', errorMessage: undefined }))
    );
    const queue = [...scenesRef.current];
    const worker = async () => {
      while (queue.length > 0) {
        const target = queue.shift();
        if (!target) break;
        try {
          const keyframe = await generateKeyframeImage(
            target,
            configRef.current,
            model,
            prod
          );
          setScenes((prev) =>
            prev.map((s) =>
              s.id === target.id
                ? {
                    ...s,
                    keyframeMedia: keyframe,
                    status: 'idle',
                  }
                : s
            )
          );
        } catch (err: any) {
          console.error(`Tạo ảnh cho ${target.id} lỗi:`, err);
          setScenes((prev) =>
            prev.map((s) =>
              s.id === target.id
                ? { ...s, status: 'error', errorMessage: err?.message || 'Lỗi tạo ảnh' }
                : s
            )
          );
        }
      }
    };
    const workers = [worker(), worker()];
    await Promise.all(workers);
    setIsGeneratingImages(false);
  };
  // 2. 📄 TẠO KỊCH BẢN (Flow.generate.text)
  const handleGenerateScript = async () => {
    if (isGeneratingScript) return;
    setIsGeneratingScript(true);
    try {
      const generated = await generateScript4Scenes(configRef.current, productMediaRef.current);
      if (generated && generated.scenes) {
        setScenes((prev) =>
          prev.map((sc, idx) => {
            const newScene = generated.scenes[idx];
            if (!newScene) return sc;
            const wc = countWords(newScene.dialogue);
            return {
              ...sc,
              dialogue: newScene.dialogue,
              actionPrompt: newScene.actionPrompt || sc.actionPrompt,
              wordCount: wc,
              isWordCountValid: wc >= 20 && wc <= 30,
            };
          })
        );
      }
    } catch (err) {
      console.error('Lỗi tạo kịch bản:', err);
    } finally {
      setIsGeneratingScript(false);
    }
  };
  // 3. 🎬 RENDER 4 CẢNH (Đa luồng tối đa 2 cảnh cùng lúc - Omni 1.1 Flash)
  const renderSingleSceneTask = async (target: SceneData) => {
    if (!target.keyframeMedia) return;
    setScenes((prev) =>
      prev.map((s) => (s.id === target.id ? { ...s, status: 'generating_video', errorMessage: undefined } : s))
    );
    try {
      const video = await renderSceneVideo(
        target,
        configRef.current,
        target.keyframeMedia.mediaId
      );
      setScenes((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? {
                ...s,
                videoMedia: video,
                status: 'success',
              }
            : s
        )
      );
    } catch (err: any) {
      console.error(`Lỗi render video cho ${target.id}:`, err);
      setScenes((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? { ...s, status: 'error', errorMessage: err?.message || 'Lỗi render video' }
            : s
        )
      );
    }
  };
  const handleRender4Videos = async () => {
    if (isRenderingVideos) return;
    const eligibleScenes = scenesRef.current.filter((s) => !!s.keyframeMedia);
    if (eligibleScenes.length === 0) {
      alert('Vui lòng tạo ảnh Keyframe trước khi render video.');
      return;
    }
    setIsRenderingVideos(true);
    const queue = [...eligibleScenes];
    const concurrency = 2;
    const worker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) {
          setActiveVideoCount((c) => c + 1);
          await renderSingleSceneTask(item);
          setActiveVideoCount((c) => Math.max(0, c - 1));
        }
      }
    };
    const workers = Array.from({ length: Math.min(concurrency, eligibleScenes.length) }, () => worker());
    await Promise.all(workers);
    setIsRenderingVideos(false);
    setActiveVideoCount(0);
  };
  // Render lại 1 cảnh riêng lẻ
  const handleRenderSingleScene = async (target: SceneData) => {
    if (!target.keyframeMedia || isRenderingVideos) return;
    setActiveVideoCount(1);
    await renderSingleSceneTask(target);
    setActiveVideoCount(0);
  };
  // Mở hộp thoại Merge Modal với kiểm tra điều kiện
  const completedVideos = scenes.filter((s) => !!s.videoMedia?.base64);
  const hasEnoughVideosToMerge = completedVideos.length >= 2;
  const handleOpenMergeModal = () => {
    if (!hasEnoughVideosToMerge) {
      alert(
        `Cần tối thiểu từ 2 phân cảnh đã render thành công clip để thực hiện ghép nối thành phim hoàn chỉnh! (Hiện có: ${completedVideos.length}/4)`
      );
      return;
    }
    setIsMergeModalOpen(true);
  };
  const canMakeImages = !!modelMedia && !!productMedia;
  const hasKeyframes = scenes.some((s) => !!s.keyframeMedia);
  return (
    <div className="flex flex-col h-screen w-full bg-[#050608] text-zinc-100 overflow-hidden font-sans">
      {/* Top Action Bar */}
      <TopActionBar
        onGenerate4Images={handleGenerate4Images}
        onGenerateScript={handleGenerateScript}
        onRender4Videos={handleRender4Videos}
        onOpenMergeModal={handleOpenMergeModal}
        isGeneratingImages={isGeneratingImages}
        isGeneratingScript={isGeneratingScript}
        isRenderingVideos={isRenderingVideos}
        canMakeImages={canMakeImages}
        hasKeyframes={hasKeyframes}
        hasEnoughVideosToMerge={hasEnoughVideosToMerge}
        completedVideoCount={completedVideos.length}
        activeVideoCount={activeVideoCount}
      />
      {/* Main 3-Column Studio Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cột Trái: Thiết lập Bối cảnh, Mẫu Kịch Bản & Giọng Đọc */}
        <LeftConfigPanel
          config={config}
          onChangeConfig={handleChangeConfig}
          modelMedia={modelMedia}
          setModelMedia={setModelMedia}
          productMedia={productMedia}
          setProductMedia={setProductMedia}
          isBusy={isGeneratingImages || isRenderingVideos}
        />
        {/* Cột Giữa: MASTER PREVIEW 9:16 */}
        <MasterPreviewCenter
          scenes={scenes}
          selectedSceneIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
        />
        {/* Cột Phải: KHU VỰC SẢN XUẤT - 4 CẢNH LƯỚI 2x2 */}
        <RightProductionGrid
          scenes={scenes}
          onUpdateSceneDialogue={handleUpdateSceneDialogue}
          onUpdateScenePrompt={handleUpdateScenePrompt}
          onToggleCustomPrompt={handleToggleCustomPrompt}
          onRenderSingleScene={handleRenderSingleScene}
          onSelectMasterScene={setSelectedSceneIndex}
          isRenderingVideos={isRenderingVideos}
        />
      </div>
      {/* Hộp thoại Ghép & Tải Video (Merge Modal) */}
      <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        scenes={scenes}
        projectName={config.productNameAndSpecs}
      />
    </div>
  );
}