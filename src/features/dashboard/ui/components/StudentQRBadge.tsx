import React from 'react';
import { Icon } from '@iconify/react';

interface StudentQRBadgeProps {
  pointageType: 'arrivée' | 'départ';
  onBack: () => void;
  onValidate: () => void;
  studentName?: string;
  matricule?: string;
}

export function StudentQRBadge({ pointageType, onBack, onValidate, studentName, matricule }: StudentQRBadgeProps) {
  return (
    <div className="p-4 text-center space-y-3.5">
      <p className="text-[10.5px] text-neutral-500 leading-relaxed font-semibold">
        Présentez ce QR Code devant le guichet de votre professeur pour enregistrer votre {pointageType}.
      </p>

      <div className="bg-gradient-to-b from-brand-red-light/20 to-brand-red-light/5 border border-[#B3181C]/10 rounded-xl p-3.5 relative overflow-hidden flex flex-col items-center">
        {/* Card Header Info */}
        <div className="w-full flex justify-between items-center text-left border-b border-[#B3181C]/8 pb-2.5 mb-3">
          <div>
            <h5 className="text-[8px] font-black text-brand-red-deep uppercase tracking-wider">ÉCOLE 221 - SÉNÉGAL</h5>
            <p className="text-[11px] font-black text-neutral-800 leading-none mt-0.5">{studentName || "Abdoulaye Diallo"}</p>
          </div>
          <span className="text-[8px] bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
            M1 GL
          </span>
        </div>

        {/* Compact QR Code Image Container */}
        <div className="bg-white p-2.5 rounded-xl border border-neutral-200/45 shadow-3xs inline-block relative overflow-hidden group">
          <div className="w-28 h-28 relative flex items-center justify-center bg-white rounded-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${matricule || '221-M382'}-M1GL-${(studentName || 'Abdoulaye Diallo').toUpperCase().replace(/\s+/g, '-')}&color=1b1c1e&margin=4`} 
              alt="QR Code Badge Étudiant"
              className="w-24 h-24 object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Ambient scan animation lines */}
            <div className="absolute inset-0 pointer-events-none rounded-lg border border-neutral-100"></div>
            <div className="absolute left-0 right-0 h-0.5 bg-brand-red-deep opacity-80 shadow-xs top-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-x-0 h-0.5 bg-brand-red-deep/30 top-1 animate-[bounce_3s_infinite]"></div>
          </div>
        </div>

        <p className="mt-3 font-mono text-[8px] text-neutral-500 font-black tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded border border-neutral-200/20 shadow-3xs">
          MATRICULE : {matricule || "221-M382"}-M1GL
        </p>
      </div>

      <div className="flex gap-2 pt-1">
        <button 
          onClick={onBack}
          className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-150 text-neutral-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-neutral-200/30"
        >
          <Icon icon="lucide:arrow-left" className="h-3.5 w-3.5" />
          <span>Retour</span>
        </button>
        <button 
          onClick={onValidate}
          className="flex-1 py-2.5 bg-brand-red-deep hover:bg-brand-red-deep/95 text-white font-black text-[11px] rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
        >
          <Icon icon="lucide:check-circle" className="h-3.5 w-3.5" />
          <span>Simuler</span>
        </button>
      </div>
    </div>
  );
}
