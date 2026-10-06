import React, { useState } from 'react';
import {
  Activity,
  Scale,
  Footprints,
  Droplets,
  Plus,
  Trash2,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  HeartHandshake
} from 'lucide-react';
import { SymptomLog, WeightLog, KickSession, UserProfile } from '../types/pregnancy';
import { FILIPINO_SYMPTOMS, getSymptomName, SymptomDefinition } from '../data/symptomTranslations';

interface TrackersTabProps {
  profile: UserProfile;
  symptomLogs: SymptomLog[];
  weightLogs: WeightLog[];
  kickSessions: KickSession[];
  onAddSymptomLog: (log: Omit<SymptomLog, 'id'>) => void;
  onDeleteSymptomLog: (id: string) => void;
  onAddWeightLog: (log: Omit<WeightLog, 'id'>) => void;
  onDeleteWeightLog: (id: string) => void;
  onSaveKickSession: (session: Omit<KickSession, 'id'>) => void;
}

export const TrackersTab: React.FC<TrackersTabProps> = ({
  profile,
  symptomLogs,
  weightLogs,
  kickSessions,
  onAddSymptomLog,
  onDeleteSymptomLog,
  onAddWeightLog,
  onDeleteWeightLog,
  onSaveKickSession
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'symptoms' | 'weight' | 'kicks'>('symptoms');

  // Language state for symptoms
  const [symptomLang, setSymptomLang] = useState<'en' | 'tl' | 'both'>('both');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physical' | 'digestive' | 'emotional' | 'general'>('all');
  const [showRemediesGuide, setShowRemediesGuide] = useState(false);

  // New symptom state
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [symptomDate, setSymptomDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Baby Kicks & Flutter']);
  const [symptomSeverity, setSymptomSeverity] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [symptomMood, setSymptomMood] = useState<'peaceful' | 'energetic' | 'tired' | 'anxious' | 'glowing'>('peaceful');
  const [symptomNotes, setSymptomNotes] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [vitaminsTaken, setVitaminsTaken] = useState(true);

  // New weight state
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightValue, setWeightValue] = useState<string>('61.6');
  const [weightNote, setWeightNote] = useState('');

  // Kick counter state
  const [kickCount, setKickCount] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [kickNotes, setKickNotes] = useState('');

  // Kick counter timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && kickCount < 10) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, kickCount]);

  const handleKickTap = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    const nextCount = kickCount + 1;
    setKickCount(nextCount);

    if (nextCount >= 10) {
      setIsTimerRunning(false);
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const handleFinishKickSession = () => {
    const durationMinutes = Math.max(Math.ceil(timerSeconds / 60), 1);
    onSaveKickSession({
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes,
      totalKicks: kickCount,
      notes: kickNotes || 'Normal healthy movement spell'
    });
    setKickCount(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setKickNotes('');
  };

  const handleResetKickCounter = () => {
    setKickCount(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const handleSaveSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptomLog({
      date: symptomDate,
      week: profile.currentWeek,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Normal wellbeing'],
      severity: symptomSeverity,
      mood: symptomMood,
      notes: symptomNotes,
      waterIntakeGlasses: waterGlasses,
      vitaminsTaken
    });
    setIsAddingSymptom(false);
    setSymptomNotes('');
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightValue);
    if (isNaN(val) || val <= 30 || val >= 200) return;
    onAddWeightLog({
      date: weightDate,
      week: profile.currentWeek,
      weightKg: Number(val.toFixed(1)),
      notes: weightNote
    });
    setIsAddingWeight(false);
    setWeightNote('');
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSymptoms = FILIPINO_SYMPTOMS.filter(
    s => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-4 pt-3">
      {/* Sub navigation header */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
        <button
          onClick={() => setActiveSubTab('symptoms')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'symptoms'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Symptoms ({symptomLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('weight')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'weight'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Weight Log ({weightLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('kicks')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'kicks'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Kick Counter
        </button>
      </div>

      {/* SYMPTOMS SUBTAB */}
      {activeSubTab === 'symptoms' && (
        <div className="space-y-4">
          {/* Header with Filipino Translation Switcher */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>Symptoms & Mood Monitor</span>
                </h2>
                <p className="text-[11px] text-stone-500">
                  {symptomLang === 'tl'
                    ? 'Subaybayan ang iyong mga nararamdaman araw-araw'
                    : 'Track sensations, maternal changes & remedies'}
                </p>
              </div>
              <button
                onClick={() => setIsAddingSymptom(!isAddingSymptom)}
                className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{symptomLang === 'tl' ? 'Mag-log' : 'Log Day'}</span>
              </button>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
              <span className="text-[11px] font-medium text-stone-600 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-rose-500" />
                <span>Symptom Language:</span>
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setSymptomLang('en')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    symptomLang === 'en' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English 🇺🇸
                </button>
                <button
                  onClick={() => setSymptomLang('tl')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    symptomLang === 'tl' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Filipino 🇵🇭
                </button>
                <button
                  onClick={() => setSymptomLang('both')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    symptomLang === 'both' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Dual 🌐
                </button>
              </div>
            </div>

            {/* Toggle Filipino Remedies Guide */}
            <button
              type="button"
              onClick={() => setShowRemediesGuide(!showRemediesGuide)}
              className="w-full text-[11px] font-medium text-rose-700 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100/70 p-2 rounded-xl flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>Maternong Gabay at Lunas sa Sintomas (Filipino Remedies Guide)</span>
              </span>
              {showRemediesGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Filipino Remedies Quick Guide Dropdown */}
          {showRemediesGuide && (
            <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-2xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1">
                  <span>🇵🇭 Gabay sa Pangangalaga ng Buntis (Maternal Care)</span>
                </h3>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-semibold">
                  Home Comfort Tips
                </span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {FILIPINO_SYMPTOMS.map((sym) => (
                  <div key={sym.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <span>{sym.iconEmoji}</span>
                        <span>{sym.nameTl}</span>
                        <span className="text-[10px] text-stone-500 font-normal">({sym.nameEn})</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {sym.descriptionTl}
                    </p>
                    <div className="text-[11px] bg-emerald-50 text-emerald-800 p-1.5 rounded-lg flex items-start gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Lunas:</strong> {sym.remedyTl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Symptom Form Modal/Drawer */}
          {isAddingSymptom && (
            <form onSubmit={handleSaveSymptom} className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-rose-700">
                  {symptomLang === 'tl' ? 'Bagong Log ng Sintomas' : 'New Daily Symptom Log'}
                </span>
                <input
                  type="date"
                  value={symptomDate}
                  onChange={(e) => setSymptomDate(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 font-mono text-stone-700"
                />
              </div>

              {/* Mood selector */}
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {symptomLang === 'tl' ? 'Kumusta ang iyong pakiramdam?' : 'How are you feeling today?'}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['peaceful', 'glowing', 'energetic', 'tired', 'anxious'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSymptomMood(m)}
                      className={`py-1.5 rounded-lg text-center capitalize text-[11px] font-medium border transition-all ${
                        symptomMood === m
                          ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-2xs font-semibold'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {m === 'peaceful' && '😌'}
                      {m === 'glowing' && '✨'}
                      {m === 'energetic' && '⚡'}
                      {m === 'tired' && '🥱'}
                      {m === 'anxious' && '💭'}
                      <span className="block mt-0.5 text-[10px]">
                        {m === 'peaceful' && (symptomLang === 'tl' ? 'Payapa' : 'Peaceful')}
                        {m === 'glowing' && (symptomLang === 'tl' ? 'Masaya' : 'Glowing')}
                        {m === 'energetic' && (symptomLang === 'tl' ? 'Masigla' : 'Energetic')}
                        {m === 'tired' && (symptomLang === 'tl' ? 'Pagod' : 'Tired')}
                        {m === 'anxious' && (symptomLang === 'tl' ? 'Nababahala' : 'Anxious')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms chips with Filipino options */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-700">
                    {symptomLang === 'tl' ? 'Pumili ng mga Nararanasang Sintomas:' : 'Select Symptoms Experienced:'}
                  </label>
                  <span className="text-[10px] text-rose-600 font-medium">
                    {selectedSymptoms.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-stone-50/80 rounded-xl border border-stone-100">
                  {FILIPINO_SYMPTOMS.map((sym) => {
                    const displayName =
                      symptomLang === 'tl'
                        ? sym.nameTl
                        : symptomLang === 'en'
                        ? sym.nameEn
                        : `${sym.nameEn} · ${sym.nameTl}`;

                    const isSelected = selectedSymptoms.includes(sym.nameEn) || selectedSymptoms.includes(displayName) || selectedSymptoms.includes(sym.nameTl);

                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => {
                          const valToStore = symptomLang === 'tl' ? sym.nameTl : sym.nameEn;
                          if (isSelected) {
                            setSelectedSymptoms(selectedSymptoms.filter((s) => s !== valToStore && s !== sym.nameEn && s !== sym.nameTl && s !== displayName));
                          } else {
                            setSelectedSymptoms([...selectedSymptoms, valToStore]);
                          }
                        }}
                        className={`px-2.5 py-1.5 text-xs rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 font-medium shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span>{sym.iconEmoji}</span>
                        <span>{displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Severity slider */}
              <div>
                <div className="flex justify-between text-xs text-stone-700 mb-1">
                  <span>{symptomLang === 'tl' ? 'Tindi o Antas ng Pananakit:' : 'Intensity / Discomfort:'}</span>
                  <span className="font-semibold text-rose-600">
                    {symptomSeverity === 1 && (symptomLang === 'tl' ? 'Banayad (1/5)' : 'Mild (1/5)')}
                    {symptomSeverity === 2 && (symptomLang === 'tl' ? 'Kapansin-pansin (2/5)' : 'Noticeable (2/5)')}
                    {symptomSeverity === 3 && (symptomLang === 'tl' ? 'Katamtaman (3/5)' : 'Moderate (3/5)')}
                    {symptomSeverity === 4 && (symptomLang === 'tl' ? 'Mataas (4/5)' : 'High (4/5)')}
                    {symptomSeverity === 5 && (symptomLang === 'tl' ? 'Matindi (5/5)' : 'Severe (5/5)')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={symptomSeverity}
                  onChange={(e) => setSymptomSeverity(Number(e.target.value) as any)}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Water and Vitamins */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl text-xs">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">
                    {symptomLang === 'tl' ? 'Baso ng Tubig' : 'Water (Glasses)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={waterGlasses}
                      onChange={(e) => setWaterGlasses(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                    />
                    <span className="text-sky-600 font-semibold">💧</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">
                    {symptomLang === 'tl' ? 'Bitamina / Asido Foliko' : 'Vitamins Taken?'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setVitaminsTaken(!vitaminsTaken)}
                    className={`w-full py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      vitaminsTaken
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    {vitaminsTaken
                      ? (symptomLang === 'tl' ? '✅ Nakainom Na' : '✅ Taken Today')
                      : (symptomLang === 'tl' ? '❌ Hindi Pa' : '❌ Missed Today')}
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {symptomLang === 'tl' ? 'Tala at Obserbasyon:' : 'Notes & Sensations:'}
                </label>
                <textarea
                  rows={2}
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder={
                    symptomLang === 'tl'
                      ? 'Halimbawa: Sumipa si baby pagkatapos kumain; nagpahinga nang nakatagilid...'
                      : 'e.g. Baby kicked after drinking water; rested lower back with pillow...'
                  }
                  className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-rose-500"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all"
                >
                  {symptomLang === 'tl' ? 'I-save ang Araw' : 'Save Daily Log'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSymptom(false)}
                  className="py-2 px-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50"
                >
                  {symptomLang === 'tl' ? 'Kanselahin' : 'Cancel'}
                </button>
              </div>
            </form>
          )}

          {/* Symptom logs list */}
          <div className="space-y-2.5">
            {symptomLogs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs space-y-1.5">
                <Activity className="w-6 h-6 text-stone-300 mx-auto" />
                <span className="font-semibold block text-stone-700">
                  {symptomLang === 'tl' ? 'Wala pang naitalang sintomas' : 'No symptom logs yet'}
                </span>
                <p className="text-[11px] text-stone-400">
                  {symptomLang === 'tl'
                    ? 'Pindutin ang "Mag-log" para itala ang iyong unang araw.'
                    : 'Click "Log Day" to record symptoms in English or Filipino!'}
                </p>
              </div>
            ) : (
              symptomLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800">{log.date}</span>
                      <span className="text-rose-600 font-medium">Week {log.week}</span>
                      <span className="capitalize text-stone-500">· {log.mood}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                        Level {log.severity}/5
                      </span>
                      <button
                        onClick={() => onDeleteSymptomLog(log.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {log.symptoms.map((s, idx) => {
                      const displayTitle = getSymptomName(s, symptomLang);
                      return (
                        <span key={idx} className="text-xs bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md font-medium border border-rose-100">
                          {displayTitle}
                        </span>
                      );
                    })}
                  </div>

                  {log.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg leading-relaxed">
                      {log.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span className="flex items-center gap-1 text-sky-700">
                      <Droplets className="w-3 h-3 text-sky-500" />
                      {log.waterIntakeGlasses} {symptomLang === 'tl' ? 'baso ng tubig' : 'glasses water'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.vitaminsTaken
                        ? (symptomLang === 'tl' ? 'Nainom ang bitamina' : 'Vitamins taken')
                        : (symptomLang === 'tl' ? 'Nakaligtaan ang bitamina' : 'Missed vitamins')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* WEIGHT TRACKER SUBTAB */}
      {activeSubTab === 'weight' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Maternal Weight Monitor</h2>
              <p className="text-xs text-stone-500">Normal healthy pregnancy progression</p>
            </div>
            <button
              onClick={() => setIsAddingWeight(!isAddingWeight)}
              className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Weight</span>
            </button>
          </div>

          {/* Trimester guidance card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
            <span className="font-semibold block flex items-center gap-1 text-amber-800">
              <Scale className="w-4 h-4 text-amber-700" />
              Trimester 2 Health Target Guideline
            </span>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              In the second trimester, average recommended weight gain is roughly 0.4 to 0.5 kg (0.8–1 lb) per week to support expanding blood volume, placenta, amniotic fluid, and baby’s rapid bone growth.
            </p>
          </div>

          {/* Add weight modal */}
          {isAddingWeight && (
            <form onSubmit={handleSaveWeight} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-stone-900 block">Record Weight Entry</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    placeholder="e.g. 61.6"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono font-bold text-stone-800"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-stone-500 block mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  placeholder="e.g. Morning weigh-in before breakfast"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium"
                >
                  Save Weight
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingWeight(false)}
                  className="py-2 px-3 border border-stone-200 text-stone-600 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Visual Trend Bars */}
          {weightLogs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-6 text-center space-y-2">
              <span className="text-xs font-semibold text-stone-700 block">No Weight Records Yet</span>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                Track your weekly weight gain curve to monitor healthy development for you and baby.
              </p>
              <button
                onClick={() => setIsAddingWeight(true)}
                className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log First Weight</span>
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs">
                <span className="text-xs font-semibold text-stone-700 block mb-3">Weight History Trend</span>
                <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1 border-b border-stone-100">
                  {weightLogs.slice(-7).map((log) => {
                    const min = 55;
                    const max = 65;
                    const pct = Math.max(Math.min(((log.weightKg - min) / (max - min)) * 100, 100), 15);
                    return (
                      <div key={log.id} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] font-mono text-stone-700 font-medium opacity-80 group-hover:opacity-100">
                          {log.weightKg}
                        </span>
                        <div
                          className="w-full max-w-[28px] bg-rose-400 hover:bg-rose-500 rounded-t-md transition-all duration-300"
                          style={{ height: `${pct}%` }}
                        />
                        <span className="text-[9px] font-mono text-stone-400 mt-1 whitespace-nowrap">
                          W{log.week}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weight entries list */}
              <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden shadow-2xs">
                {weightLogs.map((log) => (
                  <div key={log.id} className="p-3 flex items-center justify-between hover:bg-stone-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-900 font-mono tabular-nums">
                          {log.weightKg} kg
                        </span>
                        <span className="text-[11px] text-rose-600 font-medium">Week {log.week}</span>
                        <span className="text-[11px] text-stone-400">({(log.weightKg * 2.20462).toFixed(1)} lbs)</span>
                      </div>
                      {log.notes && <p className="text-[11px] text-stone-500 mt-0.5">{log.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400 font-mono">{log.date}</span>
                      <button
                        onClick={() => onDeleteWeightLog(log.id)}
                        className="text-stone-300 hover:text-rose-600 p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* KICK COUNTER SUBTAB */}
      {activeSubTab === 'kicks' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Baby Kick Counter</h2>
            <p className="text-xs text-stone-500">Track 10 movements in under 2 hours (fetal wellbeing)</p>
          </div>

          {/* Active Kick Counter Card */}
          <div className="bg-gradient-to-b from-rose-50/60 to-white rounded-2xl border border-rose-200/80 p-5 shadow-xs text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Session Timer: {formatTimer(timerSeconds)}
              </span>
              <span className="font-semibold text-rose-700">Goal: 10 Kicks</span>
            </div>

            {/* Giant Kick Tap Button */}
            <div className="py-2 flex justify-center">
              <button
                onClick={handleKickTap}
                className="w-36 h-36 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-90 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-200 transition-all select-none"
              >
                <Footprints className="w-8 h-8 mb-1 animate-pulse" />
                <span className="text-3xl font-extrabold font-mono tabular-nums leading-none">
                  {kickCount}
                </span>
                <span className="text-[11px] tracking-wide font-medium mt-1 uppercase text-rose-100">
                  {kickCount >= 10 ? 'Done! ✨' : 'Tap to Count'}
                </span>
              </button>
            </div>

            {kickCount >= 10 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium space-y-1">
                <span>🎉 Wonderful! Reached 10 kicks in {formatTimer(timerSeconds)}.</span>
                <p className="text-[11px] text-emerald-700">Your baby is active and thriving.</p>
              </div>
            )}

            {/* Session Controls */}
            <div className="space-y-2">
              <input
                type="text"
                value={kickNotes}
                onChange={(e) => setKickNotes(e.target.value)}
                placeholder="Session notes (e.g. Active after eating fruit)..."
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFinishKickSession}
                  disabled={kickCount === 0}
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition-all"
                >
                  Save Kick Record
                </button>
                <button
                  onClick={handleResetKickCounter}
                  className="py-2 px-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50"
                  title="Reset counter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Past Kick Sessions List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-800">Past Kick Sessions</h3>
            {kickSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-stone-200/80 p-3 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{session.totalKicks} Kicks</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-600">{session.durationMinutes} mins</span>
                    <span className="text-stone-400">·</span>
                    <span className="font-mono text-stone-500">{session.startTime}</span>
                  </div>
                  {session.notes && (
                    <p className="text-[11px] text-stone-500 mt-0.5">{session.notes}</p>
                  )}
                </div>
                <span className="text-[11px] font-mono text-stone-400">{session.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
