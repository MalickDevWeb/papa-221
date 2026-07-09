import React from 'react';

interface CampaignOfflineMessageProps {
  dateOuverture: string;
  dateFermeture: string;
  messageAvis: string;
  onBack: () => void;
}

export function CampaignOfflineMessage({ dateOuverture, dateFermeture, messageAvis, onBack }: CampaignOfflineMessageProps) {
  return (
    <div className="text-center py-6 space-y-4 animate-fade-in text-xs">
      <div className="w-14 h-14 rounded-full bg-[#FFF5F5] flex items-center justify-center mx-auto text-[#B3181C] border border-[#FFD1D1]">
        <span translate="no" className="material-symbols-outlined text-2xl">gavel</span>
      </div>
      <div>
        <h4 className="text-sm font-black text-[#291715] uppercase tracking-wider">Campagne d'Inscription Clôturée</h4>
        <p className="text-[10px] text-[#8E7977] font-semibold uppercase mt-0.5">Scolarité fermée ou hors-délais</p>
      </div>
      <div className="bg-white p-3 border border-[#E2DCDA] rounded-xl text-left space-y-2 leading-relaxed text-[#3E2927]">
        <p>⚠️ <strong>Statut :</strong> Inscriptions actuellement inactives.</p>
        <p>📅 <strong>Période autorisée :</strong> du {dateOuverture} au {dateFermeture}</p>
        {messageAvis && <p className="text-[10px] italic text-[#8E7977] border-t border-[#E2DCDA]/60 pt-2">{messageAvis}</p>}
      </div>
      <button type="button" onClick={onBack} className="px-5 py-2 bg-[#B3181C] hover:bg-[#8F1316] text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all">Retour</button>
    </div>
  );
}
