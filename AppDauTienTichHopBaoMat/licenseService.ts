import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
// --- CONFIGURATION ---
const PROJECT_ID = "DyoEwgDvZ2xDNL34nZ7m";
const firebaseConfig = {
  apiKey: "AIzaSyC19RZ_Yiosx-7kMFd9DK4",
  authDomain: "fast9.firebaseapp.com",
  projectId: "fas2609",
  storageBucket: "fa.firebasestorage.app",
  messagingSenderId: "4467447",
  appId: "1:44d9fe79806bb80b34eb2",
  measurementId: "G-RK0J66"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const STORAGE_KEYS = {
  MACHINE_ID: 'flow_app_machine_id',
  LICENSE_KEY: 'flow_app_license_key'
};
/** Helper to handle localStorage safely in sandboxed iframe */
const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }
};
/** Generates or retrieves a persistent Machine ID */
export const getOrCreateMachineId = (): string => {
  let id = safeStorage.getItem(STORAGE_KEYS.MACHINE_ID);
  if (!id) {
    id = crypto.randomUUID();
    safeStorage.setItem(STORAGE_KEYS.MACHINE_ID, id);
  }
  return id;
};
/** Gets the stored license key if it exists */
export const getStoredLicenseKey = (): string | null => {
  return safeStorage.getItem(STORAGE_KEYS.LICENSE_KEY);
};
/** Saves the valid license key locally */
export const saveLicenseKey = (key: string) => {
  safeStorage.setItem(STORAGE_KEYS.LICENSE_KEY, key);
};
/** 
 * Verifies the license key strictly against the server.
 */
export const verifyLicense = async (licenseKey: string): Promise<boolean> => {
  const machineId = getOrCreateMachineId();
  
  try {
    const docRef = doc(db, 'machines', machineId, 'projects', PROJECT_ID, 'licenses', licenseKey);
    const snapshot = await getDocFromServer(docRef);
    return snapshot.exists();
  } catch (error) {
    console.error("License check error:", error);
    return false;
  }
};
export { PROJECT_ID };