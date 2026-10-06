import { LICENSE_CONFIG, LICENSE_PUBLIC_JWK } from './aifastLicenseConfig';
import { getOrCreateMachineId } from './aifastMachine';
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
export async function verifyLicense(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, reason: "Định dạng License không hợp lệ" };
    }
    const [payloadPart, signaturePart] = parts;
    // 1. Import Public Key
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      LICENSE_PUBLIC_JWK,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"]
    );
    // 2. Verify Signature
    const signature = base64ToUint8Array(signaturePart);
    const data = new TextEncoder().encode(payloadPart);
    const isValidSig = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      publicKey,
      signature,
      data
    );
    if (!isValidSig) {
      return { valid: false, reason: "Chữ ký License không hợp lệ" };
    }
    // 3. Decode & Check Payload
    const payload = JSON.parse(atob(payloadPart));
    const currentMachineId = await getOrCreateMachineId();
    if (payload.projectId !== LICENSE_CONFIG.PROJECT_ID) {
      return { valid: false, reason: "Project ID không khớp" };
    }
    if (payload.machineId !== currentMachineId) {
      return { valid: false, reason: `License không thuộc về máy này (${currentMachineId})` };
    }
    if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: "License đã hết hạn" };
    }
    return { valid: true, payload };
  } catch (err) {
    console.error("Verification error:", err);
    return { valid: false, reason: "Lỗi hệ thống khi xác thực" };
  }
}