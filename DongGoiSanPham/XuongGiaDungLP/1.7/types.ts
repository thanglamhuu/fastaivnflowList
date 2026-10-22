export interface VoiceOption {
  id: string;
  category: 'podcast' | 'tiktok' | 'narrative';
  label: string;
  subLabel: string;
  gender: 'female' | 'male';
  region: string;
  baseVoice: 'Kore' | 'Fenrir' | 'Aoede' | 'Leda' | 'Charon' | 'Orpheus' | 'Zephyr';
  speed: number;
  pitch: string;
  acousticProfile: string;
  badgeColor: string;
  sampleSentence: string;
}
export interface MediaReference {
  mediaId: string;
  base64: string;
  mimeType: string;
  name?: string;
}
export type SceneId = 'SCENE_1' | 'SCENE_2' | 'SCENE_3' | 'SCENE_4';
export interface SceneData {
  id: SceneId;
  index: number;
  label: string;
  stageName: string;
  dialogue: string;
  actionPrompt: string;
  status: 'idle' | 'generating_image' | 'generating_video' | 'success' | 'error';
  errorMessage?: string;
  keyframeMedia?: MediaReference;
  videoMedia?: MediaReference;
  wordCount: number;
  isWordCountValid: boolean;
  showCustomPrompt?: boolean;
}
export interface StudioConfig {
  productNameAndSpecs: string;
  bgSetting: string;
  customBgSetting: string;
  cameraAngle: string;
  outfit: string;
  scriptTemplate: string;
  selectedVoiceId: string;
  voiceActor: string;
  filterNoise: boolean;
  characterName?: string;
  emotion?: string;
}
export interface DirectorConfig {
  productSummary?: string;
  brandSource?: string;
  brandName?: string;
  environment: string;
  density: string;
  action: string;
  spaceStyle: string;
  outfit: string;
  customNote?: string;
  aspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '4:5';
  selectedVoiceId?: string;
  dialogueLine?: string;
  characterName?: string;
  emotion?: string;
}