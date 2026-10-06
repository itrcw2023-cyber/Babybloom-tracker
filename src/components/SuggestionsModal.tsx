import React, { useState } from 'react';
import {
  Lightbulb,
  X,
  Apple,
  Briefcase,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Globe,
  ExternalLink,
  ShieldCheck,
  Building2,
  HeartPulse,
  Info,
  Phone
} from 'lucide-react';
import { symptomRemedies, trimesterGuides } from '../data/suggestionsData';
import { FILIPINO_SYMPTOMS } from '../data/symptomTranslations';
import { TRUSTED_FILIPINO_RESOURCES, TrustedResource } from '../data/trustedFilipinoResources';
import { HospitalBagItem } from '../types/pregnancy';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalBagItems: HospitalBagItem[];
  onToggleBagItem: (id: string) => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  hospitalBagItems,
  onToggleBagItem
}) => {
  const [activeTab, setActiveTab] = useState<'trustedLinks' | 'filipino' | 'remedies' | 'nutrition' | 'trimesters' | 'hospitalBag'>('trustedLinks');
  const [filterCategory, setFilterCategory] = useState<'all' | 'government' | 'medical' | 'parenting' | 'hotline'>('all');

  if (!isOpen) return null;

  const filteredResources = filterCategory === 'all'
    ? TRUSTED_FILIPINO_RESOURCES
    : TRUSTED_FILIPINO_RESOURCES.filter(r => r.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              🇵🇭
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Pinay Mom Resources &amp; Care</h3>
              <p className="text-[11px] text-stone-500">Trusted Philippine health guidelines &amp; remedies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200/80 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('trustedLinks')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'trustedLinks' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🇵🇭 Trusted Links</span>
          </button>
          <button
            onClick={() => setActiveTab('filipino')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'filipino' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Lunas sa Sintomas
          </button>
          <button
            onClick={() => setActiveTab('remedies')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'remedies' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            General Relief
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'nutrition' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Nutrition &amp; Foods
          </button>
          <button
            onClick={() => setActiveTab('trimesters')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'trimesters' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Trimesters
          </button>
          <button
            onClick={() => setActiveTab('hospitalBag')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'hospitalBag' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hospital Bag
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* TAB 1: TRUSTED FILIPINO LINKS & OFFICIAL HEALTH BODIES */}
          {activeTab === 'trustedLinks' && (
            <div className="space-y-3">
              {/* Informational Banner */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  Mga Pinagkakatiwalaang Sanggunian para sa Buntis
                </span>
                <p className="text-[11px] text-rose-900/90 leading-relaxed">
                  Verified official Philippine government health agencies, OB-GYN medical societies, maternity benefit guides, and 24/7 hotlines trusted by Filipino mothers.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                {[
                  { id: 'all', label: 'All Resources' },
                  { id: 'government', label: 'DOH & PhilHealth' },
                  { id: 'medical', label: 'POGS (OB-GYN)' },
                  { id: 'parenting', label: 'SmartParenting & Communities' },
                  { id: 'hotline', label: 'Emergency Hotlines' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id as any)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition-all ${
                      filterCategory === cat.id
                        ? 'bg-rose-600 text-white font-bold shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* List of Trusted Resources */}
              <div className="space-y-3 pt-1">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3 hover:border-rose-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          {res.badge}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 mt-1">
                          {res.name}
                        </h4>
                        <p className="text-[11px] text-rose-800 font-medium">
                          {res.tagline}
                        </p>
                      </div>

                      {res.url ? (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-2xs"
                          title="Open official website in new tab"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : res.phone ? (
                        <a
                          href={`tel:${res.phone.split('/')[0].trim().replace(/[^0-9+]/g, '')}`}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      ) : null}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Key Highlights */}
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Mahalagang Impormasyon / Highlights:
                      </span>
                      <ul className="space-y-1">
                        {res.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5 text-[11px] text-stone-700 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact or Direct Link */}
                    {res.phone && (
                      <div className="pt-1 flex items-center gap-2 text-xs text-stone-700 font-medium bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Hotline / Telepono: <strong className="font-mono text-stone-900">{res.phone}</strong></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FILIPINO REMEDIES & MATERNAL CARE */}
          {activeTab === 'filipino' && (
            <div className="space-y-3">
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  Gabay sa Pangangalaga at Lunas sa Sintomas ng Buntis
                </span>
                <p className="text-[11px] text-rose-800/90 leading-relaxed">
                  Narito ang mga natural at ligtas na payo para sa kaginhawahan ng nanay habang nagdadalantao.
                </p>
              </div>

              {FILIPINO_SYMPTOMS.map((sym) => (
                <div key={sym.id} className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{sym.iconEmoji}</span>
                      <span>{sym.nameTl}</span>
                    </h4>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {sym.nameEn}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {sym.descriptionTl}
                  </p>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Payo at Lunas:</span>
                      <span className="text-[11px] leading-relaxed">{sym.remedyTl}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SYMPTOM REMEDIES (ENGLISH) */}
          {activeTab === 'remedies' && (
            <div className="space-y-3">
              {symptomRemedies.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900">{item.symptom}</h4>
                    <span className="text-[10px] uppercase font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {item.remedy.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Nourishing Foods to Try:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.safeFoods.map((f, fIdx) => (
                        <span key={fIdx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>When to contact doctor:</strong> {item.whenToCallDoctor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: NUTRITION & DOS */}
          {activeTab === 'nutrition' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Apple className="w-4 h-4 text-emerald-600" />
                  Key Daily Nutrients for Baby &amp; Mother
                </h4>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="font-bold text-stone-800 block">Folate / Folic Acid (600–800 mcg)</span>
                    Crucial for neural tube development. Found in spinach, malunggay, lentils, and fortified cereals.
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="font-bold text-stone-800 block">Iron (27 mg)</span>
                    Supports expanding blood volume and prevents maternal fatigue. Found in beef, liver (in moderation), and leafy greens.
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="font-bold text-stone-800 block">Omega-3 DHA (200–300 mg)</span>
                    Essential for baby’s brain and retina formation. Found in low-mercury cooked salmon, walnuts, and chia seeds.
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="font-bold text-stone-800 block">Calcium &amp; Potassium (1000 mg)</span>
                    Builds strong fetal bones and relaxes maternal leg muscles against nocturnal cramps.
                  </div>
                </div>
              </div>

              {/* Foods to avoid */}
              <div className="bg-rose-50/70 rounded-2xl border border-rose-200 p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  Foods to Strictly Avoid for Safety
                </h4>
                <ul className="space-y-1 text-xs text-rose-950">
                  <li>• Raw or undercooked meat, sushi, and runny egg yolks (salmonella &amp; toxoplasmosis risk)</li>
                  <li>• Unpasteurized soft cheeses and raw milk</li>
                  <li>• High-mercury fish (swordfish, king mackerel, bigeye tuna)</li>
                  <li>• Unwashed raw produce or raw deli sprouts (listeria risk)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: TRIMESTER GUIDES */}
          {activeTab === 'trimesters' && (
            <div className="space-y-3">
              {trimesterGuides.map((guide) => (
                <div key={guide.trimester} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900">
                      Trimester {guide.trimester} ({guide.weeks})
                    </h4>
                    <span className="text-[11px] text-stone-500 font-medium">{guide.focus}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 block">Key Recommended Practices (Dos):</span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {guide.dos.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-rose-800 block">Things to Avoid (Don&apos;ts):</span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {guide.donts.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: HOSPITAL BAG */}
          {activeTab === 'hospitalBag' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-stone-700" />
                    Delivery Hospital Bag Checklist
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {hospitalBagItems.filter((i) => i.checked).length}/{hospitalBagItems.length} Packed
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Essential items for labor, postpartum recovery, baby, and hospital documentation in the Philippines (PhilHealth IDs, OB history, Marriage certificate).
                </p>

                <div className="space-y-1.5 pt-2">
                  {hospitalBagItems.map((bagItem) => (
                    <div
                      key={bagItem.id}
                      onClick={() => onToggleBagItem(bagItem.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        bagItem.checked
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            bagItem.checked ? 'text-emerald-600' : 'text-stone-300'
                          }`}
                        />
                        <span className={`text-xs ${bagItem.checked ? 'line-through text-stone-400' : 'font-medium'}`}>
                          {bagItem.item}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 uppercase font-mono">
                        {bagItem.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
