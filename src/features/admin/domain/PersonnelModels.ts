export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: 'Actif' | 'Suspendu';
  assignedClass?: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  photo: string;
  role: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: 'À l\'heure' | 'En retard' | 'Absent';
}

export const STAFF_ROLES = ['Administrateur', 'Secrétaire', 'Comptable', 'Enseignant', 'Vigile'];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'EMP-2026-001', firstName: 'Marie', lastName: 'Sow', email: 'marie.sow@ecole221.sn', phone: '77 123 45 67', role: 'Secrétaire', status: 'Actif' },
  { id: 'EMP-2026-002', firstName: 'Khadim', lastName: 'Diallo', email: 'khadim.diallo@ecole221.sn', phone: '78 987 65 43', role: 'Enseignant', status: 'Actif', assignedClass: 'L2 Génie Civil' },
  { id: 'EMP-2026-003', firstName: 'Abdou', lastName: 'Ndiaye', email: 'abdou.ndiaye@ecole221.sn', phone: '76 543 21 09', role: 'Vigile', status: 'Actif' },
  { id: 'EMP-2026-004', firstName: 'Ibrahima', lastName: 'Faye', email: 'ibrahima.faye@ecole221.sn', phone: '70 888 99 00', role: 'Comptable', status: 'Actif' },
  { id: 'EMP-2026-005', firstName: 'Awa', lastName: 'Diop', email: 'awa.diop@ecole221.sn', phone: '75 111 22 33', role: 'Secrétaire', status: 'Suspendu' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', name: 'Marie Sow', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80', role: 'Secrétaire', checkIn: '07h52', checkOut: '17h05', hours: 9, status: 'À l\'heure' },
  { id: 'att-2', name: 'Khadim Diallo', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80', role: 'Enseignant', checkIn: '08h15', checkOut: '16h00', hours: 7.5, status: 'En retard' },
  { id: 'att-3', name: 'Abdou Ndiaye', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', role: 'Vigile', checkIn: '06h45', checkOut: '18h00', hours: 11.25, status: 'À l\'heure' },
  { id: 'att-4', name: 'Ibrahima Faye', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80', role: 'Comptable', checkIn: '08h02', checkOut: '17h30', hours: 9.25, status: 'À l\'heure' },
  { id: 'att-5', name: 'Awa Diop', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80', role: 'Secrétaire', checkIn: '--', checkOut: '--', hours: 0, status: 'Absent' },
];

export const RBAC_PERMISSIONS = [
  { key: 'edit_grades', label: 'Modifier les notes', category: 'Pédagogie' },
  { key: 'validate_payments', label: 'Valider les paiements', category: 'Finance' },
  { key: 'modify_schedule', label: 'Modifier l\'emploi du temps', category: 'Logistique' },
  { key: 'view_audit_trail', label: 'Consulter la piste d\'audit', category: 'Sécurité' },
  { key: 'manage_users', label: 'Créer/Suspendre des comptes', category: 'Système' },
];
