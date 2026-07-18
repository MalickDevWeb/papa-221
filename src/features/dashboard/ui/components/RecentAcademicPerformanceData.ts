export interface SemesterData {
  semester: string;
  moyenne: number;
  color: string;
  mention: string;
}

export const SEMESTER_TRENDS: SemesterData[] = [
  { semester: 'Semestre 1 (L2)', moyenne: 14.25, color: '#B3181C', mention: 'Bien' },
  { semester: 'Semestre 2 (L2)', moyenne: 15.10, color: '#E3A857', mention: 'Très Bien' },
  { semester: 'Semestre 1 (L3)', moyenne: 16.20, color: '#10B981', mention: 'Excellent' }
];

export const CURRENT_GPA = 3.6;
export const IMPROVEMENT_RATE = "+13.7%";
