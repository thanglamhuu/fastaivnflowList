# BƯỚC 4: XÂY DỰNG TAB 1 (KỊCH BẢN) VÀ TAB 2 (KHÓA NHÂN VẬT & ASSET)

## Mục tiêu:
Xây dựng 2 màn hình đầu tiên: Tạo/sửa kịch bản drama và Module "Khóa thực thể" (tải ảnh tham chiếu nhân vật mặc sẵn đồ).

## Prompt dán vào Flow Tool Chat:
Hãy tạo 2 components cho Tab 1 và Tab 2:

1. Tạo `components/ScriptStep.tsx`:
   - Cho phép người dùng chọn: Visual Style, Tỷ lệ (9:16 hoặc 16:9), Thời lượng (15s,30s, 45s, 60s, 90s, 180s).
   - Ô nhập ý tưởng / Drama Premise.
   - Nút "Sinh Kịch Bản AI": gọi `generateDramaScript` từ `ai.ts`.
   - Khu vực hiển thị kịch bản dạng textarea hoặc editor đơn giản, cho phép người dùng tự do gõ sửa kịch bản hoặc bấm "Viết lại".
   - Nút "Chốt Kịch Bản & Trích Xuất Asset": tự động gọi `extractDramaAssets` và chuyển sang Bước 2.

2. Tạo `components/AssetLockerStep.tsx`:
   - Hiển thị 3 danh sách: Nhân vật (Characters), Bối cảnh (Locations), Đạo cụ (Props).
   - Thẻ Nhân vật (Character Card) gồm:
     * Tên nhân vật, mô tả ngoại hình, giọng điệu.
     * Khu vực tải ảnh: Cho phép bấm để upload ảnh mẫu (ảnh chụp rõ mặt và bộ trang phục mặc định).
     * Khi upload ảnh: Đọc file base64, gọi `Flow.upload` để lấy `mediaId` lưu vào asset.
     * Nút thêm nhân vật thủ công nếu muốn.
   - Thẻ Bối cảnh & Đạo cụ: Tương tự, cho phép nhập mô tả và tải ảnh mẫu nếu có.
   - Nút bấm: "Tiếp tục: Tạo Storyboard & Prompts".