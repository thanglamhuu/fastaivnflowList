import { verifyLicense } from './aifastLicenseVerifier';
const STORAGE_KEY = 'aifast_license_token';
export async function activateLicense(token: string) {
  const result = await verifyLicense(token);
  if (result.valid) {
    localStorage.setItem(STORAGE_KEY, token);
  }
  return result;
}
export async function checkLicense() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return { valid: false, reason: "Chưa có License" };
  return await verifyLicense(token);
}
export function getLicenseInfo() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[0];
    return JSON.parse(atob(payloadPart));
  } catch {
    return null;
  }
}
export function logoutLicense() {
  localStorage.removeItem(STORAGE_KEY);
}