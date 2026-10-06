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

export interface AppBackupPayload {
  version: string;
  app: 'BabyBloom Tracker';
  exportedAt: string;
  isEncrypted: boolean;
  profile: UserProfile;
  dailyNotes?: Record<string, any>;
  symptoms: SymptomLog[];
  weights: WeightLog[];
  appointments: Appointment[];
  photos: PhotoMoment[];
  medications?: MedicationItem[];
  prescriptions?: PrescriptionDoc[];
  medicationLogs?: MedicationLog[];
  reminders: ReminderSetting[];
  hospitalBag: HospitalBagItem[];
  kicks: KickSession[];
}

export interface EncryptedBackupContainer {
  version: string;
  app: 'BabyBloom Tracker';
  exportedAt: string;
  isEncrypted: true;
  salt: string; // hex
  iv: string; // hex
  cipherText: string; // base64
}

// Convert Buffer/Uint8Array to hex and base64
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Derive AES-GCM key from PIN/password using PBKDF2
async function deriveKey(passcode: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt payload with PIN
export async function encryptBackup(data: AppBackupPayload, passcode: string): Promise<EncryptedBackupContainer> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passcode, salt);

  const enc = new TextEncoder();
  const encodedData = enc.encode(JSON.stringify(data));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as BufferSource },
    key,
    encodedData
  );

  const cipherText = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));

  return {
    version: '1.0.0',
    app: 'BabyBloom Tracker',
    exportedAt: new Date().toISOString(),
    isEncrypted: true,
    salt: bufferToHex(salt.buffer),
    iv: bufferToHex(iv.buffer),
    cipherText
  };
}

// Decrypt container with PIN
export async function decryptBackup(container: EncryptedBackupContainer, passcode: string): Promise<AppBackupPayload> {
  const salt = hexToBuffer(container.salt);
  const iv = hexToBuffer(container.iv);
  const key = await deriveKey(passcode, salt);

  const binaryStr = atob(container.cipherText);
  const cipherBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    cipherBytes[i] = binaryStr.charCodeAt(i);
  }

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as BufferSource },
    key,
    cipherBytes.buffer as BufferSource
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuffer);
  return JSON.parse(jsonStr) as AppBackupPayload;
}

// Trigger automatic file download in browser
export function triggerFileDownload(filename: string, textContent: string) {
  const blob = new Blob([textContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
