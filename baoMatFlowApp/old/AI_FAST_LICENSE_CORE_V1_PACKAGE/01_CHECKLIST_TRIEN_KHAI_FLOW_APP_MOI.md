# Checklist triển khai Flow App mới

## Chuẩn bị
[ ] Có PROJECT_ID riêng
[ ] Có APP_NAME
[ ] Có SIGNING_KEY_ID
[ ] Có PUBLIC_JWK

## Cài Core
[ ] Cài aifastLicenseConfig.ts
[ ] Cài aifastLicenseV1.ts
[ ] Không sửa crypto logic

## Tích hợp UI
[ ] License Gate
[ ] Hiển thị Machine ID
[ ] Nhập License Token
[ ] Activate License

## Khóa App
[ ] Startup gọi restoreLicense()
[ ] Không render Main App trước verify

## Bảo vệ chức năng
[ ] Generate
[ ] Analyze
[ ] Video/Image AI
[ ] Export nếu cần

## Kiểm thử
[ ] Token đúng mở App
[ ] Token sai signature bị từ chối
[ ] Token App khác bị từ chối
[ ] Token Machine khác bị từ chối
[ ] Token hết hạn bị từ chối

## Audit
[ ] Không có Private Key
[ ] Không có Firebase License Check
[ ] Không duplicate verifier