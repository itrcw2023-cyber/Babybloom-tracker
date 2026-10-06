import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Sparkles,
  Copy,
  Check,
  Terminal,
  FileCode,
  Globe,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageUsage?: string;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  storageUsage = '0 KB'
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'pwabuilder' | 'cli' | 'checklist'>('install');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-yvxeamz2y3cj5whdrsw4m3-403679974254.asia-southeast1.run.app';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  const bubblewrapCommand = `npm install -g @bubblewrap/cli\nbubblewrap init --manifest="${currentUrl}/manifest.json"\nbubblewrap build`;

  const assetlinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.ojre.babybloom",
      "sha256_cert_fingerprints": [
        "PASTE_YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-xl rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Google Play & Android Setup</h3>
              <p className="text-[11px] text-stone-500">BabyBloom Tracker · Developed by OjrE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1.5 bg-stone-100 border-b border-stone-200 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'install' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direct Install
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'pwabuilder' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ⚡ 1-Click APK (PWABuilder)
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'cli' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Terminal / CLI Build
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'checklist' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Play Store Checklist
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* TAB 1: Direct Install */}
          {activeTab === 'install' && (
            <div className="space-y-3.5">
              <div className="bg-gradient-to-br from-rose-50 via-white to-stone-50 border border-rose-200 p-4 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-lg font-extrabold tracking-tight">BB</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">BabyBloom Tracker</h4>
                    <span className="text-[11px] text-rose-600 font-medium block">
                      {isInstalled ? 'Installed as Android Native App' : 'Ready to Install on Phone'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-stone-400" />
                    Storage on Phone (IndexedDB):
                  </span>
                  <span className="font-semibold text-stone-800 font-mono">{storageUsage}</span>
                </div>
              </div>

              {isInstalled ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">App is Already Installed!</span>
                    <span className="text-[11px] text-emerald-700">
                      You can launch BabyBloom Tracker anytime from your Android home screen or app drawer. All photos & data remain safely on your phone.
                    </span>
                  </div>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>{installing ? 'Opening Android Installer...' : 'Install App on This Phone'}</span>
                </button>
              ) : (
                <div className="p-3.5 bg-stone-100 border border-stone-200 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-stone-800 block">How to Install Directly on Android:</span>
                  <ol className="space-y-1.5 text-stone-600 text-[11px] list-decimal list-inside leading-relaxed">
                    <li>In Chrome on your Android phone, tap the <strong>⋮ Menu</strong> (top right).</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Tap <strong>Install</strong>. BabyBloom Tracker will appear on your home screen instantly.</li>
                  </ol>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2">
                <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  On-Device Phone Benefits
                </h5>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Internal Storage:</strong> Baby photos & journals stay safe in on-device IndexedDB without cloud leaks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Offline Mode:</strong> Works seamlessly in hospitals or areas with low connectivity.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PWABuilder (Fastest Method) */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-3.5">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    Recommended • 5 Minutes
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">No Android Studio required</span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">
                  Generate Signed Google Play Package (.AAB) with PWABuilder
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  PWABuilder (maintained by Microsoft & Google) inspects your app URL and generates a ready-to-upload Android App Bundle (<code>.aab</code>) for the Google Play Store.
                </p>
              </div>

              {/* Step 1: Copy App URL */}
              <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Step 1: Copy Your Live App URL</span>
                  <button
                    onClick={() => copyToClipboard(currentUrl, 'url')}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'url' ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono text-[11px] text-stone-700 truncate select-all">
                  {currentUrl}
                </div>
              </div>

              {/* Step 2: Open PWABuilder */}
              <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2.5">
                <span className="font-bold text-stone-900 text-xs block">Step 2: Generate Android Package</span>
                <ol className="text-[11px] text-stone-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Go to <strong>pwabuilder.com</strong> and paste your App URL.</li>
                  <li>Click <strong>Start</strong> and then tap <strong>Package for Stores</strong>.</li>
                  <li>Select <strong>Google Play (Android)</strong>.</li>
                  <li>Set Package ID to <code>com.ojre.babybloom</code>.</li>
                  <li>Click <strong>Generate Package</strong> to download your <code>.zip</code> containing your signed <code>.aab</code>.</li>
                </ol>
                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>Open PWABuilder with App URL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Google Bubblewrap CLI */}
          {activeTab === 'cli' && (
            <div className="space-y-3.5">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-stone-700" />
                  <h4 className="text-xs font-bold text-stone-900">Google's Official Bubblewrap CLI (TWA)</h4>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  For developers with Node.js and the Android SDK installed, Bubblewrap compiles a lightweight Trusted Web Activity wrapper directly into an official Google Play APK/AAB.
                </p>
              </div>

              <div className="bg-stone-900 rounded-xl p-3 space-y-2 text-white">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>Terminal / Command Prompt</span>
                  <button
                    onClick={() => copyToClipboard(bubblewrapCommand, 'cli')}
                    className="flex items-center gap-1 text-rose-300 hover:text-rose-200 font-mono text-[11px]"
                  >
                    {copiedKey === 'cli' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'cli' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-rose-200 whitespace-pre-wrap overflow-x-auto leading-relaxed bg-black/40 p-2.5 rounded-lg">
                  {bubblewrapCommand}
                </pre>
              </div>

              {/* Digital Asset Links */}
              <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Digital Asset Links Verification</span>
                  <button
                    onClick={() => copyToClipboard(assetlinksJson, 'assetlinks')}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    {copiedKey === 'assetlinks' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'assetlinks' ? 'Copied' : 'Copy assetlinks.json'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Already created at <code>/public/.well-known/assetlinks.json</code>. Replace the SHA256 fingerprint with your Play Console App Signing key to remove the Chrome top address bar completely!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Google Play Console Submission Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold text-stone-900">Google Play Console Publishing Checklist</h4>
                </div>
                <p className="text-[11px] text-stone-600">
                  Log in to your <strong>Google Play Developer Console</strong> ($25 one-time fee) and follow these exact steps:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] flex items-center justify-center font-bold">1</span>
                    Create New App
                  </span>
                  <p className="text-[11px] text-stone-500 pl-6.5">
                    Name: <strong>BabyBloom Tracker</strong> • Developer: <strong>OjrE</strong> • Default language: English (US) • Type: App • Free/Paid: Free.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] flex items-center justify-center font-bold">2</span>
                    Upload Android App Bundle (.AAB)
                  </span>
                  <p className="text-[11px] text-stone-500 pl-6.5">
                    Navigate to <strong>Production &gt; Create new release</strong> and drag-and-drop the <code>.aab</code> file downloaded from PWABuilder or Android Studio.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] flex items-center justify-center font-bold">3</span>
                    Store Listing Details
                  </span>
                  <p className="text-[11px] text-stone-500 pl-6.5">
                    Category: <strong>Health & Fitness / Parenting</strong>. Content Rating: Everyone. Includes English & Filipino pregnancy tracking.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] flex items-center justify-center font-bold">4</span>
                    Submit for Google Review
                  </span>
                  <p className="text-[11px] text-stone-500 pl-6.5">
                    Click <strong>Review release</strong> and submit. Google typically approves new apps within 24 to 48 hours, making BabyBloom Tracker downloadable worldwide!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
