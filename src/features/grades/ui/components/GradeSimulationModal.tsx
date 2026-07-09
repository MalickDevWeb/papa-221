import React from 'react';
import { createPortal } from 'react-dom';
import { Grade, calculateFinalNote, getModuleStatus } from '@/features/grades/domain/Grade';

interface GradeSimulationModalProps {
  activeModule: Grade; onClose: () => void;
  onSimulate: (moduleName: string, type: 'cc' | 'examen', val: number) => void;
  onReset: (moduleName: string) => void; onToast: (msg: string) => void;
}

export function GradeSimulationModal({ activeModule, onClose, onSimulate, onReset, onToast }: GradeSimulationModalProps) {
  const noteFinale = calculateFinalNote(activeModule.cc, activeModule.examen);

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200/45 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-red-deep p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 p-1.5 rounded-xl text-white transition-all cursor-pointer border-0"
          >
            <span className="material-symbols-outlined text-sm font-bold block">close</span>
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Module de Spécialité ({activeModule.ects} ECTS)
            </span>
            <span className="bg-success-green/30 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              {getModuleStatus(noteFinale)}
            </span>
          </div>
          
          <h3 className="font-headline-md text-lg font-black leading-tight">{activeModule.module}</h3>
          <p className="text-white/70 text-[10px] uppercase tracking-wide font-heavy mt-1">{activeModule.prof}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-brand-red-light/40 py-3.5 px-4 rounded-2xl border border-[#B3181C]/5 flex justify-between items-center text-center">
            <div className="text-left">
              <span className="block text-[8.5px] font-black text-brand-red-deep uppercase tracking-wider">Calcul de la Note finale</span>
              <p className="text-[10px] text-neutral-gray-500 font-semibold mt-0.5">Note = (CC * 40%) + (Examen * 60%)</p>
            </div>
            <div className="bg-brand-red-deep text-white px-3.5 py-1.5 rounded-xl font-black text-base shadow-sm shrink-0">
              {noteFinale.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-secondary lowercase tracking-wide">Contrôle Continu (coeff 40%) :</span>
              <span className="font-black text-[#291715]">{activeModule.cc.toFixed(2)} / 20.00</span>
            </div>
            <input 
              type="range" min="0" max="20" step="0.25"
              value={activeModule.cc}
              onChange={(e) => onSimulate(activeModule.module, 'cc', parseFloat(e.target.value))}
              className="w-full accent-brand-red-deep h-1.5 bg-neutral-gray-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-secondary lowercase tracking-wide">Examen National Final (coeff 60%) :</span>
              <span className="font-black text-[#291715]">{activeModule.examen.toFixed(2)} / 20.00</span>
            </div>
            <input 
              type="range" min="0" max="20" step="0.25"
              value={activeModule.examen}
              onChange={(e) => onSimulate(activeModule.module, 'examen', parseFloat(e.target.value))}
              className="w-full accent-brand-red-deep h-1.5 bg-neutral-gray-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-neutral-gray-100 flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-500">Moyenne générale de la classe :</span>
            <span className="font-extrabold text-[#291715]/90">{activeModule.moyPromo.toFixed(2)} / 20</span>
          </div>
        </div>

        <div className="p-5 bg-surface-container-low border-t border-neutral-gray-150 flex gap-3">
          <button 
            onClick={() => { onReset(activeModule.module); onClose(); onToast("Valeurs d'origine restaurées !"); }}
            className="flex-grow py-3 text-center border border-neutral-gray-300 bg-white rounded-xl text-xs font-black hover:bg-neutral-50 cursor-pointer active:scale-98 transition-all border-solid"
          >
            Réinitialiser
          </button>
          <button 
            onClick={() => { onToast(`Simulation sauvegardée localement avec succès !`); onClose(); }}
            className="flex-grow py-3 text-center bg-brand-red-deep text-white rounded-xl text-xs font-black shadow-md hover:opacity-95 cursor-pointer active:scale-98 transition-all border-0"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
