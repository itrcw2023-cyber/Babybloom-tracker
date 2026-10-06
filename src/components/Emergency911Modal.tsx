import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  AlertTriangle,
  UserCheck,
  Building2,
  ExternalLink,
  MessageSquare,
  Plus,
  Edit2,
  Save,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types/pregnancy';

interface Emergency911ModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const Emergency911Modal: React.FC<Emergency911ModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [partnerPhone, setPartnerPhone] = useState<string>(
    profile.partnerPhone || '+63 918 555 6789'
  );
  const [partnerName, setPartnerName] = useState<string>(
    profile.partnerName || 'Lucas'
  );
  const [doctorPhone, setDoctorPhone] = useState<string>(
    profile.doctorPhone || '+63 917 888 1234'
  );
  const [doctorName, setDoctorName] = useState<string>(
    profile.doctorName || 'Dr. Sarah Bennett, MD (OB-GYN)'
  );
  const [isEditingContact, setIsEditingContact] = useState(false);

  if (!isOpen) return null;

  const saveCustomContacts = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        doctorName,
        doctorPhone,
        partnerName,
        partnerPhone
      });
    }
    localStorage.setItem('bb_emergency_contact', partnerPhone);
    localStorage.setItem('bb_doctor_phone', doctorPhone);
    setIsEditingContact(false);
  };

  const cleanDocPhone = (doctorPhone || '').replace(/\s+/g, '');
  const cleanPartnerPhone = (partnerPhone || '').replace(/\s+/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="emergency-title" className="text-xl font-black tracking-tight text-white">
                  Emergency 911 Call
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-700 uppercase tracking-wide">
                  24/7 Hotlines
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Immediate medical assistance, hotlines &amp; OB contacts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-stone-800 text-sm">
          {/* Main 911 Dial Button */}
          <div className="bg-rose-50 border-2 border-rose-400/80 rounded-2xl p-4 text-center shadow-xs">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block mb-1">
              National Emergency Hotline
            </span>
            <div className="text-3xl font-black text-rose-900 tracking-tight mb-2">
              911
            </div>
            <p className="text-xs text-rose-800/90 mb-3.5">
              Available 24/7 across the Philippines and international networks for police, fire, and medical ambulance dispatch.
            </p>
            <a
              href="tel:911"
              className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-base shadow-md shadow-rose-500/25 transition-all"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Tap to Call 911 Now</span>
            </a>
          </div>

          {/* Personal OB-GYN Doctor & Partner Contacts with 1-Tap Call & Text */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-700" />
                OB-GYN Doctor &amp; Companion Contacts
              </span>
              <button
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="text-xs text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
              >
                {isEditingContact ? 'Cancel' : 'Edit Numbers'}
              </button>
            </div>

            {isEditingContact ? (
              <div className="space-y-3 pt-1 bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      OB-GYN Doctor Name:
                    </label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Bennett, MD"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      OB Phone (Call / Text):
                    </label>
                    <input
                      type="tel"
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      placeholder="e.g. +63 917 888 1234"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-teal-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Partner / Companion Name:
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. Lucas"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Partner Phone:
                    </label>
                    <input
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="e.g. +63 918 555 6789"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-teal-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={saveCustomContacts}
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save OB &amp; Emergency Contacts</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {/* OB Doctor Card */}
                <div className="bg-white rounded-xl border border-teal-200/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                  <div>
                    <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{doctorName || 'OB-GYN Doctor'}</span>
                    </div>
                    <div className="text-xs text-stone-500 font-mono">{doctorPhone || 'No number set'}</div>
                  </div>

                  {doctorPhone ? (
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <a
                        href={`tel:${cleanDocPhone}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs"
                        title={`Call ${doctorName}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call OB</span>
                      </a>
                      <a
                        href={`sms:${cleanDocPhone}?body=${encodeURIComponent(`Hello ${doctorName}, this is ${profile.name} (Week ${profile.currentWeek}): `)}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold text-xs"
                        title={`Text ${doctorName}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Text OB</span>
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingContact(true)}
                      className="text-xs font-bold text-teal-700 underline"
                    >
                      + Add Number
                    </button>
                  )}
                </div>

                {/* Partner Card */}
                <div className="bg-white rounded-xl border border-teal-200/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                  <div>
                    <div className="text-xs font-black text-stone-900">{partnerName || 'Companion / Partner'}</div>
                    <div className="text-xs text-stone-500 font-mono">{partnerPhone || 'No number set'}</div>
                  </div>

                  {partnerPhone ? (
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <a
                        href={`tel:${cleanPartnerPhone}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Partner</span>
                      </a>
                      <a
                        href={`sms:${cleanPartnerPhone}?body=${encodeURIComponent(`Hi ${partnerName}, quick pregnancy update from BabyBloom: `)}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Text</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Other Direct Hotlines */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              National Health &amp; Maternal Hotlines (Philippines)
            </h3>

            {/* DOH Hotline */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-rose-50/50 rounded-2xl border border-stone-200/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  DOH
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">DOH Health Emergency (1555)</div>
                  <div className="text-xs text-stone-500">Maternal health referrals &amp; hospital coordination</div>
                </div>
              </div>
              <a
                href="tel:1555"
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1555</span>
              </a>
            </div>

            {/* Red Cross Hotline */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-rose-50/50 rounded-2xl border border-stone-200/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs shrink-0">
                  143
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">Philippine Red Cross (143)</div>
                  <div className="text-xs text-stone-500">24/7 Ambulance &amp; blood bank emergency</div>
                </div>
              </div>
              <a
                href="tel:143"
                className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 143</span>
              </a>
            </div>

            {/* National Poison Management */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-rose-50/50 rounded-2xl border border-stone-200/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  UPM
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">National Poison Center (PGH)</div>
                  <div className="text-xs text-stone-500">(02) 8524-1078 · Toxic exposures &amp; poisonings</div>
                </div>
              </div>
              <a
                href="tel:0285241078"
                className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call PGH</span>
              </a>
            </div>
          </div>

          {/* Maternal Danger Signs when to call */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>When to Call 911 / Go to Hospital Immediately</span>
            </div>
            <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Severe abdominal or pelvic pain</strong> that does not go away.</li>
              <li><strong>Bright red vaginal bleeding</strong> or sudden water leakage (rupture of membranes).</li>
              <li><strong>Sudden severe headache</strong> with blurred vision, seeing spots, or dizziness (Preeclampsia warning).</li>
              <li><strong>Sudden noticeable swelling</strong> in face, hands, or sudden unexplained weight gain.</li>
              <li><strong>Marked decrease or complete absence of baby kicks/movement</strong> (in 2nd &amp; 3rd trimesters).</li>
              <li><strong>Fever above 38.5°C</strong>, shaking chills, or chest pain and shortness of breath.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
