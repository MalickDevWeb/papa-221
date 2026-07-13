export interface Candidate {
  id: string;
  name: string;
  course: string;
  step: 'new' | 'docs' | 'admitted' | 'rejected';
  docs: { diploma: boolean; idCard: boolean };
  registrationFeePaid: boolean;
}

export const INITIAL_CANDIDATES: Candidate[] = [
  { id: 'cand-2026-101', name: 'Nafissatou Diallo', course: 'L2 Génie Civil', step: 'new', docs: { diploma: true, idCard: false }, registrationFeePaid: false },
  { id: 'cand-2026-102', name: 'Ibrahima Ba', course: 'Master 1 Spécialité IA', step: 'docs', docs: { diploma: true, idCard: true }, registrationFeePaid: false },
  { id: 'cand-2026-103', name: 'Modou Diagne', course: 'L3 CM (Construction Métallique)', step: 'admitted', docs: { diploma: true, idCard: true }, registrationFeePaid: true },
  { id: 'cand-2026-104', name: 'Coumba Sow', course: 'Master 1 Spécialité IA', step: 'admitted', docs: { diploma: true, idCard: true }, registrationFeePaid: false },
  { id: 'cand-2026-105', name: 'Ousmane Diop', course: 'L2 Génie Civil', step: 'rejected', docs: { diploma: false, idCard: true }, registrationFeePaid: false },
];
