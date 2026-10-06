import {
  UserProfile,
  SymptomLog,
  WeightLog,
  Appointment,
  PhotoMoment,
  ReminderSetting,
  KickSession,
  MedicationItem,
  PrescriptionDoc,
  MedicationLog
} from '../types/pregnancy';

export const initialProfile: UserProfile = {
  name: 'Mama',
  babyNickname: 'Little Baby Bloom',
  dueDate: '2027-02-06',
  currentWeek: 22,
  doctorName: 'Dr. Sarah Bennett, MD (OB-GYN)',
  doctorPhone: '+63 917 888 1234',
  hospitalName: 'St. Jude Women & Children Pavilion',
  partnerName: 'Lucas',
  partnerPhone: '+63 918 555 6789',
  bloodType: 'O Positive',
};

export const initialMedications: MedicationItem[] = [
  {
    id: 'med-folic',
    name: 'Folic Acid + Multivitamins',
    dosage: '800 mcg',
    category: 'folic_acid',
    frequency: 'once_daily',
    scheduledTimes: ['08:00'],
    instructions: 'Take in the morning with breakfast and water. Supports healthy neural tube development.',
    doctorName: 'Dr. Sarah Bennett, MD',
    isActive: true,
    reminderEnabled: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'med-dha',
    name: 'Prenatal DHA & Omega-3',
    dosage: '200 mg DHA / 1 softgel',
    category: 'dha',
    frequency: 'once_daily',
    scheduledTimes: ['12:30'],
    instructions: 'Take with lunch. Supports fetal brain and visual development.',
    doctorName: 'Dr. Sarah Bennett, MD',
    isActive: true,
    reminderEnabled: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'med-calcium',
    name: 'Calcium Carbonate + Vitamin D3',
    dosage: '500 mg Calcium / 400 IU D3',
    category: 'calcium',
    frequency: 'once_daily',
    scheduledTimes: ['19:30'],
    instructions: 'Take after dinner. Important: Keep at least 2 hours apart from iron supplements.',
    doctorName: 'Dr. Sarah Bennett, MD',
    isActive: true,
    reminderEnabled: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'med-iron',
    name: 'Ferrous Sulfate (Iron Supplement)',
    dosage: '325 mg (65 mg elemental iron)',
    category: 'iron',
    frequency: 'once_daily',
    scheduledTimes: ['08:30'],
    instructions: 'Take with orange juice or Vitamin C to enhance absorption. Avoid dairy 1 hour before and after.',
    doctorName: 'Dr. Sarah Bennett, MD',
    isActive: true,
    reminderEnabled: true,
    createdAt: '2026-10-01'
  }
];

