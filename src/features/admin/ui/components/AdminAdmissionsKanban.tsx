import React, { useState } from 'react';
import { AdmissionsSubSidebar } from './admissions/AdmissionsSubSidebar';
import { SessionConfigTab } from './admissions/SessionConfigTab';
import { ValidationKanbanTab } from './admissions/ValidationKanbanTab';
import { MatriculationTab } from './admissions/MatriculationTab';
import { Candidate, INITIAL_CANDIDATES } from '../../domain/AdmissionsModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminAdmissionsKanban() {
  const [activeTab, setActiveTab] = useState('config');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMoveCandidate = (id: string, step: Candidate['step']) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, step } : c)));
    showToast(`Dossier du candidat mis à jour.`, true);
  };

  const handleTogglePayment = (id: string) => {
    setCandidates(
      candidates.map((c) => {
        if (c.id === id) {
          const nextState = !c.registrationFeePaid;
          showToast(nextState ? "Paiement de la tranche 1 enregistré !" : "Paiement révoqué.", true);
          return { ...c, registrationFeePaid: nextState };
        }
        return c;
      })
    );
  };

  const handleEnroll = (c: Candidate) => {
    const generatedMatricule = `MAT-2026-0${Math.floor(100 + Math.random() * 899)}`;
    showToast(`Félicitations ! ${c.name} est matriculé d'office ! Matricule : ${generatedMatricule}. QR d'accès chiffré généré.`, true);
    setCandidates(candidates.filter((item) => item.id !== c.id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="admin-admissions-root">
      <TabletDrawerWrapper>
        <AdmissionsSubSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </TabletDrawerWrapper>

      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[550px] relative overflow-hidden">
        {toast && (
          <div
            className={`absolute top-4 right-4 z-50 px-4 py-2.5 rounded-xl border text-xs font-black shadow-md flex items-center gap-2 ${
              toast.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-sm">
              {toast.success ? 'check_circle' : 'error'}
            </span>
            <span>{toast.message}</span>
          </div>
        )}

        {activeTab === 'config' && <SessionConfigTab />}

        {activeTab === 'validation' && (
          <ValidationKanbanTab candidates={candidates} onMoveCandidate={handleMoveCandidate} />
        )}

        {activeTab === 'matriculation' && (
          <MatriculationTab
            candidates={candidates}
            onEnroll={handleEnroll}
            onTogglePayment={handleTogglePayment}
          />
        )}
      </div>
    </div>
  );
}
