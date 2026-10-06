import { useState, useEffect, useCallback } from 'react';
import {
  getTodayDateString,
  formatDisplayTime,
  formatDisplayDate,
  syncOnlineTime,
  getLastSyncTime,
  getTimeZone,
  setTimeZone as saveTimeZone,
  DEFAULT_TIMEZONE
} from './dateTime';

export interface LiveClockInfo {
  todayStr: string;
  timeStr: string;
  fullDateStr: string;
  isOnline: boolean;
  isSynced: boolean;
  lastSyncedAt: number | null;
  timeZone: string;
  setTimeZone: (tz: string) => void;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
}

export function useLiveClock(): LiveClockInfo {
  const [timeZone, setTimeZoneState] = useState<string>(() => getTimeZone());
  const [todayStr, setTodayStr] = useState<string>(() => getTodayDateString(timeZone));
  const [timeStr, setTimeStr] = useState<string>(() => formatDisplayTime(undefined, timeZone));
  const [fullDateStr, setFullDateStr] = useState<string>(() => formatDisplayDate(getTodayDateString(timeZone), undefined, timeZone));
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => getLastSyncTime());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const updateClock = useCallback(() => {
    const currentToday = getTodayDateString(timeZone);
    setTodayStr(currentToday);
    setTimeStr(formatDisplayTime(undefined, timeZone));
    setFullDateStr(formatDisplayDate(currentToday, undefined, timeZone));
  }, [timeZone]);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncOnlineTime();
      setLastSyncedAt(getLastSyncTime());
      updateClock();
    } finally {
      setIsSyncing(false);
    }
  }, [updateClock]);

  // Tick clock every second
  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [updateClock]);

  // Listen to online / offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync on mount if online
    if (navigator.onLine && (!lastSyncedAt || Date.now() - lastSyncedAt > 1000 * 60 * 60)) {
      handleSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSync, lastSyncedAt]);

  const updateTimeZone = (newTz: string) => {
    saveTimeZone(newTz);
    setTimeZoneState(newTz);
    setTimeout(updateClock, 10);
  };

  return {
    todayStr,
    timeStr,
    fullDateStr,
    isOnline,
    isSynced: lastSyncedAt !== null && Date.now() - lastSyncedAt < 1000 * 60 * 60 * 24,
    lastSyncedAt,
    timeZone,
    setTimeZone: updateTimeZone,
    syncNow: handleSync,
    isSyncing
  };
}
