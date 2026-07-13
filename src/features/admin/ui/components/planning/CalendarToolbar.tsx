import React from 'react';

interface Props {
  viewMode: 'classe' | 'salle' | 'prof';
  setViewMode: (mode: 'classe' | 'salle' | 'prof') => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filterOptions: string[];
}

export function CalendarToolbar({
  viewMode,
  setViewMode,
  activeFilter,
  setActiveFilter,
  filterOptions,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F6] p-4 border border-neutral-200 rounded-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase text-neutral-400">Vue Maître :</span>
        {(['classe', 'salle', 'prof'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode);
              setActiveFilter('ALL');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === mode
                ? 'bg-[#B3181C] text-white'
                : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
            }`}
          >
            {mode === 'classe' ? 'Par Classe' : mode === 'salle' ? 'Par Salle' : 'Par Enseignant'}
          </button>
        ))}
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold bg-white"
        >
          <option value="ALL">Afficher Tout</option>
          {filterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs font-bold bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg cursor-pointer">
          Aujourd'hui
        </button>
        <button className="px-3 py-1.5 text-xs font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg cursor-pointer flex items-center gap-1">
          <span translate="no" className="material-symbols-outlined text-sm">
            print
          </span>
          <span>Imprimer PDF</span>
        </button>
      </div>
    </div>
  );
}
