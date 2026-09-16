export type AppScreen = 'landing' | 'upload' | 'references' | 'videos';

export interface MediaItem {
  mediaId: string;
  base64: string;
  mimeType: string;
  name?: string; 
}

export interface OutfitData {
  id: string;
  originalImage: MediaItem;
  stylingBoard?: MediaItem;
  video?: MediaItem;
  status: 'idle' | 'generating' | 'ready' | 'failed';
  error?: string;
}

export interface AppState {
  kocImage: MediaItem | null;
  outfits: OutfitData[];
  escalatorBackground: MediaItem | null;
  isGeneratingRefs: boolean;
}