export const initialPrescriptions: PrescriptionDoc[] = [
  {
    id: 'rx-1',
    title: '2nd Trimester Routine Prenatal Prescription',
    doctorName: 'Dr. Sarah Bennett, MD - OB-GYN',
    clinicOrHospital: 'St. Jude Women Pavilion, Room 304',
    dateIssued: '2026-09-20',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780"><rect width="600" height="780" fill="%23fcfdfa" stroke="%23cbd5e1" stroke-width="2"/><rect x="25" y="25" width="550" height="730" fill="none" stroke="%23e2e8f0" stroke-width="1.5" stroke-dasharray="4 4"/><text x="50" y="70" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="%230f766e">ST. JUDE WOMEN &amp; MATERNITY CLINIC</text><text x="50" y="95" font-family="system-ui, sans-serif" font-size="12" fill="%2364748b">Suite 304 · Tel: (555) 019-2831 · Lic # OB-88942</text><line x1="50" y1="110" x2="550" y2="110" stroke="%230f766e" stroke-width="2"/><text x="50" y="140" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="%23334155">Patient: Mama (G1P0 · Week 22)</text><text x="400" y="140" font-family="system-ui, sans-serif" font-size="13" fill="%2364748b">Date: Sept 20, 2026</text><text x="50" y="195" font-family="Georgia, serif" font-size="36" font-style="italic" font-weight="bold" fill="%230f766e">Rx</text><text x="75" y="240" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%231e293b">1. Prenatal Multivitamin + Folic Acid 800mcg</text><text x="95" y="260" font-family="system-ui, sans-serif" font-size="12" fill="%23475569">Sig: Take 1 capsule orally once daily with morning breakfast.</text><text x="75" y="300" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%231e293b">2. Prenatal DHA 200mg softgel</text><text x="95" y="320" font-family="system-ui, sans-serif" font-size="12" fill="%23475569">Sig: Take 1 softgel daily with lunch or midday meal.</text><text x="75" y="360" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%231e293b">3. Calcium Carbonate 500mg + Vit D3</text><text x="95" y="380" font-family="system-ui, sans-serif" font-size="12" fill="%23475569">Sig: 1 tab daily at bedtime. Separate from Iron by 2 hrs.</text><text x="75" y="420" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%231e293b">4. Ferrous Sulfate 325mg (Elemental Iron 65mg)</text><text x="95" y="440" font-family="system-ui, sans-serif" font-size="12" fill="%23475569">Sig: 1 tab daily with Vit C/Citrus juice on an empty stomach.</text><rect x="50" y="490" width="500" height="90" rx="8" fill="%23f0fdf4" stroke="%23bbf7d0"/><text x="70" y="520" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23166534">Doctor Instructions &amp; Safety Reminders:</text><text x="70" y="542" font-family="system-ui, sans-serif" font-size="11.5" fill="%2315803d">• Drink at least 8 to 10 glasses of water daily.</text><text x="70" y="562" font-family="system-ui, sans-serif" font-size="11.5" fill="%2315803d">• Notify clinic immediately if experiencing sudden edema or severe headaches.</text><line x1="380" y1="680" x2="540" y2="680" stroke="%23334155" stroke-width="1.5"/><text x="390" y="700" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23334155">Dr. Sarah Bennett, MD</text><text x="390" y="716" font-family="system-ui, sans-serif" font-size="10" fill="%2364748b">PRC Lic No: 0092819 / PTR # 83921</text></svg>',
    notes: 'Prescribed during regular 20-week anatomy checkup. Refills valid for 90 days.',
    medicationsIncluded: ['Folic Acid', 'Prenatal DHA', 'Calcium Carbonate + D3', 'Ferrous Sulfate'],
    createdAt: '2026-09-20'
  }
];

export const initialMedicationLogs: MedicationLog[] = [];

export const initialReminders: ReminderSetting[] = [
  {
    id: 'rem-meds',
    title: 'Missed Medicine / Vitamin Alerts',
    description: 'Instant notification if a scheduled medication or vitamin is overdue or missed',
    enabled: true,
    time: '08:00',
    type: 'medication-missed'
  },
  {
    id: 'rem-vitamins',
    title: 'Daily Prenatal Vitamin & DHA',
    description: 'Take your prenatal multivitamin with dinner or water',
    enabled: true,
    time: '20:00',
    type: 'vitamin'
  },
  {
    id: 'rem-water',
    title: 'Hydration Gentle Check-in',
    description: 'Drink a fresh glass of water to keep amniotic levels healthy',
    enabled: true,
    time: '14:00',
    type: 'water'
  },
  {
    id: 'rem-kicks',
    title: 'Evening Kick Count Window',
    description: 'Relax on your side for 15 minutes and count baby movements',
    enabled: true,
    time: '21:00',
    type: 'kick'
  },
  {
    id: 'rem-milestone',
    title: 'Sunday Weekly Milestone',
    description: 'Read baby’s new size and developmental progress for the week',
    enabled: true,
    time: '09:00',
    type: 'weekly-milestone'
  },
  {
    id: 'rem-appt',
    title: 'Doctor Appointment Alerts',
    description: 'Receive alert 24 hours prior to OB-GYN and ultrasound visits',
    enabled: true,
    time: '08:30',
    type: 'appointment'
  }
];

export const initialSymptomLogs: SymptomLog[] = [];
export const initialWeightLogs: WeightLog[] = [];
export const initialAppointments: Appointment[] = [];
export const initialPhotoMoments: PhotoMoment[] = [];
export const initialKickSessions: KickSession[] = [];

