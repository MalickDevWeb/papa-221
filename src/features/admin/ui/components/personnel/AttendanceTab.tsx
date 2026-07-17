import React from 'react';
import { INITIAL_ATTENDANCE } from '../../../domain/PersonnelModels';

export function AttendanceTab() {
  const records = INITIAL_ATTENDANCE;
  const presentCount = records.filter(r => r.status !== 'Absent').length;
  const totalCount = records.length;
  const rate = Math.round((presentCount / totalCount) * 100);

  return (
    <div className="space-y-4" id="attendance-tab-root">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Pointages & Émargements (Aujourd'hui)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F6] text-[10px] font-black text-neutral-400 uppercase border-b border-neutral-200">
                  <th className="px-4 py-2.5">Collaborateur</th>
                  <th className="px-4 py-2.5">Rôle</th>
                  <th className="px-4 py-2.5">Arrivée</th>
                  <th className="px-4 py-2.5">Départ</th>
                  <th className="px-4 py-2.5">Heures</th>
                  <th className="px-4 py-2.5">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-2.5 flex items-center gap-2.5">
                      <img src={r.photo} alt={r.name} className="w-7 h-7 rounded-full object-cover border border-neutral-200" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[#1E293B] font-extrabold">{r.name}</span>
                        <p className="text-[8px] text-neutral-400 font-semibold uppercase">{r.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[10px] text-neutral-500 uppercase">{r.role}</td>
                    <td className="px-4 py-2.5 font-mono">{r.checkIn}</td>
                    <td className="px-4 py-2.5 font-mono">{r.checkOut}</td>
                    <td className="px-4 py-2.5 font-mono">{r.hours > 0 ? `${r.hours}h` : '--'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                        r.status === 'À l\'heure' ? 'bg-emerald-50 text-emerald-700' :
                        r.status === 'En retard' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut Chart / KPI Box */}
        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">Taux de Présence</span>
            <span className="text-[9px] text-neutral-400 font-semibold">Toute l'équipe active</span>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center my-3">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-neutral-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#B3181C]" strokeDasharray={`${rate}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-[#1E293B]">{rate}%</span>
              <span className="text-[8px] uppercase font-bold text-[#B3181C] tracking-widest">{presentCount}/{totalCount} Actifs</span>
            </div>
          </div>

          <p className="text-[9px] text-neutral-400 font-semibold leading-normal">
            Le pointage s'effectue automatiquement via QR Code à l'entrée.
          </p>
        </div>
      </div>
    </div>
  );
}
