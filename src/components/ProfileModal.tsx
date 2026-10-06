import React, { useState } from 'react';
import { UserProfile } from '../types/pregnancy';
import {
  X,
  Heart,
  User,
  Calendar,
  Stethoscope,
  Building,
  RotateCcw,
  Sparkles,
  HardDrive,
  Download,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Clock,
  RefreshCw,
  Globe,
  Baby
} from 'lucide-react';
import { useLiveClock } from '../utils/useLiveClock';
import { calculateGestationalAge } from '../utils/dateTime';
import { MotherBabyLogo } from './MotherBabyLogo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onStartFresh?: () => void;
  onOpenOnboarding?: () => void;
  onLoadSampleData?: () => void;
  storageUsage?: string;
  onOpenInstall?: () => void;
  onOpenBackup?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onStartFresh,
  onOpenOnboarding,
  onLoadSampleData,
  storageUsage = '0 KB',
  onOpenInstall,
  onOpenBackup
}) => {
  const clock = useLiveClock();
  const [name, setName] = useState(profile.name);
  const [babyNickname, setBabyNickname] = useState(profile.babyNickname);
  const [dueDate, setDueDate] = useState(profile.dueDate);
  const [doctorName, setDoctorName] = useState(profile.doctorName);
  const [doctorPhone, setDoctorPhone] = useState(profile.doctorPhone || '');
  const [hospitalName, setHospitalName] = useState(profile.hospitalName);
  const [partnerName, setPartnerName] = useState(profile.partnerName || '');
  const [partnerPhone, setPartnerPhone] = useState(profile.partnerPhone || '');
  const [confirmFresh, setConfirmFresh] = useState(false);

  if (!isOpen) return null;

  // Auto calculate current gestational week from due date using unified dateTime helper
  const gestationalAge = calculateGestationalAge(dueDate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name,
      babyNickname,
      dueDate,
      currentWeek: gestationalAge.weeks,
      doctorName,
      doctorPhone,
      hospitalName,
      partnerName,
      partnerPhone
    });
    onClose();
  };

  const handleTriggerFresh = () => {
    if (!confirmFresh) {
      setConfirmFresh(true);
      return;
    }
    if (onStartFresh) {
      onStartFresh();
      setConfirmFresh(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MotherBabyLogo size={34} />
            <div>
              <h3 className="text-sm font-bold text-stone-900">BabyBloom Tracker Settings</h3>
              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <span>Personal Pregnancy Monitor</span>
                <span>·</span>
                <span className="font-semibold text-rose-600">Dev: OjrE</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* App Info & Developer Card */}
          <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/80 p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">BabyBloom Tracker</span>
                <span className="text-[11px] text-stone-600">Personal &amp; Private Maternal Monitor</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-rose-700 font-bold block">Developer</span>
                <span className="text-xs font-mono font-bold text-stone-900 bg-white/80 px-2 py-0.5 rounded-md border border-rose-200">
                  OjrE
                </span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Mama&apos;s Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Baby&apos;s Nickname</label>
                <input
                  type="text"
                  required
                  value={babyNickname}
                  onChange={(e) => setBabyNickname(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">Estimated Due Date (EDD)</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white font-mono"
              />
              <span className="text-[10px] text-rose-600 mt-1 block font-medium">
                Auto-calculates current week: ~{gestationalAge.formattedWeek} ({gestationalAge.daysRemaining > 0 ? `${gestationalAge.daysRemaining} days left` : 'Due!'}) · Baby size: {gestationalAge.sizeComparison} {gestationalAge.sizeEmoji}
              </span>
            </div>

            {/* OB-GYN Doctor Info & Contact */}
            <div className="bg-teal-50/70 border border-teal-200/90 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>OB-GYN Doctor &amp; Contact (Call / Text)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-teal-900 block mb-1">Doctor / OB-GYN Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Bennett, MD"
                    className="w-full text-xs p-2 rounded-xl border border-teal-200 bg-white focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-teal-900 block mb-1">OB Phone (Call / Text)</label>
                  <input
                    type="tel"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="e.g. +63 917 888 1234"
                    className="w-full text-xs p-2 rounded-xl border border-teal-200 bg-white focus:outline-teal-500 font-mono"
                  />
                </div>
              </div>
              <p className="text-[10px] text-teal-700">
                Adding your OB&apos;s phone number enables 1-tap direct Call and SMS Texting across the header, dashboard, and emergency hotlines.
              </p>
            </div>

            {/* Partner & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Partner / Companion Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Lucas"
                  className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Partner Phone Number</label>
                <input
                  type="tel"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  placeholder="e.g. +63 918 555 6789"
                  className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">Hospital / Birth Pavilion</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. St. Jude Women & Children Pavilion"
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                Save Profile &amp; OB Contact
              </button>
            </div>
          </form>

          {/* Date, Time & Timezone (+08:00) Settings */}
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <span className="text-xs font-bold text-stone-800 block">Date &amp; Time Synchronization (+08:00)</span>

            <div className="p-3 bg-stone-50 border border-stone-200/90 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-rose-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span className="text-xs font-bold text-stone-900 font-mono">{clock.timeStr}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                        +08:00 (GMT+8)
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium block">
                      {clock.fullDateStr}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => clock.syncNow()}
                  disabled={clock.isSyncing}
                  className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Synchronize clock with online Philippine Standard Time"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${clock.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{clock.isSyncing ? 'Syncing...' : 'Sync with Internet'}</span>
                </button>
              </div>

              <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-stone-400" />
                  <span>Philippine Standard Time (Asia/Manila)</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{clock.isOnline ? 'Online Synced' : 'Device Clock'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Fresh Start & Export / Backup Options */}
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <span className="text-xs font-bold text-stone-800 block">Personal Data &amp; Setup</span>

            {/* Re-run Welcome Onboarding Setup */}
            {onOpenOnboarding && (
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-rose-950 flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-rose-600" />
                    <span>Re-run Welcome Setup Wizard</span>
                  </span>
                  <span className="text-[10px] text-rose-800/80 block mt-0.5">
                    Update due date, mother&apos;s name, and baby&apos;s nickname using the guided fresh install screen.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOnboarding();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  Open Wizard
                </button>
              </div>
            )}

            {/* Export / Backup Button */}
            {onOpenBackup && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export &amp; Backup Data</span>
                  </span>
                  <span className="text-[10px] text-emerald-800/80 block mt-0.5">
                    Export your notes, medication logs, and profile as JSON or encrypted backup.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBackup();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  Export Data
                </button>
              </div>
            )}

            {/* Start Fresh Button */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">Start Fresh (Clean Slate)</span>
                  <span className="text-[10px] text-stone-500">
                    Clears all symptom logs, weights, and photos for your own personal pregnancy.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerFresh}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    confirmFresh
                      ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  <span>{confirmFresh ? 'Confirm Reset' : 'Start Fresh'}</span>
                </button>
              </div>

              {confirmFresh && (
                <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Tap &quot;Confirm Reset&quot; to wipe all test logs and start with a 100% clean journal.</span>
                </div>
              )}
            </div>

            {/* Load Sample Demo Data Button (Optional) */}
            {onLoadSampleData && (
              <div className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl text-xs">
                <span className="text-stone-600 text-[11px]">Need to see an example dashboard?</span>
                <button
                  type="button"
                  onClick={() => {
                    onLoadSampleData();
                    onClose();
                  }}
                  className="text-xs text-rose-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>Load Sample Entries</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
