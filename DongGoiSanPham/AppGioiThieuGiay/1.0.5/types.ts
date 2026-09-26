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
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
export type Speed = string;
export type Resolution = string;
export interface ProjectConfig {
  ratio: AspectRatio;
  model: string;
  threads: number;
  speed: string;
  resolution: string;
  // Refs and state
  charReference?: MediaItem;
  productReferences: MediaItem[];
}