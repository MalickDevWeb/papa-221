import React, { useState, useEffect } from 'react';
import { PortalCampaignsList } from './candidature/portal/PortalCampaignsList';
import { CandidateApplicationForm } from './candidature/portal/CandidateApplicationForm';
import { CandidatePortalLogin } from './candidature/portal/CandidatePortalLogin';
import { CandidateDashboardShell } from './candidature/portal/CandidateDashboardShell';
import { getAdmissionsDb, Campaign } from './candidature/portal/admissionsDb';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';

interface Props {
  onBack: () => void;
}

export function CandidatureForm({ onBack }: Props) {
  const [view, setView] = useState<'portal' | 'apply' | 'login' | 'dashboard'>('portal');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<ExtendedCandidate | null>(null);

  useEffect(() => {
    const updateCampaigns = () => {
      const db = getAdmissionsDb();
      setCampaigns(db.campaigns);
    };

    updateCampaigns();

    window.addEventListener('admissions_db_synced', updateCampaigns);
    return () => {
      window.removeEventListener('admissions_db_synced', updateCampaigns);
    };
  }, [view]);

  return (
    <div className="space-y-4 animate-fade-in" id="candidature-main-portal">
      {view === 'portal' && (
        <div className="space-y-4">
          <PortalCampaignsList
            campaigns={campaigns}
            onSelectCampaign={(camp) => {
              setSelectedCampaign(camp);
              setView('apply');
            }}
            onGoToLogin={() => setView('login')}
          />
          <div className="pt-2 border-t border-neutral-100 flex justify-center">
            <button onClick={onBack} className="text-[#8E7977] hover:text-[#B3181C] text-xs font-black uppercase cursor-pointer flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-xs">arrow_back</span>
              Retour au Campus Virtuel
            </button>
          </div>
        </div>
      )}

      {view === 'apply' && selectedCampaign && (
        <CandidateApplicationForm
          campaign={selectedCampaign}
          onSuccess={(cand) => {
            setActiveCandidate(cand);
            setView('dashboard');
          }}
          onCancel={() => setView('portal')}
        />
      )}

      {view === 'login' && (
        <CandidatePortalLogin
          onLoginSuccess={(cand) => {
            setActiveCandidate(cand);
            setView('dashboard');
          }}
          onGoBack={() => setView('portal')}
        />
      )}

      {view === 'dashboard' && activeCandidate && (
        <CandidateDashboardShell
          initialCandidate={activeCandidate}
          onLogout={() => {
            setActiveCandidate(null);
            setView('portal');
          }}
        />
      )}
    </div>
  );
}
