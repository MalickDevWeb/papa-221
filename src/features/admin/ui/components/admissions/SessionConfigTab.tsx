import React, { useState, useEffect } from 'react';
import { SessionConfigLevelItem, LevelSessionConfig } from './SessionConfigLevelItem';
import { getAdmissionsDb, saveAdmissionsDb, Campaign } from '@/features/auth/ui/components/candidature/portal/admissionsDb';
import { useCandidatureSettings } from '@/features/auth/hooks/useCandidatureSettings';

export function SessionConfigTab() {
  const { settings, updateSettings } = useCandidatureSettings();
  const [generalOpen, setGeneralOpen] = useState(true);
  const [generalDeadline, setGeneralDeadline] = useState('2026-10-31');
  const [generalFees, setGeneralFees] = useState(50000);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCampaigns(getAdmissionsDb().campaigns);
    setGeneralOpen(settings.ouvert);
  }, [settings]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateGlobal = async () => {
    const updated = campaigns.map(c => ({
      ...c,
      state: (generalOpen ? 'Ouverte' : 'Fermée') as Campaign['state'],
      deadline: generalDeadline,
      fees: generalFees
    }));
    setCampaigns(updated);
    saveAdmissionsDb({ campaigns: updated });
    await updateSettings({ ouvert: generalOpen, dateFermeture: generalDeadline });
    showToast("Paramètres globaux appliqués avec succès !");
  };

  const handleUpdateLevel = (code: string, updatedLvl: LevelSessionConfig) => {
    const nextCampaigns = campaigns.map(c => {
      if (c.code === code) {
        return {
          ...c,
          state: (updatedLvl.isOpen ? 'Ouverte' : 'Fermée') as Campaign['state'],
          deadline: updatedLvl.deadline,
          fees: updatedLvl.fees
        };
      }
      return c;
    });
    setCampaigns(nextCampaigns);
    saveAdmissionsDb({ campaigns: nextCampaigns });
    showToast(`Configuration pour ${code} sauvegardée !`);
  };

  return (
    <div className="space-y-5 text-xs font-bold text-[#4A5568]" id="session-config-tab">
      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toast}</span>
        </div>
      )}
      <div className="pb-1 border-b border-neutral-100 flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Portail Inscriptions & Configuration</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérez les paramètres et l'état de visibilité de l'inscription.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
          <div>
            <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider font-mono">Bouton de Dépôt Public</span>
            <p className="text-[10px] text-neutral-400 font-medium">Bouton "S'inscrire / Déposer un Dossier" sur la page de connexion.</p>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider ${settings.showRegisterButton !== false ? 'text-emerald-600' : 'text-neutral-500'}`}>
              {settings.showRegisterButton !== false ? 'Affiché ●' : 'Masqué ○'}
            </span>
            <button
              onClick={() => {
                const nextVal = settings.showRegisterButton === false;
                updateSettings({ showRegisterButton: nextVal });
                showToast(nextVal ? "Bouton d'inscription affiché !" : "Bouton d'inscription masqué !");
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer border ${
                settings.showRegisterButton !== false
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {settings.showRegisterButton !== false ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
          <div>
            <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider font-mono">État Général des Dépôts</span>
            <p className="text-[10px] text-neutral-400 font-medium">Activer ou suspendre le dépôt global des documents.</p>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider ${generalOpen ? 'text-emerald-600' : 'text-neutral-500'}`}>
              {generalOpen ? 'Session Ouverte ●' : 'Session Fermée ○'}
            </span>
            <button
              onClick={() => setGeneralOpen(!generalOpen)}
              className={`w-14 h-7 rounded-full p-0.5 cursor-pointer transition-all ${generalOpen ? 'bg-emerald-500' : 'bg-neutral-300'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-all transform ${generalOpen ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-xl p-4 space-y-3">
          <span className="text-[9px] font-black uppercase text-[#1E293B] block font-mono">Date & Frais de Dossier</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-neutral-400 font-black uppercase">Date Limite</label>
              <input type="date" value={generalDeadline} onChange={e => setGeneralDeadline(e.target.value)} className="w-full px-2 py-1 text-[10px] border border-neutral-200 bg-white rounded-lg focus:outline-none" />
            </div>
            <div>
              <label className="text-[8px] text-neutral-400 font-black uppercase">Frais (FCFA)</label>
              <input type="number" value={generalFees} onChange={e => setGeneralFees(Number(e.target.value))} className="w-full px-2 py-1 text-[10px] border border-neutral-200 bg-white rounded-lg focus:outline-none" />
            </div>
          </div>
          <button onClick={handleUpdateGlobal} className="w-full py-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white text-[9px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer">
            Appliquer Globalement
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-extrabold text-[10px] text-[#1E293B] uppercase tracking-wide border-b border-neutral-100 pb-1">Cursus Académiques & Campagnes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {campaigns.map(camp => (
            <SessionConfigLevelItem
              key={camp.id}
              config={{
                code: camp.code,
                label: camp.title,
                isOpen: camp.state === 'Ouverte',
                deadline: camp.deadline,
                fees: camp.fees
              }}
              onUpdate={updatedLvl => handleUpdateLevel(camp.code, updatedLvl)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

