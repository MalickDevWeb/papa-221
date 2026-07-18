import React from 'react';
import { createPortal } from 'react-dom';
import { AcademicYear } from './GradesData';

interface YearSelectorModalProps {
  previousYears: AcademicYear[]; onlyOneYearMode: boolean;
  setOnlyOneYearMode: (val: boolean) => void;
  onSelectYear: (year: AcademicYear) => void; onClose: () => void; onToast: (msg: string) => void;
}

export function YearSelectorModal({ previousYears, onlyOneYearMode, setOnlyOneYearMode, onSelectYear, onClose, onToast }: YearSelectorModalProps) {
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200/45 flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-headline-md text-lg font-black text-[#291715] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B3181C]">history_edu</span>
              Historique Académique
            </h3>
            <p className="text-[11px] text-neutral-400 font-bold uppercase mt-1">Sélectionnez une année pour voir le bulletin</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-neutral-100 hover:bg-neutral-200 p-2 rounded-xl text-neutral-600 transition-all cursor-pointer border-0"
          >
            <span className="material-symbols-outlined text-sm font-bold block">close</span>
          </button>
        </div>

        <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
          {previousYears.map((y) => (
            <div 
              key={y.id}
              onClick={() => onSelectYear(y)}
              className="p-4 border border-neutral-200 rounded-2xl hover:border-[#B3181C] hover:bg-[#FFF5F5]/30 cursor-pointer transition-all flex items-center justify-between group border-solid"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red-light/30 flex items-center justify-center text-[#B3181C] group-hover:scale-105 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-xl">folder_shared</span>
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm text-[#291715]">Année {y.year}</div>
                  <div className="text-xs text-neutral-400 font-bold">{y.level} - {y.specialty}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-brand-red-deep bg-brand-red-light/40 px-2 py-0.5 rounded-full inline-block">
                  {y.average.toFixed(2)} / 20
                </div>
                <div className="text-[9px] text-neutral-400 font-semibold mt-1">Mention {y.mention}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-150 pt-4 mt-2 border-solid">
          <label className="flex items-center justify-between bg-neutral-50 hover:bg-neutral-100/80 p-3.5 rounded-2xl cursor-pointer border border-neutral-200/50 transition-all border-solid">
            <div className="flex flex-col text-left mr-2">
              <span className="text-[10px] font-black text-[#291715] uppercase tracking-wider">Mode 1 Seule Année Précédente</span>
              <p className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5">
                Active l'accès direct en un clic sans passer par ce sélecteur.
              </p>
            </div>
            <div className="relative inline-flex items-center shrink-0">
              <input 
                type="checkbox" 
                checked={onlyOneYearMode} 
                onChange={(e) => {
                  setOnlyOneYearMode(e.target.checked);
                  onToast(e.target.checked 
                    ? "Mode 1 année activé : Le bulletin s'ouvrira directement désormais !" 
                    : "Mode multi-années activé : Vous verrez la liste de sélection d'abord."
                  );
                }}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B3181C]"></div>
            </div>
          </label>
        </div>
      </div>
    </div>,
    document.body
  );
}
