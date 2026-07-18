import React from 'react';

interface ForgotPasswordFormProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetLoading: boolean;
  resetError: string;
  handleResetSubmit: (e: React.FormEvent) => void;
  setCurrentView: (view: 'CONNEXION' | 'MOT_DE_PASSE_OUBLIE' | 'SUCCESS') => void;
}

export function ForgotPasswordForm({
  resetEmail,
  setResetEmail,
  resetLoading,
  resetError,
  handleResetSubmit,
  setCurrentView
}: ForgotPasswordFormProps) {
  return (
    <form onSubmit={handleResetSubmit} className="space-y-3.5 md:space-y-4 lg:space-y-5 animate-fade-in">
      {resetError && (
        <div className="p-2.5 text-xs text-[#B3181C] bg-[#FFF5F5] rounded-xl border border-[#B3181C]/20 font-semibold">
          {resetError}
        </div>
      )}

      <div className="space-y-1">
        <p className="text-[#8E7977] text-[11px] md:text-xs leading-relaxed mb-2.5">
          Saisissez l'adresse e-mail associée à votre compte. Nous vous enverrons un lien de réinitialisation sécurisé.
        </p>
        <label className="text-[12px] font-bold text-[#3E2927] block" htmlFor="resetEmail">
          Adresse e-mail <span className="text-[#DE4E3F] font-bold">*</span>
        </label>
        <div className="relative group">
          <span translate="no" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7977]/80 text-[18px] pointer-events-none group-focus-within:text-[#B3181C] transition-colors">mail</span>
          <input
            className="w-full h-11 md:h-12 pl-10 pr-4 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl text-xs placeholder-[#A29492] focus:border-[#B3181C] focus:ring-1 focus:ring-[#B3181C]/10 text-[#291715] transition-all outline-none"
            id="resetEmail"
            name="resetEmail"
            placeholder="votre_adresse@ecole221.sn"
            required
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full h-11 bg-[#B3181C] hover:bg-[#8F1316] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#B3181C]/15 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        type="submit"
        disabled={resetLoading}
      >
        <span>{resetLoading ? 'Envoi du lien...' : 'Envoyer le lien'}</span>
      </button>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setCurrentView('CONNEXION')}
          className="flex items-center gap-1 text-[11px] font-bold text-[#8E7977] hover:text-[#B3181C] transition-colors cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>Retour à la connexion</span>
        </button>
      </div>
    </form>
  );
}
