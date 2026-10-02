export type AspectRatio = '9:16' | '16:9';
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
  characterNames: string[]; // Danh sách tên nhân vật xuất hiện trong shot
  dialogue?: {
    characterName: string;
    line: string;
    emotion: string;
  };
  sfxAudioCue?: string;
  imageUrl?: string;
  imageMediaId?: string; // ID ảnh để sinh video
  videoUrl?: string;
  videoMediaId?: string;
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