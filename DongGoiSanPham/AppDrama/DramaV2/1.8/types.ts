export type VideoModel = 'Omni 1.1 Flash' | 'Veo 3.1 - Lite' | 'Veo 3.1 - Fast' | 'Veo 3.1 - Quality';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
export type VisualArtStyle = 'Realistic' | 'Anime' | '3D Pixar';
export interface FlowMedia {
  mediaId: string;
  base64: string;
  mimeType: string;
  url?: string;
}
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
export interface Character {
  id: string;
  name: string;
  physicalDescription: string;
  defaultOutfit: string;
  voiceTone: string;
  avatarMedia?: FlowMedia;
  selectedVoiceId?: string;
}
export interface Location {
  id: string;
  name: string;
  description: string;
  locationMedia?: FlowMedia;
  isGeneratingImage?: boolean;
}
export interface Shot {
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
  startFrameMedia?: FlowMedia;
  videoMedia?: FlowMedia;
  imageStatus: 'idle' | 'generating' | 'completed' | 'error';
  videoStatus: 'idle' | 'generating' | 'completed' | 'error';
}
export interface ScriptProjectData {
  project: {
    title: string;
    style: string;
    aspectRatio: AspectRatio;
    duration: number;
    premise: string;
    scriptMarkdown: string;
    characters: Character[];
    locations: Location[];
    props: string[];
    shots: Shot[];
  };
  config: {
    ratio: string;
    speed: number;
    model: VideoModel;
    threads: number;
    resolution: '360p' | '720p';
    visualStyle?: VisualArtStyle;
  };
}
Trình tạo công cụ
Mô tả cách bạn muốn chỉnh sửa công cụ này.



Google Flow có thể mắc sai sót nên bạn hãy xác minh nội dung do Google Flow tạo. Công cụ này có thể tiêu tốn tín dụng

