import { LICENSE_CONFIG, LICENSE_PUBLIC_JWK } from './aifastLicenseConfig';
import { getOrCreateMachineId } from './aifastMachine';

export async function verifyLicense(token: string) {
  try {
    const parts = token.split('.'); if (parts.length !== 2) return { valid: false };
    const [payloadPart, signaturePart] = parts;
    const publicKey = await crypto.subtle.importKey('jwk', LICENSE_PUBLIC_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const signature = base64UrlToUint8Array(signaturePart);
    const payloadBuffer = new TextEncoder().encode(payloadPart);
    const isSignatureValid = await crypto.subtle.verify({ name: "ECDSA", hash: { name: "SHA-256" } }, publicKey, signature, payloadBuffer);
    if (!isSignatureValid) return { valid: false };
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToUint8Array(payloadPart)));
    if (payload.projectId !== LICENSE_CONFIG.PROJECT_ID) return { valid: false };
    if (payload.machineId !== await getOrCreateMachineId()) return { valid: false };
    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) return { valid: false };
    return { valid: true, payload };
  } catch (err) { return { valid: false }; }
}