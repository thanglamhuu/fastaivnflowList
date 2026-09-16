# AI FAST FLOW LICENSE LITE ONE SHOT PROMPT V2

Bộ prompt tối ưu cho Google Flow App.

Mục tiêu:
- Chỉ cần copy 1 file prompt vào cửa sổ chat Flow.
- Flow tự tạo toàn bộ hệ thống License.
- Không phải chạy 7-10 bước riêng.

Kiến trúc:

src/license/

1. aifastLicenseConfig.ts
2. aifastMachine.ts
3. aifastLicenseVerifier.ts
4. aifastLicenseManager.ts

Chức năng:
- Verify ECDSA P-256 SHA-256.
- Check Project ID.
- Check Machine ID.
- Check Expiry.
- Hiển thị License Info.
- Hiển thị ngày hết hạn.
- Hiển thị Machine ID.
- Có nút Copy Machine ID.

Machine ID:
- Không dùng screen width/height.
- Không dùng random UUID làm định danh chính.
- Sinh từ fingerprint ổn định của trình duyệt.