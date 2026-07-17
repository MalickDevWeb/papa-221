import React, { useState } from 'react';
import { Campaign } from './admissionsDb';
import { CampaignShareModal } from './CampaignShareModal';

interface Props {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onGoToLogin: () => void;
}

export function PortalCampaignsList({ campaigns, onSelectCampaign, onGoToLogin }: Props) {
  const [selectedShare, setSelectedShare] = useState<Campaign | null>(null);

  const visibleCampaigns = campaigns.filter(c => c.state !== 'Brouillon' && c.state !== 'Archivée');

  return (
    <div className="space-y-5 animate-fade-in text-xs font-bold text-neutral-600" id="portal-campaigns-root">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-3 gap-3">
        <div>
          <h3 className="font-extrabold text-base text-[#1E293B] leading-tight">Campagnes d'Admissions 2026-2027</h3>
          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Sélectionnez un cursus et déposez votre candidature en ligne.</p>
        </div>
        <button
          onClick={onGoToLogin}
          className="px-3.5 py-1.5 border border-[#B3181C] text-[#B3181C] hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer font-extrabold uppercase text-[9.5px] flex items-center gap-1.5 shrink-0"
        >
          <span translate="no" className="material-symbols-outlined text-xs">login</span>
          <span>Espace Candidat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleCampaigns.map(camp => {
          const isOpen = camp.state === 'Ouverte';
          const isSuspended = camp.state === 'Suspendue';
          const isPlanned = camp.state === 'Planifiée';
          const isClosed = camp.state === 'Fermée';

          return (
            <div key={camp.id} className="bg-white border border-neutral-200 hover:border-[#B3181C] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-28 bg-neutral-100">
                  <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                      isOpen ? 'bg-emerald-500 text-white' :
                      isSuspended ? 'bg-amber-500 text-white' :
                      isPlanned ? 'bg-blue-500 text-white' :
                      'bg-neutral-500 text-white'
                    }`}>
                      {camp.state}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-black text-[#1E293B] text-xs leading-snug">{camp.title}</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-neutral-400 font-semibold">
                    <span>📅 Clôture : <strong className="text-neutral-600">{camp.deadline}</strong></span>
                    <span>💰 Frais : <strong className="text-neutral-600">{camp.fees.toLocaleString()} FCFA</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-neutral-50 flex gap-2">
                <button
                  disabled={!isOpen}
                  onClick={() => onSelectCampaign(camp)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer text-center ${
                    isOpen
                      ? 'bg-[#B3181C] hover:bg-[#8F1316] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                  }`}
                >
                  {isOpen ? 'Déposer candidature' : isSuspended ? 'Session Suspendue' : isPlanned ? 'Bientôt Disponible' : 'Session Clôturée'}
                </button>
                <button
                  onClick={() => setSelectedShare(camp)}
                  className="px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl flex items-center justify-center cursor-pointer transition-all border border-neutral-200"
                >
                  <span translate="no" className="material-symbols-outlined text-xs">share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedShare && (
        <CampaignShareModal campaign={selectedShare} onClose={() => setSelectedShare(null)} />
      )}
    </div>
  );
}
