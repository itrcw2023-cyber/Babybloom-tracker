import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Stethoscope,
  Lightbulb,
  Droplets,
  Pill,
  Camera,
  Activity,
  ArrowRight,
  ShieldAlert,
  Heart,
  Footprints,
  Smile,
  Coffee,
  Check,
  Plus
} from 'lucide-react';
import { UserProfile, WeeklyInfo, SymptomLog, MedicationItem, MedicationLog } from '../types/pregnancy';
import { getWeeklyInfo } from '../data/weeklyData';

interface TodayTabProps {
  profile: UserProfile;
  latestSymptomLog?: SymptomLog;
  medications: MedicationItem[];
  medicationLogs: MedicationLog[];
  onOpenLogSymptoms: () => void;
  onOpenAddPhoto: () => void;
  onOpenSuggestions: () => void;
  onOpenAppointments: () => void;
  onNavigateToMedications: () => void;
  onToggleWater: (glasses: number) => void;
  onToggleVitamins: () => void;
}

const DAILY_AFFIRMATIONS = [
  'You are doing an incredible job nurturing and growing your sweet baby! 🌸',
  'Take a deep breath and listen to your body today, Mama. Rest is productive. 💖',
  'Baby can feel your warmth and love every single moment. ✨',
  'Every kick, flutter, and heartbeat is a sign of new life blooming beautifully. 🌱',
  'Remember to stay hydrated and celebrate how strong your body is! 💧',
  'Trust your maternal instincts — you are already the perfect mother for your baby. 🤱',
  'One day closer to holding your little miracle in your arms! 🕊️'
];

