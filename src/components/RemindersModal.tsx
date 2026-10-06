import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  Droplets,
  Pill,
  Footprints,
  CalendarCheck,
  ShieldAlert
} from 'lucide-react';
import { ReminderSetting } from '../types/pregnancy';
import {
  getPushPermission,
  requestPushPermission,
  triggerPushNotification
} from '../utils/notifications';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderSetting[];
  onUpdateReminders: (updated: ReminderSetting[]) => void;
  onToggleReminder?: (id: string) => void;
  onUpdateTime?: (id: string, time: string) => void;
  onShowInAppNotification?: (title: string, body: string) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onUpdateReminders,
  onShowInAppNotification
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getPushPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermission(res);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    onUpdateReminders(updated);
  };

  const handleUpdateTime = (id: string, time: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, time } : r);
    onUpdateReminders(updated);
  };

  const handleSendTestPush = () => {
    const title = 'BabyBloom Tracker 🌸';
    const body = 'Gentle reminder: Hydrate with fresh water and check your daily prenatal vitamins!';

    triggerPushNotification(title, { body });
    if (onShowInAppNotification) {
      onShowInAppNotification(title, body);
    }

    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  const getTypeIcon = (type: ReminderSetting['type']) => {
    switch (type) {
      case 'medication-missed':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'vitamin':
        return <Pill className="w-4 h-4 text-rose-500" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'kick':
        return <Footprints className="w-4 h-4 text-amber-500" />;
      case 'appointment':
        return <CalendarCheck className="w-4 h-4 text-indigo-500" />;
      case 'weekly-milestone':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Notification &amp; Medicine Alerts</h3>
              <p className="text-[11px] text-stone-500">Scheduled reminders and missed medicine alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Permission Status Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">System Notifications</span>
                <span className="text-[11px] text-stone-500">
                  Status:{' '}
                  <strong className={
                    permission === 'granted' ? 'text-emerald-700' :
                    permission === 'denied' ? 'text-rose-700' : 'text-amber-700'
                  }>
                    {permission.toUpperCase()}
                  </strong>
                </span>
              </div>
              {permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="py-1.5 px-3 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800"
                >
                  Enable System Alerts
                </button>
              )}
            </div>

            {/* Test button */}
            <button
              onClick={handleSendTestPush}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-rose-600" />
              <span>Send Test Reminder Now</span>
            </button>

            {testSent && (
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Test notification fired! Check your screen or top toast banner.</span>
              </div>
            )}
          </div>

          {/* Reminders List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-800">Scheduled Reminders</h4>
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-center shrink-0">
                      {getTypeIcon(rem.type)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">{rem.title}</h5>
                      <p className="text-[11px] text-stone-500 leading-snug">{rem.description}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={rem.enabled}
                      onChange={() => handleToggleReminder(rem.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {/* Time picker row */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Scheduled Time
                  </span>
                  <input
                    type="time"
                    value={rem.time}
                    disabled={!rem.enabled}
                    onChange={(e) => handleUpdateTime(rem.id, e.target.value)}
                    className="p-1 rounded-md border border-stone-200 bg-stone-50 font-mono text-stone-800 disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
