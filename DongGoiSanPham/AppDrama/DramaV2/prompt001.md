Hãy đóng vai trò là một Senior ReactJS/TypeScript Architect chuyên phát triển ứng dụng AI Video Studio trên nền tảng Google Flow. Hãy xây dựng cho tôi một ứng dụng web hoàn chỉnh mang tên **"AI Short Film & Sales Video Studio"** để sản xuất phim ngắn từ kịch bản JSON.

### 1. CẤU TRÚC DỮ LIỆU & FILE `voices.ts`
Hãy tạo file `src/voices.ts` bao gồm các kiểu dữ liệu (`VideoModel`, `CameraRig`, `FlowMedia`, `ProjectState`...) và bổ sung thêm danh sách giọng đọc `VOICE_OPTIONS` cùng các interface cho kịch bản phim ngắn:

- `FlowMedia`: `{ mediaId: string; base64: string; mimeType: string; url: string; }`
- `VOICE_OPTIONS`: Mảng các giọng đọc tiếng Việt đa dạng để gán cho nhân vật, mỗi giọng gồm `{ id: string, name: string, gender: 'Nam' | 'Nữ', accent: 'Bắc' | 'Nam' | 'Trung', description: string, sampleTone: string }` (Ví dụ: Nữ trẻ điềm tĩnh chuẩn Bắc, Nam trung niên quyền lực, Nam trưởng phòng thực dụng, Nữ thư ký năng động...).
- Cấu trúc dữ liệu kịch bản JSON (`ScriptProjectData`) bám sát chính xác cấu trúc của file `SepCuopCong.json` gồm:
  - `project`: `{ title, style, aspectRatio, duration, premise, scriptMarkdown, characters: Character[], locations: Location[], props: string[], shots: Shot[] }`
  - `Character`: `{ id, name, physicalDescription, defaultOutfit, voiceTone, avatarMedia?: FlowMedia, selectedVoiceId?: string }`
  - `Location`: `{ id, name, description, locationMedia?: FlowMedia, isGeneratingImage?: boolean }`
  - `Shot`: `{ id, shotNumber, durationSeconds, title, cameraAngle, visualPrompt, videoMotionPrompt, characterNames: string[], dialogue: { characterName, line, emotion }, sfxAudioCue, startFrameMedia?: FlowMedia, videoMedia?: FlowMedia, imageStatus?: 'idle' | 'generating' | 'completed' | 'error', videoStatus?: 'idle' | 'generating' | 'completed' | 'error' }`
  - `config`: `{ ratio, speed, model, threads, resolution }`

Hãy nhúng toàn bộ nội dung của kịch bản mẫu "Sếp bắt gánh tội thay khi dự án lỗi..." (`SepCuopCong.json`) làm dữ liệu mặc định (Default State) khi khởi động ứng dụng để có thể test ngay lập tức.

---

### 2. GIAO DIỆN HEADER & CÔNG CỤ QUẢN LÝ DỰ ÁN (GLOBAL ACTIONS)
Thiết kế Header hiện đại, mang phong cách Dark Mode chuyên nghiệp của phần mềm dựng phim:
1. **Tên Dự Án & Thông số:** Hiển thị `project.title`, badge `aspectRatio` (9:16), `duration` (60s), và bộ chọn `VideoModel` ('Omni 1.1 Flash' | 'Veo 3.1 - Lite' | 'Veo 3.1 - Fast' | 'Veo 3.1 - Quality').
2. **Chuyển đổi màn hình (Stepper / Tabs):**
   - **Bước 1: Thiết lập Nhân vật & Bối cảnh (Cast & Locations)**
   - **Bước 2: Bảng phân cảnh & Sản xuất (Storyboard Studio)**
