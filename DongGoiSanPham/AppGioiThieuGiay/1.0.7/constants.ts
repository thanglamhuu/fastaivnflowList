import { AspectRatio, Speed, Resolution } from './types';
export const ASPECT_RATIOS: readonly AspectRatio[] = ['9:16', '16:9', '1:1', '4:3', '3:4'] as const;
export const SPEEDS: readonly Speed[] = ['0.75x', '1x', '1.25x', '1.5x'] as const;
export const RESOLUTIONS: readonly Resolution[] = ['360p', '720p'] as const;
export const THREAD_OPTIONS: readonly number[] = [1, 2, 4] as const;
export const VIDEO_MODELS = [
  { label: 'Omni 1.1 Flash', value: 'Omni 1.1 Flash' },
  { label: 'Veo 3.1 - Lower Priority', value: 'Veo 3.1 - Lite' },
  { label: 'Veo 3.1 - Fast', value: 'Veo 3.1 - Fast' },
  { label: 'Veo 3.1 - Quality', value: 'Veo 3.1 - Quality' }
] as const;