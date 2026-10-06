import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Pill,
  Sparkles,
  PhoneCall,
  Lightbulb,
  Clock,
  Heart,
  Smile,
  Meh,
  Frown,
  Droplets,
  AlertTriangle,
  Save,
  Check,
  CalendarDays,
  X,
  MessageSquare,
  Stethoscope,
  UserCheck,
  RefreshCw,
  Wifi
} from 'lucide-react';
import {
  UserProfile,
  MedicationItem,
  MedicationLog
} from '../types/pregnancy';
import {
  getTodayDateString,
  shiftDateString,
  formatDisplayDate,
  formatDateToYYYYMMDD,
  parseDateStringToLocalNoon
} from '../utils/dateTime';
import { useLiveClock } from '../utils/useLiveClock';

export interface DailyNoteEntry {
  date: string; // YYYY-MM-DD
  note: string;
  mood?: 'happy' | 'calm' | 'tired' | 'unwell' | 'excited';
  waterGlasses?: number;
  tags?: string[];
  updatedAt?: string;
}

interface SimpleDashboardProps {
  profile: UserProfile;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  medications: MedicationItem[];
  onAddMedication: (med: Omit<MedicationItem, 'id' | 'createdAt'>) => void;
  onUpdateMedication: (med: MedicationItem) => void;
  onDeleteMedication: (id: string) => void;
  medicationLogs: MedicationLog[];
  onToggleMedicationStatus: (medicationId: string, date: string, scheduledTime: string) => void;
  dailyNotes: Record<string, DailyNoteEntry>;
  onSaveDailyNote: (date: string, noteData: DailyNoteEntry) => void;
  onOpenEmergency911: () => void;
  onOpenSuggestions: () => void;
  onOpenProfile?: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  onNavigateToNotesTab?: () => void;
}

