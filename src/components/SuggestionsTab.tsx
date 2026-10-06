import React, { useState } from 'react';
import {
  Lightbulb,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Apple,
  Droplets,
  Heart,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Luggage,
  BookOpen
} from 'lucide-react';
import { UserProfile, HospitalBagItem } from '../types/pregnancy';
import { TRUSTED_FILIPINO_RESOURCES } from '../data/trustedFilipinoResources';
import { defaultHospitalBagItems } from '../data/suggestionsData';

interface SuggestionsTabProps {
  profile: UserProfile;
  onOpenEmergency911: () => void;
  hospitalBagItems: HospitalBagItem[];
  onToggleHospitalBagItem: (id: string) => void;
}

export const SuggestionsTab: React.FC<SuggestionsTabProps> = ({
  profile,
  onOpenEmergency911,
  hospitalBagItems,
  onToggleHospitalBagItem
}) => {
  const [activeCategory, setActiveCategory] = useState<'daily' | 'hotlines' | 'danger_signs' | 'hospital_bag'>('daily');

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Maternal Suggestions & Hotlines
            </h2>
            <p className="text-xs text-stone-500">
              Trusted guidance for Week {profile.currentWeek}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEmergency911}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm transition-all active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 911</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-2xl">
        <button
          onClick={() => setActiveCategory('daily')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'daily'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Daily Tips
        </button>
        <button
          onClick={() => setActiveCategory('danger_signs')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'danger_signs'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Danger Signs
        </button>
        <button
          onClick={() => setActiveCategory('hotlines')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'hotlines'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🇵🇭 Hotlines
        </button>
        <button
          onClick={() => setActiveCategory('hospital_bag')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'hospital_bag'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Hospital Bag
        </button>
      </div>

      {/* 1. DAILY TIPS */}
      {activeCategory === 'daily' && (
        <div className="space-y-3">
          {/* Nutrition & Vitamin Absorption */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Apple className="w-4 h-4" />
              <span>Nutrition & Vitamin Absorption</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Iron + Vitamin C:</strong> Take ferrous sulfate with orange juice or calamansi water for maximum iron absorption.</li>
              <li><strong>Separate Calcium from Iron:</strong> Wait at least 2 hours between calcium and iron tablets to prevent blockages in absorption.</li>
              <li><strong>Hydration:</strong> Aim for 8 to 10 glasses (2 to 2.5 Liters) of clean water daily to maintain amniotic fluid and prevent UTIs.</li>
              <li><strong>Folic Acid:</strong> Vital for neural tube formation and spine development.</li>
            </ul>
          </div>

          {/* Sleep & Physical Care */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Heart className="w-4 h-4" />
              <span>Sleep & Daily Rest</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Left-Side Sleeping:</strong> Sleeping on your left side relieves pressure from the inferior vena cava and maximizes placenta blood flow.</li>
              <li><strong>Pelvic & Back Relief:</strong> Place a pillow between your knees and under your belly when sleeping.</li>
              <li><strong>Gentle Movement:</strong> A light 15-20 minute walk daily helps maintain blood circulation and eases lower body swelling.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 2. DANGER SIGNS (WHEN TO CALL 911) */}
      {activeCategory === 'danger_signs' && (
        <div className="space-y-3">
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 font-black text-sm uppercase tracking-wide">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Critical Warning Signs — Call 911 or Visit ER</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              If you experience any of the following symptoms at any time during your pregnancy, do not wait. Call 911 or proceed immediately to the nearest maternity hospital:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">1. Vaginal Bleeding or Fluid Leakage:</span> Any bright red bleeding or sudden gush/trickle of watery fluid.
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">2. Severe Continuous Headache / Vision Changes:</span> Blurred vision, flashing spots, or dizziness (Preeclampsia red flag).
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">3. Severe Stomach / Upper Right Abdominal Pain:</span> Sharp, persistent cramping or pain under your right ribs.
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">4. Sudden Swelling (Edema):</span> Rapid puffiness in your face, eyelids, or hands.
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">5. Decreased Fetal Movement:</span> Noticeable reduction in your baby’s regular kicks or movements.
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-stone-800">
                <span className="font-bold text-rose-700">6. High Fever & Chills:</span> Temperature above 38.5°C (101.3°F), difficulty breathing, or severe chest pain.
              </div>
            </div>

            <div className="pt-2">
              <a
                href="tel:911"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 911 Emergency Hotline</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHILIPPINE HOTLINES & REFERENCES */}
      {activeCategory === 'hotlines' && (
        <div className="space-y-3">
          {TRUSTED_FILIPINO_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-2 hover:border-rose-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 uppercase tracking-wider">
                    {res.badge}
                  </span>
                  <h4 className="font-black text-stone-900 text-sm mt-1">
                    {res.name}
                  </h4>
                  <p className="text-[11px] text-rose-700 font-medium">{res.tagline}</p>
                </div>

                {res.phone && (
                  <a
                    href={`tel:${res.phone.split('/')[0].trim()}`}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {res.description}
              </p>

              <div className="space-y-1 pt-1 border-t border-stone-100">
                {res.highlights.map((h, i) => (
                  <div key={i} className="text-[11px] text-stone-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {res.url && (
                <div className="pt-1">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. HOSPITAL BAG CHECKLIST */}
      {activeCategory === 'hospital_bag' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Luggage className="w-4 h-4 text-rose-600" />
              <span>Hospital Bag Essentials</span>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              {hospitalBagItems.filter((i) => i.checked).length}/{hospitalBagItems.length} Packed
            </span>
          </div>

          <div className="space-y-1.5">
            {hospitalBagItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleHospitalBagItem(item.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  item.checked
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-stone-500 line-through'
                    : 'bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                    item.checked
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-stone-300'
                  }`}
                >
                  {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
