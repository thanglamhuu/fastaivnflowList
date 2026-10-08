Hãy rà soát và khắc phục 4 điểm kỹ thuật sau để hoàn thiện Xưởng Drama FastAIVN:

1. Cập nhật `App.tsx`:
- Trong hàm `handleExtractAndNext`, đảm bảo đồng bộ `aspectRatio: config.ratio` vào project.
- Cải thiện cơ chế gộp nhân vật: Giữ nguyên các nhân vật đã tạo và có ảnh tham chiếu, đồng thời tự động bổ sung thêm các nhân vật được AI bóc tách từ kịch bản (không để xảy ra tình trạng mất nhân vật nếu danh sách đã có 1 mục rỗng).

2. Cập nhật `components/StoryboardStep.tsx`:
- Đảm bảo tỷ lệ hiển thị khung hình (aspect ratio) của từng ảnh, clip trong card shot sử dụng `config.ratio` thay vì phụ thuộc vào `project.aspectRatio` cũ, đảm bảo khung hình 9:16 và 16:9 luôn khớp chính xác với cài đặt ở thanh Sidebar.

3. Cập nhật `services/video.ts`:
- Trong hàm `adjustClipSpeed`, thay thế đoạn code convert base64 bằng reduce/fromCharCode sang FileReader đọc Blob an toàn để tránh lỗi tràn bộ nhớ (Call stack exceeded) khi xử lý video dung lượng lớn.

Đảm bảo giữ nguyên phong cách giao diện Dark Mode hiện tại và không gây lỗi TypeScript build.