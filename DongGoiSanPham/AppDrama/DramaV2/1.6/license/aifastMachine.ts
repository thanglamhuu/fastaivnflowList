async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
export async function getOrCreateMachineId() {
  const fingerprint = [
    navigator.userAgent || "",
    navigator.platform || "",
    navigator.language || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    screen.colorDepth || 0,
    navigator.hardwareConcurrency || 0,
    (navigator as any).deviceMemory || 0
  ].join("|");
  const hash = await sha256(fingerprint);
  return (
    "AF-" +
    hash.substring(0, 16).toUpperCase()
  );
}