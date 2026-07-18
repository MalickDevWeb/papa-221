import React, { useState, useEffect } from 'react';
import { Check, GraduationCap, FileText, Laptop, Info, CalendarPlus } from 'lucide-react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { ProfessorScheduleFilters } from './ProfessorScheduleFilters';
import { ProfessorGridView } from './ProfessorGridView';
import { ProfessorTimelineView } from './ProfessorTimelineView';
import { ProfessorSessionModal } from './ProfessorSessionModal';
import { ProfessorSyncModal } from './ProfessorSyncModal';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly handleCancelCourse: (id: string, r: string) => Promise<void>;
  readonly handleRescheduleCourse: (id: string, d: string, t: string, rm: string) => Promise<void>;
  readonly onEnterCourse: (courseId: string) => void;
  readonly liveSessions?: readonly any[];
}

export function ProfessorScheduleView({ schedule, handleCancelCourse, handleRescheduleCourse, onEnterCourse, liveSessions = [] }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'TOUS' | 'CM' | 'TD' | 'TP'>('TOUS');
  const [filterStatus, setFilterStatus] = useState<'TOUS' | 'annule' | 'reprogramme' | 'a_venir'>('TOUS');
  const [filterClass, setFilterClass] = useState<string>('TOUS');
  const [selectedDay, setSelectedDay] = useState('Lundi');
  const [selectedSession, setSelectedSession] = useState<ProfessorSchedule | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('google_access_token') : null);

  const classesList = Array.from(new Set(schedule.map(s => s.classe || 'L3-GL'))).filter(Boolean);
  const triggerToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fitsFilters = (s: ProfessorSchedule) => {
    const mType = filterType === 'TOUS' || s.type === filterType;
    const mStatus = filterStatus === 'TOUS' || (s.status || 'a_venir') === filterStatus;
    const mClass = filterClass === 'TOUS' || (s.classe || 'L3-GL') === filterClass;
    const mSearch = !searchQuery.trim() || 
      (s.courseTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.room || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.classe && s.classe.toLowerCase().includes(searchQuery.toLowerCase()));
    return mType && mStatus && mClass && mSearch;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        sessionStorage.setItem('google_access_token', token);
        setGoogleAccessToken(token);
        setIsSyncOpen(true);
        triggerToast('Connexion à Google Calendar réussie !');
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F6] relative">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[250] bg-[#291715] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in text-xs font-black">
          <Check className="h-4 w-4 text-green-400 font-extrabold shrink-0" />{toast}
        </div>
      )}

      <ProfessorSessionModal session={selectedSession} onClose={() => setSelectedSession(null)} onCancel={async (id, r) => { await handleCancelCourse(id, r); triggerToast('Séance annulée !'); }} onReschedule={async (id, d, t, rm) => { await handleRescheduleCourse(id, d, t, rm); triggerToast('Séance reprogrammée !'); }} onEnter={onEnterCourse} />
      <ProfessorSyncModal isOpen={isSyncOpen} onClose={() => setIsSyncOpen(false)} schedule={schedule} googleAccessToken={googleAccessToken} setGoogleAccessToken={setGoogleAccessToken} triggerToast={triggerToast} />

      <div className="animate-fade-in flex flex-col h-full w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#291715] tracking-tight leading-none mb-1">Mon Emploi du Temps</h1>
            <p className="text-neutral-500 text-xs font-bold">Semaine du 23 au 27 Octobre 2023 • Semestre 1 • Espace Enseignant</p>
          </div>
          <button onClick={() => setIsSyncOpen(true)} className="flex items-center justify-center gap-2 bg-[#B3181C] text-white px-5 h-11 rounded-2xl hover:bg-[#8c1215] transition-all font-black text-xs uppercase tracking-wider cursor-pointer border-0 shadow-md whitespace-nowrap"><CalendarPlus className="h-4 w-4" /> Synchroniser l'agenda</button>
        </div>

        <ProfessorScheduleFilters viewMode={viewMode} setViewMode={setViewMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterType={filterType} setFilterType={setFilterType} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterClass={filterClass} setFilterClass={setFilterClass} classesList={classesList} triggerToast={triggerToast} />

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between mb-6 p-4 bg-white border border-neutral-gray-200 rounded-2xl shadow-3xs print:hidden">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-[#B3181C]/10 text-[#B3181C]"><GraduationCap className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">CM : Cours Magistral</span></div>
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-blue-50 text-blue-600"><FileText className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">TD : Travaux Dirigés</span></div>
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-green-50 text-green-600"><Laptop className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">TP : Travaux Pratiques</span></div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400"><Info className="h-3.5 w-3.5 text-[#B3181C] animate-pulse" /><span className="text-[10px] font-black italic tracking-wider uppercase">Cliquez sur un créneau pour gérer la séance</span></div>
        </div>

        {viewMode === 'grid' ? (
          <ProfessorGridView schedule={schedule} fitsFilters={fitsFilters} onSelectSession={setSelectedSession} liveSessions={liveSessions} />
        ) : (
          <ProfessorTimelineView schedule={schedule} selectedDay={selectedDay} setSelectedDay={setSelectedDay} fitsFilters={fitsFilters} resetAllFilters={() => { setFilterType('TOUS'); setFilterStatus('TOUS'); setFilterClass('TOUS'); setSearchQuery(''); triggerToast('Filtres réinitialisés !'); }} onSelectSession={setSelectedSession} liveSessions={liveSessions} />
        )}
      </div>
    </div>
  );
}
