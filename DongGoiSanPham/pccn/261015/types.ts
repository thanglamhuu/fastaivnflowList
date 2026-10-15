export type VideoModel = 'Omni 1.1 Flash' | 'Veo 3.1 - Lite' | 'Veo 3.1 - Fast' | 'Veo 3.1 - Quality';
export type CameraRig = 
  | 'CAM_FRONT_MCU' 
  | 'CAM_SIDE_45' 
  | 'CAM_TIGHT_CU' 
  | 'CAM_LOW_ANGLE'
  | 'CAM_BOKEH_MIC'
  | 'CAM_SLIDER_LATERAL'
  | 'CAM_WIDE_DESK'
  | 'CAM_EXTREME_CU';
export type CameraRigMode = 'DYNAMIC_MULTI_CAM' | 'STATIC_LOCKED_OFF';
export type AnchorMode = 'FIRST_FRAME' | 'REFERENCE_GUIDE' | 'TEXT_ONLY';
export interface FlowMedia {
  mediaId: string;
  base64: string;
  mimeType: string;
  url: string;
}
export interface GenrePreset {
  id: string;
  name: string;
  lighting: string;
  wordsPerSec: number;
  cameraBias: CameraRig[];
  description: string;
  icon: string;
  color: string;
}
export interface Scene {
  id: number;
  startTime: number;
  endTime: number;
  script: string;
  cameraRig: CameraRig;
  cameraRigMode: CameraRigMode;
  transitionCutRig?: CameraRig;
  wordCount: number;
  media?: FlowMedia;
  status: 'idle' | 'generating' | 'completed' | 'error';
  error?: string;
  progress: number;
}
export interface ProjectState {
  model: VideoModel;
  resolution: '360p' | '720p';
  aspectRatio: '9:16' | '16:9';
  masterMediaId?: string;
  masterBase64?: string;
  selectedVoiceId?: string;
  genre: GenrePreset;
  currentTopic: string;
  subNiche: string;
  totalDuration: number;
  script: string;
  dramaHook: string;
  scenes: Scene[];
  cameraRigMode: CameraRigMode;
  fixedRigChoice: CameraRig;
}