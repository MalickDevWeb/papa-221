import { AdminStats, AdminStudent, AdminProfessor, AdminPromotion, AdminSession } from './AdminModels';

export interface AdminRepository {
  getStats(): Promise<AdminStats>;
  getUsers(): Promise<{ students: AdminStudent[]; professors: AdminProfessor[]; promotions: AdminPromotion[] }>;
  addStudent(student: { name: string; matricule: string; promotion_id: string }): Promise<AdminStudent>;
  deleteStudent(id: string): Promise<boolean>;
  addProfessor(professor: { name: string; email: string }): Promise<AdminProfessor>;
  deleteProfessor(id: string): Promise<boolean>;
  updateStudentPayment(id: string, status: string): Promise<AdminStudent>;
  getSchedule(): Promise<AdminSession[]>;
  rescheduleSession(id: string, update: { jourComplet: string; heureStr: string; salle: string }): Promise<AdminSession>;
}
