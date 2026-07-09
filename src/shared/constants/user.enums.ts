export const ROLE_UTILISATEUR = {
  ETUDIANT:    'ETUDIANT',
  PROFESSEUR:  'PROFESSEUR',
  ADMIN:       'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SECRETAIRE:  'SECRETAIRE',
  COMPTABLE:   'COMPTABLE',
  VIGIL:       'VIGIL',
} as const;

export type RoleUtilisateur = typeof ROLE_UTILISATEUR[keyof typeof ROLE_UTILISATEUR];
