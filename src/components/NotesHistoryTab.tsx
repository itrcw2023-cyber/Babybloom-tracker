import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Search,
  Smile,
  Droplets,
  Clock,
  ArrowRight,
  Plus,
  Edit2,
  Check,
  Save,
  X,
  Sparkles,
  PenTool,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { DailyNoteEntry } from './SimpleDashboard';
import { getTodayDateString, formatDisplayDate } from '../utils/dateTime';

interface NotesHistoryTabProps {
  dailyNotes: Record<string, DailyNoteEntry>;
  onSelectDate: (date: string) => void;
  onGoToDashboard: () => void;
  onSaveDailyNote?: (date: string, noteData: DailyNoteEntry) => void;
  onOpenBackup?: () => void;
}

export const NotesHistoryTab: React.FC<NotesHistoryTabProps> = ({
  dailyNotes,
  onSelectDate,
  onGoToDashboard,
  onSaveDailyNote,
  onOpenBackup
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Note Composer visibility & draft state
  const todayStr = getTodayDateString();
  const [isWritingNewNote, setIsWritingNewNote] = useState(false);
  const [newNoteDate, setNewNoteDate] = useState(todayStr);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteMood, setNewNoteMood] = useState<DailyNoteEntry['mood']>(undefined);
  const [newNoteWater, setNewNoteWater] = useState<number>(0);
  const [newNoteTags, setNewNoteTags] = useState<string[]>([]);

  // In-place edit state for existing notes
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [editMood, setEditMood] = useState<DailyNoteEntry['mood']>(undefined);
  const [editWater, setEditWater] = useState<number>(0);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [justSavedDate, setJustSavedDate] = useState<string | null>(null);

  const notesList = useMemo(() => {
    return Object.values(dailyNotes)
      .filter((entry) => entry.note && entry.note.trim().length > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyNotes]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notesList;
    const q = searchQuery.toLowerCase();
    return notesList.filter(
      (entry) =>
        entry.note.toLowerCase().includes(q) ||
        entry.date.includes(q) ||
        entry.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [notesList, searchQuery]);

  const handleOpenNewNote = (targetDate: string = todayStr) => {
    const existing = dailyNotes[targetDate];
    setNewNoteDate(targetDate);
    setNewNoteText(existing?.note || '');
    setNewNoteMood(existing?.mood || undefined);
    setNewNoteWater(existing?.waterGlasses || 0);
    setNewNoteTags(existing?.tags || []);
    setIsWritingNewNote(true);
    setEditingDate(null);
  };

  const handleSaveNewNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newNoteText.trim()) return;

    if (onSaveDailyNote) {
      const entry: DailyNoteEntry = {
        date: newNoteDate,
        note: newNoteText.trim(),
        mood: newNoteMood,
        waterGlasses: newNoteWater,
        tags: newNoteTags,
        updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      onSaveDailyNote(newNoteDate, entry);
      setJustSavedDate(newNoteDate);
      setTimeout(() => setJustSavedDate(null), 2500);
    }

    setIsWritingNewNote(false);
    setNewNoteText('');
    setNewNoteMood(undefined);
    setNewNoteTags([]);
    setNewNoteWater(0);
  };

  const handleStartEdit = (entry: DailyNoteEntry) => {
    setIsWritingNewNote(false);
    setEditingDate(entry.date);
    setEditNoteText(entry.note || '');
    setEditMood(entry.mood);
    setEditWater(entry.waterGlasses || 0);
    setEditTags(entry.tags || []);
  };

  const handleCancelEdit = () => {
    setEditingDate(null);
  };

  const handleSaveInline = (date: string) => {
    if (onSaveDailyNote) {
      const updated: DailyNoteEntry = {
        date,
        note: editNoteText.trim(),
        mood: editMood,
        waterGlasses: editWater,
        tags: editTags,
        updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      onSaveDailyNote(date, updated);
      setJustSavedDate(date);
      setTimeout(() => setJustSavedDate(null), 2500);
    }
    setEditingDate(null);
  };

  const toggleNewTag = (tag: string) => {
    setNewNoteTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleEditTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const quickTagOptions = [
    'Baby Kicks 👶',
    'Vitamins Taken 💊',
    'Morning Sickness 🤢',
    'Cravings 🍦',
    'Doctor Visit 🩺',
    'Back Pain 💆‍♀️',
    'Happy & Glowing ✨',
    '20-min Walk 🚶‍♀️'
  ];

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Daily Notes &amp; Journal
            </h2>
            <p className="text-xs text-stone-500">
              {notesList.length} journal notes saved · Tap &quot;Write a Note&quot; to add feelings or symptoms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenBackup && (
            <button
              onClick={onOpenBackup}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Export all notes and data to JSON / backup file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={() => {
              if (isWritingNewNote) {
                setIsWritingNewNote(false);
              } else {
                handleOpenNewNote(todayStr);
              }
            }}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer ${
              isWritingNewNote
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
            }`}
          >
            {isWritingNewNote ? (
              <>
                <X className="w-4 h-4" />
                <span>Close Composer</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Write a Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DEDICATED WRITE A NOTE COMPOSER (Appears ONLY when clicked or tapped) */}
      {isWritingNewNote && (
        <div className="bg-white rounded-3xl border-2 border-rose-300 p-4 sm:p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <PenTool className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-stone-900">
                Write a Daily Note
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-600">Date:</label>
              <input
                type="date"
                value={newNoteDate}
                onChange={(e) => {
                  const d = e.target.value;
                  setNewNoteDate(d);
                  const existing = dailyNotes[d];
                  if (existing) {
                    setNewNoteText(existing.note || '');
                    setNewNoteMood(existing.mood);
                    setNewNoteWater(existing.waterGlasses || 0);
                    setNewNoteTags(existing.tags || []);
                  }
                }}
                className="text-xs p-1.5 rounded-xl border border-stone-300 font-mono bg-stone-50"
              />
            </div>
          </div>

          <form onSubmit={handleSaveNewNote} className="space-y-3.5">
            {/* Mood Picker */}
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-stone-500 shrink-0 mr-1">Today’s Mood:</span>
              {(
                [
                  { mood: 'happy', label: '😊 Happy', bg: 'bg-amber-100 border-amber-300 text-amber-900' },
                  { mood: 'calm', label: '😌 Peaceful', bg: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                  { mood: 'tired', label: '😴 Low Energy', bg: 'bg-purple-100 border-purple-300 text-purple-900' },
                  { mood: 'unwell', label: '🤢 Queasy', bg: 'bg-rose-100 border-rose-300 text-rose-900' },
                  { mood: 'excited', label: '💖 Excited', bg: 'bg-pink-100 border-pink-300 text-pink-900' }
                ] as const
              ).map((item) => (
                <button
                  key={item.mood}
                  type="button"
                  onClick={() => setNewNoteMood(item.mood)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    newNoteMood === item.mood
                      ? `${item.bg} ring-2 ring-rose-400 font-black shadow-2xs`
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Note Textarea */}
            <div className="relative">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                autoFocus
                rows={4}
                placeholder="How are you feeling? (e.g. Strong kicks at 3 PM, completed a 20-min gentle walk, took evening prenatal vitamins, felt peaceful...)"
                className="w-full p-3.5 bg-stone-50/80 border border-stone-300 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-rose-500 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* Quick Tags & Water Tracker */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Quick Tags:</span>
                <button
                  type="button"
                  onClick={() => setNewNoteWater((w) => w + 1)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 text-xs font-bold transition-all cursor-pointer"
                  title="Add 1 glass of water"
                >
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>{newNoteWater} glasses water (+1)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quickTagOptions.map((tag) => {
                  const isSelected = newNoteTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleNewTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Composer Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsWritingNewNote(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved notes by text, tags, or date (e.g. kicks, vitamins, 2026-10)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder-stone-400 focus:outline-rose-500 shadow-2xs"
        />
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center space-y-3 shadow-xs">
          <FileText className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700 text-sm">
            {searchQuery ? 'No notes matched your search' : 'No daily notes saved yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Tap &quot;Write a Note&quot; above to record your feelings, symptoms, meals, or thoughts.
          </p>
          <button
            onClick={() => handleOpenNewNote(todayStr)}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            + Write Your First Note
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((entry) => {
            const isEditingThis = editingDate === entry.date;
            const formattedDate = formatDisplayDate(entry.date, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={entry.date}
                className={`bg-white rounded-2xl border transition-all p-4 shadow-2xs space-y-3 ${
                  isEditingThis
                    ? 'border-rose-400 ring-2 ring-rose-200 shadow-sm'
                    : 'border-stone-200/90 hover:border-rose-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-black text-stone-900 text-sm">
                      {formattedDate}
                    </span>
                    {entry.mood && !isEditingThis && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {entry.mood === 'happy' && '😊 Happy'}
                        {entry.mood === 'calm' && '😌 Calm'}
                        {entry.mood === 'tired' && '😴 Tired'}
                        {entry.mood === 'unwell' && '🤢 Queasy'}
                        {entry.mood === 'excited' && '💖 Excited'}
                      </span>
                    )}
                    {justSavedDate === entry.date && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved!
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isEditingThis ? (
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-100 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        title="Edit note directly in this tab"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>View / Edit Directly</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectDate(entry.date);
                        onGoToDashboard();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 px-2 py-1 rounded-lg transition-all cursor-pointer"
                      title="Open full day dashboard view"
                    >
                      <span>Today Tab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* INLINE EDIT MODE vs VIEW MODE */}
                {isEditingThis ? (
                  <div className="space-y-3 pt-1 border-t border-rose-100">
                    {/* Mood Selector in Edit mode */}
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-stone-500 shrink-0 mr-1">Mood:</span>
                      {(
                        [
                          { mood: 'happy', label: '😊 Happy' },
                          { mood: 'calm', label: '😌 Peaceful' },
                          { mood: 'tired', label: '😴 Low Energy' },
                          { mood: 'unwell', label: '🤢 Queasy' },
                          { mood: 'excited', label: '💖 Excited' }
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.mood}
                          type="button"
                          onClick={() => setEditMood(item.mood)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            editMood === item.mood
                              ? 'bg-rose-100 border-rose-400 text-rose-800 font-black'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Direct Textarea Editor */}
                    <textarea
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-rose-500 focus:bg-white transition-all resize-y"
                      placeholder="Write or edit your daily thoughts, kicks, symptoms..."
                    />

                    {/* Quick Tags in Edit mode */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500">Quick Tags:</span>
                        <button
                          type="button"
                          onClick={() => setEditWater((w) => w + 1)}
                          className="text-[11px] text-sky-700 font-semibold flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 cursor-pointer"
                        >
                          <Droplets className="w-3 h-3 text-sky-500" />
                          <span>{editWater} glasses water (+1)</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {quickTagOptions.map((tag) => {
                          const isSelected = editTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleEditTag(tag)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Save / Cancel buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveInline(entry.date)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                      {entry.note}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400">
                        {entry.waterGlasses && entry.waterGlasses > 0 ? (
                          <span className="flex items-center gap-1 text-sky-700 font-medium">
                            <Droplets className="w-3 h-3 text-sky-500" />
                            {entry.waterGlasses} glasses
                          </span>
                        ) : null}
                        {entry.updatedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.updatedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
