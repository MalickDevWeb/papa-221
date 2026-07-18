import { AdminRepository } from '../../domain/AdminRepository';
import { AdminStats, AdminStudent, AdminProfessor, AdminPromotion, AdminSession } from '../../domain/AdminModels';

export class InMemoryAdminRepository implements AdminRepository {
  private students: AdminStudent[] = [
    { id: 's-1', name: 'Assane Diop', matricule: '2026-GC-001', promotion_id: 'pr-1', average: 16.5, gpa: 3.8, mood: 'normal', statutFrais: 'En Règle' },
    { id: 's-2', name: 'Fatou Sow', matricule: '2026-CM-042', promotion_id: 'pr-2', average: 17.8, gpa: 4.0, mood: 'happy', statutFrais: 'En Règle' },
    { id: 's-3', name: 'Amadou Diallo', matricule: '2026-IA-109', promotion_id: 'pr-1', average: 14.2, gpa: 3.2, mood: 'sad', statutFrais: 'En Retard' }
  ];

  private professors: AdminProfessor[] = [
    { id: 'p-1', name: 'Dr. Diop', email: 'diop.prof@ecole221.sn' },
    { id: 'p-2', name: 'Dr. Ndiaye', email: 'ndiaye.prof@ecole221.sn' }
  ];

  private promotions: AdminPromotion[] = [
    { id: 'pr-1', name: 'L1 Génie Civil', filiere: 'GC', faculte: 'Science & Tech' },
    { id: 'pr-2', name: 'L3 CM', filiere: 'CM', faculte: 'Science & Tech' }
  ];

  private schedule: AdminSession[] = [
    { id: 'sc-1', nom: 'Mathématiques', jourComplet: 'Lundi', heureStr: '08h00 - 10h00', salle: 'Salle 101', professeur: 'Dr. Diop' },
    { id: 'sc-2', nom: 'Algorithmique', jourComplet: 'Mardi', heureStr: '10h30 - 12h30', salle: 'Salle 102', professeur: 'Dr. Ndiaye' }
  ];

  async getStats(): Promise<AdminStats> {
    return {
      studentsCount: this.students.length,
      professorsCount: this.professors.length,
      coursesCount: 5,
      classesCount: this.promotions.length,
      presentProfessors: `${this.professors.length} / ${this.professors.length}`,
      salleOccupation: '80%'
    };
  }

  async getUsers(): Promise<{ students: AdminStudent[]; professors: AdminProfessor[]; promotions: AdminPromotion[] }> {
    return {
      students: [...this.students],
      professors: [...this.professors],
      promotions: [...this.promotions]
    };
  }

  async addStudent(student: { name: string; matricule: string; promotion_id: string }): Promise<AdminStudent> {
    const newStudent: AdminStudent = {
      id: `s-${this.students.length + 1}`,
      name: student.name,
      matricule: student.matricule,
      promotion_id: student.promotion_id,
      average: 15.0,
      gpa: 3.5,
      mood: 'normal',
      statutFrais: 'En Règle'
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const initialLength = this.students.length;
    this.students = this.students.filter(s => s.id !== id);
    return this.students.length < initialLength;
  }

  async addProfessor(professor: { name: string; email: string }): Promise<AdminProfessor> {
    const newProf: AdminProfessor = {
      id: `p-${this.professors.length + 1}`,
      name: professor.name,
      email: professor.email
    };
    this.professors.push(newProf);
    return newProf;
  }

  async deleteProfessor(id: string): Promise<boolean> {
    const initialLength = this.professors.length;
    this.professors = this.professors.filter(p => p.id !== id);
    return this.professors.length < initialLength;
  }

  async updateStudentPayment(id: string, status: string): Promise<AdminStudent> {
    const student = this.students.find(s => s.id === id);
    if (!student) throw new Error('Étudiant introuvable');
    student.statutFrais = status;
    return { ...student };
  }

  async getSchedule(): Promise<AdminSession[]> {
    return [...this.schedule];
  }

  async rescheduleSession(id: string, update: { jourComplet: string; heureStr: string; salle: string }): Promise<AdminSession> {
    const session = this.schedule.find(s => s.id === id);
    if (!session) throw new Error('Séance introuvable');
    session.jourComplet = update.jourComplet;
    session.heureStr = update.heureStr;
    session.salle = update.salle;
    return { ...session };
  }
}
