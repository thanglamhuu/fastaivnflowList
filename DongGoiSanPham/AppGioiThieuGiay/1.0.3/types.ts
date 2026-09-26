export interface MediaItem {
  mediaId: string;
  base64: string;
  mimeType: string;
}
export interface StoryboardCardData {
  id: string;
  order: number;
  sceneId?: number;
  image?: MediaItem;
  video?: MediaItem;
  videoPrompt?: string;         // Prompt video hiện tại (có thể chỉnh sửa)
  originalVideoPrompt?: string; // Prompt video gốc do AI sinh ra
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
  isAnalyzing?: boolean;        // Trạng thái đang phân tích ảnh
  error?: string;
}
export type AspectRatio = '16:9' | '9:16';
export interface AppSettings {
  charReference?: MediaItem;
  productReferences: MediaItem[];
  aspectRatio: AspectRatio;
  videoModel: string;
}