import {
  UserProfile,
  SymptomLog,
  WeightLog,
  Appointment,
  PhotoMoment,
  ReminderSetting,
  HospitalBagItem,
  KickSession,
  MedicationItem,
  PrescriptionDoc,
  MedicationLog
} from '../types/pregnancy';

const DB_NAME = 'BabyBloomTrackerDB';
const DB_VERSION = 2;

export const STORES = {
  PROFILE: 'profile',
  SYMPTOMS: 'symptoms',
  WEIGHTS: 'weights',
  APPOINTMENTS: 'appointments',
  PHOTOS: 'photos',
  MEDICATIONS: 'medications',
  PRESCRIPTIONS: 'prescriptions',
  MEDICATION_LOGS: 'medicationLogs',
  REMINDERS: 'reminders',
  HOSPITAL_BAG: 'hospitalBag',
  KICKS: 'kicks'
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this device.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if not exist
      if (!db.objectStoreNames.contains(STORES.PROFILE)) {
        db.createObjectStore(STORES.PROFILE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.SYMPTOMS)) {
        db.createObjectStore(STORES.SYMPTOMS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.WEIGHTS)) {
        db.createObjectStore(STORES.WEIGHTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.APPOINTMENTS)) {
        db.createObjectStore(STORES.APPOINTMENTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.PHOTOS)) {
        db.createObjectStore(STORES.PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.MEDICATIONS)) {
        db.createObjectStore(STORES.MEDICATIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.PRESCRIPTIONS)) {
        db.createObjectStore(STORES.PRESCRIPTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.MEDICATION_LOGS)) {
        db.createObjectStore(STORES.MEDICATION_LOGS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.REMINDERS)) {
        db.createObjectStore(STORES.REMINDERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.HOSPITAL_BAG)) {
        db.createObjectStore(STORES.HOSPITAL_BAG, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.KICKS)) {
        db.createObjectStore(STORES.KICKS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic get all items from an IndexedDB store
export async function idbGetAll<T>(storeName: StoreName): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB read error on ${storeName}, falling back:`, err);
    return [];
  }
}

// Generic put / save all items to an IndexedDB store (replaces content)
export async function idbSaveAll<T extends { id: string }>(storeName: StoreName, items: T[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB save error on ${storeName}:`, err);
  }
}

// Save single item
export async function idbPutItem<T>(storeName: StoreName, item: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB put error on ${storeName}:`, err);
  }
}

// Delete single item by key
export async function idbDeleteItem(storeName: StoreName, key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB delete error on ${storeName}:`, err);
  }
}

// Save Profile
export async function idbSaveProfile(profile: UserProfile): Promise<void> {
  return idbPutItem(STORES.PROFILE, { key: 'current_profile', ...profile });
}

// Get Profile
export async function idbGetProfile(): Promise<UserProfile | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.PROFILE, 'readonly');
      const store = tx.objectStore(STORES.PROFILE);
      const req = store.get('current_profile');
      req.onsuccess = () => {
        if (req.result) {
          const { key, ...rest } = req.result;
          resolve(rest as UserProfile);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Clear all user data for a clean fresh start
export async function idbClearAllUserData(): Promise<void> {
  try {
    const db = await openDB();
    const storeNames = [
      STORES.SYMPTOMS,
      STORES.WEIGHTS,
      STORES.APPOINTMENTS,
      STORES.PHOTOS,
      STORES.MEDICATIONS,
      STORES.PRESCRIPTIONS,
      STORES.MEDICATION_LOGS,
      STORES.KICKS
    ];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeNames, 'readwrite');
      for (const s of storeNames) {
        tx.objectStore(s).clear();
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Error clearing IndexedDB:', err);
  }
}

// Calculate approximate local device storage usage (in MB / KB)
export async function idbEstimateStorageUsage(): Promise<{ usedBytes: number; formatted: string }> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      if (usage > 1024 * 1024) {
        return { usedBytes: usage, formatted: `${(usage / (1024 * 1024)).toFixed(1)} MB` };
      }
      return { usedBytes: usage, formatted: `${Math.round(usage / 1024)} KB` };
    } catch {
      // fallback
    }
  }

  // Fallback calculation based on photos & prescription photos
  const photos = await idbGetAll<PhotoMoment>(STORES.PHOTOS);
  const prescriptions = await idbGetAll<PrescriptionDoc>(STORES.PRESCRIPTIONS);
  const approxBytes = photos.reduce((acc, p) => acc + (p.imageUrl?.length || 0), 0) +
    prescriptions.reduce((acc, rx) => acc + (rx.imageUrl?.length || 0), 0);
  const mb = approxBytes / (1024 * 1024);
  return {
    usedBytes: approxBytes,
    formatted: mb > 0.1 ? `${mb.toFixed(1)} MB` : `${Math.round(approxBytes / 1024)} KB`
  };
}
