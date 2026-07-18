import React, { useState } from 'react';
import { getAdmissionsDb } from './admissionsDb';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';

interface Props {
  onLoginSuccess: (candidate: ExtendedCandidate) => void;
  onGoBack: () => void;
}

export function CandidatePortalLogin({ onLoginSuccess, onGoBack }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const db = getAdmissionsDb();
    const candidate = db.candidates.find(
      c => c.email.toLowerCase() === identifier.trim().toLowerCase() || c.id === identifier.trim()
    );

    if (candidate) {
      onLoginSuccess(candidate);
    } else {
      setError('Identifiants incorrects ou dossier introuvable. Astuce : utilisez un email des candidats de démo (ex: nafi.diallo@gmail.com).');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-[#4A5568]" id="candidate-login-root">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
        <div>
          <h4 className="font-extrabold text-sm text-[#1E293B]">Connexion Espace Candidat</h4>
          <p className="text-[10px] text-neutral-400">Suivez l'état d'avancement de votre dossier universitaire.</p>
        </div>
        <button onClick={onGoBack} className="text-neutral-400 hover:text-[#B3181C] uppercase font-black tracking-wider text-[9.5px] cursor-pointer">
          [ Retour ]
        </button>
      </div>

      {error && (
        <div className="p-3 text-[10px] text-[#B3181C] bg-rose-50 border border-rose-100 rounded-xl font-semibold leading-relaxed">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[#3E2927]">Adresse Email / Identifiant Dossier</label>
          <input
            required
            type="text"
            placeholder="Ex: nafi.diallo@gmail.com"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="w-full h-11 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 focus:border-[#B3181C] outline-none text-xs font-semibold text-[#1E293B]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[#3E2927]">Mot de passe</label>
          <input
            required
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-11 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 focus:border-[#B3181C] outline-none text-xs font-semibold text-[#1E293B]"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-[#B3181C] hover:bg-[#8F1316] text-white rounded-xl font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center"
        >
          Se Connecter à mon Espace
        </button>
      </form>

      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-[10px] font-semibold text-neutral-400">
        <span className="font-extrabold uppercase text-neutral-500 text-[9px] tracking-wider block">ℹ️ Comptes de Démo Candidats :</span>
        <ul className="list-disc pl-3.5 space-y-0.5">
          <li>nafi.diallo@gmail.com (Nouveau Bachelier - Licence 1)</li>
          <li>ibrahima.ba@gmail.com (Transfert de cursus - Licence 2)</li>
          <li>marie.gomes@pro.sn (Validation d'Acquis - VAE)</li>
        </ul>
      </div>
    </div>
  );
}
