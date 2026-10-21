import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { MediaReference, StudioConfig } from '../types';
import {
  BG_SETTINGS,
  CAMERA_ANGLES,
  OUTFIT_OPTIONS,
  SCRIPT_TEMPLATES,
  VOICE_ACTORS,
} from '../constants';
interface LeftConfigPanelProps {
  config: StudioConfig;
  onChangeConfig: (newCfg: Partial<StudioConfig>) => void;
  modelMedia: MediaReference | null;
  setModelMedia: (m: MediaReference | null) => void;
  productMedia: MediaReference | null;
  setProductMedia: (m: MediaReference | null) => void;
  isBusy: boolean;
}
export const LeftConfigPanel: React.FC<LeftConfigPanelProps> = ({
  config,
  onChangeConfig,
  modelMedia,
  setModelMedia,
  productMedia,
  setProductMedia,
  isBusy,
}) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
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
  const handlePickProduct = async () => {
    if (isBusy) return;
    try {
      setProductLoading(true);
      const media = await Flow.media.select({ filter: 'image' });
      if (media) {
        setProductMedia({
          mediaId: media.mediaId,
          base64: media.base64,
          mimeType: media.mimeType,
          name: media.name,
        });
      }
    } catch (e) {
      console.warn('Hủy chọn ảnh sản phẩm', e);
    } finally {
      setProductLoading(false);
    }
  };
  return (
    <aside className="w-[320px] shrink-0 border-r border-zinc-800 bg-[#090a0f] flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 select-none">
      <div className="p-3 border-b border-zinc-800/80 bg-[#0c0d14] sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200">
          <span className="material-symbols-outlined text-amber-400 text-sm">tune</span>
          Thiết Lập Đạo Diễn & Thoại
        </div>
        <span className="text-[10px] font-mono text-zinc-500">CỘT 1</span>
      </div>
      <div className="p-3.5 space-y-4">
        {/* Ảnh Người Mẫu & Ảnh Sản Phẩm */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Mẫu */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-400">person</span>
                Ảnh Mẫu
              </span>
              {modelMedia && (
                <button
                  type="button"
                  onClick={() => setModelMedia(null)}
                  className="text-[10px] text-zinc-500 hover:text-red-400"
                >
                  Xóa
                </button>
              )}
            </div>
            <div
              onClick={handlePickModel}
              className={`h-24 rounded-lg border border-dashed flex flex-col items-center justify-center p-1 text-center cursor-pointer transition-all overflow-hidden relative ${
                modelMedia
                  ? 'border-amber-500/60 bg-zinc-900/60'
                  : 'border-zinc-700 hover:border-amber-400 bg-zinc-950/60'
              }`}
            >
              {modelMedia ? (
                <img
                  src={`data:${modelMedia.mimeType};base64,${modelMedia.base64}`}
                  alt="Mẫu"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                  <span className="material-symbols-outlined text-lg text-amber-400">
                    {modelLoading ? 'sync' : 'add_photo_alternate'}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-300">Chọn ảnh mẫu</span>
                </div>
              )}
            </div>
          </div>
          {/* Sản phẩm */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-400">inventory_2</span>
                Ảnh SP
              </span>
              {productMedia && (
                <button
                  type="button"
                  onClick={() => setProductMedia(null)}
                  className="text-[10px] text-zinc-500 hover:text-red-400"
                >
                  Xóa
                </button>
              )}
            </div>
            <div
              onClick={handlePickProduct}
              className={`h-24 rounded-lg border border-dashed flex flex-col items-center justify-center p-1 text-center cursor-pointer transition-all overflow-hidden relative ${
                productMedia
                  ? 'border-amber-500/60 bg-zinc-900/60'
                  : 'border-zinc-700 hover:border-amber-400 bg-zinc-950/60'
              }`}
            >
              {productMedia ? (
                <img
                  src={`data:${productMedia.mimeType};base64,${productMedia.base64}`}
                  alt="Sản phẩm"
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                  <span className="material-symbols-outlined text-lg text-amber-400">
                    {productLoading ? 'sync' : 'shopping_bag'}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-300">Chọn ảnh SP</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tên & Đặc điểm sản phẩm */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px] text-amber-400">edit_note</span>
            Tên & Đặc điểm sản phẩm
          </label>
          <textarea
            rows={2}
            value={config.productNameAndSpecs}
            onChange={(e) => onChangeConfig({ productNameAndSpecs: e.target.value })}
            placeholder="VD: Mũ Cối Cao Cấp Chống Nước - nhựa cứng phíp tàu, màu xanh bộ đội..."
            className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md p-2 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none placeholder:text-zinc-600"
          />
        </div>
        {/* Bối cảnh & Góc quay */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          {/* Bối cảnh tạo ảnh */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Bối cảnh tạo ảnh
            </label>
            <select
              value={config.bgSetting}
              onChange={(e) => onChangeConfig({ bgSetting: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {BG_SETTINGS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {/* Ô input bối cảnh tùy chỉnh khi chọn mục 14 */}
            {config.bgSetting === '14. Tự nhập bối cảnh tùy chỉnh' && (
              <input
                type="text"
                value={config.customBgSetting}
                onChange={(e) => onChangeConfig({ customBgSetting: e.target.value })}
                placeholder="VD: sản phẩm dải đầy trên kệ đằng sau lưng..."
                className="w-full mt-1.5 bg-zinc-950 border border-amber-500/50 rounded-md py-1.5 px-2.5 text-amber-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-zinc-600"
              />
            )}
          </div>
          {/* Góc quay đạo diễn */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Góc quay đạo diễn
            </label>
            <select
              value={config.cameraAngle}
              onChange={(e) => onChangeConfig({ cameraAngle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {CAMERA_ANGLES.map((ang) => (
                <option key={ang} value={ang}>
                  {ang}
                </option>
              ))}
            </select>
          </div>
          {/* Trang phục */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Trang phục người mẫu
            </label>
            <select
              value={config.outfit}
              onChange={(e) => onChangeConfig({ outfit: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {OUTFIT_OPTIONS.map((otf) => (
                <option key={otf} value={otf}>
                  {otf}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 99 MẪU KỊCH BẢN (Dropdown chọn mẫu Hook bán hàng) */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              99 Mẫu Kịch Bản Hook Bán Hàng
            </label>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PRO AFFILIATE
            </span>
          </div>
          <select
            value={config.scriptTemplate}
            onChange={(e) => onChangeConfig({ scriptTemplate: e.target.value })}
            className="w-full bg-zinc-900 border border-amber-500/40 rounded-md py-1.5 px-2.5 text-zinc-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {SCRIPT_TEMPLATES.map((tmpl) => (
              <option key={tmpl} value={tmpl}>
                {tmpl}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-zinc-500 italic">
            * Nhấn "📄 Tạo Kịch Bản" trên thanh trên cùng để AI tự viết lời thoại 4 cảnh theo mẫu này.
          </p>
        </div>
        {/* Thanh chọn Giọng Đọc (Dưới cùng cột trái) */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px] text-amber-400">record_voice_over</span>
              Giọng Đọc Nhân Vật
            </label>
            <span className="text-[9px] font-mono text-zinc-500">Omni Audio</span>
          </div>
          <select
            value={config.voiceActor}
            onChange={(e) => onChangeConfig({ voiceActor: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 px-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {VOICE_ACTORS.map((vc) => (
              <option key={vc} value={vc}>
                {vc}
              </option>
            ))}
          </select>
          {/* Nút bật/tắt Lọc tạp âm */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-400">Lọc tạp âm nhà xưởng:</span>
            <button
              type="button"
              onClick={() => onChangeConfig({ filterNoise: !config.filterNoise })}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                config.filterNoise
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {config.filterNoise ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              {config.filterNoise ? 'Đang Bật' : 'Tắt'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};