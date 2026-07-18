export interface Student {
  id: string;
  matricule: string;
  name: string;
  email: string;
  classe: string;
  financialStatus: 'En Règle' | 'En Retard';
  qrStatus: 'AUTORISÉ' | 'SUSPENDU';
  avatar?: string;
  gpa: string;
  phoneParent: string;
}

export interface StudentDoc {
  name: string;
  size: string;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    matricule: '2026-GC-001',
    name: 'Assane Diop',
    email: 'assane.diop@ecole221.sn',
    classe: 'L1 Génie Civil',
    financialStatus: 'En Règle',
    qrStatus: 'AUTORISÉ',
    gpa: '16.5/20',
    phoneParent: '+221 77 450 12 34'
  },
  {
    id: 's-2',
    matricule: '2026-CM-042',
    name: 'Fatou Sow',
    email: 'fatou.sow@ecole221.sn',
    classe: 'L3 CM (Construction Métallique)',
    financialStatus: 'En Règle',
    qrStatus: 'AUTORISÉ',
    gpa: '17.8/20',
    phoneParent: '+221 78 120 44 99'
  },
  {
    id: 's-3',
    matricule: '2026-IA-109',
    name: 'Amadou Diallo',
    email: 'amadou.diallo@ecole221.sn',
    classe: 'Master 1 Spécialité IA',
    financialStatus: 'En Retard',
    qrStatus: 'SUSPENDU',
    gpa: '14.2/20',
    phoneParent: '+221 76 990 88 11'
  }
];
