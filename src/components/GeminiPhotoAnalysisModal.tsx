import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Heart,
  Save,
  Loader2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { PhotoMoment, PhotoAnalysis } from '../types/pregnancy';

interface GeminiPhotoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  moment: PhotoMoment | null;
  onSaveAnalysis?: (momentId: string, analysis: PhotoAnalysis) => void;
}

export const GeminiPhotoAnalysisModal: React.FC<GeminiPhotoAnalysisModalProps> = ({
  isOpen,
  onClose,
  moment,
  onSaveAnalysis
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(moment?.analysis || null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with moment's saved analysis when opened
  React.useEffect(() => {
    if (moment) {
      setAnalysis(moment.analysis || null);
      setError(null);
      setSavedSuccess(false);
    }
  }, [moment]);

  if (!isOpen || !moment) return null;

  const handleAnalyzePhoto = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: moment.imageUrl,
          category: moment.tag,
          week: moment.week,
          notes: moment.caption
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to analyze photo');
      }

      const newAnalysis: PhotoAnalysis = {
        ...data.analysis,
        analyzedAt: new Date().toISOString()
      };

      setAnalysis(newAnalysis);

      // Automatically persist to moment if handler provided
      if (onSaveAnalysis) {
        onSaveAnalysis(moment.id, newAnalysis);
        setSavedSuccess(true);
      }
    } catch (err: any) {
      console.error('Photo analysis error:', err);
      setError(err.message || 'Unable to connect to Gemini API. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf8] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Gemini Photo Insights</h3>
              <p className="text-[11px] text-stone-500">AI analysis for ultrasounds & bump milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Photo Preview Thumbnail & Meta */}
          <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center">
              <img
                src={moment.imageUrl}
                alt={moment.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 inline-block mb-1">
                Week {moment.week} · {moment.tag.toUpperCase()}
              </span>
              <h4 className="text-xs font-bold text-stone-900 truncate">{moment.title}</h4>
              <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{moment.caption}</p>
            </div>
          </div>

          {/* Trigger button if not yet analyzed */}
          {!analysis && !loading && (
            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Analyze This Photo with Gemini</h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Gemini will detect fetal features, explain ultrasound landmarks, highlight bump development, and suggest questions for your doctor.
                </p>
              </div>
              <button
                onClick={handleAnalyzePhoto}
                className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 mx-auto shadow-sm active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Start Gemini Analysis</span>
              </button>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
              <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-900">Gemini is analyzing your photo...</h4>
                <p className="text-[11px] text-stone-500">
                  Recognizing fetal contours, anatomical landmarks, and week {moment.week} milestones.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Analysis unavailable</span>
                <span className="text-[11px] text-rose-700">{error}</span>
                <button
                  onClick={handleAnalyzePhoto}
                  className="mt-2 text-[11px] font-semibold underline text-rose-800"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysis && !loading && (
            <div className="space-y-3.5">
              {/* Analysis Header Card */}
              <div className="bg-gradient-to-br from-rose-50/80 via-white to-stone-50 rounded-2xl border border-rose-200/80 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    Gemini Multimodal Insights
                  </span>
                  {analysis.analyzedAt && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(analysis.analyzedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-stone-900">{analysis.title}</h3>
                <p className="text-xs text-stone-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-stone-100">
                  {analysis.summary}
                </p>
              </div>

              {/* Key Visual Observations */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Visual Highlights
                </h4>
                <ul className="space-y-1.5">
                  {analysis.keyObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sweet Milestone Note */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Week {moment.week} Milestone Reflection</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {analysis.sweetMilestoneNote}
                </p>
              </div>

              {/* Suggestions / Questions for Doctor */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Suggestions & Care Notes
                </h4>
                <ul className="space-y-1.5">
                  {analysis.helpfulSuggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Educational Disclaimer */}
              <div className="p-3 bg-stone-100 rounded-xl text-[10px] text-stone-500 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{analysis.medicalDisclaimer}</span>
              </div>

              {/* Re-analyze button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAnalyzePhoto}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium underline underline-offset-2"
                >
                  Re-analyze with Gemini
                </button>
                {savedSuccess && (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to photo journal!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
