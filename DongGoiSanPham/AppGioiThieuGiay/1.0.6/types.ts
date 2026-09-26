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
  sceneId?: string;
  lockType?: LockType;
  promptTemplate?: string;
  
  image?: MediaItem;
  video?: MediaItem;
  videoPrompt?: string;
  originalVideoPrompt?: string;
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
  isAnalyzing?: boolean;
  error?: string;
}
// --- Specific Types Requested ---
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3' | '3:4';
export type Speed = '0.75x' | '1x' | '1.25x' | '1.5x';
export type Resolution = '360p' | '720p';
export interface ProjectConfig {
  // Required keys from request
  ratio: AspectRatio;
  speed: Speed;
  model: string;
  threads: number;
  resolution: Resolution;
  
  // Reference items
  charReference?: MediaItem;
  productReferences: MediaItem[];
}