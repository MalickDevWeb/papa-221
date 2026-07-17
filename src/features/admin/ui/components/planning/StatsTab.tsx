import React from 'react';
import { CalendarSlot, TeacherSubjectAssociation, INITIAL_TEACHERS } from '../../../domain/PlanningModels';

interface Props {
  readonly associations: TeacherSubjectAssociation[];
  readonly slots: CalendarSlot[];
  readonly onRemoveAssociation: (id: string) => void;
}

export function StatsTab({ associations, slots, onRemoveAssociation }: Props) {
  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="stats-tab-root">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-[#B3181C]">analytics</span>
          <span>Association Enseignant ↔ Classe ↔ Matière & Statistiques de Charge</span>
        </h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Registre mémorisé des affectations pédagogiques et équilibre horaire des enseignants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registre des Associations */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-sm">
          <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Matières Mémorisées par Enseignant</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {associations.length === 0 ? (
              <div className="py-8 text-center text-neutral-400 font-bold">
                Aucune association enregistrée pour le moment.
              </div>
            ) : (
              associations.map((assoc) => (
                <div key={assoc.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-[#1E293B]">{assoc.prof}</div>
                    <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                      {assoc.subject} <span className="text-[#B3181C] font-black">→</span> {assoc.classe}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAssociation(assoc.id)}
                    className="p-1 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer l'association"
                  >
                    <span translate="no" className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charge Horaire par Enseignant */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-sm">
          <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Volume Horaire Réparti (sur 2h/cours)</h4>
          <div className="space-y-3">
            {INITIAL_TEACHERS.map((teacher) => {
              const currentHours = slots.filter((s) => s.prof === teacher.name).length * 2;
              const ratio = Math.min((currentHours / teacher.maxHours) * 100, 100);

              return (
                <div key={teacher.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-extrabold text-[#1E293B]">{teacher.name}</span>
                    <span className="font-black text-neutral-500">
                      {currentHours}h / <span className="text-[#B3181C]">{teacher.maxHours}h max</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentHours > teacher.maxHours ? 'bg-rose-600 animate-pulse' : ratio > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
