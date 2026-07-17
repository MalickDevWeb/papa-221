import React from 'react';

interface Props {
  readonly profName: string;
  readonly coursesCount: number;
  readonly vigilCheckInsCount: number;
  readonly onOpenPresence: (tab: 'badge' | 'scanner', type: 'arrivée' | 'départ') => void;
  readonly onZoomQR: () => void;
}

export function ProfessorHeaderBanner({ profName, coursesCount, vigilCheckInsCount, onOpenPresence, onZoomQR }: Props) {
  const currentHour = new Date().getHours();
  const welcomeMessage = currentHour >= 18 ? "Bonsoir, " : currentHour >= 12 ? "Bon après-midi, " : "Bonjour, ";
  const nextPointerType = vigilCheckInsCount % 2 === 0 ? 'arrivée' : 'départ';

  return (
    <div className="-mt-2 mb-6 flex flex-row items-center justify-between gap-4 sm:gap-6 bg-[#f8fafc] p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-3xs relative overflow-hidden">
      <div className="flex-1 space-y-3 min-w-0">
        <div className="max-w-full">
          <h2 className="font-headline-lg font-black text-on-surface tracking-tight leading-tight text-[20px] sm:text-[38px]">
            {welcomeMessage}{profName} !
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary mt-1">
            Gérez vos enseignements, vos notes et l'assiduité à l'administration.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/15 px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[9px] sm:text-[10px] text-emerald-700 font-black">
            Session active • {coursesCount} cours enregistrés
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-center gap-2.5 w-[130px] relative z-20">
        <div
          onClick={onZoomQR}
          title="Cliquez pour agrandir"
          className="bg-white p-2.5 h-[115px] w-[115px] rounded-2xl border border-neutral-200 flex flex-col items-center justify-center shadow-3xs hover:shadow-2xs hover:bg-neutral-50 transition-all duration-300 relative group cursor-pointer shrink-0"
        >
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-[#B3181C]/10 border border-[#B3181C]/20 text-[#B3181C] px-1.5 py-0.5 rounded-full text-[6.5px] font-black uppercase tracking-wider">
            <span className="h-1 w-1 rounded-full bg-brand-red-deep animate-pulse"></span>
            PROF
          </div>

          <div className="bg-white p-1 rounded-xl border border-neutral-200/60 shadow-3xs relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300 mt-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=221-PROF-${profName.replace(/\s+/g, '-')}&color=1b1c1e&margin=4`}
              alt="QR Code Enseignant"
              className="w-[68px] h-[68px] object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 h-0.5 bg-[#B3181C]/50 top-1 animate-[bounce_4s_infinite] pointer-events-none"></div>
          </div>
        </div>

        <button
          onClick={() => onOpenPresence('scanner', nextPointerType)}
          className="bg-[#B3181C] text-white rounded-xl font-black uppercase tracking-wider shadow-md hover:bg-[#961215] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 w-[130px] h-[34px] text-[9.5px] border border-brand-red-deep/10 relative z-30"
        >
          <span className="material-symbols-outlined text-[12px] font-black animate-pulse">qr_code_scanner</span>
          Scanner ({nextPointerType === 'arrivée' ? 'Arrivée' : 'Départ'})
        </button>
      </div>
    </div>
  );
}
