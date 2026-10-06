import React, { useState, useMemo } from 'react';
import {
  Heart,
  Baby,
  Calendar,
  User,
  Sparkles,
  Stethoscope,
  Building,
  PhoneCall,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types/pregnancy';
import { MotherBabyLogo } from './MotherBabyLogo';
import {
  getTodayDateString,
  shiftDateString,
  calculateGestationalAge,
  calculateDueDateFromLMP,
  formatDisplayDate
} from '../utils/dateTime';

interface OnboardingModalProps {
  isOpen: boolean;
  currentProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onSkip?: () => void;
}

const NICKNAME_SUGGESTIONS = [
  { label: 'Little Peanut 🥜', value: 'Little Peanut' },
  { label: 'Baby Bloom 🌸', value: 'Baby Bloom' },
  { label: 'Little Bean 🌱', value: 'Little Bean' },
  { label: 'Sweet Pea 🫛', value: 'Sweet Pea' },
  { label: 'Sunshine ☀️', value: 'Sunshine' },
  { label: 'Little Nugget 💛', value: 'Little Nugget' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentProfile,
  onComplete,
  onSkip
}) => {
  const todayStr = useMemo(() => getTodayDateString(), []);

  // Default suggested due date ~22 weeks away (approx 126 days)
  const defaultDueDate = useMemo(() => {
    return currentProfile.dueDate || shiftDateString(todayStr, 126);
  }, [currentProfile.dueDate, todayStr]);

  // Form State
  const [motherName, setMotherName] = useState(
    currentProfile.name && currentProfile.name !== 'Mama' ? currentProfile.name : ''
  );
  const [babyNickname, setBabyNickname] = useState(
    currentProfile.babyNickname && currentProfile.babyNickname !== 'Little Baby Bloom'
      ? currentProfile.babyNickname
      : ''
  );

  // Due Date Mode: 'direct' | 'lmp'
  const [dateMode, setDateMode] = useState<'direct' | 'lmp'>('direct');
  const [dueDate, setDueDate] = useState<string>(defaultDueDate);
  const [lmpDate, setLmpDate] = useState<string>(() => shiftDateString(todayStr, -154)); // ~22 weeks ago

  // Optional fields
  const [showMedicalFields, setShowMedicalFields] = useState(false);
  const [doctorName, setDoctorName] = useState(currentProfile.doctorName || '');
  const [doctorPhone, setDoctorPhone] = useState(currentProfile.doctorPhone || '');
  const [hospitalName, setHospitalName] = useState(currentProfile.hospitalName || '');
  const [partnerName, setPartnerName] = useState(currentProfile.partnerName || '');

  // Live Gestational Age calculations
  const effectiveDueDate = dateMode === 'lmp' && lmpDate ? calculateDueDateFromLMP(lmpDate) : dueDate;
  const gestationalInfo = useMemo(() => {
    return calculateGestationalAge(effectiveDueDate, todayStr);
  }, [effectiveDueDate, todayStr]);

  if (!isOpen) return null;

  const handleSelectLmp = (newLmp: string) => {
    setLmpDate(newLmp);
    if (newLmp) {
      const calculatedEdd = calculateDueDateFromLMP(newLmp);
      setDueDate(calculatedEdd);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalMotherName = motherName.trim() || 'Mama';
    const finalBabyNickname = babyNickname.trim() || 'Little Bloom';
    const finalDueDate = effectiveDueDate || defaultDueDate;

    const newProfile: UserProfile = {
      ...currentProfile,
      name: finalMotherName,
      babyNickname: finalBabyNickname,
      dueDate: finalDueDate,
      currentWeek: gestationalInfo.weeks,
      doctorName: doctorName.trim() || 'Dr. Sarah Bennett, MD (OB-GYN)',
      doctorPhone: doctorPhone.trim() || '+63 917 888 1234',
      hospitalName: hospitalName.trim() || 'St. Jude Women & Children Pavilion',
      partnerName: partnerName.trim() || currentProfile.partnerName || ''
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#fdfbf9] w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="relative bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle floral/sparkle decoration background */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-rose-400/20 blur-lg pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <MotherBabyLogo size={48} className="border border-white/30 shadow-inner" />
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-rose-100/90 block">
                  Welcome Setup
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  BabyBloom Tracker
                </h2>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-rose-100 border border-white/20">
              Fresh Install
            </span>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-rose-100 leading-relaxed max-w-md">
            Let&apos;s personalize your pregnancy journal. Enter your details below to calculate your current week, track baby&apos;s growth, and schedule daily wellness logs.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Mother's Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-rose-500" />
                <span>Mother&apos;s Name</span>
              </span>
              <span className="text-[11px] text-stone-400 font-normal">Required</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="e.g. Maria, Catherine, or Mama"
                className="w-full pl-3.5 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all font-medium shadow-2xs"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-stone-500">
              How you would like your daily notes and header to address you.
            </p>
          </div>

          {/* 2. Baby's Nickname Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-rose-500" />
                <span>Baby&apos;s Nickname</span>
              </span>
              <span className="text-[11px] text-stone-400 font-normal">Required</span>
            </label>
            <input
              type="text"
              value={babyNickname}
              onChange={(e) => setBabyNickname(e.target.value)}
              placeholder="e.g. Little Peanut, Baby Bloom, Bean"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all font-medium shadow-2xs"
            />

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-stone-400 font-semibold self-center mr-1">Suggestions:</span>
              {NICKNAME_SUGGESTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setBabyNickname(item.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    babyNickname === item.value
                      ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-2xs'
                      : 'bg-white hover:bg-rose-50 border-stone-200 text-stone-700 hover:border-rose-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Estimated Due Date (EDD) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>Estimated Due Date (EDD)</span>
              </label>

              {/* Mode Toggle: Due Date vs LMP */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDateMode('direct')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    dateMode === 'direct'
                      ? 'bg-white text-rose-600 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Exact Date
                </button>
                <button
                  type="button"
                  onClick={() => setDateMode('lmp')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    dateMode === 'lmp'
                      ? 'bg-white text-rose-600 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  From Last Period
                </button>
              </div>
            </div>

            {dateMode === 'direct' ? (
              <div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 font-medium shadow-2xs"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Selected delivery date:{' '}
                  <span className="font-semibold text-stone-700">
                    {formatDisplayDate(dueDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 bg-rose-50/60 p-3 rounded-xl border border-rose-200/70">
                <label className="text-[11px] font-semibold text-rose-900 block">
                  First Day of Last Menstrual Period (LMP):
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => handleSelectLmp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium shadow-2xs"
                  required
                />
                <p className="text-[11px] text-stone-600">
                  Calculated Due Date (+280 days):{' '}
                  <span className="font-bold text-rose-700">
                    {formatDisplayDate(effectiveDueDate, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>
            )}

            {/* Live Gestational Age & Baby Size Preview Card */}
            <div className="p-3.5 bg-gradient-to-br from-rose-50/90 via-amber-50/60 to-white rounded-2xl border border-rose-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center text-xl shadow-2xs border border-rose-100">
                    {gestationalInfo.sizeEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-stone-900">
                        {gestationalInfo.formattedWeek}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Trimester {gestationalInfo.trimester}
                      </span>
                    </div>
                    <span className="text-xs text-stone-600 font-medium">
                      Baby is the size of a{' '}
                      <strong className="text-stone-900 font-bold">{gestationalInfo.sizeComparison}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-700 block">
                    {gestationalInfo.daysRemaining > 0
                      ? `${gestationalInfo.daysRemaining} days left`
                      : 'Delivery Time!'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {gestationalInfo.progressPercent}% of 40 weeks
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, gestationalInfo.progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4. Optional Healthcare & Doctor Info (Collapsible) */}
          <div className="pt-1 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowMedicalFields(!showMedicalFields)}
              className="w-full py-2 flex items-center justify-between text-xs font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-stone-500" />
                <span>Doctor &amp; Emergency Contact (Optional)</span>
              </span>
              {showMedicalFields ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {showMedicalFields && (
              <div className="mt-2 space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700">OB-GYN Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Bennett, MD"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-emerald-600" />
                    <span>Doctor Phone / Mobile (For 1-Tap Dial &amp; SMS)</span>
                  </label>
                  <input
                    type="tel"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="e.g. +63 917 888 1234"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                    <Building className="w-3 h-3 text-stone-500" />
                    <span>Hospital / Delivery Center</span>
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. St. Jude Women & Children Pavilion"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700">Partner / Spouse Name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Lucas"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>100% Private &amp; Offline:</strong> Your data is stored locally on your device with no registration or third-party tracking.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Begin My Pregnancy Journal 🌸</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer transition-colors"
              >
                Skip for now &amp; use demo values
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
