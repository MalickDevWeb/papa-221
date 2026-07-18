import React, { useState, useMemo } from 'react';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';
import type { AttendanceByStudent, AttendanceStatus } from '../../../domain/ProfessorAttendance';
import { ProfessorAttendanceStats } from './ProfessorAttendanceStats';
import { ProfessorAttendanceRow } from './ProfessorAttendanceRow';
import { Search, CheckSquare } from 'lucide-react';

interface Props {
  readonly students: readonly StudentEnrolled[];
  readonly attendance: AttendanceByStudent;
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
}

type FilterType = 'all' | 'present' | 'retard' | 'absent';

export function ProfessorAttendanceSection({ students, attendance, onMarkAttendance }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const stats = useMemo(() => {
    let p = 0, r = 0, a = 0;
    students.forEach((s) => {
      const st = attendance[s.id] ?? 'absent';
      if (st === 'present') p++; else if (st === 'retard') r++; else a++;
    });
    return { total: students.length, present: p, retard: r, absent: a };
  }, [students, attendance]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const prenom = s.prenom || '';
      const nom = s.nom || '';
      const matricule = s.matricule || '';
      const query = (searchQuery || "").toLowerCase();
      const match = `${prenom} ${nom}`.toLowerCase().includes(query) || matricule.toLowerCase().includes(query);
      const status = attendance[s.id] ?? 'absent';
      return match && (activeFilter === 'all' || status === activeFilter);
    });
  }, [students, attendance, searchQuery, activeFilter]);

  return (
    <div className="space-y-6 select-none">
      <ProfessorAttendanceStats {...stats} />
      <section className="bg-white border border-neutral-200/90 rounded-[28px] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 bg-neutral-100 p-1 rounded-xl w-full xl:w-auto shrink-0">
            {([
              { key: 'all', label: 'Tous', count: students.length },
              { key: 'present', label: 'Présents', count: stats.present },
              { key: 'retard', label: 'Retards', count: stats.retard },
              { key: 'absent', label: 'Absents', count: stats.absent }
            ] as const).map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 border-0 ${
                  activeFilter === filter.key ? 'bg-white text-neutral-800 shadow-3xs' : 'text-neutral-500 hover:text-neutral-800 bg-transparent'
                }`}
              >
                {filter.label}
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-full text-neutral-600 font-mono">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 focus-within:border-brand-red-deep focus-within:bg-white rounded-xl transition-all w-full sm:w-[220px]">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un élève..."
                className="bg-transparent text-xs font-bold text-neutral-700 outline-none w-full border-0 p-0"
              />
            </div>
            <button
              type="button"
              onClick={() => students.forEach((s) => onMarkAttendance(s.id, 'present'))}
              disabled={students.length === 0}
              className="flex items-center justify-center gap-1.5 bg-[#FFF5F5] hover:bg-[#FFEBEB] text-[#B3181C] border border-[#B3181C]/15 font-black text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-97 cursor-pointer whitespace-nowrap border-0"
            >
              <CheckSquare className="h-4 w-4 shrink-0" /> Tout marquer Présent
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-0.5">
          {filteredStudents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-10 text-center flex flex-col items-center justify-center gap-2">
              <span translate="no" className="material-symbols-outlined text-neutral-300 text-4xl">person_search</span>
              <p className="text-sm font-black text-neutral-400 mt-1">Aucun étudiant trouvé</p>
              <p className="text-xs text-neutral-400 font-semibold">Ajustez votre recherche ou vos filtres.</p>
            </div>
          ) : (
            filteredStudents.map((s) => (
              <ProfessorAttendanceRow key={s.id} student={s} status={attendance[s.id] ?? 'absent'} onMark={onMarkAttendance} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

