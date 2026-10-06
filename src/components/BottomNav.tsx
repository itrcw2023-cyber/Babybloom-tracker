import React from 'react';
import {
  CalendarDays,
  FileText,
  Pill,
  Lightbulb,
  PhoneCall
} from 'lucide-react';

export type TabType = 'dashboard' | 'notes' | 'medications' | 'suggestions';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingMedsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingMedsCount = 0
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: CalendarDays },
    { id: 'notes', label: 'Daily Notes', icon: FileText },
    { id: 'medications', label: 'Medicines', icon: Pill, badge: pendingMedsCount },
    { id: 'suggestions', label: 'Tips & Hotlines', icon: Lightbulb }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-95 relative ${
                isActive ? 'text-rose-600' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div
                className={`relative px-3.5 py-1 rounded-2xl transition-all ${
                  isActive ? 'bg-rose-100/90 text-rose-700' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'text-rose-700 font-bold' : 'text-stone-600 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