3. **Các nút chức năng trên Header:**
   - **Import JSON:** Cho phép chọn file `.json` từ máy tính. Khi tải lên, tự động phân tích và cập nhật toàn bộ nhân vật, bối cảnh, danh sách shots (nếu file JSON xuất ra trước đó đã có sẵn ảnh/video `FlowMedia` và `selectedVoiceId` thì khôi phục nguyên trạng).
   - **Export JSON:** Xuất toàn bộ trạng thái hiện tại của dự án (bao gồm các prompt đã chỉnh sửa, giọng đọc đã chọn, ảnh và video đã tạo ở từng shot) thành một file `.json` tải về máy.
   - **Tải ZIP Tất Cả Video (ZIP All Shots):** Sử dụng thư viện `jszip` để gom toàn bộ các video clip của những shot đã tạo xong, đặt tên file rõ ràng (`Shot_01_Title.mp4`, `Shot_02_Title.mp4`...) và tải về thành 1 file `.zip`. Hiển thị số lượng shot đã có video trên nút (VD: `Tải ZIP (3/8)`).
   - **Ghép Tất Cả Shot (Merge Video):** Nút ghép nối tuần tự tất cả các video clip đã tạo xong của các shot thành 1 video hoàn chỉnh duy nhất. Hiển thị thanh tiến trình khi đang ghép và cho phép xem trước + tải file video tổng hợp về máy.

---

### 3. MÀN HÌNH 1: THIẾT LẬP NHÂN VẬT & BỐI CẢNH (PRE-PRODUCTION)
Chia làm 2 khu vực rõ ràng:

#### A. Khu vực Nhân vật (`characters`)
Hiển thị dạng Grid các Card nhân vật. Trong mỗi Card nhân vật:
- Hiển thị tên nhân vật (`name`), mô tả gợi ý giọng đọc gốc từ kịch bản (`voiceTone`).
- **Tải/Chọn Ảnh Nhân Vật:** Khung hiển thị ảnh chân dung/toàn thân của nhân vật (tỷ lệ 9:16 hoặc 3:4). Có nút **"Chọn từ Flow Media"** (mở Modal thư viện Flow Media hoặc tích hợp API chọn media của Flow, đồng thời hỗ trợ tải ảnh từ máy tính lên) để gán vào `avatarMedia`.
- **Chọn Giọng Đọc (`selectedVoiceId`):** Dropdown lấy danh sách từ `VOICE_OPTIONS` trong `voices.ts`. Khi tạo video ở các shot có nhân vật này thoại, hệ thống sẽ tự động lấy giọng đọc này.
- **Chỉnh sửa mô tả:** Cho phép sửa nhanh `physicalDescription` và `defaultOutfit`.

#### B. Khu vực Bối cảnh (`locations`)
Hiển thị danh sách các bối cảnh trong kịch bản. Trong mỗi Card bối cảnh:
- Hiển thị tên bối cảnh (`name`).
- **Ô nhập lệnh mô tả bối cảnh (`description`):** Một `textarea` hiển thị nội dung từ `locations.description` và cho phép người dùng chỉnh sửa tự do.
- **Ảnh Bối Cảnh (`locationMedia`):** Có nút **"Chọn từ Flow Media"** (hoặc tải ảnh lên) VÀ nút **"Tạo Ảnh Bối Cảnh"** (dùng prompt trong ô `description` để tạo ảnh bối cảnh trực tiếp).
- Nút lớn ở góc dưới: **"Tiếp tục sang Storyboard →"** để chuyển sang Màn hình 2.

---

### 4. MÀN HÌNH 2: STORYBOARD STUDIO (DANH SÁCH SHOT CARDS)
Hiển thị danh sách các phân cảnh từ mảng `shots`, mỗi shot là 1 Card lớn, bố cục trực quan (bên trái là thông tin & prompt, bên phải là khu vực Media Start Frame & Video):

Trong mỗi **Shot Card**, thiết kế đầy đủ các thành phần sau:
1. **Header của Card:** Số thứ tự Shot (`Shot #1`), Tiêu đề (`title`), Thời lượng (`durationSeconds`s), Góc máy (`cameraAngle`), và các badge tên nhân vật xuất hiện (`characterNames` kèm avatar nhỏ nếu đã tải lên ở Bước 1).
2. **Khu vực Thoại & Âm thanh:**
   - Hiển thị nhân vật nói (`dialogue.characterName`), badge Giọng đọc đã gán ở Bước 1, cảm xúc (`dialogue.emotion`), và ô cho phép sửa câu thoại (`dialogue.line`).
   - Hiển thị hiệu ứng âm thanh (`sfxAudioCue`).
3. **Khu vực Chỉnh sửa Prompt:**
   - **Prompt Tạo Ảnh (`visualPrompt`):** Ô `textarea` cho phép xem và chỉnh sửa trực tiếp. Có nút nhỏ *"Ghép mô tả nhân vật & bối cảnh"* nếu người dùng muốn nối thêm thông tin từ Bước 1 vào prompt.
   - **Prompt Chuyển Động Video (`videoMotionPrompt`):** Ô `textarea` cho phép xem và chỉnh sửa trực tiếp lệnh điều khiển camera/chuyển động trong Flow.
