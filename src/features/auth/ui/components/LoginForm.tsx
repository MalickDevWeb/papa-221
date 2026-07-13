import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetSuccessMessage } from './ResetSuccessMessage';
import { ROUTES } from '@/shared/constants';

interface LoginFormProps {
  isMobile?: boolean;
}

export function LoginForm({ isMobile = false }: LoginFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<'CONNEXION' | 'MOT_DE_PASSE_OUBLIE' | 'SUCCESS'>('CONNEXION');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const { executer, etat, erreur } = useLogin();
  const loading = etat === 'CHARGEMENT';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    executer({ email, motDePasse: password });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true); setResetError('');
    setTimeout(() => { setResetLoading(false); setCurrentView('SUCCESS'); }, 1200);
  };

  if (currentView === 'MOT_DE_PASSE_OUBLIE') {
    return <ForgotPasswordForm resetEmail={resetEmail} setResetEmail={setResetEmail} resetLoading={resetLoading} resetError={resetError} handleResetSubmit={handleResetSubmit} setCurrentView={setCurrentView} />;
  }

  if (currentView === 'SUCCESS') {
    return <ResetSuccessMessage resetEmail={resetEmail} setCurrentView={setCurrentView} setResetEmail={setResetEmail} />;
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3.5 ${isMobile ? 'pt-1 space-y-3' : 'md:space-y-4'} animate-fade-in`}>
      {erreur && <div className="p-2.5 text-xs text-[#B3181C] bg-[#FFF5F5] rounded-xl border border-[#B3181C]/20 animate-fade-in font-semibold animate-shake py-1.5 mb-1">{erreur}</div>}
      <div className="space-y-1">
        <label className={`text-[12px] font-bold block ${isMobile ? 'text-[#3E2927] mb-[2px]' : 'text-[#3E2927]'}`} htmlFor="email">Adresse e-mail <span className="text-[#DE4E3F] font-bold">*</span></label>
        <div className="relative group">
          <span translate="no" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7977]/80 text-[18px] pointer-events-none group-focus-within:text-[#B3181C] transition-colors">mail</span>
          <input className="w-full h-11 md:h-12 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl text-xs placeholder-[#A29492] focus:border-[#B3181C] focus:ring-1 focus:ring-[#B3181C]/10 pl-10 pr-4 text-[#291715] transition-all outline-none" id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <label className={`text-[12px] font-bold block ${isMobile ? 'text-[#3E2927] mb-[2px]' : 'text-[#3E2927]'}`} htmlFor="password">Mot de passe <span className="text-[#DE4E3F] font-bold">*</span></label>
        <div className="relative group">
          <span translate="no" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7977]/80 text-[18px] pointer-events-none group-focus-within:text-[#B3181C] transition-colors">lock</span>
          <input className="w-full h-11 md:h-12 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl text-xs placeholder-[#A29492] focus:border-[#B3181C] focus:ring-1 focus:ring-[#B3181C]/10 pl-10 pr-10 text-[#291715] transition-all outline-none" id="password" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7977]/80 hover:text-[#1c1110] transition-colors p-1 flex items-center justify-center rounded-md cursor-pointer" type="button" onClick={() => setShowPassword(!showPassword)}>
            <span translate="no" className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
      </div>
      <button className="w-full h-11 bg-[#B3181C] hover:bg-[#8F1316] active:scale-[0.98] rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#B3181C]/15 transition-all flex items-center justify-center gap-2 cursor-pointer mt-5 mb-1" type="submit" disabled={loading}>
        <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
        {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
      </button>

      <button type="button" onClick={() => navigate(ROUTES.candidature)} className="w-full h-10 border border-[#B3181C] text-[#B3181C] hover:bg-[#FFF5F5] active:scale-[0.98] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-2">
        <span translate="no" className="material-symbols-outlined text-[16px] font-bold">how_to_reg</span>
        <span>S'inscrire / Déposer un Dossier</span>
      </button>

      <div className="flex justify-between items-center pt-3 text-[11px] font-bold">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9] text-[10px] font-black uppercase tracking-wider select-none"><span translate="no" className="material-symbols-outlined text-[13px] font-bold">verified_user</span><span>Sécurisé</span></div>
        <button type="button" onClick={() => { setCurrentView('MOT_DE_PASSE_OUBLIE'); setResetEmail(email); }} className="text-[#8E7977] hover:text-[#B3181C] hover:underline transition-colors cursor-pointer">Mot de passe oublié ?</button>
      </div>
      <div className="mt-4 pt-3 border-t border-[#E2DCDA]/60 space-y-2">
        <p className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Identifiants Rapides :</p>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => { setEmail('admin221@gmail.com'); setPassword('ecole221'); }} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[9.5px] font-black rounded-lg border border-rose-200 transition-all cursor-pointer">Admin</button>
          <button type="button" onClick={() => { setEmail('etudiant221@gmail.com'); setPassword('ecole221'); }} className="px-2.5 py-1 bg-[#EAF7EE] hover:bg-[#D0EBD9] text-[#1E5E3A] text-[9.5px] font-black rounded-lg border border-[#1E5E3A]/20 transition-all cursor-pointer">Étudiant</button>
          <button type="button" onClick={() => { setEmail('professeur221@gmail.com'); setPassword('ecole221'); }} className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[9.5px] font-black rounded-lg border border-blue-200 transition-all cursor-pointer">Prof</button>
          <button type="button" onClick={() => { setEmail('vigile221@gmail.com'); setPassword('ecole221'); }} className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[9.5px] font-black rounded-lg border border-amber-200 transition-all cursor-pointer">Vigile</button>
        </div>
      </div>
    </form>
  );
}
