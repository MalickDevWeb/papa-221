export interface StudentFinance {
  id: string;
  name: string;
  classe: string;
  status: 'En Règle' | 'En Avance' | 'En Retard';
  debt: number; // in FCFA
  paid: number;  // in FCFA
}

export interface Expense {
  id: string;
  label: string;
  category: string;
  amount: number; // in FCFA
  date: string;
}

export const CLASSES_LIST = ['L1 Génie Civil', 'L2 Génie Civil', 'L3 CM (Construction Métallique)', 'Master 1 Spécialité IA'];

export const INITIAL_STUDENTS_FINANCES: StudentFinance[] = [
  { id: 'STU-2026-001', name: 'Assane Diop', classe: 'L1 Génie Civil', status: 'En Règle', debt: 0, paid: 450000 },
  { id: 'STU-2026-002', name: 'Fatou Sow', classe: 'L1 Génie Civil', status: 'En Avance', debt: 0, paid: 600000 },
  { id: 'STU-2026-003', name: 'Amadou Diallo', classe: 'L2 Génie Civil', status: 'En Retard', debt: 150000, paid: 300000 },
  { id: 'STU-2026-004', name: 'Khadidiatou Ba', classe: 'Master 1 Spécialité IA', status: 'En Retard', debt: 300000, paid: 900000 },
  { id: 'STU-2026-005', name: 'Cheikh Ndiaye', classe: 'L3 CM (Construction Métallique)', status: 'En Règle', debt: 0, paid: 500000 },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', label: 'Salaires des professeurs vacataires', category: 'RH', amount: 4800000, date: '2026-07-01' },
  { id: 'exp-2', label: 'Facture d\'électricité Senelec', category: 'Loyer/Charges', amount: 350000, date: '2026-07-04' },
  { id: 'exp-3', label: 'Loyer des locaux (Annexe B)', category: 'Loyer/Charges', amount: 800000, date: '2026-07-05' },
  { id: 'exp-4', label: 'Achat de serveurs de calcul pour le Labo IA', category: 'Matériel', amount: 1500000, date: '2026-07-08' },
];
