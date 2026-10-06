/**
 * Accurate Time & Date Utilities for BabyBloom Tracker
 * Supports Phone's Native Clock, +08:00 (Philippine Standard Time / Asia/Manila),
 * and Online Network Time Synchronization.
 */

export const DEFAULT_TIMEZONE = 'Asia/Manila';

export interface TimeSyncState {
  offsetMs: number;
  lastSyncedAt: number | null;
  source: 'online' | 'device';
  isSyncing: boolean;
}

// In-memory offset & cache
let cachedOffsetMs: number = (() => {
  try {
    const saved = localStorage.getItem('bb_time_offset_ms');
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
})();

let lastSyncTimestamp: number | null = (() => {
  try {
    const saved = localStorage.getItem('bb_time_last_sync');
    return saved ? Number(saved) : null;
  } catch {
    return null;
  }
})();

export function getTimeZone(): string {
  try {
    const saved = localStorage.getItem('bb_timezone');
    if (saved) return saved;
  } catch {}
  return DEFAULT_TIMEZONE;
}

export function setTimeZone(tz: string): void {
  try {
    localStorage.setItem('bb_timezone', tz);
  } catch {}
}

/**
 * Returns the current time adjusted for any detected network drift.
 */
export function getNowDate(): Date {
  return new Date(Date.now() + cachedOffsetMs);
}

/**
 * Returns today's date formatted strictly as 'YYYY-MM-DD'
 * in the specified time zone (defaults to Asia/Manila / +08:00).
 * Prevents the UTC 1-day rollback bug caused by toISOString().
 */
export function getTodayDateString(timeZone: string = getTimeZone()): string {
  const now = getNowDate();
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(now);
  } catch {
    // Fallback if Intl timeZone fails
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Formats a Date object to 'YYYY-MM-DD' in the given timeZone
 */
export function formatDateToYYYYMMDD(date: Date, timeZone: string = getTimeZone()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Formats a YYYY-MM-DD or Date object into human-readable text
 * e.g. "Tuesday, October 6, 2026"
 */
export function formatDisplayDate(
  dateInput: string | Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  timeZone: string = getTimeZone()
): string {
  try {
    let dateObj: Date;
    if (typeof dateInput === 'string') {
      const [year, month, day] = dateInput.split('-').map(Number);
      dateObj = new Date(year, month - 1, day, 12, 0, 0); // midday to avoid daylight savings/midnight boundary
    } else {
      dateObj = dateInput;
    }

    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone
    }).format(dateObj);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats current or given time in 12-hour format with AM/PM
 * e.g. "10:15 AM"
 */
export function formatDisplayTime(
  dateInput?: Date,
  timeZone: string = getTimeZone(),
  includeSeconds = false
): string {
  const d = dateInput || getNowDate();
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: true
    }).format(d);
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Shift a 'YYYY-MM-DD' string forward or backward by N days
 * safely without timezone conversion issues.
 */
export function shiftDateString(dateStr: string, daysDelta: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + daysDelta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Parse a 'YYYY-MM-DD' string safely into a Date object representing local noon
 */
export function parseDateStringToLocalNoon(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Online Time Synchronization
 * Queries server endpoint `/api/time` or reliable public time API
 * and calibrates the clock offset to +08:00 accurately.
 */
export async function syncOnlineTime(): Promise<{
  success: boolean;
  offsetMs: number;
  serverTime: string;
  source: string;
}> {
  if (typeof window === 'undefined') {
    return { success: false, offsetMs: 0, serverTime: '', source: 'none' };
  }

  const startTime = Date.now();

  // 1. Try local server endpoint
  try {
    const res = await fetch('/api/time', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const endTime = Date.now();
      const roundTrip = (endTime - startTime) / 2;
      const serverTimestamp = typeof data.timestamp === 'number' ? data.timestamp : new Date(data.utc).getTime();
      const calculatedOffset = (serverTimestamp + roundTrip) - endTime;

      cachedOffsetMs = calculatedOffset;
      lastSyncTimestamp = Date.now();
      localStorage.setItem('bb_time_offset_ms', String(calculatedOffset));
      localStorage.setItem('bb_time_last_sync', String(lastSyncTimestamp));

      return {
        success: true,
        offsetMs: calculatedOffset,
        serverTime: data.formatted?.time || new Date(serverTimestamp).toLocaleTimeString(),
        source: 'server'
      };
    }
  } catch {
    // Continue to external fallback
  }

  // 2. Try worldtimeapi fallback for Asia/Manila (GMT+8)
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Manila', {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const endTime = Date.now();
      const serverTimestamp = data.unixtime * 1000;
      const calculatedOffset = serverTimestamp - endTime;

      cachedOffsetMs = calculatedOffset;
      lastSyncTimestamp = Date.now();
      localStorage.setItem('bb_time_offset_ms', String(calculatedOffset));
      localStorage.setItem('bb_time_last_sync', String(lastSyncTimestamp));

      return {
        success: true,
        offsetMs: calculatedOffset,
        serverTime: new Date(serverTimestamp).toLocaleTimeString(),
        source: 'worldtimeapi'
      };
    }
  } catch {}

  // 3. Fallback: device's local clock is already used
  return {
    success: false,
    offsetMs: cachedOffsetMs,
    serverTime: formatDisplayTime(),
    source: 'device'
  };
}

export function getLastSyncTime(): number | null {
  return lastSyncTimestamp;
}

export function getCachedOffsetMs(): number {
  return cachedOffsetMs;
}

export interface GestationalAgeResult {
  weeks: number;
  days: number;
  daysRemaining: number;
  daysElapsed: number;
  trimester: 1 | 2 | 3;
  progressPercent: number;
  isOverdue: boolean;
  sizeComparison: string;
  sizeEmoji: string;
  formattedWeek: string;
}

const WEEKLY_BABY_SIZES: Record<number, { comparison: string; emoji: string }> = {
  1: { comparison: 'Microscopic Spark', emoji: '✨' },
  2: { comparison: 'Fertilized Ovum', emoji: '💫' },
  3: { comparison: 'Tiny Blastocyst', emoji: '🔬' },
  4: { comparison: 'Poppy Seed', emoji: '🌱' },
  5: { comparison: 'Sesame Seed', emoji: '🌰' },
  6: { comparison: 'Lentil', emoji: '🫘' },
  7: { comparison: 'Blueberry', emoji: '🫐' },
  8: { comparison: 'Raspberry', emoji: '🍓' },
  9: { comparison: 'Green Olive', emoji: '🫒' },
  10: { comparison: 'Prune / Kumquat', emoji: '🍊' },
  11: { comparison: 'Lime', emoji: '🍋' },
  12: { comparison: 'Plum', emoji: '🍑' },
  13: { comparison: 'Lemon', emoji: '🍋' },
  14: { comparison: 'Kiwi Fruit', emoji: '🥝' },
  15: { comparison: 'Navel Orange', emoji: '🍊' },
  16: { comparison: 'Avocado', emoji: '🥑' },
  17: { comparison: 'Pomegranate', emoji: '🍎' },
  18: { comparison: 'Bell Pepper', emoji: '🫑' },
  19: { comparison: 'Mango', emoji: '🥭' },
  20: { comparison: 'Banana', emoji: '🍌' },
  21: { comparison: 'Carrot', emoji: '🥕' },
  22: { comparison: 'Papaya / Coconut', emoji: '🥥' },
  23: { comparison: 'Grapefruit', emoji: '🍊' },
  24: { comparison: 'Ear of Corn', emoji: '🌽' },
  25: { comparison: 'Acorn Squash', emoji: '🎃' },
  26: { comparison: 'Zucchini', emoji: '🥒' },
  27: { comparison: 'Cauliflower', emoji: '🥦' },
  28: { comparison: 'Eggplant', emoji: '🍆' },
  29: { comparison: 'Butternut Squash', emoji: '🥔' },
  30: { comparison: 'Cabbage', emoji: '🥬' },
  31: { comparison: 'Coconut', emoji: '🥥' },
  32: { comparison: 'Jicama / Kale', emoji: '🥬' },
  33: { comparison: 'Pineapple', emoji: '🍍' },
  34: { comparison: 'Cantaloupe', emoji: '🍈' },
  35: { comparison: 'Honeydew Melon', emoji: '🍈' },
  36: { comparison: 'Romaine Lettuce', emoji: '🥗' },
  37: { comparison: 'Winter Melon', emoji: '🍈' },
  38: { comparison: 'Pumpkin', emoji: '🎃' },
  39: { comparison: 'Mini Watermelon', emoji: '🍉' },
  40: { comparison: 'Watermelon', emoji: '🍉' },
  41: { comparison: 'Sweet Pumpkin', emoji: '🎃' },
  42: { comparison: 'Full Bloom Baby', emoji: '🌸' }
};

/**
 * Returns the baby size comparison and emoji for a given gestational week (1 to 42)
 */
export function getBabySizeComparison(week: number): { comparison: string; emoji: string } {
  const clampedWeek = Math.max(1, Math.min(42, Math.round(week)));
  return WEEKLY_BABY_SIZES[clampedWeek] || { comparison: 'Watermelon', emoji: '🍉' };
}

/**
 * Accurately calculate gestational age from an estimated due date string (YYYY-MM-DD)
 */
export function calculateGestationalAge(
  dueDateStr: string,
  referenceDateStr: string = getTodayDateString()
): GestationalAgeResult {
  try {
    const dueTime = parseDateStringToLocalNoon(dueDateStr).getTime();
    const refTime = parseDateStringToLocalNoon(referenceDateStr).getTime();
    const diffMs = dueTime - refTime;
    const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const daysElapsed = 280 - daysRemaining;

    let weeks = Math.floor(daysElapsed / 7);
    let days = daysElapsed % 7;

    if (days < 0) days += 7;

    const clampedWeek = Math.max(1, Math.min(42, weeks));
    const trimester: 1 | 2 | 3 = clampedWeek <= 12 ? 1 : clampedWeek <= 27 ? 2 : 3;
    const progressPercent = Math.max(0, Math.min(100, Math.round((Math.max(0, daysElapsed) / 280) * 100)));
    const size = getBabySizeComparison(clampedWeek);

    return {
      weeks: clampedWeek,
      days: Math.max(0, Math.min(6, days)),
      daysRemaining,
      daysElapsed,
      trimester,
      progressPercent,
      isOverdue: daysRemaining < 0,
      sizeComparison: size.comparison,
      sizeEmoji: size.emoji,
      formattedWeek: `Week ${clampedWeek}${days > 0 ? ` + ${days}d` : ''}`
    };
  } catch {
    return {
      weeks: 22,
      days: 0,
      daysRemaining: 126,
      daysElapsed: 154,
      trimester: 2,
      progressPercent: 55,
      isOverdue: false,
      sizeComparison: 'Papaya',
      sizeEmoji: '🥥',
      formattedWeek: 'Week 22'
    };
  }
}

/**
 * Calculates estimated due date (EDD) from Last Menstrual Period (LMP)
 * Standard Naegele's rule: LMP + 280 days (40 weeks)
 */
export function calculateDueDateFromLMP(lmpDateStr: string): string {
  return shiftDateString(lmpDateStr, 280);
}

