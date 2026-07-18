import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { getDynamicBadgeData } from '@/shared/lib/qrSecurity';

interface Props {
  readonly studentName?: string;
  readonly matricule?: string;
  readonly onClose: () => void;
}

export function StudentQRZoomOverlay({ studentName, matricule, onClose }: Props) {
  const name = studentName || 'Abdoulaye Diallo';
  const mat = matricule || 'SN-2026-8492';

  const [minuteEpoch, setMinuteEpoch] = useState(() => Math.floor(Date.now() / 60000));

  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteEpoch(Math.floor(Date.now() / 60000));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const qrData = getDynamicBadgeData(mat, name, minuteEpoch);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}&color=1b1c1e&margin=4`;


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
      id="student-qr-zoom-overlay"
      onClick={onClose}
      className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6 cursor-pointer animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-5 rounded-3xl shadow-2xl w-full max-w-[320px] aspect-square flex items-center justify-center cursor-default border border-neutral-100 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button 
          id="close-student-qr-zoom-btn"
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
            alt="QR Code Étudiant" 
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
