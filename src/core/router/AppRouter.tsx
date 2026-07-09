import React from 'react';
import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES, ROLE_UTILISATEUR } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';

import { LoginPage, CandidaturePage } from '@/features/auth';
import { AdminPage } from '@/features/admin';
import {
  StudentDashboardPage,
  StudentCoursesPage,
  CourseDetailPage,
  StudentHomeworksPage,
  StudentSchedulePage,
  StudentGradesPage,
  StudentTutorPage,
} from '@/features/student';
import { StudentLayout } from '@/features/student/ui/components/layout/StudentLayout';
import {
  VigilPatrolPage,
  VigilLayout,
} from '@/features/vigil';
import { ProfessorDashboardPage } from '@/features/professor';

// Skeleton très simple pour le Suspense
const PageSkeleton = () => <div className="p-8 text-center text-gray-500">Chargement...</div>;

// Redirection intelligente d'accueil pour /dashboard
const DashboardRedirect = () => {
  const { utilisateur } = useAuthStore();
  if (utilisateur?.role === ROLE_UTILISATEUR.ADMIN || utilisateur?.role === ROLE_UTILISATEUR.SUPER_ADMIN) {
    return <Navigate to={ROUTES.admin.dashboard} replace />;
  }
  if (utilisateur?.role === ROLE_UTILISATEUR.VIGIL) {
    return <Navigate to={ROUTES.vigil.dashboard} replace />;
  }
  if (utilisateur?.role === ROLE_UTILISATEUR.PROFESSEUR) {
    return <Navigate to={ROUTES.professor.dashboard} replace />;
  }
  return <Navigate to={ROUTES.student.dashboard} replace />;
};

export function AppRouter() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.candidature} element={<CandidaturePage />} />

        {/* Dashboard smart routing redirector */}
        <Route path={ROUTES.dashboard} element={<DashboardRedirect />} />

        {/* Routes Protégées pour l'Admin */}
        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.ADMIN, ROLE_UTILISATEUR.SUPER_ADMIN]} />}>
          <Route path={ROUTES.admin.dashboard} element={<AdminPage />} />
        </Route>

        {/* Routes Protégées pour l'Espace Éducatif — partagent le StudentLayout */}
        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.ETUDIANT, ROLE_UTILISATEUR.PROFESSEUR, ROLE_UTILISATEUR.SECRETAIRE, ROLE_UTILISATEUR.VIGIL]} />}>
          <Route element={<StudentLayout />}>
            <Route path={ROUTES.student.dashboard} element={<StudentDashboardPage />} />
            <Route path="/etudiant/cours"          element={<StudentCoursesPage />} />
            <Route path="/etudiant/cours/:id"      element={<CourseDetailPage />} />
            <Route path="/etudiant/devoirs"        element={<StudentHomeworksPage />} />
            <Route path="/etudiant/planning"       element={<StudentSchedulePage />} />
            <Route path="/etudiant/notes"          element={<StudentGradesPage />} />
            <Route path="/etudiant/tuteur"         element={<StudentTutorPage />} />
          </Route>
        </Route>

        {/* Routes Protégées pour l'Espace Vigile */}
        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.VIGIL]} />}>
          <Route element={<VigilLayout />}>
            <Route path={ROUTES.vigil.dashboard} element={<VigilPatrolPage />} />
            <Route path={ROUTES.vigil.rondes} element={<VigilPatrolPage />} />
            <Route path={ROUTES.vigil.rapports} element={<VigilPatrolPage />} />
            <Route path="/vigile/stats" element={<VigilPatrolPage />} />
            <Route path="/vigile/profil" element={<VigilPatrolPage />} />
          </Route>
        </Route>

        {/* Routes Protégées pour l'Espace Professeur */}
        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.PROFESSEUR]} />}>
          <Route path={ROUTES.professor.dashboard} element={<ProfessorDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
    </Suspense>
  );
}
