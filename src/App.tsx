import React, { useState, useEffect, useMemo } from 'react';
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
} from './types/pregnancy';
import {
  initialProfile,
  initialMedications,
  initialPrescriptions,
  initialMedicationLogs,
  initialReminders
} from './data/initialData';
import { defaultHospitalBagItems } from './data/suggestionsData';
import { ToastNotification } from './utils/notifications';
import {
  idbGetAll,
  idbSaveAll,
  idbSaveProfile,
  idbGetProfile,
  STORES
} from './utils/indexedDb';
import { usePWAInstall } from './utils/usePWAInstall';

import { TopBar, TabType } from './components/TopBar';
import { SimpleDashboard, DailyNoteEntry } from './components/SimpleDashboard';
import { NotesHistoryTab } from './components/NotesHistoryTab';
import { MedicationsTab } from './components/MedicationsTab';
import { SuggestionsTab } from './components/SuggestionsTab';

import { Emergency911Modal } from './components/Emergency911Modal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { BackupModal } from './components/BackupModal';
import { ProfileModal } from './components/ProfileModal';
import { InstallAppModal } from './components/InstallAppModal';
import { OnboardingModal } from './components/OnboardingModal';
import { getTodayDateString, shiftDateString } from './utils/dateTime';

export default function App() {
  const todayStr = getTodayDateString();

  // Selected Calendar Date
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // PWA Install Hook
  const { isInstalled: isPWAInstalled } = usePWAInstall();

  // Tab State: 'dashboard' | 'notes' | 'medications' | 'suggestions'
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals
  const [isEmergency911Open, setIsEmergency911Open] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const completed = localStorage.getItem('bb_onboarding_completed');
      const savedProfile = localStorage.getItem('bb_profile');
      // On fresh install, trigger onboarding if not completed or profile is unconfigured
      return completed !== 'true' || !savedProfile;
    } catch {
      return false;
    }
  });

  // In-App Toast Notification
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bb_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && !parsed.name.includes('Catherine Faye') && !parsed.babyNickname?.includes('Faye')) {
          return parsed;
        }
      } catch {}
    }
    return initialProfile;
  });

  // Daily Notes Map: Record<dateStr, DailyNoteEntry>
  const [dailyNotes, setDailyNotes] = useState<Record<string, DailyNoteEntry>>(() => {
    const saved = localStorage.getItem('bb_daily_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Seed initial welcome note for today
    return {
      [todayStr]: {
        date: todayStr,
        note: 'Welcome to your simplified BabyBloom Tracker! Track your daily notes, feelings, and mark medicines taken.',
        mood: 'happy',
        waterGlasses: 6,
        tags: ['💖 Feeling Great', '💧 Hydrated', '💊 Meds on Time'],
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };
  });

  // Medications List
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    const saved = localStorage.getItem('bb_medications');
    return saved ? JSON.parse(saved) : initialMedications;
  });

  // Prescriptions List
  const [prescriptions, setPrescriptions] = useState<PrescriptionDoc[]>(() => {
    const saved = localStorage.getItem('bb_prescriptions');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  // Medication Logs
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(() => {
    const saved = localStorage.getItem('bb_med_logs');
    return saved ? JSON.parse(saved) : initialMedicationLogs;
  });

  // Hospital Bag Checklist
  const [hospitalBag, setHospitalBag] = useState<HospitalBagItem[]>(() => {
    const saved = localStorage.getItem('bb_hospital_bag');
    return saved ? JSON.parse(saved) : defaultHospitalBagItems;
  });

  // Load from IndexedDB on initial mount
  useEffect(() => {
    async function loadFromIDB() {
      try {
        const idbProf = await idbGetProfile();
        if (idbProf) setProfile(idbProf);

        const [idbMeds, idbRx, idbMedLogs, idbHosp] = await Promise.all([
          idbGetAll<MedicationItem>(STORES.MEDICATIONS),
          idbGetAll<PrescriptionDoc>(STORES.PRESCRIPTIONS),
          idbGetAll<MedicationLog>(STORES.MEDICATION_LOGS),
          idbGetAll<HospitalBagItem>(STORES.HOSPITAL_BAG)
        ]);

        if (idbMeds.length > 0) setMedications(idbMeds);
        if (idbRx.length > 0) setPrescriptions(idbRx);
        if (idbMedLogs.length > 0) setMedicationLogs(idbMedLogs);
        if (idbHosp.length > 0) setHospitalBag(idbHosp);
      } catch (err) {
        console.warn('IDB initialization notice:', err);
      }
    }
    loadFromIDB();
  }, []);

  // Show Toast Helper
  const showToast = (title: string, body?: string, type: ToastNotification['type'] = 'info') => {
    setActiveToast({
      id: `toast-${Date.now()}`,
      title,
      body: body || title,
      type,
      timestamp: Date.now()
    });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.title === title ? null : prev));
    }, 3000);
  };

  // Save Daily Note Handler
  const handleSaveDailyNote = (date: string, noteData: DailyNoteEntry) => {
    const updated = {
      ...dailyNotes,
      [date]: noteData
    };
    setDailyNotes(updated);
    localStorage.setItem('bb_daily_notes', JSON.stringify(updated));
  };

  // Toggle Medication Status for Date
  const handleToggleMedicationStatus = (medicationId: string, date: string, scheduledTime: string) => {
    const existingLog = medicationLogs.find(
      (l) => l.medicationId === medicationId && l.date === date && l.status === 'taken'
    );

    let updated: MedicationLog[];
    if (existingLog) {
      updated = medicationLogs.filter((l) => l.id !== existingLog.id);
      showToast('Medication unmarked as taken');
    } else {
      const med = medications.find((m) => m.id === medicationId);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog: MedicationLog = {
        id: `medlog-${Date.now()}`,
        medicationId,
        medicationName: med?.name || 'Medication',
        date,
        scheduledTime: scheduledTime || '08:00',
        takenAt: nowTime,
        status: 'taken'
      };
      updated = [newLog, ...medicationLogs];
      showToast(`Marked ${med?.name || 'Medication'} as taken! 💊`);
    }

    setMedicationLogs(updated);
    localStorage.setItem('bb_med_logs', JSON.stringify(updated));
    idbSaveAll(STORES.MEDICATION_LOGS, updated);
  };

  // Medication Management Handlers
  const handleAddMedication = (medData: Omit<MedicationItem, 'id' | 'createdAt'> | MedicationItem) => {
    const fullMed: MedicationItem =
      'id' in medData
        ? medData
        : {
            ...medData,
            id: `med-${Date.now()}`,
            createdAt: getTodayDateString()
          };

    const updated = [...medications, fullMed];
    setMedications(updated);
    localStorage.setItem('bb_medications', JSON.stringify(updated));
    idbSaveAll(STORES.MEDICATIONS, updated);
    showToast(`Added ${fullMed.name} to schedule 💊`);
  };

  const handleUpdateMedication = (updatedMed: MedicationItem) => {
    const updated = medications.map((m) => (m.id === updatedMed.id ? updatedMed : m));
    setMedications(updated);
    localStorage.setItem('bb_medications', JSON.stringify(updated));
    idbSaveAll(STORES.MEDICATIONS, updated);
    showToast(`Updated ${updatedMed.name}`);
  };

  const handleDeleteMedication = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    localStorage.setItem('bb_medications', JSON.stringify(updated));
    idbSaveAll(STORES.MEDICATIONS, updated);
    showToast('Medication removed from schedule');
  };

  // Prescriptions Management Handlers
  const handleAddPrescription = (rx: PrescriptionDoc) => {
    const updated = [rx, ...prescriptions];
    setPrescriptions(updated);
    localStorage.setItem('bb_prescriptions', JSON.stringify(updated));
    idbSaveAll(STORES.PRESCRIPTIONS, updated);
    showToast('Prescription saved 📄');
  };

  const handleDeletePrescription = (id: string) => {
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem('bb_prescriptions', JSON.stringify(updated));
    idbSaveAll(STORES.PRESCRIPTIONS, updated);
    showToast('Prescription deleted');
  };

  // Hospital Bag Handler
  const handleToggleHospitalBag = (id: string) => {
    const updated = hospitalBag.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setHospitalBag(updated);
    localStorage.setItem('bb_hospital_bag', JSON.stringify(updated));
    idbSaveAll(STORES.HOSPITAL_BAG, updated);
  };

  // Save Profile Handler
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('bb_profile', JSON.stringify(newProfile));
    localStorage.setItem('bb_onboarding_completed', 'true');
    idbSaveProfile(newProfile);
    showToast('Profile & Due Date updated successfully! 🌸');
  };

  // Complete Onboarding Handler (Fresh Install Setup)
  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('bb_profile', JSON.stringify(newProfile));
    localStorage.setItem('bb_onboarding_completed', 'true');
    idbSaveProfile(newProfile);
    setIsOnboardingOpen(false);

    // Personalize initial daily note if it's the stock template note
    setDailyNotes((prev) => {
      const todayNote = prev[todayStr];
      const isTemplateNote =
        !todayNote ||
        todayNote.note.includes('Welcome to your simplified') ||
        todayNote.note.includes('Welcome to your personal');

      if (isTemplateNote) {
        const personalizedNote: DailyNoteEntry = {
          date: todayStr,
          note: `Welcome to your personal BabyBloom Tracker, ${newProfile.name || 'Mama'}! 🌸 Tracking every precious milestone with ${newProfile.babyNickname || 'baby'}. You are currently at Week ${newProfile.currentWeek}!`,
          mood: 'happy',
          waterGlasses: 6,
          tags: ['💖 BabyBloom', '✨ Feeling Great', '🌸 Fresh Start'],
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updated = { ...prev, [todayStr]: personalizedNote };
        localStorage.setItem('bb_daily_notes', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });

    showToast(
      `Welcome, ${newProfile.name || 'Mama'}! 🌸`,
      `Due Date set for ${newProfile.babyNickname} (Week ${newProfile.currentWeek})`,
      'weekly-milestone'
    );
  };

  // Start Fresh Handler (Full Clean Slate)
  const handleStartFresh = () => {
    try {
      localStorage.removeItem('bb_onboarding_completed');
      localStorage.removeItem('bb_profile');
      localStorage.removeItem('bb_daily_notes');
      localStorage.removeItem('bb_med_logs');
    } catch {}

    const freshProf: UserProfile = {
      ...initialProfile,
      name: '',
      babyNickname: '',
      dueDate: shiftDateString(todayStr, 126),
      currentWeek: 22
    };
    setProfile(freshProf);
    setDailyNotes({});
    setMedicationLogs([]);
    setIsProfileOpen(false);
    setIsOnboardingOpen(true);
    showToast('Journal reset. Please enter your pregnancy details 🌸');
  };

  // Compute pending medications count for today
  const pendingMedsTodayCount = useMemo(() => {
    const activeMeds = medications.filter((m) => m.isActive);
    const takenTodayIds = new Set(
      medicationLogs.filter((l) => l.date === todayStr && l.status === 'taken').map((l) => l.medicationId)
    );
    return Math.max(0, activeMeds.length - takenTodayIds.size);
  }, [medications, medicationLogs, todayStr]);

  return (
    <div className="min-h-screen bg-[#faf8f6] text-stone-900 flex flex-col font-sans selection:bg-rose-200">
      {/* Top Header with Navigation (No bottom horizontal bar) */}
      <TopBar
        profile={profile}
        selectedDate={selectedDate}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingMedsCount={pendingMedsTodayCount}
        onOpenEmergency911={() => setIsEmergency911Open(true)}
        onOpenSuggestions={() => setIsSuggestionsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        isPWAInstalled={isPWAInstalled}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-28 sm:pt-20 pb-10">
        {currentTab === 'dashboard' && (
          <SimpleDashboard
            profile={profile}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            medications={medications}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onDeleteMedication={handleDeleteMedication}
            medicationLogs={medicationLogs}
            onToggleMedicationStatus={handleToggleMedicationStatus}
            dailyNotes={dailyNotes}
            onSaveDailyNote={handleSaveDailyNote}
            onOpenEmergency911={() => setIsEmergency911Open(true)}
            onOpenSuggestions={() => setIsSuggestionsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onUpdateProfile={handleSaveProfile}
            onNavigateToNotesTab={() => setCurrentTab('notes')}
          />
        )}

        {currentTab === 'notes' && (
          <NotesHistoryTab
            dailyNotes={dailyNotes}
            onSelectDate={setSelectedDate}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            onSaveDailyNote={handleSaveDailyNote}
            onOpenBackup={() => setIsBackupOpen(true)}
          />
        )}

        {currentTab === 'medications' && (
          <MedicationsTab
            medications={medications}
            prescriptions={prescriptions}
            medicationLogs={medicationLogs}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onDeleteMedication={handleDeleteMedication}
            onAddPrescription={handleAddPrescription}
            onDeletePrescription={handleDeletePrescription}
            onLogMedication={(log) => {
              const fullLog = { ...log, id: `medlog-${Date.now()}` };
              const updated = [fullLog, ...medicationLogs];
              setMedicationLogs(updated);
              localStorage.setItem('bb_med_logs', JSON.stringify(updated));
              idbSaveAll(STORES.MEDICATION_LOGS, updated);
            }}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'suggestions' && (
          <SuggestionsTab
            profile={profile}
            onOpenEmergency911={() => setIsEmergency911Open(true)}
            hospitalBagItems={hospitalBag}
            onToggleHospitalBagItem={handleToggleHospitalBag}
          />
        )}
      </main>

      {/* Emergency 911 Direct Dial & Hotlines Modal */}
      <Emergency911Modal
        isOpen={isEmergency911Open}
        onClose={() => setIsEmergency911Open(false)}
        profile={profile}
        onUpdateProfile={handleSaveProfile}
      />

      {/* Care Suggestions & Remedy Dialog */}
      <SuggestionsModal
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        hospitalBagItems={hospitalBag}
        onToggleBagItem={handleToggleHospitalBag}
      />

      {/* Profile & Due Date Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onStartFresh={handleStartFresh}
        onOpenOnboarding={() => {
          setIsProfileOpen(false);
          setIsOnboardingOpen(true);
        }}
        onOpenInstall={() => {
          setIsProfileOpen(false);
          setIsInstallOpen(true);
        }}
        onOpenBackup={() => {
          setIsProfileOpen(false);
          setIsBackupOpen(true);
        }}
      />

      {/* Data Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        currentData={{
          profile,
          dailyNotes,
          symptoms: [],
          weights: [],
          appointments: [],
          photos: [],
          medications,
          prescriptions,
          medicationLogs,
          reminders: [],
          hospitalBag,
          kicks: []
        }}
        onRestoreData={(payload) => {
          if (payload.profile) setProfile(payload.profile);
          if (payload.dailyNotes) {
            setDailyNotes(payload.dailyNotes);
            localStorage.setItem('bb_daily_notes', JSON.stringify(payload.dailyNotes));
          }
          if (payload.medications) setMedications(payload.medications);
          if (payload.prescriptions) setPrescriptions(payload.prescriptions);
          if (payload.medicationLogs) setMedicationLogs(payload.medicationLogs);
          if (payload.hospitalBag) setHospitalBag(payload.hospitalBag);
          showToast('Backup restored successfully! 🌸');
        }}
      />

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      {/* Fresh Install Onboarding Modal (Due Date, Mother's Name, Baby's Nickname) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        currentProfile={profile}
        onComplete={handleCompleteOnboarding}
        onSkip={() => {
          localStorage.setItem('bb_onboarding_completed', 'true');
          setIsOnboardingOpen(false);
          showToast('Sample profile loaded. You can personalize anytime from Settings 🌸');
        }}
      />

      {/* In-App Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm animate-bounce-short">
          <div className="p-3.5 bg-stone-900/95 text-white rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between border border-stone-800">
            <div className="text-xs font-semibold">{activeToast.title}</div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-stone-400 hover:text-white text-xs ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
