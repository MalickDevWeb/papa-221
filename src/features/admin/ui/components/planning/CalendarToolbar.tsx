import React, { useState } from 'react';

interface Props {
  readonly viewMode: 'classe' | 'salle' | 'prof';
  readonly setViewMode: (mode: 'classe' | 'salle' | 'prof') => void;
  readonly activeFilter: string;
  readonly setActiveFilter: (filter: string) => void;
  readonly filterOptions: string[];
  readonly slots: any[];
}

export function CalendarToolbar({
  viewMode,
  setViewMode,
  activeFilter,
  setActiveFilter,
  filterOptions,
  slots,
}: Props) {
  const [showExport, setShowExport] = useState(false);

  const triggerDownload = (format: string) => {
    setShowExport(false);
    const content = format === 'csv'
      ? "Sujet,Professeur,Salle,Classe,Jour,Creneau,Type,Semestre,Annee\n" + slots.map(s => `"${s.subject}","${s.prof}","${s.room}","${s.classe}","${s.day}","${s.slot}","${s.type}","${s.semestre}","${s.anneeAcademique}"`).join("\n")
      : `Planning Export - ${format.toUpperCase()}\nTotal: ${slots.length} cours`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emploi-du-temps-${activeFilter.replace(/\s+/g, '-')}.${format === 'excel' ? 'xlsx' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const secureLink = `${window.location.origin}/etudiant/planning?shared=true&filter=${encodeURIComponent(activeFilter)}`;
    navigator.clipboard.writeText(secureLink).then(() => {
      alert(`Lien sécurisé copié dans le presse-papier :\n${secureLink}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F6] p-4 border border-neutral-200 rounded-2xl" id="calendar-toolbar">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase text-neutral-400">Vue Maître :</span>
        {(['classe', 'salle', 'prof'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); setActiveFilter('ALL'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${viewMode === mode ? 'bg-[#B3181C] text-white' : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'}`}
          >
            {mode === 'classe' ? 'Par Classe' : mode === 'salle' ? 'Par Salle' : 'Par Enseignant'}
          </button>
        ))}
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold bg-white text-neutral-700"
        >
          <option value="ALL">Afficher Tout</option>
          {filterOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          onClick={handleShare}
          className="px-3 py-1.5 text-xs font-bold bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg cursor-pointer flex items-center gap-1.5"
          title="Générer un lien de partage"
        >
          <span translate="no" className="material-symbols-outlined text-sm text-[#B3181C]">share</span>
          <span>Partager</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="px-3 py-1.5 text-xs font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <span translate="no" className="material-symbols-outlined text-sm">download</span>
            <span>Exporter / Imprimer</span>
          </button>
          {showExport && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <button onClick={() => window.print()} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-sm text-neutral-400">print</span> Imprimer direct
              </button>
              <button onClick={() => triggerDownload('pdf')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-sm text-rose-500">picture_as_pdf</span> Document PDF
              </button>
              <button onClick={() => triggerDownload('excel')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-sm text-emerald-600">table_view</span> Feuille Excel
              </button>
              <button onClick={() => triggerDownload('csv')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-sm text-blue-500">csv</span> Fichier CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
