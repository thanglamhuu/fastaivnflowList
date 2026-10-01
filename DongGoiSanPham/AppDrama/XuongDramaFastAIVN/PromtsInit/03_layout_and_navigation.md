# BƯỚC 3: DỰNG GIAO DIỆN CHÍNH & THANH ĐIỀU HƯỚNG TẦNG

## Mục tiêu:
Tạo layout ứng dụng `App.tsx` với giao diện tối (Dark mode) hiện đại, tinh gọn theo quy trình sản xuất 4 bước: 
[1. Ý tưởng & Kịch bản] -> [2. Khóa Nhân Vật & Asset] -> [3. Bàn Phân Cảnh (Storyboard)] -> [4. Xuất Dữ Liệu].

## Prompt dán vào Flow Tool Chat:
Hãy tạo giao diện chính `App.tsx` cho **Xưởng Drama FastAIVN**:

1. Header:
   - Logo & Tên app: **Xưởng Drama FastAIVN** (Kèm badge tỷ lệ khung hình 9:16 / 16:9).
   - Tiêu đề dự án có thể bấm vào để đổi tên.
   - Nút "Lưu Dự Án" (tải file .json qua Flow.download) và "Mở Dự Án" (đọc file .json từ máy).
   - Nút "Tạo Mới".

2. Stepper Navigation (4 bước rõ ràng):
   - Bước 1: ✍️ Kịch Bản (Script Engine)
   - Bước 2: 🎭 Khóa Nhân Vật & Asset (Asset Locker)
   - Bước 3: 🎬 Storyboard & Video Prompts (Production Board)
   - Bước 4: 📦 Xuất Gói Sản Xuất (Export Pack)

3. Quản lý State chung:
   - Khởi tạo state `project` chuẩn theo `DramaProject` đã định nghĩa.
   - Thêm nút Next / Back giữa các bước.
   - Giao diện full màn hình, phong cách tối giản màu xám đậm/đen viền mỏng (`border-zinc-800`), font chữ nét mảnh hiện đại.