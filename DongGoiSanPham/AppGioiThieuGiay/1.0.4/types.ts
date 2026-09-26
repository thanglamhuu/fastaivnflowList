export interface MediaItem {
  mediaId: string;
  base64: string;
  mimeType: string;
}
export type LockType = 'product_only' | 'product_and_feet' | 'full_body';
export interface SceneConfig {
  id: string;
  label: string;
  prompt_template: string;
  video_action_context: string;
  lockType: LockType;
}
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  scenes: SceneConfig[];
}
export interface StoryboardCardData {
  id: string;
  order: number;
  sceneId?: string;       // ID của scene (vd: 'ls_1')
  lockType?: LockType;    // Kiểu khóa prompt (sản phẩm, chân, hoặc toàn thân)
  promptTemplate?: string; // Lưu lại template của scene để tái tạo prompt
  
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