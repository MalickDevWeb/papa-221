import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import { ROUTES } from '@/shared/constants';
import { useAdmin } from '../hooks/useAdmin';
import { AdminWelcomeSection } from '../ui/components/AdminWelcomeSection';
import { AdminStatsGrid } from '../ui/components/AdminStatsGrid';
import { AdminQuickActions } from '../ui/components/AdminQuickActions';
import { AdminRecentActivities } from '../ui/components/AdminRecentActivities';
import { AdminSidebar } from '../ui/components/AdminSidebar';
import { AdminHeader } from '../ui/components/AdminHeader';

export function AdminPage() {
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();
  const {
    stats, students, professors, promotions, loading,
    ajouterEtudiant, supprimerEtudiant, ajouterProfesseur, supprimerProfesseur, modifierPaiement, chargerDonnees
  } = useAdmin();

  const handleLogout = () => {
    deconnexion();
    localStorage.removeItem('access_token');
    navigate(ROUTES.login);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex overflow-x-hidden" id="admin-layout-root">
      {/* Sidebar matching student layout model */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main content area with offset matching StudentLayout */}
      <div className="flex-1 md:ml-64 bg-background min-h-screen pb-24 md:pb-0 flex flex-col min-w-0 max-w-full">
        {/* Header matching student layout header */}
        <AdminHeader onLogout={handleLogout} />

        <main className="flex-grow p-4 md:p-8 max-w-[1280px] mx-auto w-full space-y-6">
          <AdminWelcomeSection />
          <AdminStatsGrid stats={stats} loading={loading} />
          
          <AdminQuickActions
            students={students}
            professors={professors}
            promotions={promotions}
            onAddStudent={ajouterEtudiant}
            onDeleteStudent={supprimerEtudiant}
            onAddProf={ajouterProfesseur}
            onDeleteProf={supprimerProfesseur}
            onUpdatePayment={modifierPaiement}
            onRefreshData={chargerDonnees}
          />
          
          <AdminRecentActivities />
        </main>
      </div>
    </div>
  );
}
