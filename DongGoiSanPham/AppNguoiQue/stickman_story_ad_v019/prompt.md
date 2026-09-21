Sửa Stickman Ad Storyteller thành "Người Que Kể Chuyện"
Sửa "Dựng clip người que chuyên nghiệp với thuyết minh Tiếng Việt" thành  căn trái nội dung là
"Phong cách tối giản của người que đen trắng rất phù hợp để truyền tải các thông điệp sâu sắc, các bài học cuộc sống mà không làm người xem bị phân tâm bởi hình ảnh quá sặc sỡ. Nên phù hợp với các dạng:
- Kênh Video Đạo lý / Triết lý nhân sinh
- Kể chuyện thương hiệu (Brand Storytelling) & Bán sách/Khóa học
- Nội dung Giáo dục / Truyện ngụ ngôn thiếu nhi
- Video Chữa lành (Healing)"

Sửa phần cấu hình bên trái, cho người dùng chỉ định app chỉ có thuyết minh hay có cả nhạc nền

Ở bước 2 "Kịch bản chi tiết" ẩn nút Sửa kịch bản, chuyển nội dung các kịch bản sang dạng input text cho tên cảnh và text area cho phần thuyết minh để sửa được và lưu phần sửa đó vào cho các công việc tiếp theo, các màn hình sau
Phần bước tạo video, cho hiện lại nút tải những video được chọn bên cạnh nút Ghép video.

chỉnh Prompt để AI đọc đúng giọng (Bắc/Nam, Tuổi tác)
Để mô hình GenAI (như Veo) lồng tiếng chính xác theo nhân khẩu học (độ tuổi, vùng miền), bạn không cần gửi yêu cầu vào phần kịch bản Text (Bước 1), mà phải gửi thẳng vào Prompt tạo Video của Bước 3.

Dưới đây là cách bạn cần sửa code:

Bước 3.1: Mở rộng danh sách Voice trong constants.ts
Thay vì để các lựa chọn chung chung, hãy đổi thành các chuỗi miêu tả chính xác (Prompt text) bằng tiếng Anh (vì các mô hình Voice/Video AI thường hiểu profile âm thanh bằng tiếng Anh tốt hơn).

TypeScript
// Sửa trong file constants.ts
export const VOICE_TYPES = [
  { 
    label: 'Đạo lý (Nam 40t, miền Bắc)', 
    prompt: 'A 40-year-old Northern Vietnamese male, deep, warm, and philosophical voice' 
  },
  { 
    label: 'Bán sách (Nữ 34t, miền Bắc)', 
    prompt: 'A 34-year-old Northern Vietnamese female (Mien Bac), deep, warm, and philosophical voice' 
  },
  { 
    label: 'Bán sách (Nữ 34t, miền Tây)', 
    prompt: 'A 34-year-old Western Vietnamese female (Mien Tay), sweet, inspiring, and expressive voice' 
  },
  { 
    label: 'Kể chuyện (Nam 25t, Nam)', 
    prompt: 'A 25-year-old Southern Vietnamese male, dynamic, friendly, and narrative voice' 
  },
  { 
    label: 'Thiếu nhi (Nữ 10t, Bắc)', 
    prompt: 'A 10-year-old Northern Vietnamese female, cute, energetic, and storytelling voice for kids' 
  }
];
Bước 3.2: Sửa lại kiểu dữ liệu trong types.ts
Cập nhật lại kiểu VoiceType để lưu cả label và prompt.

TypeScript
// Sửa trong file types.ts
export type VoiceType = { label: string; prompt: string };
Bước 3.3: Tiêm Prompt vào lệnh tạo Video trong App.tsx
Tìm đến hàm generateVideo (khoảng dòng 90) và sửa biến audioPrompt thành như sau:

JavaScript
// Sửa trong file App.tsx
const generateVideo = async (sceneId: number) => {
  // ... (giữ nguyên code cũ) ...
  
  try {
    // Ép AI tuân thủ Profile người đọc và ngôn ngữ
    const audioPrompt = `VIETNAMESE AUDIO NARRATION ONLY. 
    Voice Actor Profile: ${config.voiceType.prompt}. 
    Speaking Mood: ${config.rhythm}. 
    Spoken Text: "${scene.voiceScript}".`;

    const videoRes = await Flow.generate.video({
      prompt: `${scene.promptEn}. ${audioPrompt}`,
      // ... (giữ nguyên các tham số khác)
    });
    // ...
Mẹo viết Prompt cho Voice AI (Flow Video):

Bắt buộc dùng từ khóa: VIETNAMESE AUDIO NARRATION (để tránh AI tự dịch kịch bản sang tiếng Anh).

Công thức chuẩn: [Tuổi] + [Giới tính] + [Vùng miền/Accent] + [Chất giọng/Cảm xúc].

Ví dụ tiếng Anh tương đương cho AI dễ hiểu: "Northern Vietnamese" (Giọng Bắc), "Southern Vietnamese" (Giọng Nam), "Western Vietnamese / Mekong Delta accent" (Giọng miền Tây).

Cảm xúc: "deep" (trầm), "warm" (ấm áp), "expressive" (truyền cảm), "energetic" (tràn đầy năng lượng).

Chỉ cần sửa lại luồng tiêm biến Voice này vào audioPrompt của Bước 3, ứng dụng của bạn sẽ linh hoạt hơn gấp nhiều lần và phục vụ được đa dạng các ngách nội dung (Niche) trên TikTok/Reels!
