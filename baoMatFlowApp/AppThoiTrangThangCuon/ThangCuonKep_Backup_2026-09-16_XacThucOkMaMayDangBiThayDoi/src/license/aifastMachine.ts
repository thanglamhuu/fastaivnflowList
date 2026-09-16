const MACHINE_SEED_KEY = "aifast.machine.seed";
async function getPersistentSeed() {
  let seed = ""; try { seed = localStorage.getItem(MACHINE_SEED_KEY) || ""; } catch(e){}
  if(!seed){ seed = crypto.randomUUID(); try { localStorage.setItem(MACHINE_SEED_KEY, seed); } catch(e){} }
  return seed;
}
async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}
export async function getOrCreateMachineId() {
  const seed = await getPersistentSeed();
  const fingerprint = [navigator.platform, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone, screen.width, screen.height, screen.colorDepth, navigator.hardwareConcurrency, (navigator as any).deviceMemory].join("|");
  const machineHash = await sha256(fingerprint + "|" + seed);
  return "AF-" + machineHash.substring(0, 16).toUpperCase();
}