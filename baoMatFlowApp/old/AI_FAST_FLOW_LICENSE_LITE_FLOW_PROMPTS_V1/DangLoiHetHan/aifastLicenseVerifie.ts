import { LICENSE_CONFIG, LICENSE_PUBLIC_JWK } from './aifastLicenseConfig';
import { getOrCreateMachineId } from './aifastMachine';
/**
 * Chuyển đổi Base64Url sang Uint8Array để xử lý Crypto
 */
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
/**
 * Hàm xác thực License Token (ECDSA P-256 + SHA-256)
 * Yêu cầu: Token định dạng "Payload.Signature"
 */
export async function verifyLicense(token: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    // 1. Split token: payload.signature
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, reason: "Định dạng License không hợp lệ (Thiếu dấu chấm phân tách)." };
    }
    const [payloadPart, signaturePart] = parts;
    // 2. Import LICENSE_PUBLIC_JWK
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      LICENSE_PUBLIC_JWK,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, // Key không cần export lại
      ['verify']
    );
    // Chuẩn bị dữ liệu để verify
    const signature = base64UrlToUint8Array(signaturePart);
    const payloadBuffer = new TextEncoder().encode(payloadPart);
    // 3. Verify Signature (Không parse payload trước bước này)
    const isSignatureValid = await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" }
      },
      publicKey,
      signature,
      payloadBuffer
    );
    if (!isSignatureValid) {
      return { valid: false, reason: "Chữ ký License không hợp lệ hoặc đã bị chỉnh sửa." };
    }
    // 4. Decode payload sau khi đã xác thực chữ ký thành công
    const payloadRaw = new TextDecoder().decode(base64UrlToUint8Array(payloadPart));
    const payload = JSON.parse(payloadRaw);
    // 5. Check logic nghiệp vụ
    // Kiểm tra Project ID
    if (payload.projectId !== LICENSE_CONFIG.PROJECT_ID) {
      return { valid: false, reason: "Mã dự án (Project ID) không khớp với ứng dụng này." };
    }
    // Kiểm tra Machine ID (Định danh thiết bị)
    if (payload.machineId !== getOrCreateMachineId()) {
      return { valid: false, reason: "License này không dành cho thiết bị hiện tại." };
    }
    // Kiểm tra thời hạn (Unix Timestamp)
    if (payload.expiresAt <= Date.now()) {
      return { valid: false, reason: "Mã License của bạn đã hết hạn sử dụng." };
    }
    // Tất cả các bước hợp lệ
    return { valid: true };
  } catch (err) {
    console.error("Critical License Error:", err);
    return { 
      valid: false, 
      reason: "Lỗi hệ thống khi giải mã License: " + (err instanceof Error ? err.message : "Unknown Error") 
    };
  }
}