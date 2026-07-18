import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';

interface Student {
  id: string;
  matricule: string;
  name: string;
  email: string;
  classe: string;
  financialStatus: string;
  qrStatus: string;
}

interface Props {
  students: Student[];
  onToggleQr: (id: string) => void;
  onViewProfile: (student: Student) => void;
}

export function MobileStudentCards({ students, onToggleQr, onViewProfile }: Props) {
  const [search, setSearch] = useState('');

  const filtered = students.filter(
    (s) =>
      s.matricule.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="mobile-student-cards" className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Recherche par matricule ou nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#B3181C] focus:outline-none shadow-xs"
        />
      </div>

      {/* Grid of Cards */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((student) => {
            const isAuthorized = student.qrStatus === 'AUTORISÉ';
            const isInRule = student.financialStatus === 'En Règle';

            return (
              <div
                key={student.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center border border-slate-200 text-xs">
                      {student.name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{student.email}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono uppercase">
                    {student.matricule}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-extrabold pt-2 border-t border-slate-50">
                  <span className="text-slate-500">{student.classe}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] uppercase ${
                      isInRule ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {student.financialStatus}
                    </span>
                    <button
                      onClick={() => onToggleQr(student.id)}
                      className={`px-2 py-0.5 rounded-md text-[8px] uppercase cursor-pointer flex items-center gap-0.5 font-black ${
                        isAuthorized ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      {isAuthorized ? <ShieldCheck className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                      {student.qrStatus}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onViewProfile(student as any)}
                  className="w-full mt-1.5 py-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Fiche Profil 360°
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
            Aucun élève correspondant au matricule ou nom.
          </div>
        )}
      </div>
    </div>
  );
}
