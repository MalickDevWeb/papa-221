import React, { useState } from 'react';
import { INITIAL_YEARS, INITIAL_SESSIONS, INITIAL_PROMOTIONS } from './AcademicMockData';

export function AcademicYearsSection() {
  const [years, setYears] = useState(INITIAL_YEARS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS);

  const [newYear, setNewYear] = useState('');
  const [newSession, setNewSession] = useState({ name: '', start: '', end: '' });
  const [newPromo, setNewPromo] = useState('');

  const addYear = () => {
    if (!newYear.trim()) return;
    setYears([...years, { id: Date.now().toString(), name: newYear, status: 'actif' }]);
    setNewYear('');
  };

  const addSession = () => {
    if (!newSession.name.trim()) return;
    setSessions([...sessions, { id: Date.now().toString(), name: newSession.name, startDate: newSession.start, endDate: newSession.end }]);
    setNewSession({ name: '', start: '', end: '' });
  };

  const addPromo = () => {
    if (!newPromo.trim()) return;
    setPromotions([...promotions, { id: Date.now().toString(), name: newPromo }]);
    setNewPromo('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-semibold" id="academic-years-section">
      {/* Annees Academiques */}
      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/80 space-y-3">
        <h4 className="font-extrabold text-[#1E293B] uppercase tracking-wider flex items-center gap-1 text-[#B3181C]">
          <span className="material-symbols-outlined text-sm">calendar_today</span> Années Académiques
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {years.map(y => (
            <div key={y.id} className="flex justify-between items-center bg-white p-2 border border-neutral-150/60 rounded-xl">
              <span className="font-bold text-neutral-800">{y.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase ${y.status === 'actif' ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-400'}`}>
                {y.status}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 pt-1.5">
          <input type="text" placeholder="Ex: 2027-2028" value={newYear} onChange={e => setNewYear(e.target.value)} className="flex-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
          <button onClick={addYear} className="p-1.5 bg-[#B3181C] text-white font-extrabold uppercase text-[10px] rounded-lg">Ajouter</button>
        </div>
      </div>

      {/* Sessions / Semestres */}
      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/80 space-y-3">
        <h4 className="font-extrabold text-[#1E293B] uppercase tracking-wider flex items-center gap-1 text-[#B3181C]">
          <span className="material-symbols-outlined text-sm">schedule_send</span> Semestres & Sessions
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {sessions.map(s => (
            <div key={s.id} className="bg-white p-2 border border-neutral-150/60 rounded-xl space-y-0.5">
              <p className="font-bold text-neutral-800">{s.name}</p>
              <p className="text-[9px] text-neutral-400 font-bold">{s.startDate} au {s.endDate}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 pt-1.5">
          <input type="text" placeholder="Semestre / Session" value={newSession.name} onChange={e => setNewSession({ ...newSession, name: e.target.value })} className="w-full p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
          <div className="flex gap-1.5">
            <input type="date" value={newSession.start} onChange={e => setNewSession({ ...newSession, start: e.target.value })} className="w-1/2 p-1 border border-neutral-200 rounded-lg text-[10px] font-bold" />
            <input type="date" value={newSession.end} onChange={e => setNewSession({ ...newSession, end: e.target.value })} className="w-1/2 p-1 border border-neutral-200 rounded-lg text-[10px] font-bold" />
          </div>
          <button onClick={addSession} className="w-full py-1.5 bg-[#B3181C] text-white font-extrabold uppercase text-[10px] rounded-lg">Ajouter Session</button>
        </div>
      </div>

      {/* Promotions */}
      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/80 space-y-3">
        <h4 className="font-extrabold text-[#1E293B] uppercase tracking-wider flex items-center gap-1 text-[#B3181C]">
          <span className="material-symbols-outlined text-sm">groups</span> Promotions Actives
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {promotions.map(p => (
            <div key={p.id} className="bg-white p-2 border border-neutral-150/60 rounded-xl">
              <span className="font-bold text-neutral-800">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 pt-1.5">
          <input type="text" placeholder="Ex: Promotion L3 GL" value={newPromo} onChange={e => setNewPromo(e.target.value)} className="flex-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
          <button onClick={addPromo} className="p-1.5 bg-[#B3181C] text-white font-extrabold uppercase text-[10px] rounded-lg">Créer</button>
        </div>
      </div>
    </div>
  );
}
