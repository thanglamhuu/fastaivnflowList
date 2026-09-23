import { verifyLicense } from './aifastLicenseVerifier';
const STORAGE_KEY = "aifast_license_token";
export async function activateLicense(token: string) {
  const result = await verifyLicense(token);
  if (result.valid) { try { localStorage.setItem(STORAGE_KEY, token); } catch (e) {} return { success: true, payload: result.payload }; }
  return { success: false, reason: result.reason };
}
export async function checkLicense() {
  try { const token = localStorage.getItem(STORAGE_KEY); if (!token) return { valid: false }; return await verifyLicense(token); } catch (e) { return { valid: false }; }
}