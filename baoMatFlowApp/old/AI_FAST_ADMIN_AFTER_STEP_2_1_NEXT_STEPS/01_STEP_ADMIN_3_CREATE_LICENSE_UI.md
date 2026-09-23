# ADMIN LICENSE UPDATE – STEP 3
# CREATE LICENSE UI

Mục tiêu:
Tạo màn hình Admin để cấp License Token cho Flow App.

Prompt:

ADMIN LICENSE SYSTEM
STEP 3 – CREATE LICENSE ISSUANCE UI

Bối cảnh:

STEP 2.1 đã hoàn thành.

Không thay đổi:
- Signing Key
- Public Key
- Private Key Storage
- Token Format
- Crypto Algorithm

Token phải được tạo duy nhất thông qua:

generateSignedLicenseToken()

Không tự viết signer mới.

==================================================

Tạo trang:

License Management
Tab:

Create License

==================================================

Form fields:

1. Project

Input:
projectId

2. App Name

3. License ID

Tự sinh hoặc nhập.

4. Machine ID

Bắt buộc.

5. Customer Email

Lưu dạng masked khi đưa vào payload.

6. Plan

Ví dụ:
1 tháng
3 tháng
12 tháng

7. Expiry Date

Convert sang Unix seconds.

==================================================

Flow:

Admin nhập thông tin

↓

Validate

↓

Load Current Signing Key

↓

generateSignedLicenseToken()

↓

Self Verify

↓

Hiển thị:

License Token

Fingerprint

Payload Preview

==================================================

Không:

- lưu Private Key
- hiển thị Private Key
- sửa payload sau khi ký
- lưu full token nếu chưa có yêu cầu

==================================================

Output:

Báo:
- File tạo
- Component tạo
- Service sử dụng
- Token generation flow