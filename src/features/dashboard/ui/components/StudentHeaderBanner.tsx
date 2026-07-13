import React, { useState, useEffect } from 'react';
import { getDynamicBadgeData } from '@/shared/lib/qrSecurity';

interface StudentHeaderBannerProps {
  attendancesCount: number;
  onPointer: (type: 'arrivée' | 'départ') => void;
  onShowBadge: (type: 'arrivée' | 'départ') => void;
  studentName?: string;
  matricule?: string;
}

export function StudentHeaderBanner({ 
  attendancesCount, onPointer, onShowBadge, studentName, matricule 
}: StudentHeaderBannerProps) {
  const currentHour = new Date().getHours();
  const nameToDisplay = studentName ? studentName.split(' ')[0] : "Abdoulaye";
  const welcomeMessage = currentHour >= 18 
    ? `Bonsoir, ${nameToDisplay} !` 
    : currentHour >= 12 
      ? `Bon après-midi, ${nameToDisplay} !` 
      : `Bonjour, ${nameToDisplay} !`;

  // Déterminer automatiquement le type de pointage (alternance Arrivée / Départ)
  const nextPointerType = attendancesCount % 2 === 0 ? 'arrivée' : 'départ';

  const [minuteEpoch, setMinuteEpoch] = useState(() => Math.floor(Date.now() / 60000));

  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteEpoch(Math.floor(Date.now() / 60000));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const qrData = getDynamicBadgeData(matricule || "SN-2026-8492", studentName || "Abdoulaye Diallo", minuteEpoch);


  return (
    <div className="-mt-6 mb-[19px] mr-0 flex flex-row items-center justify-between gap-3 sm:gap-6 bg-white/90 backdrop-blur-md p-4 sm:p-6 pr-4 sm:pr-6 py-4 sm:py-6 rounded-3xl border border-neutral-gray-200 shadow-sm relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute right-0 top-0 -mt-12 -mr-12 w-48 h-48 rounded-full bg-brand-red-light/5 pointer-events-none"></div>

      <div className="flex-1 space-y-3 min-w-0">
        <div className="max-w-full">
          <h2 className="font-headline-lg font-black text-on-surface tracking-tight leading-tight max-w-full pl-[6px] text-[20px] sm:text-[45px]">{welcomeMessage}</h2>
          <p className="text-[14px] sm:text-[21px] sm:leading-[35px] leading-snug pl-[5px] max-w-full font-semibold text-secondary mt-1">
            Bienvenue dans votre espace d'apprentissage en temps réel de <span className="text-brand-red-deep text-[21px] sm:text-[27px] font-bold not-italic">l'École 221</span>.
          </p>
        </div>

        {attendancesCount > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-[#B3181C]/5 border border-[#B3181C]/15 px-2.5 sm:px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B3181C] animate-pulse"></span>
            <span className="font-mono text-[8.5px] sm:text-[9.5px] text-[#B3181C] font-black">
              {attendancesCount} {attendancesCount === 1 ? 'pointage' : 'pointages'}
            </span>
          </div>
        )}
      </div>

      {/* Modern Student QR Code Badge & Scanner on the right */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2 w-[140px]">
        <div
          id="student-qr-code-banner-card"
          onClick={() => onShowBadge(nextPointerType)}
          title="Cliquez pour agrandir"
          className="bg-white p-2.5 h-[120px] w-[120px] rounded-2xl border border-neutral-200/50 flex flex-col items-center justify-center shadow-3xs hover:shadow-2xs hover:bg-neutral-100/50 transition-all relative group cursor-pointer shrink-0"
        >
          {/* Pulsing active status badge - critical to show active/payment validation */}
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-green-500/10 border border-green-500/20 text-green-700 px-1 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider">
            <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></span>
            ACTIF
          </div>

          {/* QR Code Mini-Card - Custom 100px size for pristine scanning */}
          <div className="bg-white p-1 rounded-xl border border-neutral-200/60 shadow-3xs relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-350 mt-3">
            <img
              id="student-qr-code-img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}&color=1b1c1e&margin=4`}
              alt="QR Code d'accès"
              className="w-[74px] h-[74px] object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Horizontal scan line effect */}
            <div className="absolute inset-x-0 h-0.5 bg-[#B3181C]/50 top-1 animate-[bounce_4s_infinite] pointer-events-none"></div>
          </div>
        </div>

        {/* Consolidated Action Button aligned perfectly under the QR badge */}
        <button
          id="scanner-action-btn"
          onClick={() => onPointer(nextPointerType)}
          className="bg-brand-red-deep text-white rounded-xl font-black uppercase tracking-wider shadow-md hover:bg-[#961215] transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap border border-brand-red-deep/10 w-[145px] h-[35px] text-[10px] leading-[12px]"
        >
          <span translate="no" className="material-symbols-outlined text-[11px] font-black animate-pulse">qr_code_scanner</span>
          Scanner ({nextPointerType === 'arrivée' ? 'Arrivée' : 'Départ'})
        </button>
      </div>
    </div>
  );
}
