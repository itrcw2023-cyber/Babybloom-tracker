import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Calendar,
  X,
  Maximize2,
  Download,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { PhotoMoment, UserProfile, PhotoAnalysis } from '../types/pregnancy';
import { GeminiPhotoAnalysisModal } from './GeminiPhotoAnalysisModal';

interface MomentsTabProps {
  profile: UserProfile;
  moments: PhotoMoment[];
  onAddMoment: (moment: Omit<PhotoMoment, 'id'>) => void;
  onDeleteMoment: (id: string) => void;
  onSaveAnalysis?: (momentId: string, analysis: PhotoAnalysis) => void;
}

export const MomentsTab: React.FC<MomentsTabProps> = ({
  profile,
  moments,
  onAddMoment,
  onDeleteMoment,
  onSaveAnalysis
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [week, setWeek] = useState<number>(profile.currentWeek);
  const [tag, setTag] = useState<PhotoMoment['tag']>('bump');
  const [fullScreenPhoto, setFullScreenPhoto] = useState<PhotoMoment | null>(null);
  const [analyzingMoment, setAnalyzingMoment] = useState<PhotoMoment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPreviewUrl(event.target.result);
        if (!title) {
          setTitle(tag === 'ultrasound' ? `Ultrasound Scan - Week ${week}` : `Bump Milestone - Week ${week}`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    onAddMoment({
      title: title || `Week ${week} Memory`,
      caption: caption || 'Cherishing this sweet milestone.',
      date: new Date().toISOString().split('T')[0],
      week,
      imageUrl: previewUrl,
      tag
    });

    // Reset
    setIsAdding(false);
    setPreviewUrl('');
    setTitle('');
    setCaption('');
  };

  const filteredMoments = selectedTag === 'all'
    ? moments
    : moments.filter((m) => m.tag === selectedTag);

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-4 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900">Photo Journal & Memories</h2>
          <p className="text-xs text-stone-500">Capture bump progress & ultrasound scans</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Hidden File / Camera Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Add Photo Panel */}
      {isAdding && (
        <form onSubmit={handleSaveMoment} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">New Photo Moment</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Trigger choices: Camera vs Gallery */}
          {!previewUrl ? (
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 flex flex-col items-center justify-center gap-1.5 transition-all"
              >
                <Camera className="w-6 h-6 text-rose-600" />
                <span className="text-xs font-semibold text-rose-800">Snap with Camera</span>
                <span className="text-[10px] text-stone-500">Open Android camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center gap-1.5 transition-all"
              >
                <Upload className="w-6 h-6 text-stone-600" />
                <span className="text-xs font-semibold text-stone-800">Upload Picture</span>
                <span className="text-[10px] text-stone-500">Select from gallery</span>
              </button>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center max-h-52">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-52 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full"
                title="Change image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tag & Week */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Category</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium"
              >
                <option value="bump">Bump Progression</option>
                <option value="ultrasound">Ultrasound Scan</option>
                <option value="nursery">Nursery & Gear</option>
                <option value="celebration">Shower & Milestone</option>
                <option value="other">Other Memory</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Gestational Week</label>
              <input
                type="number"
                min="1"
                max="42"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-600 block mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Week 22 Sunshine Bump"
              className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div>
            <label className="text-[11px] text-stone-600 block mb-1">Caption / Thoughts</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="How were you feeling? Special moments of the day..."
              className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={!previewUrl}
              className="flex-1 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 disabled:opacity-40"
            >
              Save Memory
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-2 px-3 border border-stone-200 text-stone-600 rounded-xl text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Photos' },
          { id: 'bump', label: 'Bump Photos' },
          { id: 'ultrasound', label: 'Ultrasounds' },
          { id: 'nursery', label: 'Nursery' },
          { id: 'celebration', label: 'Milestones' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedTag(f.id)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
              selectedTag === f.id
                ? 'bg-rose-600 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMoments.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-rose-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Your Photo Keepsake is Fresh</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Capture your week {profile.currentWeek} bump progression or upload your ultrasound scan. All photos are stored securely on your phone.
              </p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Photo</span>
            </button>
          </div>
        ) : (
          filteredMoments.map((moment) => (
            <div
              key={moment.id}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              {/* Image Container with Fullscreen trigger */}
              <div
                onClick={() => setFullScreenPhoto(moment)}
                className="relative aspect-4/3 bg-stone-100 cursor-pointer overflow-hidden flex items-center justify-center"
              >
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs font-mono">
                  Week {moment.week}
                </span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="p-2 rounded-full bg-white/90 text-stone-800 shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Caption & Info */}
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">
                    {moment.title}
                  </h4>
                  <button
                    onClick={() => onDeleteMoment(moment.id)}
                    className="text-stone-300 hover:text-rose-600 p-1"
                    title="Delete moment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                  {moment.caption}
                </p>

                {/* Gemini Analysis Button / Badge */}
                <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setAnalyzingMoment(moment)}
                    className={`text-[11px] font-medium py-1 px-2.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 ${
                      moment.analysis
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>{moment.analysis ? 'Gemini Insights' : 'Analyze Photo'}</span>
                  </button>

                  <div className="text-[10px] text-stone-400 font-mono">
                    {moment.date}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Photo Modal */}
      {fullScreenPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between text-white pb-3">
            <div>
              <span className="text-xs font-mono text-rose-300">Week {fullScreenPhoto.week}</span>
              <h3 className="text-sm font-semibold">{fullScreenPhoto.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const m = fullScreenPhoto;
                  setFullScreenPhoto(null);
                  setAnalyzingMoment(m);
                }}
                className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Analysis</span>
              </button>
              <button
                onClick={() => setFullScreenPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={fullScreenPhoto.imageUrl}
              alt={fullScreenPhoto.title}
              className="max-h-full max-w-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-3 text-stone-300 text-xs flex items-center justify-between">
            <p className="max-w-xs">{fullScreenPhoto.caption}</p>
            <span className="font-mono text-stone-400">{fullScreenPhoto.date}</span>
          </div>
        </div>
      )}

      {/* Gemini AI Photo Analysis Modal */}
      <GeminiPhotoAnalysisModal
        isOpen={!!analyzingMoment}
        onClose={() => setAnalyzingMoment(null)}
        moment={analyzingMoment}
        onSaveAnalysis={onSaveAnalysis}
      />
    </div>
  );
};
