import type { RoleUtilisateur } from '@/shared/constants';

export interface Utilisateur {
  readonly id: string;
  readonly nom: string;
  readonly prenom: string;
  readonly email: string;
  readonly role: RoleUtilisateur;
}
