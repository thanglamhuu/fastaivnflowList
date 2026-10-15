export interface MediaAsset {
  mediaId: string;
  base64: string;
  mimeType: string;
}
export type ProductionStatus = 'idle' | 'generating' | 'done' | 'error';
export type AppView = 'intro' | 'main';
export type BackgroundMode = 'auto' | 'reference';
export interface VideoFrame {
  id: number;
  motionPrompt: string;
  voiceScript: string;
  promptStatus: ProductionStatus;
  videoAsset: MediaAsset | null;
  videoStatus: ProductionStatus;
  videoProgress: number;
}
export interface AppState {
  view: AppView;
  products: (MediaAsset | null)[];
  productInfo: string;
  bgMode: BackgroundMode;
  kocImage: MediaAsset | null;
  brandName: string;
  videoModel: string; // Model tạo video được chọn
  masterImage: MediaAsset | null;
  masterImageStatus: ProductionStatus;
  masterImageProgress: number;
  videoFrames: VideoFrame[];
}