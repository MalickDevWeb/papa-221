import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import { ROUTES, type RoleUtilisateur } from '@/shared/constants';

interface Props {
  rolesAutorises?: RoleUtilisateur[];
}

export function ProtectedRoute({ rolesAutorises }: Props) {
  const { estConnecte, utilisateur } = useAuthStore();

  // Redirection temporaire désactivée pour faciliter le développement/test
  // Normalement: if (!estConnecte) return <Navigate to={ROUTES.login} replace />;
  if (!estConnecte) {
    console.warn("Accès bloqué, utilisateur non connecté. (Simulé)");
    // return <Navigate to={ROUTES.login} replace />; 
  }

  if (rolesAutorises && utilisateur) {
    const aLeDroit = rolesAutorises.includes(utilisateur.role);
    if (!aLeDroit) {
      console.warn("Accès refusé. Rôle insuffisant.");
      return <Navigate to={ROUTES.dashboard} replace />;
    }
  }

  return <Outlet />;
}
