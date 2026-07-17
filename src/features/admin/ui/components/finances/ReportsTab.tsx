import React, { useState } from 'react';

export function ReportsTab() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const startExport = (name: string) => {
    setExporting(name);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setExporting(null), 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 text-xs font-bold text-[#4A5568]" id="reports-tab-root">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Centre de Rapports Comptables & Exports</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Téléchargez les bilans analytiques pour les inspections ou la direction générale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-[#1E293B] block">Bilan Mensuel Analytique</span>
          <p className="text-[10px] text-neutral-400 font-semibold leading-normal">
            Générez un rapport PDF complet intégrant l'ensemble des encaissements d'écolages, des dépenses de fonctionnement et des ratios de recouvrement.
          </p>
          <button
            onClick={() => startExport('Bilan Mensuel PDF')}
            disabled={exporting !== null}
            className="w-full py-2.5 bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white rounded-xl uppercase tracking-wider text-[9px] font-black transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <span translate="no" className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>Télécharger le Bilan Mensuel (PDF)</span>
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-[#1E293B] block">Balance Générale des Écolages</span>
          <p className="text-[10px] text-neutral-400 font-semibold leading-normal">
            Exportez au format Excel l'historique complet des versements par élève, classés par promotion et statut de scolarité pour intégration comptable.
          </p>
          <button
            onClick={() => startExport('Balance Générale Excel')}
            disabled={exporting !== null}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl uppercase tracking-wider text-[9px] font-black transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <span translate="no" className="material-symbols-outlined text-sm">table_view</span>
            <span>Exporter la balance générale (Excel)</span>
          </button>
        </div>
      </div>

      {exporting && (
        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xl space-y-2 animate-fade-in">
          <div className="flex justify-between text-[10px] font-black text-neutral-600 uppercase">
            <span>Génération du fichier : {exporting}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#B3181C] h-full transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
