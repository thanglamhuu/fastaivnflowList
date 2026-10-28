import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { MediaReference, StudioConfig } from '../types';
import {
  BG_SETTINGS,
  CAMERA_ANGLES,
  OUTFIT_OPTIONS,
  SCRIPT_TEMPLATES,
} from '../constants';
import { MATRIX_12_VOICES } from '../voicePresets';
import { LicenseStatus } from './LicenseStatus';
interface LeftConfigPanelProps {
  config: StudioConfig;
  onChangeConfig: (newCfg: Partial<StudioConfig>) => void;
  modelMedia: MediaReference | null;
  setModelMedia: (m: MediaReference | null) => void;
  productMedias: MediaReference[];
  setProductMedias: React.Dispatch<React.SetStateAction<MediaReference[]>>;
  backgroundMedia: MediaReference | null;
  setBackgroundMedia: (m: MediaReference | null) => void;
  isBusy: boolean;
  onScanProduct: () => Promise<void>;
  isScanning: boolean;
}
export const LeftConfigPanel: React.FC<LeftConfigPanelProps> = ({
  config,
  onChangeConfig,
  modelMedia,
  setModelMedia,
  productMedias,
  setProductMedias,
  backgroundMedia,
  setBackgroundMedia,
  isBusy,
  onScanProduct,
  isScanning,
}) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [bgLoading, setBgLoading] = useState(false);
  const [productLoadingIndex, setProductLoadingIndex] = useState<number | null>(null);
  const handlePickModel = async () => {
    if (isBusy) return;
    try {
      setModelLoading(true);
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        setModelMedia({
          mediaId: media.mediaId,
          base64: media.base64,
          mimeType: media.mimeType,
          name: media.name,
        });
      }
    } catch (e) {
      console.warn('Hủy chọn ảnh mẫu', e);
    } finally {
      setModelLoading(false);
    }
  };
  const handlePickBackground = async () => {
    if (isBusy) return;
    try {
      setBgLoading(true);
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        setBackgroundMedia({
          mediaId: media.mediaId,
          base64: media.base64,
          mimeType: media.mimeType,
          name: media.name,
        });
      }
    } catch (e) {
      console.warn('Hủy chọn ảnh bối cảnh', e);
    } finally {
      setBgLoading(false);
    }
  };
  // Chọn hoặc thay thế ảnh sản phẩm tại chỉ số cụ thể
  const handlePickProductAtIndex = async (index: number) => {
    if (isBusy) return;
    try {
      setProductLoadingIndex(index);
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        const item: MediaReference = {
          mediaId: media.mediaId,
          base64: media.base64,
          mimeType: media.mimeType,
          name: media.name,
        };
        setProductMedias((prev) => {
          const next = [...prev];
          next[index] = item;
          return next;
        });
      }
    } catch (e) {
      console.warn('Hủy chọn ảnh sản phẩm', e);
    } finally {
      setProductLoadingIndex(null);
    }
  };
  // Thêm ảnh sản phẩm mới
  const handleAddNewProduct = async () => {
    if (isBusy) return;
    try {
      setProductLoadingIndex(productMedias.length);
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        const item: MediaReference = {
          mediaId: media.mediaId,
          base64: media.base64,
          mimeType: media.mimeType,
          name: media.name,
        };
        setProductMedias((prev) => [...prev, item]);
      }
    } catch (e) {
      console.warn('Hủy thêm ảnh sản phẩm', e);
    } finally {
      setProductLoadingIndex(null);
    }
  };
  // Xóa 1 ảnh sản phẩm
  const handleRemoveProduct = (index: number) => {
    setProductMedias((prev) => prev.filter((_, idx) => idx !== index));
  };
  return (
    <aside className="w-[330px] shrink-0 border-r border-zinc-800 bg-[#090a0f] flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 select-none">
      {/* Header Sidebar */}
      <div className="p-3 border-b border-zinc-800/80 bg-[#0c0d14] sticky top-0 z-10 flex flex-col">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200">
            <span className="material-symbols-outlined text-[#F31B17] text-sm">tune</span>
            Thiết Lập Đạo Diễn & Thoại
          </div>
          <span className="text-[10px] font-mono text-zinc-500">CỘT 1</span>
        </div>
      </div>
      <div className="p-2.5 space-y-3 flex-1 flex flex-col">
        {/* HÀNG ẢNH THAM CHIẾU: ẢNH MẪU, ẢNH BỐI CẢNH, ẢNH SẢN PHẨM TRÊN 1 HÀNG TRƯỢT NGANG (HIỆN 4 THUMB TRÊN 1 HÀNG) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#F31B17]">photo_library</span>
              Ảnh Mẫu, Bối Cảnh & Sản Phẩm (9:16)
            </span>
            <span className="text-[9px] font-mono text-zinc-500">
              Trượt ngang ({2 + productMedias.length} mục)
            </span>
          </div>
          {/* Dải trượt ngang với kích thước vừa vặn ban đầu 4 thumbnail trên 1 hàng (chiều rộng mỗi thumb ~67px) */}
          <div className="flex items-start gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {/* 1. Ảnh Mẫu */}
            <div className="w-[67px] shrink-0 space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-300">
                <span className="truncate" title="Ảnh Mẫu">Mẫu</span>
                {modelMedia && (
                  <button
                    type="button"
                    onClick={() => setModelMedia(null)}
                    className="text-[8px] text-zinc-500 hover:text-[#F31B17] cursor-pointer"
                    title="Xóa ảnh mẫu"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div
                onClick={handlePickModel}
                className={`w-full aspect-[9/16] rounded-md border border-dashed flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all overflow-hidden relative ${
                  modelMedia
                    ? 'border-[#F31B17]/80 bg-zinc-900/80 shadow'
                    : 'border-zinc-700 hover:border-[#F31B17] bg-zinc-950/60'
                }`}
                title="Chọn ảnh người mẫu (9:16)"
              >
                {modelMedia ? (
                  <img
                    src={`data:${modelMedia.mimeType};base64,${modelMedia.base64}`}
                    alt="Mẫu"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500 p-0.5">
                    <span className="material-symbols-outlined text-sm text-[#F31B17]">
                      {modelLoading ? 'sync' : 'person'}
                    </span>
                    <span className="text-[8px] font-medium text-zinc-300 leading-tight">Chọn mẫu</span>
                    <span className="text-[7px] text-zinc-500 font-mono">9:16</span>
                  </div>
                )}
              </div>
            </div>
            {/* 2. Ảnh Bối Cảnh */}
            <div className="w-[67px] shrink-0 space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-300">
                <span className="truncate" title="Ảnh Bối Cảnh">Bối cảnh</span>
                {backgroundMedia && (
                  <button
                    type="button"
                    onClick={() => setBackgroundMedia(null)}
                    className="text-[8px] text-zinc-500 hover:text-[#F31B17] cursor-pointer"
                    title="Xóa ảnh bối cảnh"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div
                onClick={handlePickBackground}
                className={`w-full aspect-[9/16] rounded-md border border-dashed flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all overflow-hidden relative ${
                  backgroundMedia
                    ? 'border-[#F31B17]/80 bg-red-950/20 shadow'
                    : 'border-zinc-700 hover:border-[#F31B17] bg-zinc-950/60'
                }`}
                title="Chọn ảnh bối cảnh (9:16)"
              >
                {backgroundMedia ? (
                  <img
                    src={`data:${backgroundMedia.mimeType};base64,${backgroundMedia.base64}`}
                    alt="Bối cảnh"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500 p-0.5">
                    <span className="material-symbols-outlined text-sm text-[#F31B17]">
                      {bgLoading ? 'sync' : 'wallpaper'}
                    </span>
                    <span className="text-[8px] font-medium text-zinc-300 leading-tight">Bối cảnh</span>
                    <span className="text-[7px] text-zinc-500 font-mono">9:16</span>
                  </div>
                )}
              </div>
            </div>
            {/* 3. Slot Sản Phẩm 1 (Luôn hiện sẵn) */}
            <div className="w-[67px] shrink-0 space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-300">
                <span className="truncate">Ảnh SP 1</span>
                {productMedias[0] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(0)}
                    className="text-[8px] text-zinc-500 hover:text-[#F31B17] cursor-pointer"
                    title="Xóa SP 1"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div
                onClick={() => handlePickProductAtIndex(0)}
                className={`w-full aspect-[9/16] rounded-md border border-dashed flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all overflow-hidden relative ${
                  productMedias[0]
                    ? 'border-[#F31B17]/80 bg-zinc-900/80 shadow'
                    : 'border-zinc-700 hover:border-[#F31B17] bg-zinc-950/60'
                }`}
                title="Chọn ảnh sản phẩm 1 (9:16)"
              >
                {productMedias[0] ? (
                  <img
                    src={`data:${productMedias[0].mimeType};base64,${productMedias[0].base64}`}
                    alt="Ảnh SP 1"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500 p-0.5">
                    <span className="material-symbols-outlined text-sm text-[#F31B17]">
                      {productLoadingIndex === 0 ? 'sync' : 'shopping_bag'}
                    </span>
                    <span className="text-[8px] font-medium text-zinc-300 leading-tight">Chọn SP 1</span>
                    <span className="text-[7px] text-zinc-500 font-mono">9:16</span>
                  </div>
                )}
              </div>
            </div>
            {/* 4. Slot Sản Phẩm 2 (Luôn hiện sẵn để đạt 4 thumbnail trên hàng ban đầu) */}
            <div className="w-[67px] shrink-0 space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-300">
                <span className="truncate">Ảnh SP 2</span>
                {productMedias[1] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(1)}
                    className="text-[8px] text-zinc-500 hover:text-[#F31B17] cursor-pointer"
                    title="Xóa SP 2"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div
                onClick={() => handlePickProductAtIndex(1)}
                className={`w-full aspect-[9/16] rounded-md border border-dashed flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all overflow-hidden relative ${
                  productMedias[1]
                    ? 'border-[#F31B17]/80 bg-zinc-900/80 shadow'
                    : 'border-zinc-700 hover:border-[#F31B17] bg-zinc-950/60'
                }`}
                title="Chọn ảnh sản phẩm 2 (9:16)"
              >
                {productMedias[1] ? (
                  <img
                    src={`data:${productMedias[1].mimeType};base64,${productMedias[1].base64}`}
                    alt="Ảnh SP 2"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500 p-0.5">
                    <span className="material-symbols-outlined text-sm text-[#F31B17]">
                      {productLoadingIndex === 1 ? 'sync' : 'add_photo_alternate'}
                    </span>
                    <span className="text-[8px] font-medium text-zinc-300 leading-tight">Chọn SP 2</span>
                    <span className="text-[7px] text-zinc-500 font-mono">9:16</span>
                  </div>
                )}
              </div>
            </div>
            {/* Các ảnh sản phẩm thêm (SP 3, SP 4, ...) xuất hiện nối tiếp và trượt ngang mượt mà */}
            {productMedias.slice(2).map((item, idx) => {
              const actualIdx = idx + 2;
              return (
                <div key={item.mediaId || actualIdx} className="w-[67px] shrink-0 space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-300">
                    <span className="truncate">Ảnh SP {actualIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(actualIdx)}
                      className="text-[8px] text-zinc-500 hover:text-[#F31B17] cursor-pointer"
                      title={`Xóa SP ${actualIdx + 1}`}
                    >
                      Xóa
                    </button>
                  </div>
                  <div
                    onClick={() => handlePickProductAtIndex(actualIdx)}
                    className="w-full aspect-[9/16] rounded-md border border-dashed border-[#F31B17]/80 bg-zinc-900/80 flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all overflow-hidden relative shadow"
                    title={`Thay đổi ảnh sản phẩm ${actualIdx + 1}`}
                  >
                    <img
                      src={`data:${item.mimeType};base64,${item.base64}`}
                      alt={`Ảnh SP ${actualIdx + 1}`}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                </div>
              );
            })}
            {/* Nút Thêm Sản Phẩm Mới (Nằm ở cuối dải trượt ngang) */}
            <div className="w-[67px] shrink-0 space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-400">
                <span className="truncate">+ Thêm SP</span>
              </div>
              <div
                onClick={handleAddNewProduct}
                className="w-full aspect-[9/16] rounded-md border border-dashed border-zinc-700 hover:border-[#F31B17] bg-zinc-950/40 hover:bg-zinc-900/50 flex flex-col items-center justify-center p-0.5 text-center cursor-pointer transition-all text-zinc-500 hover:text-zinc-200"
                title="Tải thêm ảnh sản phẩm khác"
              >
                <span className="material-symbols-outlined text-base text-[#F31B17]">
                  {productLoadingIndex === productMedias.length ? 'sync' : 'add'}
                </span>
                <span className="text-[8px] font-semibold mt-0.5 text-center leading-tight">Thêm SP</span>
                <span className="text-[7px] text-zinc-500 font-mono">9:16</span>
              </div>
            </div>
          </div>
        </div>
        {/* AI Product Scan Button */}
        {productMedias.length > 0 && (
          <button
            type="button"
            onClick={onScanProduct}
            disabled={isScanning || isBusy}
            className="w-full py-1.5 px-2 rounded bg-gradient-to-r from-[#F31B17]/25 to-red-600/25 hover:from-[#F31B17]/40 hover:to-red-600/40 border border-[#F31B17]/50 text-red-100 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[14px] text-[#F31B17] ${isScanning ? 'animate-spin' : ''}`}>
              {isScanning ? 'sync' : 'auto_awesome'}
            </span>
            {isScanning ? 'Đang phân tích...' : `AI Quét Sản Phẩm (${productMedias.length} ảnh)`}
          </button>
        )}
        {/* CHỌN VOICE NGAY DƯỚI ẢNH NHÂN VẬT */}
        <div className="space-y-1.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-[#F31B17] shrink-0">
              record_voice_over
            </span>
            <select
              value={config.selectedVoiceId || ''}
              onChange={(e) => {
                const selectedId = e.target.value;
                const found = MATRIX_12_VOICES.find((v) => v.id === selectedId);
                onChangeConfig({
                  selectedVoiceId: selectedId,
                  voiceActor: found ? `${found.label} (${found.region})` : config.voiceActor,
                });
              }}
              className="w-full bg-zinc-900 border border-zinc-700/80 text-[11px] text-zinc-200 rounded-md py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer"
            >
              <option value="">-- Chọn giọng đọc --</option>
              <optgroup label="Nam (Male)">
                {MATRIX_12_VOICES.filter((v) => v.gender === 'male').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.region})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Nữ (Female)">
                {MATRIX_12_VOICES.filter((v) => v.gender === 'female').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.region})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {/* Lọc tạp âm */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] text-zinc-400">Lọc tạp âm xưởng:</span>
            <button
              type="button"
              onClick={() => onChangeConfig({ filterNoise: !config.filterNoise })}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                config.filterNoise
                  ? 'bg-[#F31B17]/20 text-red-300 border border-[#F31B17]/40'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
              }`}
            >
              <span className="material-symbols-outlined text-[12px] text-[#F31B17]">
                {config.filterNoise ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              {config.filterNoise ? 'Bật' : 'Tắt'}
            </button>
          </div>
        </div>
        {/* Tên & Đặc điểm sản phẩm */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px] text-[#F31B17]">edit_note</span>
            Tên & Đặc điểm sản phẩm
          </label>
          <textarea
            rows={3}
            value={config.productNameAndSpecs}
            onChange={(e) => onChangeConfig({ productNameAndSpecs: e.target.value })}
            placeholder="Nhập tên & đặc điểm sản phẩm (tùy chọn)..."
            className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md p-1.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] resize-none placeholder:text-zinc-600"
          />
        </div>
        {/* KỊCH BẢN - CHỌN TRONG 35 MẪU KỊCH BẢN */}
        <div className="pt-1.5 pb-1 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <label className="text-[11px] font-semibold text-[#F31B17] flex items-center gap-1 uppercase tracking-wider shrink-0">
            <span className="material-symbols-outlined text-[13px] text-[#F31B17]">auto_stories</span>
            Kịch bản:
          </label>
          <select
            value={config.scriptTemplate}
            onChange={(e) => onChangeConfig({ scriptTemplate: e.target.value })}
            className="flex-1 min-w-0 bg-zinc-900 border border-[#F31B17]/40 rounded-md py-1 px-2 text-zinc-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer"
          >
            {SCRIPT_TEMPLATES.map((tmpl) => (
              <option key={tmpl} value={tmpl}>
                {tmpl}
              </option>
            ))}
          </select>
        </div>
        {/* BỐI CẢNH DẠNG DROPDOWN & TÙY CHỌN BỔ TRỢ */}
        <div className="space-y-2 pt-1.5 border-t border-zinc-800/80">
          <div className={`space-y-0.5 ${backgroundMedia ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Bối cảnh mẫu (Khi không tải ảnh)
              </label>
              {backgroundMedia && (
                <span className="text-[9px] text-[#F31B17] font-mono">Đang dùng ảnh tải lên</span>
              )}
            </div>
            <select
              value={config.bgSetting}
              disabled={!!backgroundMedia}
              onChange={(e) => onChangeConfig({ bgSetting: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer disabled:cursor-not-allowed"
            >
              {BG_SETTINGS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {!backgroundMedia && config.bgSetting === '14. Tự nhập bối cảnh tùy chỉnh' && (
              <input
                type="text"
                value={config.customBgSetting}
                onChange={(e) => onChangeConfig({ customBgSetting: e.target.value })}
                placeholder="VD: sản phẩm dải đầy trên kệ đằng sau lưng..."
                className="w-full mt-1 bg-zinc-950 border border-[#F31B17]/50 rounded-md py-1 px-2 text-red-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] placeholder:text-zinc-600"
              />
            )}
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Góc quay đạo diễn
            </label>
            <select
              value={config.cameraAngle}
              onChange={(e) => onChangeConfig({ cameraAngle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer"
            >
              {CAMERA_ANGLES.map((ang) => (
                <option key={ang} value={ang}>
                  {ang}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Trang phục người mẫu
            </label>
            <select
              value={config.outfit}
              onChange={(e) => onChangeConfig({ outfit: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer"
            >
              {OUTFIT_OPTIONS.map((otf) => (
                <option key={otf} value={otf}>
                  {otf}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Footer của Sidebar cấu hình App với LicenseStatus và App Version 1.11 */}
        <div className="pt-3 mt-auto border-t border-zinc-800/80">
          <LicenseStatus />
          <p className="text-[10px] text-center font-bold text-zinc-500 mt-2 tracking-wide">
            App version <span className="text-[#F31B17] font-mono">1.11</span>
          </p>
        </div>
      </div>
    </aside>
  );
};