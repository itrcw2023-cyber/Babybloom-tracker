export interface SymptomDefinition {
  id: string;
  nameEn: string;
  nameTl: string; // Tagalog / Filipino
  descriptionEn: string;
  descriptionTl: string;
  remedyEn: string;
  remedyTl: string;
  category: 'digestive' | 'physical' | 'emotional' | 'general';
  iconEmoji: string;
}

export const FILIPINO_SYMPTOMS: SymptomDefinition[] = [
  {
    id: 'baby-kicks',
    nameEn: 'Baby Kicks & Flutter',
    nameTl: 'Pagsipa at Paggalaw ni Baby',
    descriptionEn: 'Gentle quickening, rolls, and active movement in the belly.',
    descriptionTl: 'Banayad na paggalaw, pag-ikot, at pagsipa ni baby sa loob ng tiyan.',
    remedyEn: 'Count kicks while resting on your left side in a calm environment.',
    remedyTl: 'Magpahinga nang nakatagilid sa kaliwa habang nagbibilang ng sipa.',
    category: 'general',
    iconEmoji: '🦶'
  },
  {
    id: 'morning-nausea',
    nameEn: 'Morning Nausea / Sickness',
    nameTl: 'Paglilihi / Hilahil sa Umaga',
    descriptionEn: 'Queasiness, nausea, or sensitivity to strong aromas.',
    descriptionTl: 'Pagkahilo, pakiramdam na masusuka, o pagiging maselan sa amoy (paglilihi).',
    remedyEn: 'Sip ginger tea, eat small plain crackers before getting out of bed.',
    remedyTl: 'Uminom ng salabat (ginger tea) at kumain ng biskwit bago bumangon.',
    category: 'digestive',
    iconEmoji: '🍋'
  },
  {
    id: 'heartburn',
    nameEn: 'Heartburn & Acid Reflux',
    nameTl: 'Pangangasim ng Sikmura (Heartburn)',
    descriptionEn: 'Burning sensation in chest or upper throat after eating.',
    descriptionTl: 'Mahiap na pananakit o init sa dibdib at lalamunan dulot ng acid.',
    remedyEn: 'Eat smaller, frequent meals and avoid lying down right after eating.',
    remedyTl: 'Kumain ng pakonti-konti ngunit madalas; iwasang humiga agad pagkakain.',
    category: 'digestive',
    iconEmoji: '🔥'
  },
  {
    id: 'lower-back-pain',
    nameEn: 'Lower Back & Pelvic Ache',
    nameTl: 'Pananakit ng Likod at Balakang',
    descriptionEn: 'Dull ache or stiffness in lower spine as belly expands.',
    descriptionTl: 'Pangangalay at pananakit ng ibabang bahagi ng likod at balakang.',
    remedyEn: 'Use a maternity support pillow and apply warm compresses.',
    remedyTl: 'Gumamit ng unan sa pagitan ng mga binti at maglagay ng maligamgam na bimpo.',
    category: 'physical',
    iconEmoji: '🧘‍♀️'
  },
  {
    id: 'fatigue',
    nameEn: 'Fatigue & Low Energy',
    nameTl: 'Labis na Pagkapagod at Panghihina',
    descriptionEn: 'Feeling drained as your body nourishes your growing baby.',
    descriptionTl: 'Mabilis mapagod at kawalan ng lakas habang lumalaki si baby.',
    remedyEn: 'Take 20-minute power naps and ensure adequate iron & water intake.',
    remedyTl: 'Mag-idlip ng 20 minuto, uminom ng maraming tubig, at kumain ng masustansya.',
    category: 'physical',
    iconEmoji: '💤'
  },
  {
    id: 'swollen-feet',
    nameEn: 'Swollen Feet & Ankles (Edema)',
    nameTl: 'Manas sa Paa at Bukung-bukong',
    descriptionEn: 'Fluid retention and swelling in lower extremities.',
    descriptionTl: 'Pamamaga ng mga paa dahil sa naipong tubig o fluid (manas).',
    remedyEn: 'Elevate your feet above heart level when resting; reduce high sodium.',
    remedyTl: 'Itaas ang mga paa habang nakaupo o nakahiga; bawasan ang maaalat na pagkain.',
    category: 'physical',
    iconEmoji: '🦶'
  },
  {
    id: 'braxton-hicks',
    nameEn: 'Braxton Hicks Practice Tightness',
    nameTl: 'Pamumulikat o Paninigas ng Tiyan',
    descriptionEn: 'Painless, irregular uterine muscle tightening.',
    descriptionTl: 'Panandaliang paninigas ng tiyan bilang paghahanda sa panganganak.',
    remedyEn: 'Drink a large glass of water and gently change your physical posture.',
    remedyTl: 'Uminom ng isang basong tubig at magpalit ng posisyon sa pag-upo o pagkakahiga.',
    category: 'physical',
    iconEmoji: '🤰'
  },
  {
    id: 'leg-cramps',
    nameEn: 'Leg & Calf Cramps',
    nameTl: 'Pulikat sa Binti',
    descriptionEn: 'Sudden spasms in calf muscles, especially at night.',
    descriptionTl: 'Biglaang pamumulikat o pagkirot ng kalamnan sa binti tuwing gabi.',
    remedyEn: 'Gently flex your toes upward towards your nose; ensure magnesium/calcium intake.',
    remedyTl: 'Ibanat ang mga daliri ng paa pataas at kumain ng saging o uminom ng gatas.',
    category: 'physical',
    iconEmoji: '🦵'
  },
  {
    id: 'frequent-urination',
    nameEn: 'Frequent Urination',
    nameTl: 'Madalas na Pag-ihi',
    descriptionEn: 'Increased bladder pressure from growing uterus.',
    descriptionTl: 'Madalas na pagpunta sa banyo dahil naiipit ang pantog.',
    remedyEn: 'Lean forward while urinating to empty bladder completely; stay hydrated by day.',
    remedyTl: 'Yumuko nang bahagya habang umiihi; uminom ng sapat na tubig sa araw.',
    category: 'physical',
    iconEmoji: '💧'
  },
  {
    id: 'mood-swings',
    nameEn: 'Mood Swings & Emotional Shifts',
    nameTl: 'Pabago-bagong Mood at Emosyon',
    descriptionEn: 'Hormonal surges causing sudden tears, sensitivity, or joy.',
    descriptionTl: 'Madaling maiyak, mairita, o maging emosyonal dulot ng hormones.',
    remedyEn: 'Practice prenatal breathing, talk with your partner, and rest without guilt.',
    remedyTl: 'Mag-relax, huminga nang malalim, at kausapin ang asawa o kapamilya.',
    category: 'emotional',
    iconEmoji: '🌸'
  },
  {
    id: 'food-cravings',
    nameEn: 'Food Cravings & Aversions',
    nameTl: 'Paglilihi sa Pagkain',
    descriptionEn: 'Sudden urges for specific flavors or dislike of previous favorites.',
    descriptionTl: 'Matinding pananabik sa partikular na pagkain o pagka-ayaw sa dating paborito.',
    remedyEn: 'Enjoy balanced treats and balance cravings with whole fruits and veggies.',
    remedyTl: 'Kainin ang ninanais sa katamtamang dami sabayan ng prutas at gulay.',
    category: 'digestive',
    iconEmoji: '🍓'
  },
  {
    id: 'dizziness',
    nameEn: 'Dizziness & Lightheadedness',
    nameTl: 'Pagkahilo at Pagkaluwang ng Paningin',
    descriptionEn: 'Shifts in blood circulation or sudden standing.',
    descriptionTl: 'Pakiramdam na umiikot ang paligid kapag biglang tumatayo.',
    remedyEn: 'Stand up slowly from bed or chair; keep healthy snacks handy.',
    remedyTl: 'Dahan-dahang tumayo at huwag magpagutom; magbaon ng meryenda.',
    category: 'general',
    iconEmoji: '💫'
  },
  {
    id: 'insomnia',
    nameEn: 'Insomnia & Restless Sleep',
    nameTl: 'Hirap sa Pagtulog (Insomnia)',
    descriptionEn: 'Difficulty finding a comfortable sleeping posture.',
    descriptionTl: 'Kahirapan sa pagkatulog o madalas na paggising sa gabi.',
    remedyEn: 'Sleep with a U-shaped pregnancy body pillow; avoid screens 1 hr before bed.',
    remedyTl: 'Gumamit ng pregnancy body pillow at iwasan ang cellphone bago matulog.',
    category: 'physical',
    iconEmoji: '🌙'
  },
  {
    id: 'glowing-skin',
    nameEn: 'Pregnancy Glow & Radiance',
    nameTl: 'Glow ng Pagbubuntis (Glowing Skin)',
    descriptionEn: 'Increased blood flow providing natural cheek flush and vibrancy.',
    descriptionTl: 'Maliwanag at makinis na balat dahil sa magandang sirkulasyon ng dugo.',
    remedyEn: 'Use gentle sunscreen and keep skin moisturized with maternal lotion.',
    remedyTl: 'Mag-sunscreen at maglagay ng banayad na moisturizer.',
    category: 'general',
    iconEmoji: '✨'
  }
];

export function getSymptomName(idOrName: string, language: 'en' | 'tl' | 'both' = 'en'): string {
  const found = FILIPINO_SYMPTOMS.find(
    s => s.id === idOrName || s.nameEn.toLowerCase() === idOrName.toLowerCase() || s.nameTl.toLowerCase() === idOrName.toLowerCase()
  );

  if (!found) return idOrName;

  if (language === 'tl') return found.nameTl;
  if (language === 'both') return `${found.nameEn} (${found.nameTl})`;
  return found.nameEn;
}
