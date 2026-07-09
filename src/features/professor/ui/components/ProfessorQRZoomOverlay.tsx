import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

interface Props {
  readonly profName: string;
  readonly onClose: () => void;
}

export function ProfessorQRZoomOverlay({ profName, onClose }: Props) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=221-PROF-${profName.replace(/\s+/g, '-')}&color=1b1c1e&margin=4`;

  return createPortal(
    <div 
      id="professor-qr-zoom-overlay"
      onClick={onClose}
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-5 rounded-3xl shadow-2xl w-full max-w-[320px] aspect-square flex items-center justify-center cursor-default border border-neutral-100 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button 
          id="close-qr-zoom-btn"
          onClick={onClose}
          className="absolute -top-12 right-0 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
          title="Fermer"
        >
          <Icon icon="lucide:x" className="h-5 w-5" />
        </button>

        {/* Minimalist QR code display */}
        <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
          <img 
            src={qrUrl} 
            alt="QR Code Enseignant" 
            className="w-full h-full object-contain p-2" 
            referrerPolicy="no-referrer" 
          />
          {/* Subtle scanning light animation bar */}
          <div className="absolute left-0 right-0 h-[1.5px] bg-brand-red-deep opacity-80 shadow-[0_0_8px_#B3181C] top-1/2 -translate-y-1/2" />
          <div className="absolute inset-x-0 h-0.5 bg-brand-red-deep/20 top-1 animate-[bounce_3s_infinite]" />
        </div>
      </div>
    </div>,
    document.body
  );
}
