# BƯỚC 5: XÂY DỰNG TAB 3 - PRODUCTION STORYBOARD

## Mục tiêu:
Tạo bàn phân cảnh hiển thị trực quan từng khung hình, tự động gắn ảnh tham chiếu, tách riêng Video Prompt và Lời thoại.

## Prompt dán vào Flow Tool Chat:
Hãy tạo component `components/StoryboardStep.tsx`:

1. Nút tác vụ trên đầu:
   - "Phân Rã Shot Tự Động": gọi `breakdownScriptToShots` để chia nhỏ kịch bản thành danh sách `DramaShot`.
   - "Sinh Tất Cả Ảnh Khung Hình (Batch Gen)": tự động chạy hàng đợi gọi `generateShotImage` cho các shot chưa có ảnh.

2. Giao diện danh sách Shot (Hỗ trợ hiển thị dạng lưới card tỉ lệ dọc 9:16 hoặc 16:9):
   - Mỗi card gồm:
     * Cột hiển thị ảnh preview (hoặc nút bấm "Tạo ảnh khung hình").
     * Huy hiệu số Shot & Thời lượng (VD: Shot 01 - 3s).
     * Góc máy (`cameraAngle`): Extreme Close-up, Over-shoulder...
     * Khung `Video Motion Prompt`: Chứa câu lệnh mô tả chuyển động camera & diễn xuất (có nút Copy nhanh để paste sang Runway/Luma/Sora/Kling).
     * Khung `Lời Thoại & Diễn Xuất`: Tên nhân vật, cảm xúc (giận dữ, khóc...), câu thoại tiếng Việt.
     * Khung `Âm thanh SFX`: Hiệu ứng âm thanh giật gân tương ứng.
   - Cho phép người dùng chỉnh sửa tay nội dung prompt hoặc câu thoại của từng shot.