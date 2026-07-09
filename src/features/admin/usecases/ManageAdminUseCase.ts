import { AdminRepository } from '../domain/AdminRepository';
import { AdminStats, AdminStudent, AdminProfessor, AdminPromotion, AdminSession } from '../domain/AdminModels';

export class ManageAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async fetchStats(): Promise<AdminStats> {
    return this.adminRepository.getStats();
  }

  async fetchUsers(): Promise<{ students: AdminStudent[]; professors: AdminProfessor[]; promotions: AdminPromotion[] }> {
    return this.adminRepository.getUsers();
  }

  async createStudent(student: { name: string; matricule: string; promotion_id: string }): Promise<AdminStudent> {
    return this.adminRepository.addStudent(student);
  }

  async removeStudent(id: string): Promise<boolean> {
    return this.adminRepository.deleteStudent(id);
  }

  async createProfessor(professor: { name: string; email: string }): Promise<AdminProfessor> {
    return this.adminRepository.addProfessor(professor);
  }

  async removeProfessor(id: string): Promise<boolean> {
    return this.adminRepository.deleteProfessor(id);
  }

  async setStudentPaymentStatus(id: string, status: string): Promise<AdminStudent> {
    return this.adminRepository.updateStudentPayment(id, status);
  }

  async fetchSchedule(): Promise<AdminSession[]> {
    return this.adminRepository.getSchedule();
  }

  async updateSessionPlanning(id: string, update: { jourComplet: string; heureStr: string; salle: string }): Promise<AdminSession> {
    return this.adminRepository.rescheduleSession(id, update);
  }
}
