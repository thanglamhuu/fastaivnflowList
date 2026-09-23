Bạn đang chỉnh sửa Flow App.

Triển khai:

AI FAST LICENSE LITE V1

Không tạo hệ thống License mới.

Không dùng:
- Firebase
- Backend
- API
- Private Key
- JWT

Chuẩn:

ECDSA
P-256
SHA-256

Flow App chỉ dùng Public Key để verify.

Không thay đổi kiến trúc ở các bước sau.
Tạo file:

src/license/aifastLicenseConfig.ts


Copy chính xác:

```typescript
export const LICENSE_CONFIG = {
 APP_NAME:"BMV1 Tạo Video Thang Cuốn KOC",
 PROJECT_ID:"DyoEwgDvZ2xDNL34nZ7m",
 ISSUER:"aifast-license-admin",
 AUDIENCE:"aifast-flow-offline"
} as const;


export const LICENSE_PUBLIC_JWK: JsonWebKey = {
 kty:"EC",
 crv:"P-256",
 x:"7TdV2OHoKXNzV-LruK2SkMcAa6fMOpg5D54GCfzaMo4",
 y:"yx77NMsDwomn4DB7P31v9495_s28-XzRomrxyNM3V8U",
 key_ops:["verify"],
 ext:true
};
```

Không thêm private key.
Không đổi public key.