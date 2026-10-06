import React, { useState, useRef, useMemo } from 'react';
import {
  Pill,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Camera,
  Upload,
  FileText,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  X,
  Volume2,
  VolumeX,
  Check,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Search,
  SlidersHorizontal,
  FileCheck,
  Archive,
  ArchiveRestore,
  BellOff,
  BellRing,
  Power
} from 'lucide-react';
import { MedicationItem, PrescriptionDoc, MedicationLog } from '../types/pregnancy';
import { getTodayDateString } from '../utils/dateTime';

interface MedicationsTabProps {
  medications: MedicationItem[];
  prescriptions: PrescriptionDoc[];
  medicationLogs: MedicationLog[];
  onAddMedication: (med: MedicationItem) => void;
  onUpdateMedication: (med: MedicationItem) => void;
  onDeleteMedication: (id: string) => void;
  onAddPrescription: (prescription: PrescriptionDoc) => void;
  onDeletePrescription: (id: string) => void;
  onLogMedication: (log: Omit<MedicationLog, 'id'>) => void;
  onDeleteLog?: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({
  medications,
  prescriptions,
  medicationLogs,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onAddPrescription,
  onDeletePrescription,
  onLogMedication,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'medications' | 'prescriptions'>('schedule');
  const [medFilterStatus, setMedFilterStatus] = useState<'all' | 'active' | 'archived'>('active');
  
  // Modals state
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicationItem | null>(null);
  const [viewingRx, setViewingRx] = useState<PrescriptionDoc | null>(null);
  const [viewingPillPhoto, setViewingPillPhoto] = useState<{ name: string; url: string } | null>(null);
  const [deleteConfirmMed, setDeleteConfirmMed] = useState<MedicationItem | null>(null);
  
  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form states for Add/Edit Med
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medCategory, setMedCategory] = useState<MedicationItem['category']>('vitamin');
  const [medFrequency, setMedFrequency] = useState<MedicationItem['frequency']>('once_daily');
  const [medTimes, setMedTimes] = useState<string[]>(['08:00']);
  const [medInstructions, setMedInstructions] = useState('');
  const [medDoctorName, setMedDoctorName] = useState('');
  const [medPillPhoto, setMedPillPhoto] = useState<string>('');
  const [medPrescriptionId, setMedPrescriptionId] = useState<string>('');
  const [medIsActive, setMedIsActive] = useState(true);
  const [medReminderEnabled, setMedReminderEnabled] = useState(true);

  // Form states for Add Prescription
  const [rxTitle, setRxTitle] = useState('');
  const [rxDoctorName, setRxDoctorName] = useState('');
  const [rxClinic, setRxClinic] = useState('');
  const [rxDateIssued, setRxDateIssued] = useState(() => getTodayDateString());
  const [rxImageUrl, setRxImageUrl] = useState('');
  const [rxNotes, setRxNotes] = useState('');
  const [rxMedsList, setRxMedsList] = useState('');

  // File Inputs
  const pillPhotoInputRef = useRef<HTMLInputElement>(null);
  const rxPhotoInputRef = useRef<HTMLInputElement>(null);

  // Today's date string YYYY-MM-DD in +08:00
  const todayStr = useMemo(() => getTodayDateString(), []);
  const now = new Date();
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

  // Active vs Archived medicines
  const activeMedications = useMemo(() => medications.filter(m => m.isActive), [medications]);
  const archivedMedications = useMemo(() => medications.filter(m => !m.isActive), [medications]);

  // Calculate missed/overdue doses for today (only for ACTIVE medicines)
  const todayDoses = useMemo(() => {
    const doses: {
      medication: MedicationItem;
      scheduledTime: string;
      scheduledMinutes: number;
      isOverdue: boolean;
      status: 'taken' | 'missed' | 'pending' | 'skipped';
      log?: MedicationLog;
    }[] = [];

    activeMedications.forEach(med => {
      med.scheduledTimes.forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const scheduledMin = h * 60 + m;
        
        // Find existing log for today
        const existingLog = medicationLogs.find(
          l => l.date === todayStr && l.medicationId === med.id && l.scheduledTime === time
        );

        let status: 'taken' | 'missed' | 'pending' | 'skipped' = 'pending';
        let isOverdue = false;

        if (existingLog) {
          status = existingLog.status === 'snoozed' ? 'missed' : existingLog.status;
        } else {
          // Check overdue if reminder is enabled and current time passed scheduled time
          if (currentMinutesNow > scheduledMin) {
            status = 'missed';
            if (med.reminderEnabled) {
              isOverdue = true;
            }
          } else {
            status = 'pending';
          }
        }

        doses.push({
          medication: med,
          scheduledTime: time,
          scheduledMinutes: scheduledMin,
          isOverdue,
          status,
          log: existingLog
        });
      });
    });

    return doses.sort((a, b) => a.scheduledMinutes - b.scheduledMinutes);
  }, [activeMedications, medicationLogs, todayStr, currentMinutesNow]);

  const missedDoses = useMemo(() => {
    return todayDoses.filter(d => d.status === 'missed' && d.medication.reminderEnabled);
  }, [todayDoses]);

  const takenCount = useMemo(() => todayDoses.filter(d => d.status === 'taken').length, [todayDoses]);
  const totalCount = todayDoses.length;
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  // Toggle Mute / Silent for a specific medication
  const handleToggleMuteMedication = (med: MedicationItem) => {
    const updated: MedicationItem = {
      ...med,
      reminderEnabled: !med.reminderEnabled
    };
    onUpdateMedication(updated);
    onShowToast(updated.reminderEnabled ? `Alerts enabled for ${med.name} 🔔` : `Silenced/Muted alerts for ${med.name} 🔕`);
  };

  // Toggle Archive / Active for a medication (e.g. no need to take anymore)
  const handleToggleArchiveMedication = (med: MedicationItem) => {
    const updated: MedicationItem = {
      ...med,
      isActive: !med.isActive
    };
    onUpdateMedication(updated);
    if (!updated.isActive) {
      onShowToast(`Archived ${med.name}. No longer scheduled for daily alerts 📦`);
    } else {
      onShowToast(`Reactivated ${med.name} into your active medicine schedule! 🌸`);
    }
  };

  // Handle Image uploads
  const handlePillPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMedPillPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRxPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRxImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddMedModal = (medToEdit?: MedicationItem) => {
    if (medToEdit) {
      setEditingMed(medToEdit);
      setMedName(medToEdit.name);
      setMedDosage(medToEdit.dosage);
      setMedCategory(medToEdit.category);
      setMedFrequency(medToEdit.frequency);
      setMedTimes(medToEdit.scheduledTimes.length ? medToEdit.scheduledTimes : ['08:00']);
      setMedInstructions(medToEdit.instructions || '');
      setMedDoctorName(medToEdit.doctorName || '');
      setMedPillPhoto(medToEdit.pillPhotoUrl || '');
      setMedPrescriptionId(medToEdit.prescriptionId || '');
      setMedIsActive(medToEdit.isActive);
      setMedReminderEnabled(medToEdit.reminderEnabled);
    } else {
      setEditingMed(null);
      setMedName('');
      setMedDosage('');
      setMedCategory('vitamin');
      setMedFrequency('once_daily');
      setMedTimes(['08:00']);
      setMedInstructions('');
      setMedDoctorName('');
      setMedPillPhoto('');
      setMedPrescriptionId('');
      setMedIsActive(true);
      setMedReminderEnabled(true);
    }
    setShowAddMedModal(true);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      onShowToast('Please enter the medication / vitamin name');
      return;
    }

    const medData: MedicationItem = {
      id: editingMed ? editingMed.id : `med-${Date.now()}`,
      name: medName.trim(),
      dosage: medDosage.trim() || '1 dose',
      category: medCategory,
      frequency: medFrequency,
      scheduledTimes: medTimes.filter(Boolean),
      instructions: medInstructions.trim(),
      doctorName: medDoctorName.trim(),
      pillPhotoUrl: medPillPhoto || undefined,
      prescriptionId: medPrescriptionId || undefined,
      isActive: medIsActive,
      reminderEnabled: medReminderEnabled,
      createdAt: editingMed ? editingMed.createdAt : todayStr
    };

    if (editingMed) {
      onUpdateMedication(medData);
      onShowToast(`Updated ${medData.name} 📝`);
    } else {
      onAddMedication(medData);
      onShowToast(`Added ${medData.name} to schedule 🌸`);
    }

    setShowAddMedModal(false);
  };

  const handleConfirmDeleteMed = () => {
    if (!deleteConfirmMed) return;
    onDeleteMedication(deleteConfirmMed.id);
    onShowToast(`Deleted ${deleteConfirmMed.name} from your medicines 🗑️`);
    setDeleteConfirmMed(null);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxTitle.trim() || !rxImageUrl) {
      onShowToast('Please provide a title and take/upload a photo of the prescription');
      return;
    }

    const medsArray = rxMedsList
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newRx: PrescriptionDoc = {
      id: `rx-${Date.now()}`,
      title: rxTitle.trim(),
      doctorName: rxDoctorName.trim() || 'Attending OB-GYN',
      clinicOrHospital: rxClinic.trim() || 'Maternity Clinic',
      dateIssued: rxDateIssued || todayStr,
      imageUrl: rxImageUrl,
      notes: rxNotes.trim(),
      medicationsIncluded: medsArray.length > 0 ? medsArray : undefined,
      createdAt: todayStr
    };

    onAddPrescription(newRx);
    onShowToast('Prescription saved to your medical vault! 📄');
    setShowAddRxModal(false);
    setRxTitle('');
    setRxDoctorName('');
    setRxClinic('');
    setRxImageUrl('');
    setRxNotes('');
    setRxMedsList('');
  };

  const handleAddTimeInput = () => {
    setMedTimes([...medTimes, '12:00']);
  };

  const handleRemoveTimeInput = (index: number) => {
    if (medTimes.length <= 1) return;
    setMedTimes(medTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...medTimes];
    updated[index] = val;
    setMedTimes(updated);
  };

  // Quick Preset Selector for common pregnancy supplements
  const handleApplyPreset = (name: string, dose: string, category: MedicationItem['category'], time: string, instruction: string) => {
    setMedName(name);
    setMedDosage(dose);
    setMedCategory(category);
    setMedTimes([time]);
    setMedInstructions(instruction);
  };

  // Sound alert trigger
  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext restriction fallback
    }
  };

  const handleMarkTaken = (med: MedicationItem, time: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    onLogMedication({
      medicationId: med.id,
      medicationName: med.name,
      date: todayStr,
      scheduledTime: time,
      takenAt: nowTimeStr,
      status: 'taken',
      notes: 'Logged on time'
    });
    playAlertSound();
    onShowToast(`Great job! Logged ${med.name} taken at ${nowTimeStr} 🌸`);
  };

  const handleMarkSkipped = (med: MedicationItem, time: string) => {
    onLogMedication({
      medicationId: med.id,
      medicationName: med.name,
      date: todayStr,
      scheduledTime: time,
      status: 'skipped',
      notes: 'Skipped by mom'
    });
    onShowToast(`Marked ${med.name} as skipped for ${time}`);
  };

  // Filtered meds based on search, category, and active/archived filter
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.instructions && med.instructions.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'all' || med.category === filterCategory;
    const matchesStatus = medFilterStatus === 'all' || 
      (medFilterStatus === 'active' && med.isActive) ||
      (medFilterStatus === 'archived' && !med.isActive);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-12 animate-fadeIn">
      {/* Top Header & Overview */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-1.5">
              <Pill className="w-3.5 h-3.5" />
              <span>BabyBloom Rx &amp; Vitamin Care</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Prescription &amp; Medicine Tracker</h1>
            <p className="text-white/90 text-xs mt-1 max-w-md">
              Easily add, edit, archive/mute, or delete your daily vitamins and medicines. Store original doctor prescriptions safely.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setShowAddRxModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Prescription</span>
            </button>
            <button
              onClick={() => handleOpenAddMedModal()}
              className="px-4 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* Adherence Progress Bar */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="font-semibold text-white/95">Today&apos;s Adherence:</div>
            <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden max-w-xs">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${adherencePercent}%` }}
              ></div>
            </div>
            <span className="font-bold">{adherencePercent}%</span>
            <span className="text-white/80">({takenCount}/{totalCount} taken)</span>
          </div>

          {missedDoses.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold animate-pulse text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{missedDoses.length} Missed/Overdue Alert!</span>
            </div>
          )}
        </div>
      </div>

      {/* MISSED / OVERDUE ALERT BANNER (High Visibility) */}
      {missedDoses.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-4.5 shadow-sm space-y-3 animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  Missed / Overdue Medicine Alert!
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold uppercase">Action Needed</span>
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  You have {missedDoses.length} scheduled vitamin/medicine past due. Take now or mute/archive if no longer needed.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {missedDoses.map(({ medication, scheduledTime }) => (
              <div
                key={`${medication.id}-${scheduledTime}`}
                className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {medication.pillPhotoUrl ? (
                    <img
                      src={medication.pillPhotoUrl}
                      alt={medication.name}
                      onClick={() => setViewingPillPhoto({ name: medication.name, url: medication.pillPhotoUrl! })}
                      className="w-10 h-10 rounded-lg object-cover border border-amber-200 cursor-pointer hover:opacity-80 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="font-bold text-stone-900 text-xs truncate">{medication.name}</h4>
                    <p className="text-[11px] text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled at <span className="font-bold">{scheduledTime}</span>
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">{medication.dosage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleMuteMedication(medication)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600"
                    title="Mute alert for this medicine"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMarkSkipped(medication, scheduledTime)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 text-[11px] font-medium"
                    title="Skip this dose"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => handleMarkTaken(medication, scheduledTime)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Take</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Sub-tabs */}
      <div className="flex items-center border-b border-stone-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'schedule'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Today&apos;s Schedule ({todayDoses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('medications')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'medications'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>All Vitamins &amp; Meds ({medications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prescriptions')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'prescriptions'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prescription Photos &amp; Rx ({prescriptions.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: TODAY'S SCHEDULE & INTAKE TIMELINE */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Today&apos;s Dosing Timeline</h2>
              <p className="text-xs text-stone-500">Live tracker for active prenatal vitamins &amp; medicines</p>
            </div>
            <button
              onClick={() => handleOpenAddMedModal()}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Schedule</span>
            </button>
          </div>

          {todayDoses.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-2xl bg-white space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Pill className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">No Active Vitamins or Medicines Scheduled</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {archivedMedications.length > 0
                  ? `You have ${archivedMedications.length} archived/muted medicines. Add or reactivate one to see it on today's schedule.`
                  : 'Add your daily prenatal vitamins, iron, calcium, or doctor prescriptions to receive timely reminders and missed dose alerts.'}
              </p>
              <button
                onClick={() => handleOpenAddMedModal()}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs hover:bg-rose-600 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your Prenatal Vitamins</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayDoses.map(({ medication, scheduledTime, status, log }) => {
                const isTaken = status === 'taken';
                const isMissed = status === 'missed';
                const isSkipped = status === 'skipped';

                return (
                  <div
                    key={`${medication.id}-${scheduledTime}`}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white ${
                      isTaken
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : isMissed
                        ? 'border-amber-300 bg-amber-50/50 ring-1 ring-amber-300'
                        : isSkipped
                        ? 'border-stone-200 opacity-60 bg-stone-50'
                        : 'border-stone-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Pill Image or Icon */}
                      <div className="relative">
                        {medication.pillPhotoUrl ? (
                          <img
                            src={medication.pillPhotoUrl}
                            alt={medication.name}
                            onClick={() => setViewingPillPhoto({ name: medication.name, url: medication.pillPhotoUrl! })}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 cursor-pointer hover:ring-2 hover:ring-rose-400 transition-all shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isTaken
                                ? 'bg-emerald-100 text-emerald-700'
                                : isMissed
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-600'
                            }`}
                          >
                            <Pill className="w-6 h-6" />
                          </div>
                        )}
                        {medication.pillPhotoUrl && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs text-stone-500">
                            <Eye className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-stone-900 text-sm">{medication.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase bg-stone-100 text-stone-600">
                            {medication.category.replace('_', ' ')}
                          </span>

                          {!medication.reminderEnabled && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-md font-medium" title="Alerts muted">
                              <VolumeX className="w-3 h-3" /> Muted
                            </span>
                          )}

                          {isTaken && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-100">
                              <CheckCircle2 className="w-3 h-3" /> Taken at {log?.takenAt || 'today'}
                            </span>
                          )}
                          {isMissed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-200 animate-pulse">
                              <AlertCircle className="w-3 h-3" /> Overdue / Missed
                            </span>
                          )}
                          {isSkipped && (
                            <span className="text-[11px] font-medium text-stone-500 px-2 py-0.5 rounded-md bg-stone-200">
                              Skipped
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                          <span className="font-semibold text-rose-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {scheduledTime}
                          </span>
                          <span>·</span>
                          <span className="font-medium text-stone-700">{medication.dosage}</span>
                          {medication.doctorName && (
                            <>
                              <span>·</span>
                              <span className="text-stone-500">Rx: {medication.doctorName}</span>
                            </>
                          )}
                        </div>

                        {medication.instructions && (
                          <p className="text-xs text-stone-600 mt-1.5 flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{medication.instructions}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isTaken ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700">Completed</span>
                          <button
                            onClick={() => handleMarkSkipped(medication, scheduledTime)}
                            className="text-[11px] text-stone-400 hover:text-stone-600 underline"
                          >
                            Reset
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleMarkSkipped(medication, scheduledTime)}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium transition-all"
                          >
                            Skip
                          </button>
                          <button
                            onClick={() => handleMarkTaken(medication, scheduledTime)}
                            className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                              isMissed
                                ? 'bg-amber-600 hover:bg-amber-700 animate-pulse'
                                : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark Taken</span>
                          </button>
                        </>
                      )}

                      {/* Quick Edit or Archive button right from timeline */}
                      <button
                        onClick={() => handleOpenAddMedModal(medication)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                        title="Edit medicine details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Doctor Safety Reminder for Pregnancy Meds */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Prenatal Nutrition &amp; Absorption Tips (Gabay sa Pag-inom):</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
                <li><strong>Iron + Vitamin C:</strong> Take Iron with orange juice or water. Avoid taking iron together with milk or calcium supplements as calcium blocks iron absorption by up to 50%.</li>
                <li><strong>Folic Acid:</strong> Vital for baby&apos;s neural tube and brain formation throughout pregnancy.</li>
                <li><strong>Calcium &amp; Vitamin D:</strong> Best taken in the evening or with dinner to support baby&apos;s bones and prevent maternal leg cramps (pulikat).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ALL VITAMINS & MEDICINES LIST (ACTIVE & ARCHIVED) */}
      {activeSubTab === 'medications' && (
        <div className="space-y-4">
          {/* Filter Bar: Status Tabs (Active vs Archived/Muted vs All) */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex p-1 bg-stone-100 rounded-xl text-xs font-semibold text-stone-600">
              <button
                onClick={() => setMedFilterStatus('active')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  medFilterStatus === 'active' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <Power className="w-3.5 h-3.5 text-emerald-600" />
                <span>Currently Taking ({activeMedications.length})</span>
              </button>

              <button
                onClick={() => setMedFilterStatus('archived')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  medFilterStatus === 'archived' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-amber-600" />
                <span>Archived / Stopped ({archivedMedications.length})</span>
              </button>

              <button
                onClick={() => setMedFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  medFilterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <span>All ({medications.length})</span>
              </button>
            </div>

            <button
              onClick={() => handleOpenAddMedModal()}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search vitamins, medicines, dosage..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden bg-white"
              />
            </div>

            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-700 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="vitamin">Prenatal Vitamin</option>
              <option value="folic_acid">Folic Acid</option>
              <option value="iron">Iron Supplement</option>
              <option value="calcium">Calcium + D3</option>
              <option value="dha">DHA &amp; Omega-3</option>
              <option value="prescription">Prescription Rx</option>
              <option value="supplement">Other Supplement</option>
            </select>
          </div>

          {/* Medications Grid */}
          {filteredMedications.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-2xl bg-white space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">
                {medFilterStatus === 'archived' ? 'No Archived / Stopped Medicines' : 'No Medicines Found'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {medFilterStatus === 'archived'
                  ? 'When you finish a prescription course or doctor advises to stop taking a supplement, tap "Archive/Mute" to store it here.'
                  : 'Tap "+ Add New Medicine" to add your prenatal vitamins or prescriptions.'}
              </p>
              {medFilterStatus !== 'archived' && (
                <button
                  onClick={() => handleOpenAddMedModal()}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs hover:bg-rose-600 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMedications.map(med => {
                const isArchived = !med.isActive;
                const isMuted = !med.reminderEnabled;

                return (
                  <div
                    key={med.id}
                    className={`bg-white p-4 rounded-2xl border transition-all shadow-2xs space-y-3 flex flex-col justify-between ${
                      isArchived
                        ? 'border-stone-200 bg-stone-50/70 opacity-80'
                        : 'border-stone-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {med.pillPhotoUrl ? (
                            <img
                              src={med.pillPhotoUrl}
                              alt={med.name}
                              onClick={() => setViewingPillPhoto({ name: med.name, url: med.pillPhotoUrl! })}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 cursor-pointer hover:opacity-85 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isArchived ? 'bg-stone-200 text-stone-500' : 'bg-rose-50 text-rose-600'
                            }`}>
                              <Pill className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-stone-900 text-sm">{med.name}</h3>
                              {isArchived && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 font-bold">
                                  Archived / Stopped
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-rose-600">{med.dosage}</p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-50 text-rose-700">
                          {med.category.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-stone-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Scheduled Times: <strong className="text-stone-800">{med.scheduledTimes.join(', ')}</strong></span>
                        </div>

                        {med.doctorName && (
                          <div className="flex items-center gap-2 text-stone-500">
                            <FileCheck className="w-3.5 h-3.5 text-stone-400" />
                            <span>Prescribed by: {med.doctorName}</span>
                          </div>
                        )}

                        {med.instructions && (
                          <div className="p-2 rounded-lg bg-stone-50 text-stone-600 text-xs border border-stone-100 flex items-start gap-1.5 mt-2">
                            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <span>{med.instructions}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar: Mute / Archive / Edit / Delete */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                      {/* Left: Status Badges & Quick Mute */}
                      <div className="flex items-center gap-2">
                        {/* Mute / Silent Button */}
                        <button
                          onClick={() => handleToggleMuteMedication(med)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                            isMuted
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title={isMuted ? 'Click to enable reminder alerts' : 'Click to mute/silent alerts'}
                        >
                          {isMuted ? <VolumeX className="w-3 h-3 text-amber-700" /> : <Volume2 className="w-3 h-3 text-emerald-600" />}
                          <span>{isMuted ? 'Alerts Muted' : 'Alerts Active'}</span>
                        </button>
                      </div>

                      {/* Right: Archive / Edit / Delete */}
                      <div className="flex items-center gap-1">
                        {/* Archive / Reactivate Button */}
                        <button
                          onClick={() => handleToggleArchiveMedication(med)}
                          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
                            isArchived
                              ? 'bg-teal-50 hover:bg-teal-100 text-teal-700'
                              : 'hover:bg-stone-100 text-stone-600'
                          }`}
                          title={isArchived ? 'Reactivate medicine' : 'Archive / Stop taking this medicine'}
                        >
                          {isArchived ? <ArchiveRestore className="w-3.5 h-3.5 text-teal-600" /> : <Archive className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{isArchived ? 'Reactivate' : 'Archive'}</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenAddMedModal(med)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-all"
                          title="Edit medication details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmMed(med)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-all"
                          title="Delete medication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PRESCRIPTION VAULT & PHOTOS */}
      {activeSubTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Doctor Prescription Vault</h2>
              <p className="text-xs text-stone-500">Store and zoom into original doctor prescription slips &amp; clinic orders</p>
            </div>

            <button
              onClick={() => setShowAddRxModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all self-start sm:self-auto"
            >
              <Camera className="w-4 h-4" />
              <span>Snap / Upload Prescription</span>
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-2xl bg-white space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">No Prescriptions Saved Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Snap a photo of your doctor&apos;s physical prescription slip during your next prenatal clinic visit for quick reference.
              </p>
              <button
                onClick={() => setShowAddRxModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 transition-all inline-flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Add First Prescription</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-teal-300 transition-all shadow-2xs overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setViewingRx(rx)}>
                    <img
                      src={rx.imageUrl}
                      alt={rx.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Tap to zoom prescription
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-stone-900 text-sm">{rx.title}</h3>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="font-medium text-teal-700 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> {rx.doctorName}
                      </p>
                      <p className="text-stone-500">{rx.clinicOrHospital}</p>
                      <p className="text-stone-400 text-[11px]">Issued: {rx.dateIssued}</p>
                    </div>

                    {rx.medicationsIncluded && rx.medicationsIncluded.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rx.medicationsIncluded.map((m, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setViewingRx(rx)}
                      className="text-teal-700 hover:text-teal-800 font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full View
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete prescription "${rx.title}"?`)) {
                          onDeletePrescription(rx.id);
                          onShowToast('Prescription removed');
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT MEDICATION */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {editingMed ? 'Edit Medication / Vitamin' : 'Add Vitamin or Medicine'}
                  </h3>
                  <p className="text-xs text-stone-500">Set schedule, dose, instructions, and picture</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMedModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets for Moms */}
            {!editingMed && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-stone-400">Quick Presets (Isang Pindot):</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Folic Acid', '800 mcg', 'folic_acid', '08:00', 'Take daily in morning with breakfast')}
                    className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-medium"
                  >
                    + Folic Acid
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Prenatal Multivitamins', '1 capsule', 'vitamin', '08:30', 'Take with full glass of water')}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium"
                  >
                    + Multivitamins
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Calcium + Vit D3', '500 mg', 'calcium', '19:30', 'Take after dinner. Separate from iron.')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    + Calcium
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Ferrous Sulfate (Iron)', '325 mg', 'iron', '08:00', 'Take with orange juice. Avoid milk.')}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium"
                  >
                    + Iron
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Prenatal DHA', '200 mg', 'dha', '12:30', 'Take with lunch')}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-medium"
                  >
                    + DHA
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveMedication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Medication / Vitamin Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Folic Acid, Obimin, Caltrate"
                    value={medName}
                    onChange={e => setMedName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Dosage / Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 800 mcg, 1 capsule, 500 mg"
                    value={medDosage}
                    onChange={e => setMedDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Category</label>
                  <select
                    value={medCategory}
                    onChange={e => setMedCategory(e.target.value as MedicationItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="vitamin">Prenatal Vitamin</option>
                    <option value="folic_acid">Folic Acid</option>
                    <option value="iron">Iron / Ferrous</option>
                    <option value="calcium">Calcium + D3</option>
                    <option value="dha">DHA &amp; Omega-3</option>
                    <option value="prescription">Doctor Prescription Rx</option>
                    <option value="supplement">Dietary Supplement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Frequency</label>
                  <select
                    value={medFrequency}
                    onChange={e => setMedFrequency(e.target.value as MedicationItem['frequency'])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="once_daily">Once a Day (1x)</option>
                    <option value="twice_daily">Twice a Day (2x)</option>
                    <option value="three_daily">Three Times a Day (3x)</option>
                    <option value="as_needed">As Needed (PRN)</option>
                    <option value="weekly">Once Weekly</option>
                  </select>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="space-y-1.5 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    Scheduled Time(s) to Take
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTimeInput}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add another time
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {medTimes.map((timeVal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="time"
                        required
                        value={timeVal}
                        onChange={e => handleTimeChange(idx, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden flex-1"
                      />
                      {medTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeInput(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-stone-500">
                  You will receive an alert if you miss this window by 15 minutes.
                </p>
              </div>

              {/* Optional Pill Picture Upload */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 flex items-center justify-between">
                  <span>Photo of Actual Pill / Bottle (Optional)</span>
                  {medPillPhoto && (
                    <button
                      type="button"
                      onClick={() => setMedPillPhoto('')}
                      className="text-[11px] text-rose-500 font-semibold"
                    >
                      Remove Photo
                    </button>
                  )}
                </label>

                {medPillPhoto ? (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <img
                      src={medPillPhoto}
                      alt="Pill preview"
                      className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                    />
                    <div className="text-xs text-stone-600">
                      <p className="font-bold">Photo attached</p>
                      <p className="text-[11px] text-stone-400">Helps you identify this pill instantly.</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => pillPhotoInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 hover:border-rose-300 rounded-xl p-3 text-center cursor-pointer bg-stone-50 hover:bg-rose-50/40 transition-colors flex items-center justify-center gap-2 text-stone-500"
                  >
                    <Camera className="w-4 h-4 text-rose-500" />
                    <span className="font-medium">Take / Upload Picture of Medicine or Bottle</span>
                  </div>
                )}
                <input
                  ref={pillPhotoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePillPhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Doctor Instructions &amp; Dietary Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Take with food. Do not take with dairy or tea. Drink lots of water."
                  value={medInstructions}
                  onChange={e => setMedInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Prescribing Doctor (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Bennett, MD"
                  value={medDoctorName}
                  onChange={e => setMedDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Status & Alert Controls */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                {/* Active / Archive Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div>
                    <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Power className={`w-3.5 h-3.5 ${medIsActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <span>Medicine Status</span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {medIsActive ? 'Active (Scheduled on daily intake)' : 'Archived / Stopped (No longer need to take)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMedIsActive(!medIsActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      medIsActive ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {medIsActive ? 'Active' : 'Archived'}
                  </button>
                </div>

                {/* Reminder Alert Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div>
                    <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                      {medReminderEnabled ? <Volume2 className="w-3.5 h-3.5 text-rose-500" /> : <VolumeX className="w-3.5 h-3.5 text-amber-500" />}
                      <span>Missed Dose Alarm / Alerts</span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {medReminderEnabled ? 'Alert me with sounds & banners if missed' : 'Silenced / Muted (No alarms)'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={medReminderEnabled}
                    onChange={e => setMedReminderEnabled(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  {editingMed ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmMed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-stone-900 text-base">Delete {deleteConfirmMed.name}?</h3>
              <p className="text-xs text-stone-500">
                Do you want to permanently delete this medication, or archive it instead if you only stopped taking it?
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleArchiveMedication(deleteConfirmMed);
                  setDeleteConfirmMed(null);
                }}
                className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive / Mute (Keep in Records)</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteMed}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmMed(null)}
                className="w-full py-2 text-stone-400 hover:text-stone-600 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / SNAP PRESCRIPTION */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Snap / Upload Doctor Prescription</h3>
                  <p className="text-xs text-stone-500">Keep a safe digital photo of your clinic prescription</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddRxModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
              {/* Photo Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700">Prescription Photo *</label>
                {rxImageUrl ? (
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                    <img src={rxImageUrl} alt="Prescription" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setRxImageUrl('')}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-bold hover:bg-black"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => rxPhotoInputRef.current?.click()}
                    className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer bg-teal-50/50 hover:bg-teal-50 transition-colors space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-teal-900">Take Photo with Camera or Upload Image</p>
                    <p className="text-[11px] text-teal-700">Clear photo of the doctor&apos;s physical prescription slip</p>
                  </div>
                )}
                <input
                  ref={rxPhotoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleRxPhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Prescription Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24-Week Routine Checkup Rx"
                  value={rxTitle}
                  onChange={e => setRxTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Doctor&apos;s Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Bennett, MD"
                    value={rxDoctorName}
                    onChange={e => setRxDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Date Issued</label>
                  <input
                    type="date"
                    value={rxDateIssued}
                    onChange={e => setRxDateIssued(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Clinic / Hospital</label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude Women Pavilion, Room 304"
                  value={rxClinic}
                  onChange={e => setRxClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Medicines Listed (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Folic Acid, Calcium D3, Ferrous Sulfate"
                  value={rxMedsList}
                  onChange={e => setRxMedsList(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Doctor Notes &amp; Special Advice</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Refill valid for 3 months. Continue taking until delivery."
                  value={rxNotes}
                  onChange={e => setRxNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Save Prescription Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ZOOM VIEW PRESCRIPTION */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-scaleUp">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">{viewingRx.title}</h3>
                <p className="text-xs text-stone-500">{viewingRx.doctorName} · {viewingRx.clinicOrHospital} ({viewingRx.dateIssued})</p>
              </div>
              <button
                onClick={() => setViewingRx(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-900 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img
                src={viewingRx.imageUrl}
                alt={viewingRx.title}
                className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-4 space-y-3 bg-stone-50">
              {viewingRx.notes && (
                <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                  <strong className="block text-stone-900 mb-0.5">Doctor Notes:</strong>
                  {viewingRx.notes}
                </div>
              )}

              {viewingRx.medicationsIncluded && viewingRx.medicationsIncluded.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Medications on Rx:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {viewingRx.medicationsIncluded.map((m, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setViewingRx(null)}
                  className="px-5 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ZOOM VIEW PILL PHOTO */}
      {viewingPillPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setViewingPillPhoto(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleUp" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">{viewingPillPhoto.name} - Actual Photo</h3>
              <button
                onClick={() => setViewingPillPhoto(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-950 flex items-center justify-center">
              <img
                src={viewingPillPhoto.url}
                alt={viewingPillPhoto.name}
                className="max-w-full max-h-[50vh] object-contain rounded-xl"
              />
            </div>
            <div className="p-3 text-center bg-stone-50">
              <p className="text-xs text-stone-500">Visual pill reference for easy identification</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
