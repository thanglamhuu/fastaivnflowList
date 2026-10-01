export type AssetType = 'character' | 'location' | 'prop';
export interface ImageHistoryItem {
  id: string;
  mediaId: string;
  dataUrl?: string; // Transient cache for immediate display after generation
}
export interface BaseAsset {
  id: string;
  type: AssetType;
  name: string;
  description?: string;
  imageUrl?: string;
  
  // Image Management
  referenceImageId?: string; // The ID of the currently "Starred" image
  supportingImages: ImageHistoryItem[]; // History of all generated/imported images
  
  // Inspiration
  inspirationImage?: {
    id: string;
    mediaId: string;
    dataUrl?: string;
  };
  includeInspirationInImageGen: boolean;
  // UI State
  isGenerating?: boolean;
  isAutofilling?: boolean;
  sceneIds?: string[];
}
export interface CharacterAsset extends BaseAsset {
  type: 'character';
  physicalCharacteristics: string;
  clothingAccessories: string;
  backstory: string;
  voice?: string;
}
export interface LocationAsset extends BaseAsset {
  type: 'location';
  physicalCharacteristics: string;
  timeOfDay: string;
}
export interface PropAsset extends BaseAsset {
  type: 'prop';
  physicalCharacteristics: string;
}
export type Asset = CharacterAsset | LocationAsset | PropAsset;
export interface AssetSuggestions {
  characters: string[];
  locations: string[];
  props: string[];
}
export interface ScriptScene {
  id: string;        // e.g., 'scene-123456-1'
  heading: string;   // e.g., 'EXT. CAFE - DAY'
  slugline?: string;
  content: string;   // Full markdown text including heading and ID comment
  order?: number;     // 1-based index
  isPreamble?: boolean;
}
export interface ScriptContext {
  brief: string;
  scratchpad: string;
  assets: string;
}
export const SCENE_HEADING_REGEX = /^(#{1,3}\s*)?(EXT\.|INT\.|EXT\/INT\.|I\/E\.)/im;
export const SCENE_ID_REGEX = /<!--\s*scene-id:\s*([a-zA-Z0-9-]+)\s*-->/;
export const CHARACTER_REGEX = /^\*\*([A-Z][A-Z\s\d.()'"]+)\*\*(?:\s*\([^)]+\))?$/;
export const PARENTHETICAL_REGEX = /^(?:[_*])?\((.+?)\)(?:[_*])?$/;
export interface StoryboardFrame {
  id: string;
  sceneId?: string;
  sceneNumber: string;
  sceneTitle: string; 
  shotNumber: string; // "01", "02", etc.
  title: string;      // Descriptive title: "Arthur's Reveal"
  visualDescription: string;
  motionDescription: string;
  audioDescription: string;
  linkedAssetIds: string[];
  imageUrl?: string;
  imageHistory?: string[]; 
}
export type ViewMode = 'grid' | 'carousel';
export type VisualStyle = string;
export interface ParsedScene {
  id: string;
  title: string;
  content: string;
  suggestedFrameCount: number;
}