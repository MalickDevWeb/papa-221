import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import { ROUTES } from '@/shared/constants';
import { SCHOOL_TENANTS, SchoolTenant } from '../domain/AdminTenants';
import { AdminSidebar } from '../ui/components/AdminSidebar';
import { AdminCommandPalette } from '../ui/components/AdminCommandPalette';
import { AdminCEODashboard } from '../ui/components/AdminCEODashboard';
import { AdminSchoolManager } from '../ui/components/AdminSchoolManager';
import { AdminGlobalScheduler } from '../ui/components/AdminGlobalScheduler';
import { AdminPersonnelRH } from '../ui/components/AdminPersonnelRH';
import { AdminStudentManager } from '../ui/components/AdminStudentManager';
import { AdminAdmissionsKanban } from '../ui/components/AdminAdmissionsKanban';
import { AdminFinanceDashboard } from '../ui/components/AdminFinanceDashboard';
import { AdminNotificationsHub } from '../ui/components/AdminNotificationsHub';
import { AdminPredictiveAIEngine } from '../ui/components/AdminPredictiveAIEngine';
import { AdminSecurityAuditTrail } from '../ui/components/AdminSecurityAuditTrail';
import { useDeviceStore } from '@/features/screenguard/hooks/useDeviceStore';
import { MobileBottomNav } from '@/features/screenguard/ui/components/MobileBottomNav';

export function AdminPage() {
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenant, setTenant] = useState<SchoolTenant>(SCHOOL_TENANTS[0]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isMobile, isTablet } = useDeviceStore();

  useEffect(() => {
    setIsSidebarCollapsed(isTablet || activeTab !== 'dashboard');
  }, [activeTab, isTablet]);

  const handleLogout = () => { deconnexion(); localStorage.removeItem('access_token'); navigate(ROUTES.login); };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminCEODashboard currency={tenant.currency} />;
      case 'school': return <AdminSchoolManager />;
      case 'schedule': return <AdminGlobalScheduler />;
      case 'personnel': return <AdminPersonnelRH />;
      case 'students': return <AdminStudentManager />;
      case 'admissions': return <AdminAdmissionsKanban />;
      case 'finances': return <AdminFinanceDashboard />;
      case 'notifications': return <AdminNotificationsHub />;
      case 'ai': return <AdminPredictiveAIEngine />;
      case 'security': return <AdminSecurityAuditTrail />;
      default: return <AdminCEODashboard currency={tenant.currency} />;
    }
  };

  const leftMarginClass = isSidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64';

  return (
    <div className="bg-surface text-on-surface font-sans min-h-screen flex overflow-x-hidden" id="admin-layout-root">
      {!isMobile && (
        <AdminSidebar
          onLogout={handleLogout}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      <div className={`flex-grow min-w-0 w-full overflow-x-hidden transition-all duration-300 bg-neutral-50 min-h-screen flex flex-col pb-20 ${leftMarginClass}`}>
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-neutral-200 px-6 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] text-xl">school</span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">École 221</span>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 border border-neutral-200 px-3 py-1.5 rounded-xl text-[11px] font-bold text-neutral-400 bg-neutral-50 hover:bg-neutral-100 transition-colors w-64 text-left cursor-pointer"
          >
            <span translate="no" className="material-symbols-outlined text-sm">search</span>
            <span>Rechercher partout... (Ctrl+K)</span>
          </button>

          <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full animate-pulse">
            Connecté
          </span>
        </header>

        <main className={`p-4 md:p-6 w-full space-y-6 flex-grow ${activeTab === 'schedule' ? 'max-w-none' : 'max-w-[1440px] mx-auto'}`}>
          {renderContent()}
        </main>
      </div>

      {isMobile && <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} onLogout={handleLogout} />}
      <AdminCommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectTab={setActiveTab} />
    </div>
  );
}
