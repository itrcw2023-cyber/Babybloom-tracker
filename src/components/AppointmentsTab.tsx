import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Stethoscope,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Appointment, UserProfile } from '../types/pregnancy';

interface AppointmentsTabProps {
  profile: UserProfile;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteAppointment: (id: string) => void;
  onAddQuestion: (appointmentId: string, question: string) => void;
  onToggleReminder: (id: string) => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  profile,
  appointments,
  onAddAppointment,
  onToggleComplete,
  onDeleteAppointment,
  onAddQuestion,
  onToggleReminder
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState(profile.doctorName || 'Dr. Sarah Bennett, MD');
  const [location, setLocation] = useState(profile.hospitalName || 'St. Jude Women Pavilion');
  const [dateTime, setDateTime] = useState('');
  const [week, setWeek] = useState<number>(profile.currentWeek + 2);
  const [notes, setNotes] = useState('');
  const [newQuestionInput, setNewQuestionInput] = useState<{ [key: string]: string }>({});

  const upcomingAppointments = appointments
    .filter((a) => !a.completed)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const completedAppointments = appointments
    .filter((a) => a.completed)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dateTime) return;
    onAddAppointment({
      title,
      doctor,
      location,
      dateTime,
      week,
      notes,
      questions: [],
      completed: false,
      reminderSet: true
    });
    setIsAdding(false);
    setTitle('');
    setNotes('');
  };

  const handleAddQuestionToVisit = (appointmentId: string) => {
    const q = newQuestionInput[appointmentId]?.trim();
    if (!q) return;
    onAddQuestion(appointmentId, q);
    setNewQuestionInput({ ...newQuestionInput, [appointmentId]: '' });
  };

  const formatVisitDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-4 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900">Doctor & Ultrasound Visits</h2>
          <p className="text-xs text-stone-500">Track checkups, tests, and questions to ask</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1 shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Visit</span>
        </button>
      </div>

      {/* Add Visit Form */}
      {isAdding && (
        <form onSubmit={handleCreateAppointment} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <span className="text-xs font-bold text-stone-900 block">Schedule Prenatal Visit</span>

          <div>
            <label className="text-[11px] text-stone-600 block mb-1">Visit Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 24-Week Routine Checkup & Glucose Screening"
              className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Gestational Week</label>
              <input
                type="number"
                min="1"
                max="42"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Physician / Midwife</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="Dr. Name"
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Clinic / Hospital</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Clinic name or suite"
                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-600 block mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Remember to drink 1 glass of water 30 mins before scan..."
              className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
            >
              Save Appointment
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-2 px-3 border border-stone-200 text-stone-600 rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* UPCOMING VISITS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          Upcoming ({upcomingAppointments.length})
        </h3>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-6 text-center space-y-2">
            <span className="text-xs font-semibold text-stone-700 block">No Appointments Scheduled Yet</span>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
              Schedule your next routine OB checkup or ultrasound scan to keep track of questions and get reminders.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Visit</span>
            </button>
          </div>
        ) : (
          upcomingAppointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide">
                    Week {apt.week} Checkup
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-0.5">{apt.title}</h4>
                </div>
                <button
                  onClick={() => onToggleComplete(apt.id)}
                  className="py-1 px-2.5 rounded-lg border border-stone-200 hover:bg-emerald-50 text-[11px] font-medium text-stone-600 hover:text-emerald-700 flex items-center gap-1 transition-all"
                  title="Mark as completed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              </div>

              {/* Date & Location */}
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-medium text-stone-800">{formatVisitDate(apt.dateTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{apt.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-stone-500">{apt.location}</span>
                </div>
              </div>

              {apt.notes && (
                <div className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-700 border border-stone-100">
                  <span className="font-semibold text-stone-800 block text-[10px] uppercase">Notes</span>
                  {apt.notes}
                </div>
              )}

              {/* Questions Checklist for Doctor */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  Questions to ask Dr. Bennett:
                </span>
                {apt.questions.length > 0 && (
                  <ul className="space-y-1.5">
                    {apt.questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Add question input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newQuestionInput[apt.id] || ''}
                    onChange={(e) => setNewQuestionInput({ ...newQuestionInput, [apt.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddQuestionToVisit(apt.id)}
                    placeholder="Type a question for the doctor..."
                    className="flex-1 text-xs p-1.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleAddQuestionToVisit(apt.id)}
                    className="py-1.5 px-2.5 bg-stone-900 text-white text-xs rounded-lg font-medium hover:bg-stone-800"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <button
                  onClick={() => onToggleReminder(apt.id)}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    apt.reminderSet ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{apt.reminderSet ? 'Reminder Active (24h before)' : 'Enable Reminder'}</span>
                </button>
                <button
                  onClick={() => onDeleteAppointment(apt.id)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Delete appointment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMPLETED VISITS */}
      {completedAppointments.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Completed Visits ({completedAppointments.length})
          </h3>
          {completedAppointments.map((apt) => (
            <div key={apt.id} className="bg-stone-50/80 rounded-2xl border border-stone-200/60 p-3.5 text-xs space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 line-through text-stone-500">{apt.title}</span>
                  <span className="block text-[11px] text-stone-400">
                    Week {apt.week} · {formatVisitDate(apt.dateTime)}
                  </span>
                </div>
                <button
                  onClick={() => onToggleComplete(apt.id)}
                  className="text-[11px] text-stone-500 hover:underline"
                >
                  Re-open
                </button>
              </div>
              {apt.notes && (
                <p className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-100">
                  {apt.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Philippine Prenatal Standards Guide Card */}
      <div className="bg-rose-50/60 rounded-2xl border border-rose-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🇵🇭</span>
            <div>
              <h3 className="text-xs font-bold text-rose-950">
                POGS &amp; PhilHealth Prenatal Milestones
              </h3>
              <p className="text-[10px] text-rose-800">Key Philippine OB-GYN checkup roadmap</p>
            </div>
          </div>
          <a
            href="https://pogs.org.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-rose-700 hover:underline"
          >
            POGS.org.ph ↗
          </a>
        </div>

        <div className="space-y-1.5 text-xs text-stone-700">
          <div className="p-2 bg-white rounded-xl border border-rose-100/80 flex items-start gap-2">
            <span className="font-bold text-rose-700 shrink-0">Wk 6–10:</span>
            <span>Early Transvaginal Ultrasound (TVS) for heartbeat &amp; gestational sac dating.</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-rose-100/80 flex items-start gap-2">
            <span className="font-bold text-rose-700 shrink-0">Wk 18–22:</span>
            <span>Congenital Anomaly Scan (CAS / 2D/3D Ultrasound) for complete organ anatomy check.</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-rose-100/80 flex items-start gap-2">
            <span className="font-bold text-rose-700 shrink-0">Wk 24–28:</span>
            <span>75g OGTT (Oral Glucose Tolerance Test) screening for Gestational Diabetes.</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-rose-100/80 flex items-start gap-2">
            <span className="font-bold text-rose-700 shrink-0">Wk 32–36:</span>
            <span>Fetal Biometry Ultrasound, BPP (Biophysical Profile), and PhilHealth MCP document prep.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
