import React from 'react';
import { FileSpreadsheet, Lock, AlertCircle } from 'lucide-react';

export function BlockedMobileImport() {
  return (
    <div id="blocked-mobile-import" className="bg-[#FAF8F6] border border-dashed border-red-200 rounded-2xl p-6 text-center space-y-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="p-4 bg-red-50 rounded-2xl text-red-500">
          <FileSpreadsheet className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-red-600 rounded-lg text-white">
          <Lock className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-xs mx-auto">
        <h5 className="font-extrabold text-xs text-slate-950 uppercase tracking-wider">
          🚫 Fonctionnalité indisponible sur mobile
        </h5>
        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
          Veuillez utiliser un ordinateur pour importer vos fichiers Excel ou CSV existants. Le traitement lourd des structures de colonnes et du mapping requiert un espace de travail supérieur.
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/50 rounded-lg text-[9px] text-amber-800 font-extrabold uppercase">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>L'ajout d'élève individuel reste disponible</span>
      </div>
    </div>
  );
}
