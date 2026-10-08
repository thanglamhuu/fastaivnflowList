export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3' | '3:4';
export type Speed = '0.75x' | '1x' | '1.25x' | '1.5x';
export type Resolution = '360p' | '720p';
export interface ProjectConfig {
  ratio: AspectRatio;
  speed: Speed;
  model: string;
  threads: number;
  resolution: Resolution;
}
export type DramaDuration = '15s' | '30s' | '45s' | '60s' | '90s' | '180s';
export type DramaStyle = 
  | 'Cinematic Photorealistic' 
  | '3D Pixar' 
  | 'Anime Drama' 
  | 'K-Drama Tone';
export interface CharacterAsset {
  id: string;
  name: string;
  physicalDescription: string;
  defaultOutfit: string;
  voiceTone: string;
  referenceImageUrl?: string;
  mediaId?: string;
  voicePresetId?: string;
  baseVoice?: string;
  voiceSpeed?: number;
  voicePitch?: string;
}
export interface LocationAsset {
  id: string;
  name: string;
  description: string;
  referenceImageUrl?: string;
  mediaId?: string;
}
export interface PropAsset {
  id: string;
  name: string;
  description: string;
  referenceImageUrl?: string;
  mediaId?: string;
}
export interface DramaShot {
  id: string;
  shotNumber: number;
  durationSeconds: number;
  title: string;
  cameraAngle: string;
  visualPrompt: string;
  videoMotionPrompt: string;
  characterNames: string[];
  dialogue?: {
    characterName: string;
    line: string;
    emotion: string;
  };
  sfxAudioCue?: string;
  imageUrl?: string;
  imageMediaId?: string;
  videoUrl?: string;
  videoMediaId?: string;
  audioMediaId?: string;
  isGenerating?: boolean;
  isGeneratingVideo?: boolean;
}
export interface DramaProject {
  title: string;
  style: DramaStyle;
  aspectRatio: AspectRatio;
  duration: DramaDuration;
  premise: string;
  scriptMarkdown: string;
  characters: CharacterAsset[];
  locations: LocationAsset[];
  props: PropAsset[];
  shots: DramaShot[];
}