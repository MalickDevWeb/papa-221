import React, { useState } from 'react';
import { Student } from '../../../domain/StudentModels';
import { useDeviceStore } from '@/features/screenguard/hooks/useDeviceStore';
import { MobileStudentCards } from '@/features/screenguard/ui/components/MobileStudentCards';

interface Props {
  students: Student[];
  onUpdateStudents: (list: Student[]) => void;
  onViewProfile: (student: Student) => void;
}

export function StudentDataGridTab({ students, onUpdateStudents, onViewProfile }: Props) {
  const { isMobile } = useDeviceStore();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterFin, setFilterFin] = useState('ALL');
  const [filterQr, setFilterQr] = useState('ALL');

  const toggleQrStatus = (id: string) => {
    onUpdateStudents(students.map(s => s.id === id ? { ...s, qrStatus: s.qrStatus === 'AUTORISÉ' ? 'SUSPENDU' : 'AUTORISÉ' } : s));
  };

  if (isMobile) {
    return (
      <MobileStudentCards
        students={students as any}
        onToggleQr={toggleQrStatus}
        onViewProfile={onViewProfile}
      />
    );
  }

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.matricule.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass === 'ALL' || s.classe === filterClass;
    const matchesFin = filterFin === 'ALL' || s.financialStatus === filterFin;
    const matchesQr = filterQr === 'ALL' || s.qrStatus === filterQr;
    return matchesSearch && matchesClass && matchesFin && matchesQr;
  });

  return (
    <div className="space-y-4 font-sans text-xs" id="student-grid-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Annuaire & DataGrid Enterprise</h3>
          <p className="text-[10px] text-neutral-400 font-bold">Suivi d'accès QR, états de paiement et scolarité.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <input type="text" placeholder="Rechercher par Nom, Matricule..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold bg-white outline-none" />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-semibold outline-none">
          <option value="ALL">Toutes les classes</option>
          {Array.from(new Set(students.map(s => s.classe))).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterFin} onChange={e => setFilterFin(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-semibold outline-none">
          <option value="ALL">Tous les paiements</option>
          <option value="En Règle">En Règle</option>
          <option value="En Retard">En Retard</option>
        </select>
        <select value={filterQr} onChange={e => setFilterQr(e.target.value)} className="px-3 py-2 border border-[#E2DCDA] rounded-xl bg-white text-xs font-semibold outline-none">
          <option value="ALL">Tous les statuts QR</option>
          <option value="AUTORISÉ">AUTORISÉ</option>
          <option value="SUSPENDU">SUSPENDU</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-bold text-neutral-600">
            <thead>
              <tr className="bg-[#FAF8F6] text-[9px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200">
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Paiement</th>
                <th className="px-4 py-3">Accès QR</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50/30">
                  <td className="px-4 py-3 text-[#1E293B] font-extrabold">{s.matricule}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center border border-slate-200 text-[10px]">{s.name[0]}</div>
                      <span className="text-slate-800 font-bold">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 font-semibold">{s.classe}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] border font-black uppercase ${s.financialStatus === 'En Règle' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{s.financialStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleQrStatus(s.id)} className={`px-2.5 py-1 text-[8.5px] font-black uppercase rounded-lg border cursor-pointer ${s.qrStatus === 'AUTORISÉ' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {s.qrStatus}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onViewProfile(s)} className="text-[#B3181C] hover:underline cursor-pointer">Profil 360°</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
