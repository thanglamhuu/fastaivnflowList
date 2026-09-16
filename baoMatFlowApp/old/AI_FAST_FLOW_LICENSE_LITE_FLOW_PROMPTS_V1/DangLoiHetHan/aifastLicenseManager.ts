import { verifyLicense } from './aifastLicenseVerifier';
const STORAGE_KEY = "aifast_license_token";
/**
 * Kích hoạt license mới. 
 * Nếu hợp lệ, lưu token vào bộ nhớ cục bộ.
 */
export async function activateLicense(token: string): Promise<{ success: boolean; reason?: string }> {
  const result = await verifyLicense(token);
  
  if (result.valid) {
    try {
      localStorage.setItem(STORAGE_KEY, token);
    } catch (e) {
      console.warn("localStorage bị chặn. License sẽ chỉ có tác dụng trong phiên này.");
    }
    return { success: true };
  }
  
  return { success: false, reason: result.reason };
}
/**
 * Kiểm tra tính hợp lệ của license hiện tại trong bộ nhớ.
 */
export async function checkLicense(): Promise<{ valid: boolean; reason?: string }> {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return { valid: false, reason: "Chưa có License được kích hoạt." };
    
    return await verifyLicense(token);
  } catch (e) {
    return { valid: false, reason: "Không thể truy cập bộ nhớ License." };
  }
}
/**
 * Lấy trạng thái lưu trữ license (không xác thực cryptographic).
 */
export function getLicenseStatus(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return false;
  }
}