import React from 'react';
import { ConflictAlert } from '../../../domain/PlanningModels';

interface Props {
  conflicts: ConflictAlert[];
  onClearConflict: (id: string) => void;
  onClearAll: () => void;
}

export function ConflictsTab({ conflicts, onClearConflict, onClearAll }: Props) {
  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="conflicts-tab-root">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-rose-600 animate-pulse">warning</span>
            <span>Matrice de Contrôle Synchrone des Conflits</span>
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Validation algorithmique temps réel (Salle, Enseignant, Promotion).</p>
        </div>
        {conflicts.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Résoudre tout d'un coup
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Statistics Cards */}
        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600">
            <span translate="no" className="material-symbols-outlined text-xl">room</span>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-black uppercase">Double-résas Salle</div>
            <div className="text-xl font-black text-[#1E293B]">{conflicts.filter(c => c.type === 'Salle').length}</div>
          </div>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
            <span translate="no" className="material-symbols-outlined text-xl">person</span>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-black uppercase">Conflits Professeur</div>
            <div className="text-xl font-black text-[#1E293B]">{conflicts.filter(c => c.type === 'Enseignant').length}</div>
          </div>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[#B3181C]">
            <span translate="no" className="material-symbols-outlined text-xl">school</span>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-black uppercase">Surcharges Classe</div>
            <div className="text-xl font-black text-[#1E293B]">{conflicts.filter(c => c.type === 'Classe').length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-sm">
        <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Alertes Actives & Résolutions</h4>

        {conflicts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <span translate="no" className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
            <p className="text-xs font-black text-[#1E293B] uppercase tracking-wider">Zéro conflit détecté ! ✨</p>
            <p className="text-[10px] text-neutral-400 font-semibold max-w-sm">Le moteur de surveillance garantit un planning sans aucune collision logistique.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conflicts.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 border rounded-xl flex items-center justify-between transition-all ${
                  c.severity === 'high' ? 'bg-rose-50/50 border-rose-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    translate="no"
                    className={`material-symbols-outlined text-lg mt-0.5 ${
                      c.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  >
                    {c.type === 'Salle' ? 'meeting_room' : c.type === 'Enseignant' ? 'badge' : 'groups'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        c.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Conflit {c.type}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-semibold">{c.timestamp}</span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-xs mt-1.5">{c.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => onClearConflict(c.id)}
                  className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-neutral-700 hover:text-neutral-900 shadow-xs transition-colors cursor-pointer"
                >
                  Résoudre
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
