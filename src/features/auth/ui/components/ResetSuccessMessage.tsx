import React from 'react';

interface ResetSuccessMessageProps {
  resetEmail: string;
  setCurrentView: (view: 'CONNEXION' | 'MOT_DE_PASSE_OUBLIE' | 'SUCCESS') => void;
  setResetEmail: (email: string) => void;
}

export function ResetSuccessMessage({ resetEmail, setCurrentView, setResetEmail }: ResetSuccessMessageProps) {
  return (
    <div className="space-y-4 text-center animate-fade-in py-2">
      <div className="mx-auto h-12 w-12 bg-[#EAF7EE] text-[#1D6F3F] rounded-2xl flex items-center justify-center border border-[#D0EBD9] mb-1 shadow-sm">
        <span translate="no" className="material-symbols-outlined text-[24px]">check_circle</span>
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-base font-black text-[#291715]">Lien envoyé</h3>
        <p className="text-[#8E7977] text-xs leading-relaxed max-w-[300px] mx-auto">
          Instructions de réinitialisation envoyées à : <span className="font-bold text-[#291715] break-all">{resetEmail}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setCurrentView('CONNEXION');
          setResetEmail('');
        }}
        className="w-full h-11 border border-[#E2DCDA] hover:bg-[#FAF8F6] text-[#291715] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
      >
        <span>Retour à la connexion</span>
      </button>
    </div>
  );
}
