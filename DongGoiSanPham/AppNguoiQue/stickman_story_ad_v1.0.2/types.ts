export type PaperStyle = 'Giấy trắng nhăn' | 'Giấy cũ ngả vàng' | 'Giấy học sinh' | 'Giấy ghi chú' | 'Giấy rách mép';
export type StickmanType = 'Mực đen tối giản' | 'Bóng chiếu' | 'Vẽ bút chì' | 'Cắt giấy đen' | 'Phấn trắng';
export type StoryRhythm = 'Nhẹ nhàng' | 'Buồn sâu lắng' | 'Hài hước' | 'Truyền cảm hứng' | 'Bí ẩn' | 'Thiếu nhi';
export type VoiceType = { label: string; prompt: string };
export type AudioMode = 'Chỉ thuyết minh' | 'Thuyết minh & Nhạc nền';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3';
export interface ImageResult {
  base64: string;
  mimeType: string;
  mediaId: string;
}
export interface Scene {
  id: number;
  textVi: string;
  voiceScript: string;
  action: string;
  emotion: string;
  promptEn: string;
  isProductAd?: boolean;
  
  // Trạng thái tạo ảnh
  imageStatus: 'idle' | 'generating' | 'completed' | 'error';
  imageResults: ImageResult[];
  selectedImageIndex: number;
  
  // Trạng thái tạo video
  videoStatus: 'idle' | 'generating' | 'completed' | 'error';
  videoResult?: {
    base64: string;
    mimeType: string;
    mediaId: string;
  };
  isSelected?: boolean;
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
  audioMode: AudioMode;
  maxParallel: number;
  
  productName: string;
  productDesc: string;
  productImage?: {
    mediaId: string;
    base64: string;
    mimeType: string;
  };
}