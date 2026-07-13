import { Grade } from '../../domain/Grade';
import { GradeRepository } from '../../domain/GradeRepository';

const FAKE_GRADES: Grade[] = [
  { id: 'g-001', module: 'Machine Learning Foundations', prof: 'Prof. A. Ndiaye', ects: 8, cc: 17.5, examen: 18.75, moyPromo: 13.40 },
  { id: 'g-002', module: 'Cybersecurity Essentials', prof: 'Prof. M. Fall', ects: 6, cc: 13.5, examen: 15.15, moyPromo: 12.10 },
  { id: 'g-003', module: 'Advanced Mobile Dev (Flutter)', prof: 'Prof. S. Diop', ects: 8, cc: 15.5, examen: 17.65, moyPromo: 14.20 },
  { id: 'g-004', module: 'Business Intelligence', prof: 'Prof. K. Sy', ects: 6, cc: 14.2, examen: 16.20, moyPromo: 12.80 },
  { id: 'g-005', module: 'Ethics in Technology', prof: 'Prof. L. Camara', ects: 2, cc: 18.0, examen: 19.65, moyPromo: 16.50 },
];

export class InMemoryGradeRepository implements GradeRepository {
  async getStudentGrades(): Promise<Grade[]> {
    // Simule une latence réseau pour afficher les skeletons/spinners
    await new Promise((resolve) => setTimeout(resolve, 800));
    return FAKE_GRADES;
  }

  async requestGradeReview(gradeId: string, reason: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Demande de révision envoyée pour la note ${gradeId}: ${reason}`);
  }
}
