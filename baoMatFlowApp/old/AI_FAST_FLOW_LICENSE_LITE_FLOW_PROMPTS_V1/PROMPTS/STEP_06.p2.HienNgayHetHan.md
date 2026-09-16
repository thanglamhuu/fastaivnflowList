PROMPT: HIỂN THỊ NGÀY HẾT HẠN LICENSE
Bạn đang chỉnh sửa Flow App hiện tại.

Yêu cầu:
Bổ sung hiển thị thông tin License sau khi xác thực thành công.

Không thay đổi:
- License verification logic.
- ECDSA P-256 SHA-256.
- Public Key.
- Project ID check.
- Machine ID check.
- expiresAt validation.

Chỉ bổ sung phần hiển thị thông tin.


========================

1. Cập nhật aifastLicenseVerifier.ts

Hiện tại khi License hợp lệ đang trả:

```typescript
return {
  valid:true
};

Sửa thành:

return {
  valid:true,
  payload
};

Mục đích:
Cho phép UI nhận được thông tin License Payload.

========================

Cập nhật aifastLicenseManager.ts

Không thay đổi activateLicense().

Bổ sung function:

export async function getLicenseInfo(){

  const result = await checkLicense();

  if(!result.valid){

    return {
      valid:false,
      info:null
    };

  }


  return {
    valid:true,
    info:result.payload
  };

}

========================

Tạo helper format ngày

Tạo file:

src/license/aifastLicenseFormat.ts

Code:

export function formatLicenseDate(timestamp:number){

  if(!timestamp){
    return "";
  }


  return new Date(timestamp * 1000)
    .toLocaleDateString(
      "vi-VN",
      {
        day:"2-digit",
        month:"2-digit",
        year:"numeric"
      }
    );

}

Lưu ý:

expiresAt là Unix Timestamp SECOND.

Phải dùng:

timestamp * 1000

Không dùng trực tiếp new Date(timestamp).

========================

Cập nhật License Gate / License Status UI

Sau khi License valid hiển thị:

Thông tin License:

License ID:
payload.licenseId
Gói sử dụng:
payload.planLabel
Project:
payload.projectId
Thiết bị:
payload.machineId
Email:
payload.licensedEmailMasked
Ngày cấp:
formatLicenseDate(payload.issuedAt)
Ngày hết hạn:
formatLicenseDate(payload.expiresAt)

Ví dụ:

License:
LIC-2026-WH7UB

Gói:
3 tháng

Hết hạn:
16/12/2026

========================

Yêu cầu cuối:

Không tạo lại License Core.
Không sửa thuật toán verify.
Không thêm Firebase.
Không thêm API.
Chỉ mở rộng phần trả dữ liệu và hiển thị UI.

Sau khi hoàn thành báo cáo:

FILES UPDATED:

src/license/aifastLicenseVerifier.ts
src/license/aifastLicenseManager.ts
src/license/aifastLicenseFormat.ts
License Status UI component

STATUS:
SUCCESS