4. **Khu vực Start Frame (Ảnh tham chiếu đầu cảnh):**
   - Khung hiển thị ảnh Start Frame (theo đúng tỷ lệ `aspectRatio` của dự án, ví dụ 9:16).
   - Nút **"Chọn từ Flow Media"**: Cho phép chọn ảnh có sẵn từ Flow Media (hoặc upload từ máy) làm Start Frame.
   - Nút **"Tạo Ảnh (Generate Image)"**: Lấy `visualPrompt` hiện tại (kèm ảnh nhân vật/bối cảnh làm tham chiếu nếu có) để gọi hàm tạo ảnh của Flow.
   - **Cơ chế bấm nhiều lần (Re-generate & Cancel):** Nút "Tạo Ảnh" luôn cho phép bấm lại bất cứ lúc nào (kể cả khi đang trong trạng thái `generating` hoặc đã `completed`). Khi người dùng bấm lại, hệ thống lập tức hủy/bỏ qua lượt tạo ảnh hiện tại của shot đó (`requestId` / `AbortController`) và chạy tiến trình tạo ảnh mới theo `visualPrompt` mới nhất.
5. **Khu vực Video Kết Quả (Image-to-Video):**
   - **Điều kiện hiển thị:** Ngay sau khi Shot đã có ảnh Start Frame (`startFrameMedia`), hiển thị/kích hoạt nút **"Tạo Video (Generate Video)"**.
   - **Cơ chế Tạo Video:** Khi bấm "Tạo Video", hệ thống lấy ảnh `startFrameMedia` làm ảnh tham chiếu đầu vào + `videoMotionPrompt` + thông tin thoại (`dialogue.line`) + giọng đọc của nhân vật đang thoại (`selectedVoiceId`) để gọi API tạo video của Flow.
   - **Cơ chế bấm nhiều lần (Re-generate & Cancel):** Tương tự nút tạo ảnh, nút "Tạo Video" có thể bấm lại nhiều lần. Nếu bấm khi đang tạo hoặc đã tạo xong, hệ thống sẽ bỏ qua/hủy tiến trình tạo video cũ của shot đó và tạo lại ngay lập tức theo prompt và ảnh Start Frame mới nhất.
   - **Trình phát & Công cụ Video:** Khi video tạo xong (`videoMedia`):
     - Hiển thị video player ngay trên card.
     - Nút **Zoom To Video (Phóng to):** Khi bấm vào sẽ mở một Modal Lightbox toàn màn hình để xem video kích thước lớn sắc nét.
     - Nút **Tải Clip (Download Shot):** Tải trực tiếp file `.mp4` của riêng shot đó về máy.

---

### 5. YÊU CẦU KỸ THUẬT & TRẢI NGHIỆM NGƯỜI DÙNG (UX)
- **Tích hợp Flow Media & AI Generation:** Thiết kế tầng service (`flowService.ts`) kết nối với Flow Media Picker và hàm tạo Ảnh/Video trên môi trường Google Flow (nếu chạy ở môi trường preview chưa có bridge API thực tế, hãy xây dựng cơ chế fallback thông minh: cho phép chọn từ thư viện Flow Media giả lập sẵn + upload file thật từ máy + sinh ảnh/video preview mượt mà để test toàn bộ luồng từ đầu đến cuối).
- **Xử lý bất đồng bộ độc lập theo từng Shot:** Quản lý tiến trình tạo ảnh/video bằng `Map<string, AbortController>` hoặc `generationCounter` theo từng `shot.id` để việc bấm tạo lại ở Shot 1 hoàn toàn độc lập, hủy ngay tiến trình cũ của Shot 1 mà không ảnh hưởng tới Shot 2 đang chạy.
- **Tính năng Ghép Video (Video Merger):** Sử dụng HTML5 `<canvas>` + `<video>` + `MediaRecorder` API để phát nối tiếp các video đã tạo và ghi lại thành 1 file video hoàn chỉnh tải về máy (không bị lỗi CORS), kèm thanh phần trăm tiến độ rõ ràng.
- Giao diện sử dụng **Tailwind CSS** và bộ icon **Lucide React**, thiết kế chuẩn Studio chuyên nghiệp, tối ưu không gian hiển thị cho video dọc `9:16`.