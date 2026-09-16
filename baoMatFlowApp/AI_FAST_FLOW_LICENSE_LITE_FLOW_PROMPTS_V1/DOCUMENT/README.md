# AI FAST FLOW LICENSE LITE FLOW PROMPTS V1

Bộ prompt dùng trực tiếp trong cửa sổ chat của Google Flow.

Mục tiêu:
- Không upload file.
- Không để AI tự thiết kế License Core.
- Copy từng prompt theo thứ tự.
- Flow sinh đúng file code.

Kiến trúc:

src/license/

1. aifastLicenseConfig.ts
2. aifastMachine.ts
3. aifastLicenseVerifier.ts
4. aifastLicenseManager.ts

Flow App chỉ:
- Verify Public Key
- Check Project ID
- Check Machine ID
- Check Expiry
- Unlock Feature