import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Database,
  Pill
} from 'lucide-react';
import {
  AppBackupPayload,
  EncryptedBackupContainer,
  encryptBackup,
  decryptBackup,
  triggerFileDownload
} from '../utils/storage';
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

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    profile: UserProfile;
    dailyNotes?: Record<string, any>;
    symptoms: SymptomLog[];
    weights: WeightLog[];
    appointments: Appointment[];
    photos: PhotoMoment[];
    medications: MedicationItem[];
    prescriptions: PrescriptionDoc[];
    medicationLogs: MedicationLog[];
    reminders: ReminderSetting[];
    hospitalBag: HospitalBagItem[];
    kicks: KickSession[];
  };
  onRestoreData: (restoredData: AppBackupPayload) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onRestoreData
}) => {
  const [useEncryption, setUseEncryption] = useState(true);
  const [exportPin, setExportPin] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Restore state
  const [restoreFileContent, setRestoreFileContent] = useState<string | null>(null);
  const [isContainerEncrypted, setIsContainerEncrypted] = useState(false);
  const [restorePin, setRestorePin] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [restorePreview, setRestorePreview] = useState<AppBackupPayload | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const payload: AppBackupPayload = {
        version: '1.0.0',
        app: 'BabyBloom Tracker',
        exportedAt: new Date().toISOString(),
        isEncrypted: useEncryption && exportPin.trim().length > 0,
        ...currentData
      };

      const dateStr = new Date().toISOString().split('T')[0];

      if (useEncryption && exportPin.trim().length > 0) {
        const encrypted = await encryptBackup(payload, exportPin.trim());
        triggerFileDownload(
          `babybloom-secure-backup-${dateStr}.bbbak`,
          JSON.stringify(encrypted, null, 2)
        );
      } else {
        triggerFileDownload(
          `babybloom-backup-${dateStr}.json`,
          JSON.stringify(payload, null, 2)
        );
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to generate backup file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError('');
    setRestorePreview(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      setRestoreFileContent(content);

      try {
        const parsed = JSON.parse(content);
        if (parsed.isEncrypted && parsed.cipherText) {
          setIsContainerEncrypted(true);
        } else if (parsed.app || parsed.profile) {
          setIsContainerEncrypted(false);
          setRestorePreview(parsed as AppBackupPayload);
        } else {
          setRestoreError('Unrecognized backup format.');
        }
      } catch {
        setRestoreError('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDecryptAndPreview = async () => {
    if (!restoreFileContent || !restorePin) return;
    setRestoreError('');

    try {
      const container: EncryptedBackupContainer = JSON.parse(restoreFileContent);
      const decrypted = await decryptBackup(container, restorePin.trim());
      if (!decrypted.profile) {
        throw new Error('Invalid decrypted content');
      }
      setRestorePreview(decrypted);
    } catch {
      setRestoreError('Incorrect PIN or corrupted backup.');
    }
  };

  const handleConfirmRestore = () => {
    if (!restorePreview) return;
    onRestoreData(restorePreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Secure Backup &amp; Restore</h3>
              <p className="text-[11px] text-stone-500">Encrypted on-device pregnancy archive</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* SECTION 1: EXPORT BACKUP */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-stone-900">Download Encrypted Backup</h4>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Export your prescriptions, medication logs, symptom check-ins, weight charts, ultrasound photos, and doctor notes into a secure single-file archive.
            </p>

            {/* Current Summary Badge */}
            <div className="grid grid-cols-4 gap-1.5 py-2 px-3 bg-stone-50 rounded-xl text-[10px] text-stone-600 font-mono text-center">
              <div>
                <span className="block font-bold text-stone-800">{currentData.symptoms.length}</span>
                <span>Symptoms</span>
              </div>
              <div>
                <span className="block font-bold text-stone-800">{currentData.photos.length}</span>
                <span>Photos</span>
              </div>
              <div>
                <span className="block font-bold text-rose-600">{currentData.medications.length}</span>
                <span>Meds</span>
              </div>
              <div>
                <span className="block font-bold text-teal-600">{currentData.prescriptions.length}</span>
                <span>Rx Slips</span>
              </div>
            </div>

            {/* Encryption PIN */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useEncryption}
                  onChange={(e) => setUseEncryption(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Protect with AES-256 Passcode / PIN</span>
              </label>

              {useEncryption && (
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    placeholder="Enter backup passcode (e.g., 4-digit PIN)"
                    value={exportPin}
                    onChange={(e) => setExportPin(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Encrypting & Packaging...' : 'Download Backup File'}</span>
            </button>

            {exportSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Backup downloaded successfully! Keep this file in a safe place.</span>
              </div>
            )}
          </div>

          {/* SECTION 2: RESTORE BACKUP */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-stone-900">Restore from File</h4>
            </div>

            <p className="text-[11px] text-stone-500">
              Restore your pregnancy journal on any browser, device, or phone without loss of records.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.cfbak,.bbbak"
              onChange={handleFileSelected}
              className="hidden"
            />

            {!restoreFileContent ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-indigo-400 rounded-xl text-xs font-medium text-stone-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all bg-stone-50/50"
              >
                <FileText className="w-4 h-4 text-stone-400" />
                <span>Choose .bbbak or .json Backup File</span>
              </button>
            ) : (
              <div className="space-y-3">
                {isContainerEncrypted && !restorePreview && (
                  <div className="space-y-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Encrypted File Detected - Enter PIN</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter PIN used during export"
                        value={restorePin}
                        onChange={(e) => setRestorePin(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                      />
                      <button
                        onClick={handleDecryptAndPreview}
                        className="px-3 py-1.5 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800"
                      >
                        Unlock
                      </button>
                    </div>
                  </div>
                )}

                {restoreError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{restoreError}</span>
                  </div>
                )}

                {restorePreview && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready to Restore</span>
                    </div>
                    <div className="text-[11px] text-stone-600 space-y-0.5">
                      <p>• Mother: <strong>{restorePreview.profile?.name}</strong> (Due {restorePreview.profile?.dueDate})</p>
                      <p>• {restorePreview.symptoms?.length || 0} symptom logs, {restorePreview.photos?.length || 0} photos</p>
                      <p>• {restorePreview.medications?.length || 0} medications, {restorePreview.prescriptions?.length || 0} prescriptions</p>
                    </div>
                    <button
                      onClick={handleConfirmRestore}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs"
                    >
                      Confirm and Load Data into App
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setRestoreFileContent(null);
                    setRestorePreview(null);
                    setRestoreError('');
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-700 underline block mx-auto text-center"
                >
                  Select a different file
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