// Sample demo records if the user wants to test or preview
export const sampleDemoLogs: {
  symptoms: SymptomLog[];
  weights: WeightLog[];
  appointments: Appointment[];
  photos: PhotoMoment[];
  kicks: KickSession[];
} = {
  symptoms: [
    {
      id: 'sym-1',
      date: '2026-10-04',
      week: 22,
      symptoms: ['Gentle baby kicks', 'Mild back tightness', 'Glowing skin'],
      severity: 1,
      mood: 'peaceful',
      notes: 'Felt three consecutive little kicks after lunch! Sipped raspberry leaf tea in the afternoon.',
      waterIntakeGlasses: 7,
      vitaminsTaken: true
    }
  ],
  weights: [
    { id: 'wt-1', date: '2026-08-01', week: 13, weightKg: 58.2, notes: 'End of 1st trimester baseline' },
    { id: 'wt-2', date: '2026-09-12', week: 19, weightKg: 60.3, notes: 'Bump is showing proudly' },
    { id: 'wt-3', date: '2026-10-04', week: 22, weightKg: 61.6, notes: 'Current check-in' }
  ],
  appointments: [
    {
      id: 'apt-1',
      title: 'Routine 24-Week Prenatal Checkup',
      doctor: 'Dr. Sarah Bennett, MD',
      location: 'St. Jude Women Pavilion, Suite 304',
      dateTime: '2026-10-18T10:30',
      week: 24,
      notes: 'Fundal height measurement and fetal heartbeat Doppler check.',
      questions: [
        'Confirm prep instructions for the upcoming 1-hour glucose drink test.',
        'Check if occasional lower belly stretching aches are normal round ligament expansion.'
      ],
      completed: false,
      reminderSet: true
    }
  ],
  photos: [
    {
      id: 'photo-1',
      date: '2026-09-21',
      week: 20,
      title: '20-Week Anatomy Scan Keepsake',
      caption: 'Profile scan showing sweet button nose and tiny fingers tucked near chin.',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a1d20"/><circle cx="300" cy="200" r="140" fill="%23262a2e"/><path d="M 230 180 C 240 140 310 130 350 160 C 380 180 370 240 330 260 C 290 280 250 250 240 220 Z" fill="none" stroke="%238a99a8" stroke-width="6" stroke-linecap="round"/><circle cx="280" cy="180" r="14" fill="%23dbe4ee"/><path d="M 280 195 Q 310 215 320 250" stroke="%23adc0d4" stroke-width="4" fill="none"/><text x="40" y="50" font-family="system-ui, sans-serif" font-size="14" fill="%238a99a8" letter-spacing="1.5">ST. JUDE ULTRASOUND DEPT - WEEK 20</text><text x="40" y="365" font-family="system-ui, sans-serif" font-size="13" fill="%23dbe4ee">GA: 20w 2d · EFW: 310g · FHR: 148 bpm</text></svg>',
      tag: 'ultrasound',
      analysis: {
        title: '20-Week Fetal Facial Profile & Anatomy Scan',
        categoryDetected: 'ultrasound',
        summary: 'This ultrasound keepsake captures a clear sagittal profile view of baby at 20 weeks gestation. The cranial vault contour, facial bone alignment, nasal bridge, and upper spine curvature are well demarcated against the dark amniotic fluid space.',
        keyObservations: [
          'Clear fetal profile showing gentle nasal bone and lips.',
          'Normal acoustic shadow indicating healthy cranial and facial ossification.',
          'Heart rate marker documented at 148 bpm (healthy baseline range 110–160 bpm).',
          'Estimated fetal weight ~310 grams matching standard 20-week percentiles.'
        ],
        sweetMilestoneNote: 'At Week 20, baby can hear external voices, swallow amniotic fluid, and is developing unique tiny fingerprints!',
        helpfulSuggestions: [
          'Confirm with Dr. Bennett during your next visit that the placenta position remains high and posterior.',
          'Save this printout in your digital backup to preserve the biometric numbers (EFW 310g, GA 20w 2d).'
        ],
        medicalDisclaimer: 'This AI visual analysis is for keepsake and educational purposes only and does not constitute a formal diagnostic reading. Always discuss ultrasound reports directly with your obstetrician.',
        analyzedAt: '2026-09-21T09:30:00.000Z'
      }
    }
  ],
  kicks: [
    {
      id: 'kick-1',
      date: '2026-10-04',
      startTime: '20:15',
      durationMinutes: 14,
      totalKicks: 10,
      notes: 'Very active after eating half an apple with peanut butter!'
    }
  ]
};
