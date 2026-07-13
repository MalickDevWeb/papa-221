import React, { useState } from 'react';
import { PersonnelSubSidebar } from './personnel/PersonnelSubSidebar';
import { AccountsTab } from './personnel/AccountsTab';
import { RbacTab } from './personnel/RbacTab';
import { AttendanceTab } from './personnel/AttendanceTab';
import { StaffMember, INITIAL_STAFF } from '../../domain/PersonnelModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminPersonnelRH() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddStaff = (newMember: Omit<StaffMember, 'id'>) => {
    const id = `EMP-2026-0${Math.floor(10 + Math.random() * 89)}`;
    setStaff([...staff, { id, ...newMember }]);
    showToast(`Compte pour ${newMember.firstName} créé.`, true);
  };

  const handleToggleStatus = (id: string) => {
    setStaff(
      staff.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'Actif' ? 'Suspendu' : 'Actif';
          showToast(`Le statut de ${s.firstName} est maintenant : ${nextStatus}`, true);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="admin-personnel-rh-root">
      <TabletDrawerWrapper>
        <PersonnelSubSidebar
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

        {activeTab === 'accounts' && (
          <AccountsTab
            staff={staff}
            onAddStaff={handleAddStaff}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {activeTab === 'rbac' && <RbacTab onShowToast={showToast} />}

        {activeTab === 'attendance' && <AttendanceTab />}
      </div>
    </div>
  );
}
