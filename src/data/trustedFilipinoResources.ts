export interface TrustedResource {
  id: string;
  name: string;
  category: 'government' | 'medical' | 'parenting' | 'hotline';
  tagline: string;
  description: string;
  url?: string;
  phone?: string;
  badge: string;
  highlights: string[];
  iconType: 'doh' | 'pogs' | 'philhealth' | 'nnc' | 'smartparenting' | 'asianparent' | 'hotline' | 'mentalhealth';
}

export const TRUSTED_FILIPINO_RESOURCES: TrustedResource[] = [
  {
    id: 'doh-maternal',
    name: 'Department of Health (DOH Philippines)',
    category: 'government',
    tagline: 'Kagawaran ng Kalusugan · Official Maternal & Child Health Division',
    description: 'The national agency providing clinical standards, First 1,000 Days Program (RA 11148), maternal micronutrient guidelines (Iron-Folate, Iodine), and safe birth facilities across the Philippines.',
    url: 'https://doh.gov.ph',
    phone: '1555 / (02) 8651-7800',
    badge: 'Official Government Health',
    highlights: [
      'First 1,000 Days Program (Kalusugan at Nutrisyon ng Mag-Nanay Act)',
      'Free prenatal vitamins and vaccines at Barangay Health Centers',
      'Accredited lying-in and maternal hospital guidelines'
    ],
    iconType: 'doh'
  },
  {
    id: 'pogs',
    name: 'Philippine Obstetrical and Gynecological Society (POGS)',
    category: 'medical',
    tagline: 'Leading medical society for Filipino OB-GYNs',
    description: 'The official Philippine specialty organization for obstetricians and gynecologists, establishing clinical practice guidelines for high-risk pregnancies, ultrasounds, and maternal-fetal medicine.',
    url: 'https://pogs.org.ph',
    badge: 'Medical Specialty Board',
    highlights: [
      'Certified Filipino OB-GYN clinical guidelines',
      'Prenatal ultrasound schedule & anomaly scan standards',
      'Preeclampsia & gestational diabetes protocols'
    ],
    iconType: 'pogs'
  },
  {
    id: 'philhealth-maternity',
    name: 'PhilHealth Maternity Benefit Package',
    category: 'government',
    tagline: 'Normal Delivery & CS Benefit Packages (MCP & ANC)',
    description: 'Provides government health insurance coverage for prenatal checkups, Normal Spontaneous Delivery (NSD), Caesarean Section (CS), and Newborn Care Package (NCP).',
    url: 'https://www.philhealth.gov.ph',
    phone: '(02) 8441-7442',
    badge: 'Insurance & Coverage',
    highlights: [
      'Maternity Care Package (MCP) for prenatal & delivery',
      'Newborn Care Package (NCP) including newborn screening test & hearing test',
      'Caesarean section coverage up to ₱19,000+'
    ],
    iconType: 'philhealth'
  },
  {
    id: 'nnc-nutrition',
    name: 'National Nutrition Council (NNC Philippines)',
    category: 'government',
    tagline: 'Nutrisyon para kay Nanay at Baby · Pinggang Pinoy para sa Buntis',
    description: 'Official dietary and micronutrient guides specially formulated for Pinay mothers, promoting traditional nourishing foods like malunggay, dahon ng sili, gabi, and local citrus fruits.',
    url: 'https://www.nnc.gov.ph',
    badge: 'Diet & Nutrition Guidelines',
    highlights: [
      'Pinggang Pinoy food plate for pregnant and lactating mothers',
      'Malunggay & rich iron source food combinations for anemia prevention',
      'Safe weight gain trajectory by trimester'
    ],
    iconType: 'nnc'
  },
  {
    id: 'smart-parenting-ph',
    name: 'SmartParenting Philippines',
    category: 'parenting',
    tagline: 'Most Trusted Filipino Parenting & Pregnancy Portal',
    description: 'Leading digital publication offering OB-GYN-approved advice, hospital maternity package cost comparisons in Metro Manila and provinces, and baby registry guides.',
    url: 'https://www.smartparenting.com.ph/pregnancy',
    badge: 'Top Motherhood Portal',
    highlights: [
      'Maternity hospital package price guides across Philippine hospitals',
      'Real Pinay mom birth stories and postpartum recovery experiences',
      'Pediatrician and lactation consultant tips'
    ],
    iconType: 'smartparenting'
  },
  {
    id: 'theasianparent-ph',
    name: 'theAsianparent Philippines',
    category: 'parenting',
    tagline: 'Community & Medical Expert Guidance for Pinay Moms',
    description: 'Comprehensive Asian and Filipino maternity database featuring food safety check tools, pregnancy medicine safety lookup, and active Filipino mother support network.',
    url: 'https://ph.theasianparent.com',
    badge: 'Mom Community & Safety',
    highlights: [
      'Pinoy food safety encyclopedia (Pwede ba kainin habang buntis?)',
      'Medicine & herbal teas pregnancy safety checker',
      'Baby names with Filipino & cultural meanings'
    ],
    iconType: 'asianparent'
  },
  {
    id: 'ncmh-crisis-hotline',
    name: 'National Center for Mental Health (NCMH) Crisis Hotline',
    category: 'hotline',
    tagline: 'Postpartum Depression & Emotional Support Hotline · 24/7 Free',
    description: 'Trained psychological first-aid responders and mental health professionals offering confidential support for prenatal anxiety, postpartum blues, and maternal mental wellness.',
    phone: '1553 / 0917-899-8727 / 0966-351-4518',
    badge: '24/7 Free Helpline',
    highlights: [
      'Toll-free 24/7 hotline for postpartum depression & anxiety',
      'Confidential and empathetic Tagalog / English counselors',
      'Immediate crisis intervention for overwhelmed mothers'
    ],
    iconType: 'mentalhealth'
  },
  {
    id: 'doh-emergency-hotline',
    name: 'DOH National Emergency & Buntis Hotline',
    category: 'hotline',
    tagline: 'Direct National Emergency Hotlines for Philippine Health',
    description: 'Emergency referral and health hotline for acute labor onset, bleeding, hypertensive emergencies, or urgent maternal hospital transfers.',
    phone: '911 (National Emergency) / 1555 (DOH Hotline)',
    badge: 'Emergency Assistance',
    highlights: [
      'Dial 911 for ambulance dispatch in Philippine cities',
      'Dial 1555 for DOH health queries and hospital beds availability',
      'Philippine Red Cross Emergency Hotline: 143'
    ],
    iconType: 'hotline'
  }
];
