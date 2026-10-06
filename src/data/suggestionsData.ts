import { HospitalBagItem } from '../types/pregnancy';

export interface SymptomRemedy {
  symptom: string;
  category: 'digestive' | 'musculoskeletal' | 'energy' | 'circulation';
  remedy: string[];
  safeFoods: string[];
  whenToCallDoctor: string;
}

export interface TrimesterGuide {
  trimester: 1 | 2 | 3;
  weeks: string;
  focus: string;
  dos: string[];
  donts: string[];
  recommendedFoods: string[];
}

export const symptomRemedies: SymptomRemedy[] = [
  {
    symptom: 'Morning Sickness & Nausea',
    category: 'digestive',
    remedy: [
      'Keep plain crackers, dry toast, or almonds on your bedside table to eat before getting out of bed.',
      'Sip fresh ginger tea, peppermint water, or suck on natural sour citrus drops.',
      'Eat small, nutrient-dense mini-meals every 2 hours rather than 3 large meals.',
      'Take prenatal vitamins with dinner or right before bed rather than in the morning on an empty stomach.'
    ],
    safeFoods: ['Dry toast', 'Crackers', 'Ginger tea', 'Cold watermelon slices', 'Bone broth'],
    whenToCallDoctor: 'If you cannot keep liquids down for 24 hours, experience rapid weight loss, or feel severely lightheaded.'
  },
  {
    symptom: 'Heartburn & Acid Reflux',
    category: 'digestive',
    remedy: [
      'Elevate your head and upper chest with extra pillows or a wedge pillow while sleeping.',
      'Avoid lying down for at least 2 hours after having a meal.',
      'Drink a glass of cold almond milk or oat milk to soothe stomach acidity.',
      'Wear loose-fitting clothes around your abdomen.'
    ],
    safeFoods: ['Oatmeal', 'Bananas', 'Almond milk', 'Papaya', 'Ginger tea'],
    whenToCallDoctor: 'If heartburn is accompanied by severe upper right abdominal pain or severe headaches.'
  },
  {
    symptom: 'Lower Back & Pelvic Aches',
    category: 'musculoskeletal',
    remedy: [
      'Place a supportive maternity pillow between your knees and under your belly while side-sleeping.',
      'Practice gentle prenatal yoga poses: Cat-Cow stretch, Child’s Pose with knees wide.',
      'Wear a supportive pregnancy belly band during long walks or standing periods.',
      'Use warm (not hot) compresses on your lower back for 15 minutes.'
    ],
    safeFoods: ['Magnesium-rich pumpkin seeds', 'Chia seeds', 'Spinach', 'Greek yogurt'],
    whenToCallDoctor: 'If back pain is sharp, rhythmic, or accompanied by cramping or spotting.'
  },
  {
    symptom: 'Fatigue & Exhaustion',
    category: 'energy',
    remedy: [
      'Listen to your body without guilt; take a 20-30 minute power nap mid-afternoon.',
      'Stay properly hydrated—mild dehydration often mimics intense fatigue.',
      'Have iron-rich snacks paired with vitamin C (e.g. spinach salad with lemon dressing, dried apricots).',
      'Take a brisk, gentle 10-minute walk in natural sunlight to reset circadian rhythms.'
    ],
    safeFoods: ['Lentils', 'Spinach', 'Oranges', 'Hard-boiled eggs', 'Berries with Greek yogurt'],
    whenToCallDoctor: 'If fatigue feels overwhelming, extreme, or accompanied by pale skin and dizziness (could be anemia).'
  },
  {
    symptom: 'Leg & Calf Cramps (Charley Horse)',
    category: 'musculoskeletal',
    remedy: [
      'Flex your foot upward toward your shin immediately when a calf spasm begins—never point toes downward.',
      'Perform gentle calf stretches against a wall before bedtime.',
      'Ensure adequate daily intake of calcium, potassium, and magnesium.',
      'Take warm baths with Epsom salts in the evening.'
    ],
    safeFoods: ['Bananas', 'Avocados', 'Sweet potatoes', 'Coconut water', 'Almonds'],
    whenToCallDoctor: 'If you notice localized swelling, warmth, or redness in one calf (needs evaluation for DVT).'
  },
  {
    symptom: 'Swollen Feet & Ankles (Edema)',
    category: 'circulation',
    remedy: [
      'Elevate your feet above heart level for 20 minutes twice a day.',
      'Drink plenty of clean water—counterintuitively, hydration helps flush out excess retained fluid.',
      'Avoid standing or sitting in one stationary position for extended hours.',
      'Wear gentle graduated compression socks during travel or daytime errands.'
    ],
    safeFoods: ['Cucumber', 'Celery', 'Watermelon', 'Citrus water', 'Herbal dandelion leaf tea (mild)'],
    whenToCallDoctor: 'Sudden, drastic swelling in your face or hands, especially accompanied by blurred vision.'
  }
];

