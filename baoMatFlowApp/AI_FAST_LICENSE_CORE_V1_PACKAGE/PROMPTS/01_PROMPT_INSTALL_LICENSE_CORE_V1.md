# Prompt Install Canonical License Core V1

Tạo hai file:

src/license/aifastLicenseConfig.ts

src/license/aifastLicenseV1.ts

Core phải quản lý:
- Public Key import
- verifyLicenseToken()
- getOrCreateMachineId()
- saveLicenseToken()
- restoreLicense()
- validateLicenseAccess()

Không tạo service License khác.

Không thay đổi:
ECDSA P-256 SHA-256
UTF8(payloadPart)
Token format.