# BƯỚC 6: TAB 4 - XUẤT DỮ LIỆU & HOÀN THIỆN TOÀN BỘ ỨNG DỤNG

## Mục tiêu:
Xây dựng màn hình xuất file (Export Sheet) cho toàn bộ kịch bản, prompt ảnh, prompt video và âm thanh; ráp nối toàn bộ các tab vào `App.tsx` không lỗi.

## Prompt dán vào Flow Tool Chat:
Hãy hoàn thiện Bước 4 và tích hợp toàn bộ hệ sinh thái ứng dụng:

1. Tạo `components/ExportStep.tsx`:
   - Bảng tổng hợp toàn bộ dự án dạng Production Sheet:
     | Shot | Thời lượng | Góc máy | Lời thoại & Cảm xúc | Audio SFX | Image Prompt | Video Motion Prompt |
   - Nút "Tải Bảng Kịch Bản (CSV)": xuất file CSV để import vào Google Sheets / Excel.
   - Nút "Tải Trọn Bộ Prompts (Markdown/TXT)": gom toàn bộ Video Motion Prompts theo thứ tự để người dùng tiện chạy tool sinh video.
   - Nút "Lưu File Dự Án (JSON)": dùng `Flow.download` đóng gói toàn bộ state dự án.

2. Hoàn thiện kết nối trong `App.tsx`:
   - Kiểm tra logic chuyển tab giữa Bước 1 -> Bước 2 -> Bước 3 -> Bước 4.
   - Đảm bảo khi người dùng tải ảnh tham chiếu ở Bước 2, `mediaId` được truyền chính xác vào hàm `generateShotImage` ở Bước 3.
   - Thêm thông báo toast ngắn gọn khi tạo ảnh hoặc xuất file thành công.
   - Kiểm tra toàn bộ code đảm bảo build mượt mà, không còn lỗi import hay syntax.