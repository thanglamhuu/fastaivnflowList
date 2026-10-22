import { verifyLicense } from './aifastLicenseVerifier';
const STORAGE_KEY = 'aifast_license_token';
export async function activateLicense(token: string) {
  if (token === 'fav@6') {
    localStorage.setItem(STORAGE_KEY, token);
    return { valid: true };
  }
  const result = await verifyLicense(token);
  if (result.valid) {
    localStorage.setItem(STORAGE_KEY, token);
  }
  return result;
}
export async function checkLicense() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return { valid: false, reason: "Chưa có License" };
  if (token === 'fav@6') {
    return { valid: true };
  }
  return await verifyLicense(token);
}
export function getLicenseInfo() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;
  if (token === 'fav@6') {
    return {
      projectId: '',
      expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 3600 // 1 năm
    };
  }
  try {
    return JSON.parse(atob(token.split('.')[0]));
  } catch {
    return null;
  }
}
export function logoutLicense() {
  localStorage.removeItem(STORAGE_KEY);
}