export const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  profile,
  selectedDate,
  onSelectDate,
  medications,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  medicationLogs,
  onToggleMedicationStatus,
  dailyNotes,
  onSaveDailyNote,
  onOpenEmergency911,
  onOpenSuggestions,
  onOpenProfile,
  onUpdateProfile,
  onNavigateToNotesTab
}) => {
  // Live clock and network synchronization
  const clock = useLiveClock();
  const todayStr = clock.todayStr;
  const isToday = selectedDate === todayStr;

  // Calendar View Mode: weekly strip or full month view toggle
  const [showFullMonthPicker, setShowFullMonthPicker] = useState(false);
  const [currentMonthView, setCurrentMonthView] = useState(() => {
    return parseDateStringToLocalNoon(selectedDate || todayStr);
  });

  // Daily note local draft for immediate responsiveness
  const currentNoteEntry = dailyNotes[selectedDate] || {
    date: selectedDate,
    note: '',
    mood: undefined,
    waterGlasses: 0,
    tags: []
  };

  const [localNoteText, setLocalNoteText] = useState(currentNoteEntry.note || '');
  const [localMood, setLocalMood] = useState<DailyNoteEntry['mood']>(currentNoteEntry.mood);
  const [localWater, setLocalWater] = useState<number>(currentNoteEntry.waterGlasses || 0);
  const [localTags, setLocalTags] = useState<string[]>(currentNoteEntry.tags || []);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync draft when selectedDate changes
  React.useEffect(() => {
    const entry = dailyNotes[selectedDate] || {
      date: selectedDate,
      note: '',
      mood: undefined,
      waterGlasses: 0,
      tags: []
    };
    setLocalNoteText(entry.note || '');
    setLocalMood(entry.mood);
    setLocalWater(entry.waterGlasses || 0);
    setLocalTags(entry.tags || []);
  }, [selectedDate, dailyNotes]);

  // Medication Add/Edit Modal
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('08:00');
  const [medInstructions, setMedInstructions] = useState('');
  const [medCategory, setMedCategory] = useState<MedicationItem['category']>('vitamin');

  // Format nice display date strictly in +08:00 timezone
  const formattedDateTitle = useMemo(() => {
    return formatDisplayDate(selectedDate, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDate]);

  // Calculate day difference & gestational week preview safely
  const daysDiffFromToday = useMemo(() => {
    try {
      const [y1, m1, d1] = selectedDate.split('-').map(Number);
      const [y2, m2, d2] = todayStr.split('-').map(Number);
      const t1 = Date.UTC(y1, m1 - 1, d1);
      const t2 = Date.UTC(y2, m2 - 1, d2);
      return Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }, [selectedDate, todayStr]);

  // Generate 7-day strip centered around selected date (immune to UTC rollbacks)
  const weekDays = useMemo(() => {
    const days: { dateStr: string; dayName: string; dayNum: number; isSelected: boolean; isToday: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
      const str = shiftDateString(selectedDate, i);
      const [y, m, d] = str.split('-').map(Number);
      const dObj = new Date(y, m - 1, d, 12, 0, 0);
      days.push({
        dateStr: str,
        dayName: dObj.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNum: d,
        isSelected: str === selectedDate,
        isToday: str === todayStr
      });
    }
    return days;
  }, [selectedDate, todayStr]);

  // Date stepper handlers
  const handlePrevDay = () => {
    onSelectDate(shiftDateString(selectedDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(shiftDateString(selectedDate, 1));
  };

  const handleGoToday = () => {
    onSelectDate(todayStr);
  };

  // Medicine logs for current selected date
  const activeMedications = useMemo(() => {
    return medications.filter((m) => m.isActive);
  }, [medications]);

  const takenLogsForDate = useMemo(() => {
    return medicationLogs.filter(
      (log) => log.date === selectedDate && log.status === 'taken'
    );
  }, [medicationLogs, selectedDate]);

  const takenMedIds = useMemo(() => {
    return new Set(takenLogsForDate.map((l) => l.medicationId));
  }, [takenLogsForDate]);

  const allMedsTaken = activeMedications.length > 0 && takenMedIds.size >= activeMedications.length;

  // Save Note Handler
  const handleSaveNote = () => {
    onSaveDailyNote(selectedDate, {
      date: selectedDate,
      note: localNoteText,
      mood: localMood,
      waterGlasses: localWater,
      tags: localTags,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const toggleTag = (tag: string) => {
    const updated = localTags.includes(tag)
      ? localTags.filter((t) => t !== tag)
      : [...localTags, tag];
    setLocalTags(updated);
    onSaveDailyNote(selectedDate, {
      date: selectedDate,
      note: localNoteText,
      mood: localMood,
      waterGlasses: localWater,
      tags: updated,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleSelectMood = (mood: DailyNoteEntry['mood']) => {
    const newMood = localMood === mood ? undefined : mood;
    setLocalMood(newMood);
    onSaveDailyNote(selectedDate, {
      date: selectedDate,
      note: localNoteText,
      mood: newMood,
      waterGlasses: localWater,
      tags: localTags,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleAddWater = () => {
    const newWater = Math.min(16, localWater + 1);
    setLocalWater(newWater);
    onSaveDailyNote(selectedDate, {
      date: selectedDate,
      note: localNoteText,
      mood: localMood,
      waterGlasses: newWater,
      tags: localTags,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Medicine Form Submit
  const handleSaveMedicationForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    if (editingMedId) {
      const existing = medications.find((m) => m.id === editingMedId);
      if (existing) {
        onUpdateMedication({
          ...existing,
          name: medName.trim(),
          dosage: medDosage.trim() || '1 dose',
          scheduledTimes: [medTime],
          instructions: medInstructions.trim(),
          category: medCategory
        });
      }
    } else {
      onAddMedication({
        name: medName.trim(),
        dosage: medDosage.trim() || '1 dose',
        category: medCategory,
        frequency: 'once_daily',
        scheduledTimes: [medTime],
        instructions: medInstructions.trim(),
        isActive: true,
        reminderEnabled: true
      });
    }

    setIsMedModalOpen(false);
    setEditingMedId(null);
    setMedName('');
    setMedDosage('');
    setMedInstructions('');
    setMedTime('08:00');
  };

  const openAddMedModal = () => {
    setEditingMedId(null);
    setMedName('');
    setMedDosage('1 capsule / tablet');
    setMedTime('08:00');
    setMedInstructions('');
    setMedCategory('vitamin');
    setIsMedModalOpen(true);
  };

  const openEditMedModal = (med: MedicationItem) => {
    setEditingMedId(med.id);
    setMedName(med.name);
    setMedDosage(med.dosage);
    setMedTime(med.scheduledTimes[0] || '08:00');
    setMedInstructions(med.instructions || '');
    setMedCategory(med.category);
    setIsMedModalOpen(true);
  };

  // Monthly Calendar Generation
  const monthDays = useMemo(() => {
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; hasNote: boolean; allMedsDone: boolean }[] = [];

    // previous month fillers
    const prevMonthTotal = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const dNum = prevMonthTotal - i;
      const prevDate = new Date(year, month - 1, dNum, 12, 0, 0);
      const dStr = formatDateToYYYYMMDD(prevDate);
      cells.push({
        dateStr: dStr,
        dayNum: dNum,
        isCurrentMonth: false,
        hasNote: !!dailyNotes[dStr]?.note,
        allMedsDone: false
      });
    }

    // current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasNote = !!(dailyNotes[dStr]?.note && dailyNotes[dStr].note.trim().length > 0);
      const takenLogs = medicationLogs.filter((l) => l.date === dStr && l.status === 'taken');
      const allMedsDone = activeMedications.length > 0 && takenLogs.length >= activeMedications.length;

      cells.push({
        dateStr: dStr,
        dayNum: i,
        isCurrentMonth: true,
        hasNote,
        allMedsDone
      });
    }

    return cells;
  }, [currentMonthView, dailyNotes, medicationLogs, activeMedications]);

  const quickTagOptions = [
    '💖 Feeling Great',
    '🥱 Low Energy',
    '🤰 Baby Kicking',
    '🩺 Doctor Visit',
    '💧 Hydrated',
    '💊 Meds on Time',
    '🥦 Ate Veggies',
    '😴 Took a Nap'
  ];

  return (
    <div className="space-y-4 pb-20 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (Calendar, Emergency 911, Daily Tips) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. DATE NAVIGATOR & CALENDAR STRIP */}
          <section className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Live Clock & Internet Time Sync Banner (+08:00) */}
            <div className="bg-gradient-to-r from-stone-50 via-rose-50/50 to-stone-50 p-2.5 sm:p-3 rounded-2xl border border-stone-200/90 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center text-rose-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 leading-tight">
                    <span className="font-mono text-xs sm:text-sm">{clock.timeStr}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-bold shrink-0">
                      +08:00 (GMT+8)
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium truncate">
                    {clock.fullDateStr}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <button
                  type="button"
                  onClick={() => clock.syncNow()}
                  disabled={clock.isSyncing}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 active:scale-95 border border-stone-200 text-stone-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  title="Synchronize clock with online Philippine Standard Time (+08:00)"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-rose-600 ${clock.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{clock.isSyncing ? 'Syncing...' : 'Sync Time'}</span>
                </button>

                <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{clock.isOnline ? 'Online' : 'Device'}</span>
                </div>
              </div>
            </div>

            {/* Date Selector Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevDay}
                  className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all"
                  title="Previous Day"
                  aria-label="Previous Day"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextDay}
                  className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all"
                  title="Next Day"
                  aria-label="Next Day"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {!isToday && (
                  <button
                    onClick={handleGoToday}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200/80 active:scale-95 transition-all"
                  >
                    Today
                  </button>
                )}
              </div>

              {/* Month Calendar Toggle Button */}
              <button
                onClick={() => setShowFullMonthPicker(!showFullMonthPicker)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-rose-600" />
                <span>{showFullMonthPicker ? 'Hide Calendar' : 'Monthly View'}</span>
              </button>
            </div>

            {/* Selected Date Big Title */}
            <div className="flex items-baseline justify-between border-b border-stone-100 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {formattedDateTitle}
                </h2>
                <div className="text-xs font-semibold text-rose-600 flex items-center gap-2 mt-0.5">
                  <span>{isToday ? '🌟 Today’s Schedule' : daysDiffFromToday > 0 ? `In ${daysDiffFromToday} days` : `${Math.abs(daysDiffFromToday)} days ago`}</span>
                  <span>•</span>
                  <span className="text-stone-500">Gestational Week {profile.currentWeek}</span>
                </div>
              </div>
            </div>

            {/* 7-Day Quick Strip */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1 w-full min-w-0">
              {weekDays.map((day) => {
                const hasNote = !!(dailyNotes[day.dateStr]?.note && dailyNotes[day.dateStr].note.trim().length > 0);
                const takenLogs = medicationLogs.filter((l) => l.date === day.dateStr && l.status === 'taken');
                const medsDone = activeMedications.length > 0 && takenLogs.length >= activeMedications.length;

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => onSelectDate(day.dateStr)}
                    className={`py-2 px-0.5 sm:px-1 rounded-2xl flex flex-col items-center justify-center transition-all min-w-0 ${
                      day.isSelected
                        ? 'bg-rose-600 text-white font-black shadow-sm ring-2 ring-rose-300'
                        : day.isToday
                        ? 'bg-rose-50 border-2 border-rose-400 text-rose-900 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${day.isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                      {day.dayName}
                    </span>
                    <span className="text-base font-bold my-0.5">
                      {day.dayNum}
                    </span>
                    <div className="flex items-center gap-1 h-2">
                      {hasNote && (
                        <span className={`w-1.5 h-1.5 rounded-full ${day.isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} title="Note recorded" />
                      )}
                      {medsDone && (
                        <span className={`w-1.5 h-1.5 rounded-full ${day.isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} title="Medicines taken" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Full Month Calendar View Accordion */}
            {showFullMonthPicker && (
              <div className="mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">
                    {currentMonthView.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() - 1, 1))}
                      className="p-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() + 1, 1))}
                      className="p-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-stone-400 py-1">{d}</div>
                  ))}
                  {monthDays.map((cell) => {
                    const isSelected = cell.dateStr === selectedDate;
                    const isTodayCell = cell.dateStr === todayStr;
                    return (
                      <button
                        key={cell.dateStr}
                        onClick={() => {
                          onSelectDate(cell.dateStr);
                          setShowFullMonthPicker(false);
                        }}
                        className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white font-bold'
                            : isTodayCell
                            ? 'bg-rose-100 text-rose-900 font-bold border border-rose-300'
                            : cell.isCurrentMonth
                            ? 'bg-white hover:bg-rose-50 text-stone-800'
                            : 'text-stone-300'
                        }`}
                      >
                        <span>{cell.dayNum}</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {cell.hasNote && <span className="w-1 h-1 rounded-full bg-amber-500" />}
                          {cell.allMedsDone && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* EMERGENCY 911 QUICK CALL BANNER */}
          <section className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 rounded-3xl p-4 sm:p-5 text-white shadow-md shadow-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base">
                    Emergency 911 Hotline
                  </h3>
                  <span className="px-2 py-0.5 bg-white text-red-700 font-black text-[10px] rounded-full uppercase">
                    24/7
                  </span>
                </div>
                <p className="text-xs text-rose-100 font-medium">
                  Immediate medical assistance, ambulance, or maternal emergencies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href="tel:911"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 active:scale-95 text-red-700 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 911</span>
              </a>
              <button
                onClick={onOpenEmergency911}
                className="px-3.5 py-2.5 rounded-xl bg-red-800/60 hover:bg-red-800 text-white font-bold text-xs border border-white/30 transition-colors cursor-pointer"
              >
                More Numbers
              </button>
            </div>
          </section>

          {/* OB-GYN DOCTOR DIRECT CALL / TEXT CARD */}
          <section className="bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/50 rounded-3xl border border-teal-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-black text-stone-900 text-base truncate">
                      {profile.doctorName || 'OB-GYN Doctor'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      Your Doctor
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 truncate">
                    {profile.hospitalName || 'Birth Pavilion & Clinic'}
                  </p>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold underline self-start sm:self-auto cursor-pointer"
                >
                  {profile.doctorPhone ? 'Edit Doctor & Number' : '+ Add Doctor Number'}
                </button>
              )}
            </div>

            {/* Direct 1-Tap Action Buttons */}
            <div className="p-3 bg-white rounded-2xl border border-teal-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-800 block">
                    {profile.doctorPhone ? profile.doctorPhone : 'No OB phone number added yet'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {profile.doctorPhone ? 'Direct 1-tap dial or SMS message' : 'Add your OB’s number for quick call/text'}
                  </span>
                </div>
              </div>

              {profile.doctorPhone ? (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${profile.doctorPhone.replace(/\s+/g, '')}`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                    title={`Call OB: ${profile.doctorPhone}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call OB</span>
                  </a>
                  <a
                    href={`sms:${profile.doctorPhone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                      `Hello ${profile.doctorName || 'Doctor'}, this is ${profile.name} (Week ${profile.currentWeek}): `
                    )}`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 active:scale-95 text-teal-800 border border-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    title={`Text OB: ${profile.doctorPhone}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Text OB</span>
                  </a>
                </div>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add OB Number</span>
                </button>
              )}
            </div>
          </section>

          {/* SUGGESTIONS & HEALTH TIPS CARD */}
          <section className="bg-gradient-to-br from-amber-50/80 via-white to-rose-50/50 rounded-3xl border border-amber-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    Daily Maternal Suggestions & Tips
                  </h3>
                  <p className="text-xs text-stone-500">
                    Stage insights for Week {profile.currentWeek}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenSuggestions}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all"
              >
                See All Tips
              </button>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Quick Tip for Today:</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                • <strong>Iron & Vitamin C pairing</strong>: Take your iron supplement with citrus juice or water, and avoid calcium or tea within 2 hours to maximize absorption.
              </p>
              <p className="text-xs text-stone-700 leading-relaxed">
                • <strong>Side Sleeping</strong>: Sleep on your left side to improve blood and nutrient flow to your baby and placenta.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column (Medicine Taken & Daily Notes) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2. MEDICINE TAKEN (FOR SELECTED DATE) */}
          <section className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    Medicine & Vitamins Taken
                  </h3>
                  <p className="text-xs text-stone-500">
                    {allMedsTaken
                      ? '🎉 All medications taken for this date!'
                      : `${takenMedIds.size} of ${activeMedications.length} taken`}
                  </p>
                </div>
              </div>

              <button
                onClick={openAddMedModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Med</span>
              </button>
            </div>

            {/* Medication List */}
            {activeMedications.length === 0 ? (
              <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                <Pill className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-semibold text-stone-600">No scheduled medications yet</p>
                <button
                  onClick={openAddMedModal}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Add Your First Vitamin / Medicine
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {activeMedications.map((med) => {
                  const isTaken = takenMedIds.has(med.id);
                  const logEntry = takenLogsForDate.find((l) => l.medicationId === med.id);
                  const timeSlot = med.scheduledTimes[0] || '08:00';

                  return (
                    <div
                      key={med.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isTaken
                          ? 'bg-emerald-50/60 border-emerald-200/90'
                          : 'bg-stone-50/80 hover:bg-white border-stone-200/80 shadow-2xs'
                      }`}
                    >
                      {/* Left: Checkbox & Name */}
                      <div
                        onClick={() => onToggleMedicationStatus(med.id, selectedDate, timeSlot)}
                        className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                      >
                        <button
                          type="button"
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                            isTaken
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border-2 border-stone-300 text-transparent hover:border-emerald-500'
                          }`}
                          aria-label={`Mark ${med.name} as ${isTaken ? 'not taken' : 'taken'}`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div>
                          <div className={`font-bold text-sm leading-tight ${isTaken ? 'text-emerald-950 line-through opacity-80' : 'text-stone-900'}`}>
                            {med.name}
                          </div>
                          <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-stone-700">{med.dosage}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-stone-600">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {timeSlot}
                            </span>
                            {isTaken && logEntry?.takenAt && (
                              <span className="text-emerald-700 font-bold">
                                (Taken at {logEntry.takenAt})
                              </span>
                            )}
                          </div>
                          {med.instructions && (
                            <div className="text-[11px] text-stone-500 italic mt-0.5">
                              {med.instructions}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Quick Action Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditMedModal(med)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
                          title="Edit medicine details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMedication(med.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete medicine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. DAILY NOTES OVERVIEW (Points to Notes Tab) */}
          <section className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    Daily Notes &amp; Mood
                  </h3>
                  <p className="text-xs text-stone-500">
                    {formattedDateTitle}
                  </p>
                </div>
              </div>

              {onNavigateToNotesTab && (
                <button
                  onClick={onNavigateToNotesTab}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{currentNoteEntry.note ? 'View in Notes Tab' : 'Write in Notes Tab'}</span>
                </button>
              )}
            </div>

            {currentNoteEntry.note ? (
              <div 
                onClick={onNavigateToNotesTab}
                className="p-3.5 bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 rounded-2xl space-y-2 cursor-pointer transition-colors"
                title="Click to view and edit in Notes tab"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {currentNoteEntry.mood && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-stone-800 border border-rose-200">
                        {currentNoteEntry.mood === 'happy' && '😊 Happy'}
                        {currentNoteEntry.mood === 'calm' && '😌 Calm'}
                        {currentNoteEntry.mood === 'tired' && '😴 Tired'}
                        {currentNoteEntry.mood === 'unwell' && '🤢 Queasy'}
                        {currentNoteEntry.mood === 'excited' && '💖 Excited'}
                      </span>
                    )}
                    {currentNoteEntry.waterGlasses && currentNoteEntry.waterGlasses > 0 ? (
                      <span className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        {currentNoteEntry.waterGlasses} glasses water
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[11px] text-rose-600 font-bold hover:underline">
                    Edit in Notes Tab →
                  </span>
                </div>

                <p className="text-xs text-stone-800 leading-relaxed line-clamp-3">
                  {currentNoteEntry.note}
                </p>

                {currentNoteEntry.tags && currentNoteEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentNoteEntry.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-[10px] font-medium text-rose-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center space-y-2">
                <p className="text-xs text-stone-600">
                  No note recorded for this date yet.
                </p>
                {onNavigateToNotesTab && (
                  <button
                    onClick={onNavigateToNotesTab}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-rose-300 text-stone-800 hover:text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-600" />
                    <span>Open Notes Tab to Write</span>
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ADD / EDIT MEDICATION MODAL */}
      {isMedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900">
                {editingMedId ? 'Edit Medication' : 'Add New Medicine / Vitamin'}
              </h3>
              <button
                onClick={() => setIsMedModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicationForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Medicine / Vitamin Name: *
                </label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Folic Acid, Calcium Carbonate, DHA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dosage:
                  </label>
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="e.g. 500mg, 1 tablet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Scheduled Time:
                  </label>
                  <input
                    type="time"
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category:
                </label>
                <select
                  value={medCategory}
                  onChange={(e) => setMedCategory(e.target.value as MedicationItem['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-rose-500 bg-white"
                >
                  <option value="vitamin">Prenatal Vitamin</option>
                  <option value="folic_acid">Folic Acid</option>
                  <option value="iron">Iron Supplement (Ferrous)</option>
                  <option value="calcium">Calcium + Vitamin D</option>
                  <option value="dha">DHA & Omega-3</option>
                  <option value="prescription">Doctor Prescription</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Instructions / Doctor Note (Optional):
                </label>
                <input
                  type="text"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  placeholder="e.g. Take after breakfast with water"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMedModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  {editingMedId ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
