import React from 'react';

export interface FilterState {
  readonly anneeAcademique: string;
  readonly semestre: string;
  readonly faculte: string;
  readonly departement: string;
  readonly type: string;
  readonly day: string;
  readonly building: string;
}

interface Props {
  readonly filters: FilterState;
  readonly onChange: (updater: (prev: FilterState) => FilterState) => void;
  readonly onReset: () => void;
}

export function PlanningFiltersPanel({ filters, onChange, onReset }: Props) {
  const selectClass = "px-2 py-1.5 border border-neutral-200 rounded-xl text-[10px] font-bold bg-white text-neutral-700 focus:outline-none focus:border-[#B3181C]";

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-xs space-y-3" id="planning-filters-panel">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
          <span translate="no" className="material-symbols-outlined text-sm">tune</span>
          <span>Filtres Multi-Critères Combinables</span>
        </span>
        <button
          onClick={onReset}
          className="text-[10px] font-black text-[#B3181C] hover:underline cursor-pointer"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        <select
          value={filters.anneeAcademique}
          onChange={(e) => onChange((prev) => ({ ...prev, anneeAcademique: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Année (Toutes)</option>
          <option value="2025-2026">2025-2026</option>
          <option value="2026-2027">2026-2027</option>
        </select>

        <select
          value={filters.semestre}
          onChange={(e) => onChange((prev) => ({ ...prev, semestre: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Semestre (Tous)</option>
          <option value="Semestre 1">Semestre 1</option>
          <option value="Semestre 2">Semestre 2</option>
        </select>

        <select
          value={filters.faculte}
          onChange={(e) => onChange((prev) => ({ ...prev, faculte: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Faculté (Toutes)</option>
          <option value="Sciences & Techniques">Sciences & Tech</option>
          <option value="Médecine">Médecine</option>
          <option value="Lettres">Lettres & SH</option>
        </select>

        <select
          value={filters.departement}
          onChange={(e) => onChange((prev) => ({ ...prev, departement: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Département (Tous)</option>
          <option value="Génie Civil">Génie Civil</option>
          <option value="Informatique">Informatique</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => onChange((prev) => ({ ...prev, type: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Type de Cours</option>
          <option value="CM">Cours Magistral (CM)</option>
          <option value="TD">Travaux Dirigés (TD)</option>
          <option value="TP">Travaux Pratiques (TP)</option>
        </select>

        <select
          value={filters.day}
          onChange={(e) => onChange((prev) => ({ ...prev, day: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Jour (Tous)</option>
          <option value="Lundi">Lundi</option>
          <option value="Mardi">Mardi</option>
          <option value="Mercredi">Mercredi</option>
          <option value="Jeudi">Jeudi</option>
          <option value="Vendredi">Vendredi</option>
          <option value="Samedi">Samedi</option>
        </select>

        <select
          value={filters.building}
          onChange={(e) => onChange((prev) => ({ ...prev, building: e.target.value }))}
          className={selectClass}
        >
          <option value="ALL">Bâtiment (Tous)</option>
          <option value="Bâtiment Central">Bâtiment Central</option>
          <option value="Bâtiment B">Bâtiment B</option>
        </select>
      </div>
    </div>
  );
}
