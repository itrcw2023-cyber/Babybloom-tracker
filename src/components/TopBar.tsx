import React from 'react';
import {
  PhoneCall,
  Lightbulb,
  Heart,
  Settings,
  CalendarDays,
  FileText,
  Pill,
  MessageSquare,
  UserCheck,
  Clock,
  RefreshCw,
  Wifi
} from 'lucide-react';
import { UserProfile } from '../types/pregnancy';
import { useLiveClock } from '../utils/useLiveClock';

export type TabType = 'dashboard' | 'notes' | 'medications' | 'suggestions';

interface TopBarProps {
  profile: UserProfile;
  selectedDate: string;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingMedsCount?: number;
  onOpenEmergency911: () => void;
  onOpenSuggestions: () => void;
  onOpenProfile: () => void;
  onOpenInstall?: () => void;
  isPWAInstalled?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  selectedDate,
  currentTab,
  onSelectTab,
  pendingMedsCount = 0,
  onOpenEmergency911,
  onOpenSuggestions,
  onOpenProfile,
  onOpenInstall,
  isPWAInstalled = false
}) => {
  const clock = useLiveClock();

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Today', icon: CalendarDays },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'medications', label: 'Meds', icon: Pill, badge: pendingMedsCount },
    { id: 'suggestions', label: 'Tips', icon: Lightbulb }
  ];

  const doctorPhoneClean = profile.doctorPhone ? profile.doctorPhone.replace(/\s+/g, '') : '';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Top / Left Row: Brand + Actions on mobile, Brand on desktop */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Brand Identity */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 cursor-pointer group select-none min-w-0"
            title="Click to edit profile, due date, timezone & OB contact"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-stone-900 tracking-tight leading-tight truncate">
                  BabyBloom
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 shrink-0">
                  Wk {profile.currentWeek}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-stone-500 font-medium truncate flex items-center gap-1">
                <span>{profile.name}</span>
                <span>·</span>
                <span className="text-stone-700 font-semibold">{clock.timeStr}</span>
                <span className="text-[10px] text-stone-400 font-mono">+08</span>
              </div>
            </div>
          </div>

          {/* Action buttons on Mobile (OB Call/Text + 911 + Settings) */}
          <div className="flex items-center gap-1.5 sm:hidden shrink-0">
            {profile.doctorPhone ? (
              <a
                href={`tel:${doctorPhoneClean}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-xs"
                title={`Call OB: ${profile.doctorPhone}`}
                aria-label="Call OB Doctor"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>OB</span>
              </a>
            ) : (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                title="Add OB Phone"
              >
                <span>+OB</span>
              </button>
            )}

            <button
              onClick={onOpenEmergency911}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 active:scale-95 text-white font-black text-xs shadow-sm shadow-red-500/30"
              title="Emergency 911 Call & Hotlines"
              aria-label="Call 911 Emergency"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>911</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200/60"
              title="Settings & Profile"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Today, Notes, Meds, Tips) */}
        <nav className="grid grid-cols-4 sm:flex sm:items-center gap-1 bg-stone-100/90 p-1 rounded-2xl w-full sm:w-auto min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-w-0 relative ${
                  isActive
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right Actions on Desktop (OB Call / Text + 911 Call + Settings) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {/* OB Call/Text Button */}
          {profile.doctorPhone ? (
            <div className="flex items-center bg-teal-50 border border-teal-200 rounded-xl p-0.5 shadow-2xs">
              <a
                href={`tel:${doctorPhoneClean}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs active:scale-95 transition-all"
                title={`Call OB-GYN: ${profile.doctorName || 'Doctor'} (${profile.doctorPhone})`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call OB</span>
              </a>
              <a
                href={`sms:${doctorPhoneClean}?body=${encodeURIComponent(`Hello ${profile.doctorName || 'Doctor'}, this is ${profile.name} (Week ${profile.currentWeek}): `)}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-teal-800 hover:bg-teal-100 font-bold text-xs transition-all"
                title={`Text / SMS OB-GYN: ${profile.doctorPhone}`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text</span>
              </a>
            </div>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200/80 transition-all"
              title="Add your OB-GYN phone number to call and text directly"
            >
              <UserCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>+ Add OB Number</span>
            </button>
          )}

          {/* 911 Emergency Button */}
          <button
            onClick={onOpenEmergency911}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-black text-xs shadow-sm shadow-red-500/30 transition-all cursor-pointer"
            title="Emergency 911 Call & Maternal Hotlines"
            aria-label="Call 911 Emergency"
          >
            <PhoneCall className="w-4 h-4 animate-pulse shrink-0" />
            <span className="tracking-wide">911</span>
          </button>

          {/* Live Clock & Online Sync Pill on Desktop */}
          <button
            onClick={() => clock.syncNow()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/90 text-stone-700 text-xs font-semibold border border-stone-200/80 transition-all cursor-pointer active:scale-95"
            title="Time zone: +08:00 (Philippine Standard Time). Tap to sync with online network time."
          >
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-mono font-bold text-stone-800">{clock.timeStr}</span>
            <span className="text-[10px] text-stone-500 font-mono">+08</span>
            {clock.isSyncing ? (
              <RefreshCw className="w-3 h-3 text-rose-500 animate-spin" />
            ) : clock.isOnline ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online Synced (+08:00)" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Device Clock" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:scale-95 transition-all border border-stone-200/60"
            title="Settings, Due Date & Contacts"
            aria-label="Profile Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
