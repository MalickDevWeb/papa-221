import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { CameraScanner } from './CameraScanner';

interface PresenceModalProps {
  readonly pointageType: 'arrivée' | 'départ';
  readonly onClose: () => void;
  readonly onRegisterClockIn: (method: string, keepOpen?: boolean) => void;
}

export function PresenceModal({
  pointageType, onClose, onRegisterClockIn
}: PresenceModalProps) {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, []);

  return createPortal(
    <div 
      className="fixed inset-0 z-[250] bg-black/75 flex items-center justify-center p-4 font-sans"
      onClick={onClose}
      id="student-presence-modal-overlay"
    >
      <div 
        className="bg-white w-full max-w-[350px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="student-presence-modal-container"
      >
        <div className="bg-gradient-to-br from-[#B3181C] to-[#291715] px-5 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer border-none bg-transparent"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </button>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Portail Étudiant</p>
          <h3 className="font-black text-base leading-tight">
            Scanner le QR du Vigile
          </h3>
        </div>

        <div className="p-5 text-center space-y-4">
          <CameraScanner
            onCancel={onClose}
            pointageType={pointageType}
            onScanComplete={() => onRegisterClockIn('Camera Scan', true)}
          />

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
