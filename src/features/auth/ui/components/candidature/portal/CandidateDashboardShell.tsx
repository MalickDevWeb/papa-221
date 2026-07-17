import React, { useState } from 'react';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';
import { CandidateStatusTab } from './CandidateStatusTab';
import { CandidateDocumentsTab } from './CandidateDocumentsTab';
import { CandidatePaymentsTab } from './CandidatePaymentsTab';
import { CandidateMessagingTab } from './CandidateMessagingTab';
import { CandidateAuditTab } from './CandidateAuditTab';

interface Props {
  initialCandidate: ExtendedCandidate;
  onLogout: () => void;
}

export function CandidateDashboardShell({ initialCandidate, onLogout }: Props) {
  const [candidate, setCandidate] = useState<ExtendedCandidate>(initialCandidate);
  const [activeTab, setActiveTab] = useState<'status' | 'docs' | 'pay' | 'msg' | 'audit'>('status');

  const tabs = [
    { id: 'status' as const, label: 'Statut & Étapes', icon: 'rule' },
    { id: 'docs' as const, label: 'Pièces Jointes', icon: 'folder' },
    { id: 'pay' as const, label: 'Paiements & Tranche 1', icon: 'payments' },
    { id: 'msg' as const, label: 'Messagerie', icon: 'forum' },
    { id: 'audit' as const, label: 'Audit & Sécurité', icon: 'shield_lock' }
  ];

  const handleUpdate = (updated: ExtendedCandidate) => {
    setCandidate(updated);
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600" id="candidate-shell-root">
      {/* Top Header Card */}
      <div className="bg-[#291715] text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <span translate="no" className="material-symbols-outlined text-white text-base">person</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight">{candidate.name}</h3>
            <span className="text-[9.5px] text-white/70 font-semibold">{candidate.email}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-wider border border-white/15 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <span translate="no" className="material-symbols-outlined text-xs">logout</span>
          Deconnexion
        </button>
      </div>

      {/* Tabs list navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-100 pb-2 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-xl uppercase font-black text-[9.5px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === t.id
                ? 'bg-[#B3181C] text-white border-[#B3181C] shadow-sm'
                : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-200'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-[13px]">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Render selected active tab */}
      <div className="pt-2 min-h-[300px]">
        {activeTab === 'status' && <CandidateStatusTab candidate={candidate} />}
        {activeTab === 'docs' && <CandidateDocumentsTab candidate={candidate} onUpdate={handleUpdate} />}
        {activeTab === 'pay' && <CandidatePaymentsTab candidate={candidate} onUpdate={handleUpdate} />}
        {activeTab === 'msg' && <CandidateMessagingTab candidate={candidate} />}
        {activeTab === 'audit' && <CandidateAuditTab candidate={candidate} />}
      </div>
    </div>
  );
}