export const trimesterGuides: TrimesterGuide[] = [
  {
    trimester: 1,
    weeks: 'Weeks 1 – 12',
    focus: 'Cellular Foundation & Gentle Adaptation',
    dos: [
      'Take daily prenatal vitamin containing at least 400-800mcg folic acid or methylfolate.',
      'Schedule your 8-week dating ultrasound and initial blood work panel.',
      'Drink 8-10 glasses of water daily and rest whenever your body asks for it.',
      'Stay cool; avoid hot tubs, saunas, and intense heat.'
    ],
    donts: [
      'Do not consume unpasteurized cheeses, raw meats, raw shellfish, or unpasteurized juices.',
      'Avoid high-mercury predatory fish (swordfish, king mackerel, tilefish).',
      'Do not start strenuous new high-impact contact sports.',
      'Limit caffeine to under 200mg per day (roughly 1 standard cup of coffee).'
    ],
    recommendedFoods: [
      'Spinach & Dark Leafy Greens (folate)',
      'Eggs & Avocado (choline & healthy fats)',
      'Ginger & Lemons (nausea management)',
      'Lentils & Beans (iron and fiber)'
    ]
  },
  {
    trimester: 2,
    weeks: 'Weeks 13 – 27',
    focus: 'Golden Trimester: Growth & Movement',
    dos: [
      'Begin sleeping on your left side to maximize placental blood flow.',
      'Schedule your detailed 20-week anatomy ultrasound scan.',
      'Incorporate prenatal core & pelvic floor exercises (Kegels, gentle bridges).',
      'Keep a bump photo progression each week to document your story.'
    ],
    donts: [
      'Avoid lying flat on your back for prolonged periods after week 20 (compresses vena cava).',
      'Do not skip dental checkups—gum sensitivity is common due to hormones.',
      'Avoid heavy lifting (over 25 lbs / 11 kg) without bending at knees.',
      'Do not rush when standing up quickly to avoid postural dizziness.'
    ],
    recommendedFoods: [
      'Salmon & Chia seeds (Omega-3 DHA for baby’s brain)',
      'Greek yogurt & Almonds (Calcium & protein for bone growth)',
      'Berries & Citrus (Vitamin C to absorb plant iron)',
      'Sweet potatoes & Carrots (Beta-carotene & Vitamin A)'
    ]
  },
  {
    trimester: 3,
    weeks: 'Weeks 28 – 40+',
    focus: 'Nesting, Baby Fat Storage & Birth Preparation',
    dos: [
      'Practice regular kick counts: expect 10 movements in under 2 hours during active windows.',
      'Pack your hospital bag around week 34-36 using the in-app checklist.',
      'Prepare and freeze nutritious post-partum meals.',
      'Review your birth preferences and discuss them calmly with your OB or midwife.'
    ],
    donts: [
      'Do not ignore sudden headaches, vision changes, or sudden facial swelling.',
      'Avoid long road trips or air travel after week 36 without doctor sign-off.',
      'Do not panic if due date passes—normal pregnancies can safely range between 37 and 42 weeks.',
      'Do not hesitate to call your maternity triage unit if you notice decreased fetal movements.'
    ],
    recommendedFoods: [
      'Dates (studies suggest 6 dates daily from week 36 supports cervical ripening)',
      'Oatmeal & Prunes (gentle fiber to ease late-stage constipation)',
      'Bone broths & Warm stews (nourishing and easy to digest)',
      'Pumpkin seeds & Magnesium-rich nuts (ease leg cramps)'
    ]
  }
];

export const defaultHospitalBagItems: HospitalBagItem[] = [
  // For Mom
  { id: 'hb-1', category: 'mom', item: 'Comfortable maternity robe or loose button-down nightgown', checked: true },
  { id: 'hb-2', category: 'mom', item: 'Warm non-skid gripper socks and supportive slippers', checked: true },
  { id: 'hb-3', category: 'mom', item: 'Nursing bras (2) & comfortable high-waist cotton underwear', checked: true },
  { id: 'hb-4', category: 'mom', item: 'Lip balm, hair ties, and gentle hydrating face mist', checked: true },
  { id: 'hb-5', category: 'mom', item: 'Going-home loose outfit (about 6-month pregnancy size)', checked: false },
  { id: 'hb-6', category: 'mom', item: 'Postpartum peri bottle & organic maternity pads', checked: false },
  { id: 'hb-7', category: 'mom', item: 'Toiletries (toothbrush, deodorant, shampoo, dry shampoo)', checked: false },
  
  // For Baby
  { id: 'hb-8', category: 'baby', item: 'Infant car seat (installed in car and inspected)', checked: true },
  { id: 'hb-9', category: 'baby', item: 'Coming-home outfit (newborn and 0-3 month sizes)', checked: true },
  { id: 'hb-10', category: 'baby', item: 'Soft swaddle blankets (2)', checked: true },
  { id: 'hb-11', category: 'baby', item: 'Baby beanie hat & scratch mittens', checked: true },
  { id: 'hb-12', category: 'baby', item: 'Pack of gentle newborn wipes and newborn diapers', checked: false },

  // For Partner
  { id: 'hb-13', category: 'partner', item: 'Extra long phone charger cables (10ft / 3m)', checked: true },
  { id: 'hb-14', category: 'partner', item: 'Comfortable clothes, hoodie, and change of socks', checked: false },
  { id: 'hb-15', category: 'partner', item: 'High-protein snacks & reusable water bottles', checked: true },
  { id: 'hb-16', category: 'partner', item: 'Camera or phone with cleared storage space', checked: false },

  // Documents
  { id: 'hb-17', category: 'documents', item: 'Photo ID, health insurance cards, and hospital registration forms', checked: true },
  { id: 'hb-18', category: 'documents', item: 'Printed birth preferences / plan copies (3-4)', checked: false },
  { id: 'hb-19', category: 'documents', item: 'Pediatrician name and contact information', checked: false }
];
