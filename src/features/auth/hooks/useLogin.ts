import { useState } from 'react';
import { loginUseCase } from '../infrastructure/config/dependencies';
import type { LoginCommand } from '../usecases/LoginCommand';
import { useAuthStore } from '@/core/store/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROLE_UTILISATEUR } from '@/shared/constants';

type EtatRequete = 'IDLE' | 'CHARGEMENT' | 'SUCCES' | 'ERREUR';

export function useLogin() {
  const [etat, setEtat] = useState<EtatRequete>('IDLE');
  const [erreur, setErreur] = useState<string | null>(null);
  
  const { connexionReussie } = useAuthStore();
  const navigate = useNavigate();

  const executer = async (cmd: LoginCommand) => {
    setEtat('CHARGEMENT');
    setErreur(null);
    try {
      const { utilisateur, token } = await loginUseCase(cmd);
      
      // Mettre à jour l'état global
      connexionReussie({ utilisateur, token });
      
      // Stocker le token
      localStorage.setItem('access_token', token);
      
      setEtat('SUCCES');
      
      // Redirection sécurisée selon le rôle
      if (utilisateur.role === ROLE_UTILISATEUR.ADMIN || utilisateur.role === ROLE_UTILISATEUR.SUPER_ADMIN) {
        navigate(ROUTES.admin.dashboard);
      } else if (utilisateur.role === ROLE_UTILISATEUR.VIGIL) {
        navigate(ROUTES.vigil.dashboard);
      } else if (utilisateur.role === ROLE_UTILISATEUR.PROFESSEUR) {
        navigate(ROUTES.professor.dashboard);
      } else {
        navigate(ROUTES.dashboard);
      }
      
    } catch (e: unknown) {
      setEtat('ERREUR');
      setErreur(e instanceof Error ? e.message : 'Une erreur est survenue.');
    }
  };

  return { etat, erreur, executer };
}
