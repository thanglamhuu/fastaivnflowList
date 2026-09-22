export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3' | '3:4';
export type Gender = 'Nam' | 'Nữ';
export type Accent = 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
export type Speed = '0.75x' | '1x' | '1.25x' | '1.5x';
export type OutfitMode = 'Thay trang phục' | 'Cố định';
export interface Shot {
  number: number;
  duration: number;
  transcript: string;
  prompt: string;
  videoBase64?: string;
  isGenerating?: boolean;
  isSelected?: boolean;
  error?: string;
}
export interface ProjectConfig {
  ratio: AspectRatio;
  gender: Gender;
  accent: Accent;
  speed: Speed;
  outfitMode: OutfitMode;
  model: string;
  threads: number;
} 