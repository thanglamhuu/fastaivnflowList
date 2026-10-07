export type BaseVoiceModel = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';
export interface VoiceOption {
  id: string;
  category: 'podcast' | 'tiktok' | 'raw';
  label: string;
  subLabel: string;
  gender: 'female' | 'male';
  region: string;
  baseVoice: BaseVoiceModel;
  alias?: string;
  speed: number;
  pitch: string;
  badgeColor: string;
  prompt: string;
  sampleSentence: string;
}
export interface ShotScene {
  id: string | number;
  shotIndex: number;
  totalShots: number;
  durationSec: number;
  dialogue: string;
  cameraMovement: string;
  actorExpression: string;
  visualPrompt: string;
}