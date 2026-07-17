import React, { useState } from 'react';

interface Props {
  onTriggerRelances: () => void;
  onTriggerBlocage: () => void;
}

export function AutomationTab({ onTriggerRelances, onTriggerBlocage }: Props) {
  const [runningCampaign, setRunningCampaign] = useState<string | null>(null);
  const [campaignProgress, setCampaignProgress] = useState(0);

  const launchCampaign = (name: string, callback: () => void) => {
    setRunningCampaign(name);
    setCampaignProgress(0);
    const interval = setInterval(() => {
      setCampaignProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            callback();
            setRunningCampaign(null);
          }, 800);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="space-y-6 text-xs font-bold text-[#4A5568]" id="automation-tab-root">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Planificateur & Recouvrement Automatique</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Gérez l'échéancier réglementaire de l'école de manière automatisée pour optimiser la trésorerie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#B3181C]">
            <span translate="no" className="material-symbols-outlined text-xl">sms</span>
            <span className="text-[10px] font-black uppercase tracking-wider">Étape 1 : Campagne de Relances (Le 1er du mois)</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-semibold leading-normal">
            Envoie instantanément un SMS et un message WhatsApp personnalisés à tous les parents d'élèves accusant un retard de scolarité.
          </p>
          <button
            onClick={() => launchCampaign('Envoi des Relances SMS/WhatsApp', onTriggerRelances)}
            disabled={runningCampaign !== null}
            className="w-full py-2.5 bg-[#B3181C] hover:bg-[#B3181C]/90 disabled:opacity-50 text-white rounded-xl uppercase tracking-wider text-[9px] font-black transition-all cursor-pointer"
          >
            Déclencher la Campagne du 1er
          </button>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#B3181C]">
            <span translate="no" className="material-symbols-outlined text-xl">no_accounts</span>
            <span className="text-[10px] font-black uppercase tracking-wider">Étape 2 : Suspension de l'accès (Le 5 du mois)</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-semibold leading-normal">
            Verrouille automatiquement le QR Code d'accès aux portiques pour tous les élèves restés en situation d'impayé au-delà de la date limite.
          </p>
          <button
            onClick={() => launchCampaign('Verrouillage des QR Codes Débiteurs', onTriggerBlocage)}
            disabled={runningCampaign !== null}
            className="w-full py-2.5 bg-[#B3181C] hover:bg-[#921316] disabled:opacity-50 text-white rounded-xl uppercase tracking-wider text-[9px] font-black transition-all cursor-pointer"
          >
            Appliquer les Blocages du 5
          </button>
        </div>
      </div>

      {runningCampaign && (
        <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-2 animate-pulse shadow-xs">
          <div className="flex justify-between text-[10px] font-black text-[#1E293B] uppercase">
            <span>Action en cours : {runningCampaign}...</span>
            <span>{campaignProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#B3181C] h-full transition-all duration-200" style={{ width: `${campaignProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
