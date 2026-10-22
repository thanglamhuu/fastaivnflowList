import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { DirectorConfig, MediaReference } from '../types';
import { Dropdown } from './Dropdown';
interface SidebarLeftProps {
  config: DirectorConfig;
  onChangeConfig: (newConfig: Partial<DirectorConfig>) => void;
  modelMedia: MediaReference | null;
  setModelMedia: (media: MediaReference | null) => void;
  productMedia: MediaReference | null;
  setProductMedia: (media: MediaReference | null) => void;
  onScanProduct: () => Promise<void>;
  isScanning: boolean;
  isGenerating: boolean;
}
export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  config,
  onChangeConfig,
  modelMedia,
  setModelMedia,
  productMedia,
  setProductMedia,
  onScanProduct,
  isScanning,
  isGenerating,
}) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  // Click handler to select image from Flow gallery
  const handleSelectModel = async () => {
    if (isGenerating) return;
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
    } catch (err) {
      console.warn('Select model cancelled or failed', err);
    } finally {
      setModelLoading(false);
    }
  };
  const handleSelectProduct = async () => {
    if (isGenerating) return;
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
    } catch (err) {
      console.warn('Select product cancelled or failed', err);
    } finally {
      setProductLoading(false);
    }
  };
  return (
    <aside className="h-full border-r border-zinc-800 bg-[#09090b] flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between sticky top-0 bg-[#09090b]/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Đầu Vào & Bối Cảnh
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          STEP 01
        </span>
      </div>
      <div className="p-3 space-y-4">
        {/* Section 1: Model Image Dropzone */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-amber-400">person</span>
              1. Ảnh Người Mẫu
            </label>
            {modelMedia && (
              <button
                type="button"
                onClick={() => setModelMedia(null)}
                className="text-[10px] text-zinc-400 hover:text-red-400 flex items-center gap-0.5 transition-colors"
                title="Xóa ảnh mẫu"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
                Xóa
              </button>
            )}
          </div>
          <div
            data-flow-drop-target="model"
            data-flow-accept="image"
            onClick={handleSelectModel}
            className={`relative h-[132px] w-full rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-2 text-center ${
              modelMedia
                ? 'border-amber-500/60 bg-zinc-900/60'
                : 'border-zinc-700/70 hover:border-amber-400/80 bg-zinc-950/70 hover:bg-zinc-900/40'
            }`}
          >
            {modelMedia ? (
              <>
                <img
                  src={`data:${modelMedia.mimeType};base64,${modelMedia.base64}`}
                  alt="Người mẫu"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-medium">
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Đổi ảnh khác
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-zinc-400">
                <span className="material-symbols-outlined text-2xl text-amber-400/90">
                  {modelLoading ? 'sync' : 'add_photo_alternate'}
                </span>
                <span className="text-[11px] font-medium text-zinc-300">
                  {modelLoading ? 'Đang mở thư viện...' : 'Chọn hoặc thả ảnh Mẫu'}
                </span>
                <span className="text-[9px] text-zinc-500">Giữ khuôn mặt, vóc dáng & diện mạo</span>
              </div>
            )}
          </div>
        </div>
        {/* Section 2: Product Image Dropzone & AI Scan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-amber-400">inventory_2</span>
              2. Ảnh Sản Phẩm
            </label>
            {productMedia && (
              <button
                type="button"
                onClick={() => setProductMedia(null)}
                className="text-[10px] text-zinc-400 hover:text-red-400 flex items-center gap-0.5 transition-colors"
                title="Xóa ảnh sản phẩm"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
                Xóa
              </button>
            )}
          </div>
          <div
            data-flow-drop-target="product"
            data-flow-accept="image"
            onClick={handleSelectProduct}
            className={`relative h-[132px] w-full rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-2 text-center ${
              productMedia
                ? 'border-amber-500/60 bg-zinc-900/60'
                : 'border-zinc-700/70 hover:border-amber-400/80 bg-zinc-950/70 hover:bg-zinc-900/40'
            }`}
          >
            {productMedia ? (
              <>
                <img
                  src={`data:${productMedia.mimeType};base64,${productMedia.base64}`}
                  alt="Sản phẩm"
                  className="w-full h-full object-contain rounded"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-medium">
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Đổi ảnh khác
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-zinc-400">
                <span className="material-symbols-outlined text-2xl text-amber-400/90">
                  {productLoading ? 'sync' : 'shopping_bag'}
                </span>
                <span className="text-[11px] font-medium text-zinc-300">
                  {productLoading ? 'Đang mở thư viện...' : 'Chọn hoặc thả ảnh Sản Phẩm'}
                </span>
                <span className="text-[9px] text-zinc-500">Giữ bao bì, hình dáng, nhãn mác</span>
              </div>
            )}
          </div>
          {/* AI Product Scan Button */}
          {productMedia && (
            <button
              type="button"
              onClick={onScanProduct}
              disabled={isScanning || isGenerating}
              className="w-full mt-1.5 py-1.5 px-3 rounded bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[15px] ${isScanning ? 'animate-spin' : ''}`}>
                {isScanning ? 'sync' : 'auto_awesome'}
              </span>
              {isScanning ? 'AI đang phân tích bao bì...' : '✨ AI Phân tích sản phẩm'}
            </button>
          )}
          {config.productSummary && (
            <div className="mt-1 p-2 bg-zinc-900/90 border border-zinc-800 rounded text-[11px] text-zinc-300 flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400 shrink-0 mt-0.5">
                verified
              </span>
              <p className="line-clamp-2 leading-relaxed text-[10px] text-zinc-400">
                {config.productSummary}
              </p>
            </div>
          )}
        </div>
        {/* Section 3: Context Setup */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px] text-amber-400">factory</span>
            3. Thiết Lập Bối Cảnh
          </div>
          <Dropdown
            label="Môi trường nhà máy"
            value={config.environment}
            options={[
              'Tự động',
              'Kho hàng lớn',
              'Kho thành phẩm',
              'Dây chuyền sản xuất',
              'Khu vực đóng gói',
              'Khu vực lắp ráp',
              'Nhà máy chế biến',
              'Khu trưng bày / Kiểm định',
            ]}
            onChange={(val) => onChangeConfig({ environment: val })}
          />
          <Dropdown
            label="Mật độ hàng hóa"
            value={config.density}
            options={['Bình thường', 'Dày đặc', 'Khổng lồ']}
            onChange={(val) => onChangeConfig({ density: val })}
          />
          <Dropdown
            label="Hành động người mẫu"
            value={config.action}
            options={[
              'Tự động',
              'Cử chỉ thuyết trình',
              'Cầm sản phẩm chính',
              'Trình diễn sản phẩm',
              'Kiểm tra sản phẩm',
              'Mở hộp sản phẩm',
              'Đứng cạnh kho hàng',
              'Đứng sau bàn sản phẩm',
            ]}
            onChange={(val) => onChangeConfig({ action: val })}
          />
        </div>
        {/* Section 4: Brand & Spatial Settings */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px] text-amber-400">sell</span>
            4. Thương Hiệu & Không Gian
          </div>
          <Dropdown
            label="Nguồn nhận diện"
            value={config.brandSource}
            options={[
              'Tự động quét từ Sản phẩm',
              'Nhập tay tên thương hiệu',
              'Không gắn thương hiệu',
            ]}
            onChange={(val) => onChangeConfig({ brandSource: val })}
          />
          {(config.brandSource === 'Nhập tay tên thương hiệu' ||
            config.brandSource === 'Tự động quét từ Sản phẩm') && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Tên thương hiệu
              </label>
              <input
                type="text"
                value={config.brandName}
                placeholder="VD: Vinamilk, Lock&Lock, EcoTech..."
                onChange={(e) => onChangeConfig({ brandName: e.target.value })}
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md py-1.5 px-2.5 text-zinc-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500/80 focus:border-amber-500/80"
              />
            </div>
          )}
          <Dropdown
            label="Phong cách không gian"
            value={config.spaceStyle}
            options={[
              'Tự động',
              'Kho hàng Thành phẩm Chuyên nghiệp',
              'Showroom Trưng bày Nhà máy',
              'Khu vực Dây chuyền Sản xuất',
              'Tối giản / Không gian mở',
            ]}
            onChange={(val) => onChangeConfig({ spaceStyle: val })}
          />
          <Dropdown
            label="Trang phục người mẫu"
            value={config.outfit}
            options={[
              'Tự động',
              'Giữ nguyên trang phục gốc',
              'Mặc đồng phục nhà xưởng',
              'Mặc/Đeo trực tiếp sản phẩm',
            ]}
            onChange={(val) => onChangeConfig({ outfit: val })}
          />
        </div>
      </div>
    </aside>
  );
};