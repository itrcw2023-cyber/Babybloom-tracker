export interface UserProfile {
  name: string;
  babyNickname: string;
  dueDate: string; // YYYY-MM-DD
  conceptionDate?: string;
  currentWeek: number;
  doctorName: string;
  doctorPhone?: string; // OB-GYN Phone number for 1-tap Call & Text (SMS)
  hospitalName: string;
  partnerName?: string;
  partnerPhone?: string;
  avatarUrl?: string;
  bloodType?: string;
}

export interface WeeklyInfo {
  week: number;
  trimester: 1 | 2 | 3;
  babySizeComparison: string;
  fruitEmoji: string;
  babyLengthCm: number;
  babyWeightGrams: number;
  babyDevelopment: string[];
  maternalChanges: string[];
  weeklySuggestions: string[];
  doctorChecklist: string[];
}

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  week: number;
  symptoms: string[];
  severity: 1 | 2 | 3 | 4 | 5; // 1: Mild to 5: Severe
  mood: 'peaceful' | 'energetic' | 'tired' | 'anxious' | 'glowing';
  notes: string;
  waterIntakeGlasses: number;
  vitaminsTaken: boolean;
}

export interface WeightLog {
  id: string;
  date: string;
  week: number;
  weightKg: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  location: string;
  dateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  week: number;
  notes: string;
  questions: string[];
  completed: boolean;
  reminderSet: boolean;
}

export interface PhotoAnalysis {
  title: string;
  categoryDetected?: string;
  summary: string;
  keyObservations: string[];
  sweetMilestoneNote: string;
  helpfulSuggestions: string[];
  medicalDisclaimer: string;
  analyzedAt?: string;
}

export interface PhotoMoment {
  id: string;
  date: string;
  week: number;
  title: string;
  caption: string;
  imageUrl: string;
  tag: 'ultrasound' | 'bump' | 'nursery' | 'celebration' | 'prescription' | 'other';
  analysis?: PhotoAnalysis;
}

// Prescription Document with photo
export interface PrescriptionDoc {
  id: string;
  title: string;
  doctorName: string;
  clinicOrHospital: string;
  dateIssued: string; // YYYY-MM-DD
  imageUrl: string; // Photo of the doctor's prescription
  notes?: string;
  medicationsIncluded?: string[];
  createdAt: string;
}

// Vitamin & Medicine Schedule item
export interface MedicationItem {
  id: string;
  name: string;
  dosage: string; // e.g. "400 mcg", "1 capsule", "500 mg"
  category: 'vitamin' | 'iron' | 'calcium' | 'folic_acid' | 'dha' | 'prescription' | 'supplement' | 'other';
  frequency: 'once_daily' | 'twice_daily' | 'three_daily' | 'as_needed' | 'weekly';
  scheduledTimes: string[]; // ["08:00", "20:00"] in 24h format
  instructions?: string; // e.g., "Take after breakfast with water", "Do not take with milk"
  doctorName?: string;
  pillPhotoUrl?: string; // Optional picture of the actual medicine/vitamin bottle/pill
  prescriptionId?: string; // Optional linked prescription doc id
  isActive: boolean;
  reminderEnabled: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

// Medication Intake Log (Taken, Missed, Snoozed, Skipped)
export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  date: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  takenAt?: string; // HH:mm or ISO
  status: 'taken' | 'missed' | 'snoozed' | 'skipped';
  notes?: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  time: string; // HH:mm
  type: 'vitamin' | 'water' | 'kick' | 'appointment' | 'weekly-milestone' | 'medication-missed';
}

export interface HospitalBagItem {
  id: string;
  category: 'mom' | 'baby' | 'partner' | 'documents';
  item: string;
  checked: boolean;
}

export interface KickSession {
  id: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  totalKicks: number;
  notes?: string;
}
