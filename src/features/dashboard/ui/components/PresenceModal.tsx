import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { StudentQRBadge } from './StudentQRBadge';
import { CameraScanner } from './CameraScanner';

interface PresenceModalProps {
  pointageType: 'arrivée' | 'départ';
  pointageMethod: 'selection' | 'qrcode' | 'camera';
  setPointageMethod: (method: 'selection' | 'qrcode' | 'camera') => void;
  onClose: () => void;
  cameraStream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onRegisterClockIn: (method: string) => void;
  onStartCamera: () => void;
  onStopCamera: () => void;
  studentName?: string;
  matricule?: string;
}

export function PresenceModal({
  pointageType, pointageMethod, setPointageMethod,
  onClose, cameraStream, videoRef, onRegisterClockIn, onStartCamera, onStopCamera,
  studentName, matricule
}: PresenceModalProps) {
  return createPortal(
    <div 
      className="fixed inset-0 z-[250] bg-black/55 flex items-center justify-center p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-100/50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header rouge élégant et compact */}
        <div className="bg-gradient-to-br from-brand-red-deep to-[#B3181C]/95 px-5 py-4 text-white relative">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Icon icon="lucide:x" className="h-4.5 w-4.5" />
          </button>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Présence</p>
          <h3 className="font-black text-base leading-tight">Pointage</h3>
          <p className="text-[11px] text-white/80 mt-0.5 capitalize">Enregistrer mon {pointageType}</p>
        </div>

        {/* Barre d'onglet de sélection moderne et intuitive */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 p-1 gap-1">
          <button
            onClick={() => {
              if (pointageMethod !== 'camera') {
                onStartCamera();
              }
            }}
            className={`flex-grow py-2 text-center text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              pointageMethod === 'camera'
                ? 'bg-white text-brand-red-deep shadow-3xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50'
            }`}
          >
            <Icon icon="lucide:scan" className="h-4 w-4" />
            Scanner QR Vigile
          </button>
          
          <button
            onClick={() => {
              if (pointageMethod !== 'qrcode') {
                onStopCamera();
                setPointageMethod('qrcode');
              }
            }}
            className={`flex-1 py-2 text-center text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              pointageMethod === 'qrcode'
                ? 'bg-white text-brand-red-deep shadow-3xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50'
            }`}
          >
            <Icon icon="lucide:qr-code" className="h-4 w-4" />
            Mon Badge
          </button>
        </div>

        {pointageMethod === 'qrcode' && (
          <StudentQRBadge
            pointageType={pointageType}
            onBack={onClose}
            onValidate={() => onRegisterClockIn('QR Student Code')}
            studentName={studentName}
            matricule={matricule}
          />
        )}

        {pointageMethod === 'camera' && (
          <CameraScanner
            cameraStream={cameraStream}
            videoRef={videoRef}
            onCancel={onClose}
            pointageType={pointageType}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
