# AI FAST LICENSE FLOW APP - Conversation Archive

> Lưu ý: File này được tạo từ ngữ cảnh hiện có của cuộc hội thoại. Nó
> không phải bản xuất nguyên văn tự động toàn bộ lịch sử chat từ hệ
> thống.

## Chủ đề chính

Thiết kế hệ thống License cho các AI Flow App chạy trên Google Flow.

Mục tiêu: - Mỗi Flow App có thể tích hợp License. - Admin tạo License
bằng Private Key. - Flow App chỉ giữ Public Key. - Flow App xác thực
offline: - Project ID - Machine ID - Expiry - Signature

## Quá trình thiết kế License

### Giai đoạn đầu

Đã phân tích mô hình: - Firebase quản lý license phía Admin. - Private
Key chỉ nằm ở Admin. - Flow App không kết nối Firebase để verify. - Flow
App dùng Public Key để verify token.

Token format:

    payload.signature

Thuật toán:

    ECDSA
    P-256
    SHA-256

## Các phiên bản Prompt đã phát triển

### V1 - V7

Quá trình nâng cấp:

-   V1: Ý tưởng License Core.
-   V2: Khóa contract file/function.
-   V3: Prompt sinh code.
-   V4: Embedded source contract.
-   V5: True Copy Source.
-   V6: Full Source Embedded.
-   V7: Production Hardened.

Sau đó rà soát lại và nhận thấy Flow App không cần quá phức tạp.

## Thiết kế lại AI FAST LICENSE LITE

Kiến trúc cuối:

    src/license/

    aifastLicenseConfig.ts

    aifastMachine.ts

    aifastLicenseVerifier.ts

    aifastLicenseManager.ts

### aifastLicenseConfig.ts

Chứa:

-   APP_NAME
-   PROJECT_ID
-   PUBLIC_JWK
-   ISSUER
-   AUDIENCE

Không chứa Private Key.

### aifastMachine.ts

Mục tiêu:

Tạo Machine ID ổn định.

Vấn đề ban đầu:

Dùng:

    crypto.randomUUID()
    +
    localStorage

gây thay đổi mã máy trong Flow sandbox.

Giải pháp:

Machine ID deterministic:

    Browser fingerprint
            |
            v
    SHA-256
            |
            v
    AF-XXXXXXXXXXXX

Loại bỏ: - screen.width - screen.height - random UUID làm định danh
chính

### aifastLicenseVerifier.ts

Luồng:

    License Token

    ↓

    Split payload.signature

    ↓

    Verify ECDSA

    ↓

    Decode payload

    ↓

    Check:

    Project ID
    Machine ID
    Expiry

    ↓

    Valid

Lưu ý:

expiresAt là Unix timestamp seconds.

So sánh đúng:

    expiresAt <= Math.floor(Date.now()/1000)

Không dùng:

    Date.now()

vì khác đơn vị.

### aifastLicenseManager.ts

Chức năng:

-   activateLicense()
-   checkLicense()
-   getLicenseInfo()

Vai trò:

Quản lý trạng thái License cho App.

## Public Key hiện tại

    {
    "x":"7TdV2OHoKXNzV-LruK2SkMcAa6fMOpg5D54GCfzaMo4",
    "y":"yx77NMsDwomn4DB7P31v9495_s28-XzRomrxyNM3V8U",
    "crv":"P-256",
    "kty":"EC",
    "key_ops":["verify"],
    "ext":true
    }

## License test

Project:

    DyoEwgDvZ2xDNL34nZ7m

Machine cũ:

    35902ca0-452d-4d07-a8b0-f5c14b7ca35e

License ID:

    LIC-2026-WH7UB

Expiry:

    1797465599

Đã xác định: - Token đúng. - Project đúng. - Machine đúng. - Lỗi hết hạn
do sai đơn vị timestamp.

## Các yêu cầu UI bổ sung

License Status cần hiển thị:

-   License Active
-   License ID
-   Plan Label
-   Project ID
-   Machine ID
-   Ngày cấp
-   Ngày hết hạn

Có nút:

    COPY MACHINE ID

## Bộ Prompt cuối

Bộ cuối:

    AI_FAST_FLOW_LICENSE_LITE_ONE_SHOT_PROMPT_V2

Mục tiêu:

Chỉ cần copy một prompt vào Google Flow.

Flow tự tạo:

-   License Config
-   Machine ID
-   License Verify
-   License Manager
-   License Gate
-   Startup Protection
-   License Information UI

## Kết luận kiến trúc

ADMIN:

    Private Key
        |
        v
    Sign License Token

FLOW APP:

    License Token

    +

    Public Key

    ↓

    Verify Offline

    ↓

    Unlock Feature

Không đưa: - Private Key - Firebase License Check - Backend License
Validation

vào Flow App.
