# BƯỚC 1: KHỞI TẠO CẤU TRÚC DỰ ÁN & DATA MODEL TỪ ĐẦU (BLANK PROJECT)

## Mục tiêu:
Xây dựng khung dự án React + Tailwind CSS cho ứng dụng "Xưởng Drama FastAIVN" và định nghĩa toàn bộ data models trong file `types.ts`.

## Prompt dán vào Flow Tool Chat:
Hãy khởi tạo ứng dụng React chuyên biệt cho việc làm phim ngắn Drama mang tên "Xưởng Drama FastAIVN". 

1. Tạo file `types.ts` với các định nghĩa kiểu dữ liệu phục vụ quy trình drama:
   - `AspectRatio`: '9:16' (mặc định drama dọc) hoặc '16:9'.
   - `DramaDuration`: '30s' | '60s' | '90s' | '3m'.
   - `DramaStyle`: 'Cinematic Photorealistic' | '3D Pixar' | 'Anime Drama' | 'K-Drama Tone'.
   
   - `CharacterAsset`:
     * id: string;
     * name: string;
     * physicalDescription: string; (mặt, dáng người, kiểu tóc)
     * defaultOutfit: string; (quần áo mặc định kèm full-body)
     * voiceTone: string; (mô tả âm sắc, giọng điệu)
     * referenceImageUrl?: string; (ảnh tham chiếu mặc sẵn đồ)
     * mediaId?: string; (Flow media ID sau khi upload)

   - `LocationAsset`:
     * id: string;
     * name: string;
     * description: string;
     * referenceImageUrl?: string;
     * mediaId?: string;

   - `PropAsset`:
     * id: string;
     * name: string;
     * description: string;
     * referenceImageUrl?: string;
     * mediaId?: string;

   - `DramaShot`:
     * id: string;
     * shotNumber: number;
     * durationSeconds: number;
     * title: string;
     * cameraAngle: string; (Close-up, Over-the-shoulder, Dutch angle, Wide shot...)
     * visualPrompt: string; (dùng để sinh ảnh khung hình tĩnh)
     * videoMotionPrompt: string; (câu lệnh chuyển động máy & cử chỉ để sinh video)
     * dialogue?: { characterName: string; line: string; emotion: string; };
     * sfxAudioCue?: string; (âm thanh giật gân, tát, tiếng vỡ...)
     * imageUrl?: string;
     * isGenerating?: boolean;

   - `DramaProject`:
     * title: string;
     * style: DramaStyle;
     * aspectRatio: AspectRatio;
     * duration: DramaDuration;
     * premise: string;
     * scriptMarkdown: string;
     * characters: CharacterAsset[];
     * locations: LocationAsset[];
     * props: PropAsset[];
     * shots: DramaShot[];

2. Hãy xuất toàn bộ interface và type trong `types.ts`. Đảm bảo code sạch, không phụ thuộc vào thư viện bên ngoài.