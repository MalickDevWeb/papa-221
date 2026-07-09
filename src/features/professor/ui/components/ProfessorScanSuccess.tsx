import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface Props {
  readonly pointageType: 'arrivée' | 'départ';
  readonly onReset: () => void;
}

export function ProfessorScanSuccess({ pointageType, onReset }: Props) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex flex-col items-center gap-2"
      id="professor-scan-success"
    >
      <div className="h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
        <Icon icon="lucide:check-circle" className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-emerald-900">Pointage Validé !</h4>
        <p className="text-[10px] text-emerald-700 font-medium max-w-[240px]">
          Votre {pointageType} a été enregistré avec succès auprès du vigile d&apos;ÉCOLE 221.
        </p>
      </div>
      <button
        onClick={onReset}
        className="mt-1 px-3 py-1 bg-white hover:bg-emerald-100/50 border border-emerald-200/50 text-emerald-800 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
      >
        Scanner à nouveau
      </button>
    </motion.div>
  );
}
