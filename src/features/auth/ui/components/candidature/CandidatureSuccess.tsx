import React from 'react';

interface CandidatureSuccessProps {
  nomComplet: string;
  promotionNom: string;
  typeDepot: 'En ligne' | 'Présentiel';
  onBack: () => void;
}

export function CandidatureSuccess({ nomComplet, promotionNom, typeDepot, onBack }: CandidatureSuccessProps) {
  return (
    <div className="text-center py-6 space-y-4 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-[#EAF7EE] flex items-center justify-center mx-auto text-[#1E5E3A] border border-[#D0EBD9] shadow-inner">
        <span translate="no" className="material-symbols-outlined text-3xl font-extrabold animate-bounce">verified</span>
      </div>
      <div>
        <h4 className="text-sm font-black text-[#291715] uppercase tracking-wider">Candidature Soumise avec Succès</h4>
        <p className="text-[10px] text-[#8E7977] font-semibold uppercase tracking-wider mt-0.5">Dossier académique enregistré</p>
      </div>
      <div className="bg-white p-3.5 border border-[#E2DCDA] rounded-xl text-left space-y-2 text-[11px]">
        <p className="text-[#3E2927]">🎯 <strong>Nom :</strong> {nomComplet}</p>
        <p className="text-[#3E2927]">📂 <strong>Promotion :</strong> {promotionNom}</p>
        <p className="text-[#3E2927]">⚡ <strong>Mode :</strong> Dépôt {typeDepot}</p>
        <p className="text-[#8E7977] leading-relaxed pt-1.5 border-t border-[#E2DCDA]/60">
          {typeDepot === 'Présentiel' 
            ? "Veuillez passer au Secrétariat de l'école muni de votre pièce d'identité originale et de vos bulletins originaux pour l'entretien physique."
            : "Votre dossier numérique va être étudié sous 48h. Un email de confirmation vous sera envoyé."}
        </p>
      </div>
      <button type="button" onClick={onBack} className="px-5 py-2 bg-[#B3181C] hover:bg-[#8F1316] text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all">Quitter l'Espace</button>
    </div>
  );
}
