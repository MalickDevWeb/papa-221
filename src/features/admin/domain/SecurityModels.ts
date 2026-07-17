export interface AuditLog {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  details: string;
  ip: string;
  agent: string;
}

export interface AccessTerminal {
  id: string;
  name: string;
  status: 'Actif' | 'Inactif' | 'Révoqué';
  location: string;
}

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-001', time: '2026-07-10 09:12', user: 'Marie Sow', role: 'Secrétaire', action: 'Validation Inscription', details: 'A validé l\'inscription de l\'élève Nafissatou Diallo', ip: '196.207.240.12', agent: 'Chrome / Linux' },
  { id: 'log-002', time: '2026-07-10 08:45', user: 'Khadim Diallo', role: 'Enseignant', action: 'Modification Notes', details: 'A édité les notes d\'examen de L2 Génie Civil', ip: '196.207.240.15', agent: 'Safari / macOS' },
  { id: 'log-003', time: '2026-07-10 07:30', user: 'Ibrahima Faye', role: 'Comptable', action: 'Encaissement Dépense', details: 'A enregistré une dépense de 350,000 FCFA pour Senelec', ip: '196.207.240.18', agent: 'Chrome / Windows' },
];

export const INITIAL_TERMINALS: AccessTerminal[] = [
  { id: 'term-a', name: 'Portail Principal - Entrée A', status: 'Actif', location: 'Hall Central' },
  { id: 'term-b', name: 'Scanner Vigile - Poste B', status: 'Actif', location: 'Parking Enseignants' },
  { id: 'term-c', name: 'Borne Cafétéria - Lecteur C', status: 'Inactif', location: 'Espace Restauration' },
];
