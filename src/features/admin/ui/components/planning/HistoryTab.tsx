import React, { useState } from 'react';
import { AuditLog, CalendarSlot, UnassignedCourse } from '../../../domain/PlanningModels';

interface Props {
  readonly logs: AuditLog[];
  readonly slots: CalendarSlot[];
  readonly unassigned: UnassignedCourse[];
  readonly onRestore: (log: AuditLog) => void;
}

export function HistoryTab({ logs, onRestore }: Props) {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((l) =>
    [l.action, l.target, l.motif, l.author].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="history-tab-root">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C]">history</span>
            <span>Historique des Modifications & Registre d'Audit</span>
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Traçabilité complète des actions de planification et retour arrière en temps réel.</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une action, un motif..."
          className="px-3 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold w-64 focus:outline-none focus:border-[#B3181C]"
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                <th className="p-3">Horodatage</th>
                <th className="p-3">Auteur</th>
                <th className="p-3">Action</th>
                <th className="p-3">Cible</th>
                <th className="p-3">Détails de modification</th>
                <th className="p-3">Motif</th>
                <th className="p-3 text-right">Restauration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-extrabold uppercase text-[10px] tracking-wider">
                    Aucun log de modification enregistré.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-[#1E293B] font-extrabold">{log.date}</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">{log.time}</div>
                    </td>
                    <td translate="no" className="p-3 whitespace-nowrap font-bold text-neutral-700">
                      {log.author}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        log.action === 'Ajout' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        log.action === 'Suppression' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-[#1E293B]">
                      {log.target}
                    </td>
                    <td className="p-3 font-semibold text-neutral-500 max-w-xs truncate">
                      <span className="text-neutral-400">De :</span> {log.oldValue} <br />
                      <span className="text-[#B3181C] font-black">À :</span> {log.newValue}
                    </td>
                    <td className="p-3 italic text-neutral-400 font-medium">
                      {log.motif}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onRestore(log)}
                        className="px-2 py-1 border border-[#B3181C]/30 text-[#B3181C] hover:bg-[#B3181C]/5 rounded-lg text-[10px] font-black transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Restaurer l'état précédent"
                      >
                        <span translate="no" className="material-symbols-outlined text-[11px]">restore</span>
                        <span>Revenir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
