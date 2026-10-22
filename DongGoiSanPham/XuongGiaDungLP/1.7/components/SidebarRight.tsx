import React from 'react';
import { AspectRatioType, DirectorConfig } from '../types';
import { Dropdown } from './Dropdown';
import { MATRIX_12_VOICES } from '../voicePresets';
interface SidebarRightProps {
  config: DirectorConfig;
  onChangeConfig: (newConfig: Partial<DirectorConfig>) => void;
  onGenerateAll: () => void;
  onExportAll: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  hasSuccessfulOutputs: boolean;
  isExporting: boolean;
}
export const SidebarRight: React.FC<SidebarRightProps> = ({
  config,
  onChangeConfig,
  onGenerateAll,
  onExportAll,
  isGenerating,
  canGenerate,
  hasSuccessfulOutputs,
  isExporting,
}) => {
  const countOptions = [1, 2, 4, 6, 8];
  const aspectRatios: { label: string; value: AspectRatioType; icon: string }[] = [
    { label: '9:16 (Reels/TikTok)', value: '9:16', icon: 'crop_portrait' },
    { label: '4:5 (Post/Feed)', value: '4:5', icon: 'crop_5_4' },
    { label: '1:1 (Vuông)', value: '1:1', icon: 'crop_square' },
    { label: '16:9 (Ngang)', value: '16:9', icon: 'crop_16_9' },
  ];
  const selectedVoice = MATRIX_12_VOICES.find((v) => v.id === config.selectedVoiceId);
  return (
    <aside className="h-full border-l border-zinc-800 bg-[#09090b] flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      <div>
        {/* Header */}
        <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between sticky top-0 bg-[#09090b]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">videocam</span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Chiến Lược Đạo Diễn
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            STEP 02
          </span>
        </div>
        <div className="p-3 space-y-4">
          {/* Section 1: Camera Strategy */}
          <div className="space-y-2.5">
            <Dropdown
              label="Góc quay đạo diễn"
              icon="photo_camera"
              value={config.cameraStrategy}
              options={[
                'Trộn tự động',
                'Góc cao toàn cảnh',
                'Chính diện nâng cao',
                'Ngang mắt trung cảnh',
                'Toàn cảnh nhà máy',
                'Sản phẩm tiền cảnh',
                'Lối đi kho hàng',
                'Dây chuyền sản xuất',
                'Trình diễn tại bàn',
                'Sản phẩm tiêu biểu',
              ]}
              onChange={(val) => onChangeConfig({ cameraStrategy: val })}
            />
          </div>
          {/* Section: Matrix 12 Voices System */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-red-500">record_voice_over</span>
                Hệ Thống Giọng Đọc Matrix 12
              </label>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                12 VOICES
              </span>
            </div>
            {/* Dropdown chuẩn hóa: Nam trước, Nữ sau */}
            <div className="space-y-1">
              <select
                value={config.selectedVoiceId || ''}
                onChange={(e) => {
                  const vId = e.target.value;
                  const vObj = MATRIX_12_VOICES.find((item) => item.id === vId);
                  onChangeConfig({
                    selectedVoiceId: vId,
                    dialogueLine: vObj ? (config.dialogueLine || vObj.sampleSentence) : config.dialogueLine,
                  });
                }}
                className="w-full bg-slate-950 border border-white/5 text-[11px] text-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#F31B17] cursor-pointer"
              >
                <option value="">-- Chọn giọng --</option>
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
            {/* Thông tin giọng đọc đang chọn */}
            {selectedVoice && (
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${selectedVoice.badgeColor}`}
                  >
                    {selectedVoice.label}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">
                    Spd: {selectedVoice.speed}x | Pitch: {selectedVoice.pitch}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 italic">
                  "{selectedVoice.sampleSentence}"
                </div>
                <div className="text-[9px] font-mono text-zinc-500 line-clamp-1">
                  Profile: {selectedVoice.acousticProfile}
                </div>
              </div>
            )}
            {/* Thoại nhân vật tuỳ chọn */}
            {config.selectedVoiceId && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={config.characterName || ''}
                    placeholder="Tên nhân vật (VD: Quản lý kho, MC Mai)"
                    onChange={(e) => onChangeConfig({ characterName: e.target.value })}
                    className="w-1/2 bg-zinc-900/90 border border-zinc-700/80 rounded-md py-1.5 px-2 text-zinc-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                  />
                  <input
                    type="text"
                    value={config.emotion || ''}
                    placeholder="Cảm xúc (VD: Hào hứng, Tự tin)"
                    onChange={(e) => onChangeConfig({ emotion: e.target.value })}
                    className="w-1/2 bg-zinc-900/90 border border-zinc-700/80 rounded-md py-1.5 px-2 text-zinc-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                  />
                </div>
                <textarea
                  rows={2}
                  value={config.dialogueLine || ''}
                  onChange={(e) => onChangeConfig({ dialogueLine: e.target.value })}
                  placeholder="Câu thoại cho video AI..."
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md p-2 text-zinc-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none placeholder:text-zinc-600"
                />
              </div>
            )}
          </div>
          {/* Section 2: Output Formats */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-3">
            {/* Image Count Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-amber-400">grid_view</span>
                Số lượng cảnh quay ({config.imageCount})
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {countOptions.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => onChangeConfig({ imageCount: cnt })}
                    className={`py-1.5 rounded text-xs font-bold transition-all ${
                      config.imageCount === cnt
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
            {/* Aspect Ratio Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-amber-400">aspect_ratio</span>
                Tỷ lệ khung hình
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {aspectRatios.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onChangeConfig({ aspectRatio: item.value })}
                    className={`py-2 px-2 rounded-md border flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                      config.aspectRatio === item.value
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span className="truncate">{item.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Section 3: Custom Director Note */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-amber-400">edit_note</span>
              Ghi chú đạo diễn bổ sung
            </label>
            <textarea
              rows={3}
              value={config.customNote}
              onChange={(e) => onChangeConfig({ customNote: e.target.value })}
              placeholder="VD: Ánh sáng vàng ấm hoàng hôn, xe nâng tự động di chuyển phía sau, nét mặt hào hứng, sàn nhà phản chiếu bóng..."
              className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-md p-2.5 text-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/80 focus:border-amber-500/80 resize-none placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>
      {/* Bottom Sticky Action Area */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#09090b]/95 backdrop-blur space-y-2">
        {hasSuccessfulOutputs && (
          <button
            type="button"
            onClick={onExportAll}
            disabled={isExporting || isGenerating}
            className="w-full py-2 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className={`material-symbols-outlined text-[16px] ${isExporting ? 'animate-bounce' : ''}`}>
              download
            </span>
            {isExporting ? 'Đang tải xuống tất cả...' : 'Xuất tất cả ảnh/video'}
          </button>
        )}
        <button
          type="button"
          onClick={onGenerateAll}
          disabled={!canGenerate || isGenerating}
          className={`w-full py-3 px-4 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            canGenerate && !isGenerating
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/25 active:scale-[0.98] cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${isGenerating ? 'animate-spin' : ''}`}>
            {isGenerating ? 'sync' : 'movie_filter'}
          </span>
          {isGenerating ? 'Đang thực hiện đạo diễn...' : 'Tạo các cảnh quay'}
        </button>
        {!canGenerate && (
          <p className="text-[10px] text-zinc-500 text-center">
            * Vui lòng chọn cả ảnh Người mẫu & Sản phẩm để bắt đầu
          </p>
        )}
      </div>
    </aside>
  );
};