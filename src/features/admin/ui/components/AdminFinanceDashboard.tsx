import React, { useState } from 'react';
import { FinancesSubSidebar } from './finances/FinancesSubSidebar';
import { EcolagesTab } from './finances/EcolagesTab';
import { DepensesTab } from './finances/DepensesTab';
import { ReportsTab } from './finances/ReportsTab';
import { AutomationTab } from './finances/AutomationTab';
import { StudentFinance, Expense, INITIAL_STUDENTS_FINANCES, INITIAL_EXPENSES } from '../../domain/FinancesModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminFinanceDashboard() {
  const [activeTab, setActiveTab] = useState('ecolages');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState<StudentFinance[]>(INITIAL_STUDENTS_FINANCES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4500);
  };

  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const id = `exp-${Math.floor(10 + Math.random() * 89)}`;
    setExpenses([...expenses, { id, ...newExp }]);
    showToast(`Dépense de ${newExp.amount.toLocaleString()} FCFA enregistrée !`, true);
  };

  const handleToggleStudentStatus = (id: string) => {
    // Optional toggler
  };

  const handleTriggerRelances = () => {
    showToast('Simulation lancée : 42 SMS/WhatsApp de relance personnalisés envoyés aux retardataires.', true);
  };

  const handleTriggerBlocage = () => {
    setStudents(
      students.map((s) => (s.status === 'En Retard' ? { ...s, status: 'En Retard', debt: s.debt + 5000 } : s))
    );
    showToast("Alerte Sécurité : Tous les élèves débiteurs sont bloqués aux portiques d'accès ! QR Codes désactivés.", false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="admin-finances-root">
      <TabletDrawerWrapper>
        <FinancesSubSidebar
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

        {activeTab === 'ecolages' && (
          <EcolagesTab students={students} onToggleStatus={handleToggleStudentStatus} />
        )}

        {activeTab === 'expenses' && (
          <DepensesTab expenses={expenses} onAddExpense={handleAddExpense} />
        )}

        {activeTab === 'reports' && <ReportsTab />}

        {activeTab === 'recovery' && (
          <AutomationTab
            onTriggerRelances={handleTriggerRelances}
            onTriggerBlocage={handleTriggerBlocage}
          />
        )}
      </div>
    </div>
  );
}
