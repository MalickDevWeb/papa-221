import React, { useState, useEffect } from 'react';
import { AdmissionsSubSidebar } from './admissions/AdmissionsSubSidebar';
import { SessionConfigTab } from './admissions/SessionConfigTab';
import { ValidationKanbanTab } from './admissions/ValidationKanbanTab';
import { MatriculationTab } from './admissions/MatriculationTab';
import { AdmissionsRulesEngine } from './admissions/AdmissionsRulesEngine';
import { ExtendedCandidate } from '../../domain/AdmissionsExtendedModels';
import { getAdmissionsDb, saveAdmissionsDb } from '@/features/auth/ui/components/candidature/portal/admissionsDb';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminAdmissionsKanban() {
  const [activeTab, setActiveTab] = useState('config');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [candidates, setCandidates] = useState<ExtendedCandidate[]>([]);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    const updateCandidates = () => {
      const db = getAdmissionsDb();
      setCandidates(db.candidates);
    };

    updateCandidates();

    window.addEventListener('admissions_db_synced', updateCandidates);
    return () => {
      window.removeEventListener('admissions_db_synced', updateCandidates);
    };
  }, [activeTab]);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateCandidate = (updated: ExtendedCandidate) => {
    const nextList = candidates.map((c) => (c.id === updated.id ? updated : c));
    setCandidates(nextList);
    saveAdmissionsDb({ candidates: nextList });
    showToast(`Dossier de ${updated.name} mis à jour avec succès.`, true);
  };

  const handleTogglePayment = (id: string) => {
    const nextList = candidates.map((c) => {
      if (c.id === id) {
        const nextState = !c.registrationFeePaid;
        showToast(nextState ? "Paiement de la tranche 1 enregistré !" : "Paiement révoqué.", true);
        return { ...c, registrationFeePaid: nextState };
      }
      return c;
    });
    setCandidates(nextList);
    saveAdmissionsDb({ candidates: nextList });
  };

  const handleEnroll = (c: ExtendedCandidate, matricule: string) => {
    showToast(`Félicitations ! ${c.name} est matriculé d'office ! Matricule : ${matricule}.`, true);
    const nextList = candidates.filter((item) => item.id !== c.id);
    setCandidates(nextList);
    saveAdmissionsDb({ candidates: nextList });
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

        {activeTab === 'rules' && <AdmissionsRulesEngine />}

        {activeTab === 'validation' && (
          <ValidationKanbanTab candidates={candidates} onUpdateCandidate={handleUpdateCandidate} />
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