export const TodayTab: React.FC<TodayTabProps> = ({
  profile,
  latestSymptomLog,
  medications,
  medicationLogs,
  onOpenLogSymptoms,
  onOpenAddPhoto,
  onOpenSuggestions,
  onOpenAppointments,
  onNavigateToMedications,
  onToggleWater,
  onToggleVitamins
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(profile.currentWeek);
  const [selectedMood, setSelectedMood] = useState<string>(latestSymptomLog?.mood || 'glowing');
  const [languageMode, setLanguageMode] = useState<'both' | 'tl' | 'en'>('both');

  const weeklyInfo: WeeklyInfo = getWeeklyInfo(selectedWeek);

  // Compute days remaining
  const calculateDaysRemaining = (): number => {
    const today = new Date();
    const due = new Date(profile.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const daysRemaining = calculateDaysRemaining();
  const progressPercent = Math.min(Math.round((profile.currentWeek / 40) * 100), 100);
  const isCurrentWeek = selectedWeek === profile.currentWeek;
  const currentWater = latestSymptomLog?.waterIntakeGlasses || 0;
  const vitaminsTaken = latestSymptomLog?.vitaminsTaken || false;

  // Pick daily affirmation based on day of month
  const todayDateNum = new Date().getDate();
  const dailyAffirmation = DAILY_AFFIRMATIONS[todayDateNum % DAILY_AFFIRMATIONS.length];

  // Check missed/overdue medications for today
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentMinutesNow = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  const missedMedications = useMemo(() => {
    const missedList: { med: MedicationItem; time: string }[] = [];
    medications.filter(m => m.isActive && m.reminderEnabled).forEach(med => {
      med.scheduledTimes.forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const scheduledMin = h * 60 + m;
        const existingLog = medicationLogs.find(
          l => l.date === todayStr && l.medicationId === med.id && l.scheduledTime === time
        );
        if (!existingLog && currentMinutesNow > scheduledMin) {
          missedList.push({ med, time });
        }
      });
    });
    return missedList;
  }, [medications, medicationLogs, todayStr, currentMinutesNow]);

  // Greeting by hour
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return { en: 'Good morning', tl: 'Magandang umaga' };
    if (hr < 18) return { en: 'Good afternoon', tl: 'Magandang hapon' };
    return { en: 'Good evening', tl: 'Magandang gabi' };
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2">
      {/* 1. Welcoming Mother Header & Daily Affirmation */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-xs font-medium text-rose-100 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌸</span>
              <span>{greeting.tl}, Mommy {profile.name || 'Mom'}!</span>
            </span>
            <h2 className="text-xl font-extrabold mt-0.5 tracking-tight text-white">
              {profile.babyNickname || 'Little Miracle'} is blooming 💕
            </h2>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span className="text-2xl font-black font-mono tracking-tight leading-none text-white block">
              {daysRemaining}
            </span>
            <span className="text-[10px] text-rose-100 font-medium">days to go</span>
          </div>
        </div>

        {/* Daily Sweet Affirmation */}
        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-200 fill-rose-200 shrink-0" />
          <p className="text-xs text-rose-50 italic leading-snug">
            &ldquo;{dailyAffirmation}&rdquo;
          </p>
        </div>
      </div>

      {/* 2. MISSED MEDICATIONS ALERT BANNER (Friendly, non-stressful) */}
      {missedMedications.length > 0 && (
        <div
          onClick={onNavigateToMedications}
          className="bg-amber-50 border-2 border-amber-300 hover:border-amber-400 rounded-2xl p-3.5 shadow-xs cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>Pending Vitamin / Medicine Reminder</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
                    {missedMedications.length} due
                  </span>
                </h3>
                <p className="text-[11px] text-amber-800">
                  {missedMedications.map(m => `${m.med.name} (${m.time})`).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Baby Growth & Size Card (Simple, Visual & Delightful) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Trimester {weeklyInfo.trimester} · Week {selectedWeek}
              </span>
              {isCurrentWeek && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-2 flex items-center gap-2">
              <span>Size of a {weeklyInfo.babySizeComparison}</span>
              <span className="text-2xl">{weeklyInfo.fruitEmoji}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Due Date: <span className="font-semibold text-stone-700">{profile.dueDate}</span>
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl shadow-inner shrink-0">
            {weeklyInfo.fruitEmoji}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-stone-500 mb-1.5 font-medium">
            <span>Week 1</span>
            <span className="font-bold text-rose-600">{progressPercent}% of Pregnancy Completed</span>
            <span>Week 40</span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Length & Weight Quick Specs */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-stone-100">
          <div className="bg-stone-50/80 rounded-2xl p-3 border border-stone-200/50">
            <span className="text-[11px] text-stone-500 font-medium block">Approx. Baby Length</span>
            <span className="text-base font-bold text-stone-800 font-mono">
              ~{weeklyInfo.babyLengthCm} cm
            </span>
          </div>
          <div className="bg-stone-50/80 rounded-2xl p-3 border border-stone-200/50">
            <span className="text-[11px] text-stone-500 font-medium block">Approx. Baby Weight</span>
            <span className="text-base font-bold text-stone-800 font-mono">
              ~{weeklyInfo.babyWeightGrams} grams
            </span>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedWeek(w => Math.max(w - 1, 4))}
            disabled={selectedWeek <= 4}
            className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar flex-1">
            {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((wk) => (
              <button
                key={wk}
                onClick={() => setSelectedWeek(wk)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedWeek === wk
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Wk {wk}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedWeek(w => Math.min(w + 1, 40))}
            disabled={selectedWeek >= 40}
            className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. SUPER SIMPLE "MOMMY'S DAILY 3-STEP ROUTINE" (Hydration, Vitamins, Mood) */}
      <div className="bg-gradient-to-br from-rose-50/50 to-amber-50/40 rounded-3xl border border-rose-200/70 p-4 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <span>✨</span>
            <span>Mommy&apos;s Daily Routine</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-medium">1-Tap Quick Track</span>
        </div>

        {/* Step 1: Water Intake */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>1. Tubig / Water Intake ({currentWater}/8 glasses)</span>
            </span>
            <button
              onClick={() => onToggleWater(Math.min(currentWater + 1, 8))}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>+1 Glass</span>
            </button>
          </div>

          <div className="grid grid-cols-8 gap-1.5 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((cup) => (
              <button
                key={cup}
                onClick={() => onToggleWater(cup === currentWater ? cup - 1 : cup)}
                className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  cup <= currentWater
                    ? 'bg-sky-500 text-white shadow-xs scale-105'
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
                title={`Glass #${cup}`}
              >
                💧
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-500">
            {currentWater >= 8
              ? '🎉 Excellent hydration! Healthy for you and baby.'
              : `💧 Drink ${8 - currentWater} more glasses today to keep amniotic fluid optimal.`}
          </p>
        </div>

        {/* Step 2: Prenatal Vitamins & Medicine */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-rose-500" />
              <span>2. Vitamins &amp; Medicines ({medications.length} items)</span>
            </span>
            <button
              onClick={onNavigateToMedications}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
            >
              <span>Manage Meds</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={onToggleVitamins}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              vitaminsTaken
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-dashed border-rose-300'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${vitaminsTaken ? 'text-white' : 'text-rose-500'}`} />
            <span>{vitaminsTaken ? '✅ Vitamins Taken Today! Galing ni Mommy!' : 'Tap Here to Mark Today\'s Vitamins Taken'}</span>
          </button>
        </div>

        {/* Step 3: Quick Mood Check-in */}
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>3. How are you feeling today, Mommy?</span>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { id: 'glowing', label: 'Glowing', emoji: '✨' },
              { id: 'peaceful', label: 'Happy', emoji: '😊' },
              { id: 'tired', label: 'Sleepy', emoji: '😴' },
              { id: 'nauseous', label: 'Queasy', emoji: '🤢' },
              { id: 'energetic', label: 'Active', emoji: '⚡' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  selectedMood === m.id
                    ? 'bg-rose-100 border-2 border-rose-400 text-rose-900 font-bold scale-102'
                    : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="text-[10px]">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Baby Development Highlights (Simple bullet points) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              What Baby is Doing in Week {selectedWeek} 👶
            </h3>
            <p className="text-[11px] text-stone-500">Milestones &amp; growth highlights</p>
          </div>
        </div>

        <ul className="space-y-2 pt-1">
          {weeklyInfo.babyDevelopment.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. Mommy's Body & Care Suggestions */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Mommy Care Tips &amp; Relief 🌿
              </h3>
              <p className="text-[11px] text-stone-500">Helpful advice for this stage</p>
            </div>
          </div>
          <button
            onClick={onOpenSuggestions}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
          >
            <span>More Tips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ul className="space-y-2 pt-1">
          {weeklyInfo.weeklySuggestions.map((sug, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Questions to Ask Doctor at Next Visit */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Questions for OB-GYN Checkup 🩺
              </h3>
              <p className="text-[11px] text-stone-500">Things to ask your doctor this week</p>
            </div>
          </div>
          <button
            onClick={onOpenAppointments}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
          >
            Visits
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {weeklyInfo.doctorChecklist.map((q, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-xl text-xs text-stone-800 border border-stone-200/60 font-medium">
              “{q}”
            </div>
          ))}
        </div>
      </div>

      {/* 8. Trusted Philippine Health & Mother Guides */}
      <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 rounded-3xl border border-rose-200/90 p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-sm font-bold shadow-2xs">
              🇵🇭
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Trusted Pinay Mom References
              </h3>
              <p className="text-[11px] text-stone-500">Official health agencies &amp; maternal guides</p>
            </div>
          </div>
          <button
            onClick={onOpenSuggestions}
            className="text-xs text-rose-700 hover:text-rose-800 font-bold flex items-center gap-0.5"
          >
            <span>All Links</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="https://doh.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-rose-300 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block">Official DOH</span>
              <h4 className="text-xs font-bold text-stone-900 mt-0.5 group-hover:text-rose-600 transition-colors">
                Maternal Health &amp; 1000 Days
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                Gov maternal guidelines &amp; micronutrients
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-rose-700">
              <span>doh.gov.ph</span>
              <span className="text-stone-400 group-hover:text-rose-600">↗</span>
            </div>
          </a>

          <a
            href="https://pogs.org.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-rose-300 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">POGS Society</span>
              <h4 className="text-xs font-bold text-stone-900 mt-0.5 group-hover:text-indigo-600 transition-colors">
                Philippine OB-GYN Society
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                Ultrasound standards &amp; clinical care
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-indigo-700">
              <span>pogs.org.ph</span>
              <span className="text-stone-400 group-hover:text-indigo-600">↗</span>
            </div>
          </a>

          <a
            href="https://www.philhealth.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-rose-300 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">PhilHealth</span>
              <h4 className="text-xs font-bold text-stone-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
                Maternity Packages (MCP/CS)
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                Delivery insurance &amp; newborn care
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-emerald-700">
              <span>philhealth.gov.ph</span>
              <span className="text-stone-400 group-hover:text-emerald-700">↗</span>
            </div>
          </a>

          <a
            href="https://www.smartparenting.com.ph/pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-rose-300 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">SmartParenting PH</span>
              <h4 className="text-xs font-bold text-stone-900 mt-0.5 group-hover:text-amber-700 transition-colors">
                Hospital Rates &amp; Guides
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                Delivery costs, registry &amp; mom stories
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-amber-700">
              <span>smartparenting.com.ph</span>
              <span className="text-stone-400 group-hover:text-amber-700">↗</span>
            </div>
          </a>
        </div>

        {/* 24/7 Helpline Quick Access */}
        <div className="bg-rose-100/70 rounded-2xl p-3 border border-rose-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              24/7 National Maternal &amp; Mental Health Support
            </span>
            <span className="text-xs font-extrabold text-rose-950">
              NCMH Helpline: 1553 · DOH Hotline: 1555
            </span>
          </div>
          <a
            href="tel:1553"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs shrink-0"
          >
            Call 1553
          </a>
        </div>
      </div>

      {/* 9. Quick Action Bar for Mom */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={onOpenLogSymptoms}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
        >
          <Activity className="w-4 h-4 text-rose-400" />
          <span>Log Symptoms &amp; Notes</span>
        </button>

        <button
          onClick={onOpenAddPhoto}
          className="py-3.5 px-4 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all shrink-0"
          title="Take or upload belly bump / ultrasound photo"
        >
          <Camera className="w-4 h-4 text-rose-700" />
          <span>Snap Bump</span>
        </button>
      </div>

      {/* Developer & App Signature Footer */}
      <div className="pt-4 pb-2 text-center text-[11px] text-stone-400 space-y-0.5">
        <p className="font-semibold text-stone-600">BabyBloom Tracker</p>
        <p>Developed with 💖 by <span className="font-medium text-rose-600">OjrE</span></p>
      </div>
    </div>
  );
};
