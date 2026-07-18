import React, { useState } from 'react';
import { SecuritySubSidebar } from './security/SecuritySubSidebar';
import { AuditTrailTab } from './security/AuditTrailTab';
import { TerminalsTab } from './security/TerminalsTab';
import { CryptoKeysTab } from './security/CryptoKeysTab';
import { VigilRealtimeLogs } from './security/VigilRealtimeLogs';
import { AuditLog, AccessTerminal, INITIAL_AUDIT_LOGS, INITIAL_TERMINALS } from '../../domain/SecurityModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminSecurityAuditTrail() {
  const [activeTab, setActiveTab] = useState('audit');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [terminals, setTerminals] = useState<AccessTerminal[]>(INITIAL_TERMINALS);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleTerminal = (id: string) => {
    setTerminals(
      terminals.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Actif' ? 'Inactif' : 'Actif';
          showToast(`Terminal ${t.name} : Statut changé en ${nextStatus}`, true);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleRevokeTerminal = (id: string) => {
    setTerminals(
      terminals.map((t) => {
        if (t.id === id) {
          showToast(`RÉVOCATION CRITIQUE : Terminal ${t.name} déconnecté d'office !`, false);
          return { ...t, status: 'Révoqué' };
        }
        return t;
      })
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="admin-security-root">
      <TabletDrawerWrapper>
        <SecuritySubSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </TabletDrawerWrapper>

      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[550px] relative">
        {toast && (
          <div
            className={`absolute top-4 right-4 z-50 px-4 py-2.5 rounded-xl border text-xs font-black shadow-md flex items-center gap-2 ${
              toast.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-sm">
              {toast.success ? 'check_circle' : 'security'}
            </span>
            <span>{toast.message}</span>
          </div>
        )}

        {activeTab === 'audit' && <AuditTrailTab logs={logs} />}

        {activeTab === 'realtime' && <VigilRealtimeLogs />}

        {activeTab === 'terminals' && (
          <TerminalsTab
            terminals={terminals}
            onToggleTerminal={handleToggleTerminal}
            onRevokeTerminal={handleRevokeTerminal}
          />
        )}

        {activeTab === 'keys' && <CryptoKeysTab />}
      </div>
    </div>
  );
}
