Act as an Expert ReactJS Developer. I want to build a "Dynamic Tech-Creator Video Studio" application on Flow Tool. 

Here are the detailed technical requirements and UI/UX flows. You MUST use Tailwind CSS for styling (dark mode theme, cinematic neon accents) and `flow-sdk` for AI integrations.

### 1. DATA MODELS & CONSTANTS
- **Aspect Ratios**: 9:16 (default), 16:9, 1:1, 4:3, 3:4.
- **Gender**: "Nam", "Nữ" (Auto-detect on image upload, but user can override).
- **Voice Accent** (Dependent on Gender): "Miền Bắc", "Miền Trung", "Miền Nam".
- **Speaking Speed**: 0.8x, 1x (default), 1.25x, 1.5x.
- **Language**: Vietnamese (Fixed).
- **Video Models**: Omni 1.1 Flash (default), Veo 3.1 - Lite, Veo 3.1 - Fast, Veo 3.1 - Quality.
- **Parallel Threads**: 1, 2, 4.
- **Allowed Durations (seconds)**: 2, 4, 6, 8, 10.

### 2. UI LAYOUT & WORKFLOW
Divide the app into a Left Sidebar (Configuration) and a Main Content Area (Step 1 & Step 2).

#### LEFT SIDEBAR (Sticky Configuration)
- **Media Uploads**: 
  1. "Ảnh nhân vật gốc" (Main Character Image).
  2. "Ảnh trang phục tham chiếu" (Outfit Reference Image - optional).
  *Auto-Detect Gender Logic*: When the Main Character Image is uploaded, immediately call `Flow.generate.text` with the image and prompt: "Người trong ảnh là Nam hay Nữ? Chỉ trả về đúng 1 chữ: Nam hoặc Nữ". Update the Gender state accordingly.
- **Settings Dropdowns**: Aspect Ratio, Gender, Accent, Speed, Video Model, Parallel Threads.
- **Voice Script**: A large textarea for the user to input the raw transcript.
- **Action Button**: "Tạo kịch bản Shot (Bước 1)". Disable if script or main image is missing.

#### MAIN CONTENT - STEP 1: SCENE & SCRIPT REVIEW
When user clicks "Tạo kịch bản Shot":
- Call `Flow.generate.text` using the "OMNIFLASH CREATOR DIRECTOR" System Prompt (provided below) + User's Voice Script.
- **Top Section**: Display the uploaded character image, forced into a CSS container matching the selected Aspect Ratio (e.g., aspect-[9/16] or aspect-[16/9]) using `object-cover`.
- **List of Scenes**: Parse the returned JSON. For each scene, render a Card containing:
  - Editable `<textarea>` for the prompt.
  - Dropdown for Duration (2, 4, 6, 8, 10).
  - *Duration Auto-Calculation*: Default duration = (word count of transcript / 4) * (1 / speed). Round to the nearest allowed duration (2,4,6,8,10).
- **Action Button**: "Chốt kịch bản & Chuyển sang Bước 2".

#### MAIN CONTENT - STEP 2: VIDEO GENERATION & EXPORT
- **Header Actions**: "Tạo toàn bộ cảnh" (respecting parallel threads limit).
- **Scene List**: For each scene:
  - A Video Player block. Shows loading spinner if generating.
  - Checkbox to select the scene for merging.
  - Button "Tạo Video Cảnh Này" (Calls `Flow.generate.video`).
    - *Video Prompt construction*: Combine the scene's visual prompt + audio instructions. 
    - *Audio Instruction*: `VIETNAMESE AUDIO NARRATION ONLY. Voice Actor: {Gender}, {Accent} Vietnam accent. Speaking Speed: {Speed}. Spoken Text: "{Transcript}".`
    - *Reference Images*: Pass both the Character Image and Outfit Image mediaIds to the model.
  - Button "Tải Cảnh Này" (Download individual MP4).
- **Bottom Actions**: 
  - "Ghép các cảnh đã chọn (Merge)": Use `ffmpeg.wasm` to concat the selected MP4s into one final video.
  - "Tải Video Hoàn Chỉnh (MP4)": Download the merged result.

### 3. THE SYSTEM PROMPT (DO NOT MODIFY, HARDCODE THIS INTO THE APP)
When generating the script in Step 1, you MUST use this exact system instruction for `Flow.generate.text`:

`Bạn là OMNIFLASH CREATOR DIRECTOR — Đạo diễn AI chuyên tạo prompt video dạng ngắn theo phong cách "Dynamic Tech-Creator". Nhiệm vụ của bạn là biến kịch bản (transcript) thành một bản mô tả chi tiết, sinh động, hiệu ứng liên tục để AI Render (OmniFlash) có thể tạo ra video không bao giờ nhàm chán.
# 3 QUY TẮC SINH TỬ
1. CHÍNH TẢ & TEXT HOÀN HẢO: Chữ hiển thị trên màn hình phải chuẩn chính tả Tiếng Việt 100%. Mỗi cụm text hiển thị tối đa 3-5 từ, ngắn gọn.
2. HIỆU ỨNG THAY ĐỔI LIÊN TỤC: Không có cảnh nào được phép tĩnh lặng. Mỗi shot phải có sự thay đổi về Text, Icon/Graphic, hoặc Background/Trang phục.
3. KHÔNG GIẢI THÍCH: KẾT QUẢ ĐẦU RA CHỈ ĐƯỢC PHÉP LÀ CÁC SHOT PROMPT.
# VISUAL DNA
- Tốc độ & Nhịp điệu: Nhanh, dứt khoát, năng lượng cao.
- Kinetic Text: Font chữ to, đậm, hiện đại. Dùng Neon Glow, Gradient, 3D Text. Xuất hiện kiểu Pop-up, Snap, Slide.
- Floating Graphics: Liên tục gán Icon hoặc Đồ họa lơ lửng đồng điệu với ý nghĩa câu.
- Magic Transitions: Đổi phông nền chớp nhoáng, đổi trang phục tức thì.
- Camera: Tĩnh nhưng có Punch-in (zoom giật vào mặt) ở keyword.
# CÁCH CHIA SHOT
Chia shot theo Ý NGHĨA (Meaning Beat).
# KẾT QUẢ TRẢ VỀ BẮT BUỘC SỬ DỤNG CODE JSON
{
  "name": "yyyyMMdd",
  "ratio": "{user_selected_ratio}",
  "schemaVersion": "cmvd_podcast_shots_v01",
  "projectName": "CMVD Podcast",
  "shots": [
    {
      "number": 1,
      "duration": 4,
      "transcript": "Câu thoại",
      "prompt": "Mô tả chi tiết bằng 1 đoạn văn liền mạch: Người nói (biểu cảm) + Kinetic Text (hiệu ứng) + Floating Graphics + Background/Transition + SFX & Music vibe."
    }
  ]
}
Chỉ trả về JSON, không Markdown, không giải thích thêm.`

### 4. TECHNICAL CONSTRAINTS
- Implement `ffmpegService` using a Web Worker to handle video concatenation without blocking the main UI thread.
- Handle JSON parsing carefully, stripping out markdown code blocks if the AI returns them.
- Ensure the UI looks highly professional, like an advanced video editing dashboard (dark mode, sleek sliders, clear visual hierarchy).

Please write the complete React code in App.tsx and any necessary separate files (types, services, components).