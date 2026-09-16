# AI FAST LICENSE CORE V1
## Mô tả luồng và kiến trúc

Mục tiêu:
Chuẩn hóa một cơ chế License Offline dùng chung cho nhiều Flow App.

Nguyên tắc:
- Flow App không chứa Private Key.
- Flow App không kết nối Firebase để xác minh License.
- Admin giữ Private Key và ký Token.
- Flow App chỉ giữ Public Key và verify offline.

Luồng:

ADMIN
 -> tạo payload License
 -> ký ECDSA P-256 SHA-256
 -> tạo Signed Token

FLOW APP
 -> nhận Token
 -> verify signature
 -> kiểm tra projectId
 -> kiểm tra machineId
 -> kiểm tra expiry
 -> mở ứng dụng

Canonical Core:
Tất cả Flow App phải dùng cùng:
src/license/aifastLicenseV1.ts

Không tự viết lại crypto ở từng App.

Các file chính:

aifastLicenseConfig.ts:
- chứa PROJECT_ID
- APP_NAME
- SIGNING_KEY_ID
- PUBLIC_JWK

aifastLicenseV1.ts:
- Machine ID
- Token verify
- Storage
- Restore License
- Action guard

License Gate:
- giao diện nhập License
- hiển thị Machine ID

Startup Guard:
- khóa App trước khi verify

Action Guard:
- kiểm tra quyền trước các chức năng AI quan trọng