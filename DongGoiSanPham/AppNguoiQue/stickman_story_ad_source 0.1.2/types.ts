export type PaperStyle = 'Giấy trắng nhăn' | 'Giấy cũ ngả vàng' | 'Giấy học sinh' | 'Giấy ghi chú' | 'Giấy rách mép';
export type StickmanType = 'Mực đen tối giản' | 'Bóng chiếu' | 'Vẽ bút chì' | 'Cắt giấy đen' | 'Phấn trắng';
export type StoryRhythm = 'Nhẹ nhàng' | 'Buồn sâu lắng' | 'Hài hước' | 'Truyền cảm hứng' | 'Bí ẩn' | 'Thiếu nhi';
export type VoiceType = 'Giọng Nam Trầm' | 'Giọng Nữ Ngọt Ngào' | 'Giọng Truyền Cảm' | 'Giọng Kể Chuyện';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3';

export interface ImageResult { base64: string; mimeType: string; mediaId: string; }

export interface Scene {
  id: number;
  textVi: string;
  voiceScript: string;
  action: string;
  emotion: string;
  promptEn: string;
  isProductAd?: boolean;
  imageStatus: 'idle' | 'generating' | 'completed' | 'error';
  imageResults: ImageResult[];
  selectedImageIndex: number;
  videoStatus: 'idle' | 'generating' | 'completed' | 'error';
  videoResult?: { base64: string; mimeType: string; mediaId: string; };
}

export interface AppConfig {
  videoModel: string;
  imageModel: string;
  aspectRatio: AspectRatio;
  duration: number;
  paperStyle: PaperStyle;
  stickmanType: StickmanType;
  rhythm: StoryRhythm;
  voiceType: VoiceType;
  maxParallel: number;
  productName: string;
  productDesc: string;
  productImage?: { mediaId: string; base64: string; mimeType: string; };
}