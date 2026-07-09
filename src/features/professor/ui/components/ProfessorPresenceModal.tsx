import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import type { StudentEnrolled } from '../../domain/ProfessorModels';
import type { AttendanceStatus } from '../../domain/ProfessorAttendance';
import { ProfessorScannerTab } from './ProfessorScannerTab';

interface Props {
  readonly profName: string;
  readonly students: readonly StudentEnrolled[];
  readonly onClose: () => void;
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
  readonly initialTab?: 'badge' | 'scanner';
  readonly pointageType?: 'arrivée' | 'départ';
  readonly onScanComplete?: () => void;
}

export function ProfessorPresenceModal({ profName, onClose, pointageType = 'arrivée', onScanComplete }: Props) {
  return createPortal(
    <div 
      className="fixed inset-0 z-[250] bg-black/65 flex items-center justify-center p-4 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[350px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="bg-gradient-to-br from-[#B3181C] to-[#291715] px-5 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer border-none bg-transparent"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </button>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Portail Enseignant</p>
          <h3 className="font-black text-base leading-tight">Scanner le QR du Vigile</h3>
        </div>

        <div className="p-5 text-center space-y-4">
          <ProfessorScannerTab profName={profName} pointageType={pointageType} onScanComplete={onScanComplete} />

          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black text-xs rounded-xl transition-all cursor-pointer border-0 mt-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
