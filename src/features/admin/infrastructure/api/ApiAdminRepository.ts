import { AdminRepository } from '../../domain/AdminRepository';
import { AdminStats, AdminStudent, AdminProfessor, AdminPromotion, AdminSession } from '../../domain/AdminModels';

export class ApiAdminRepository implements AdminRepository {
  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Erreur récupération statistiques');
    return res.json();
  }

  async getUsers(): Promise<{ students: AdminStudent[]; professors: AdminProfessor[]; promotions: AdminPromotion[] }> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Erreur récupération utilisateurs');
    return res.json();
  }

  async addStudent(student: { name: string; matricule: string; promotion_id: string }): Promise<AdminStudent> {
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'étudiant');
    return res.json();
  }

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  async addProfessor(professor: { name: string; email: string }): Promise<AdminProfessor> {
    const res = await fetch('/api/admin/professors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professor)
    });
    if (!res.ok) throw new Error('Erreur lors de l\'ajout du professeur');
    return res.json();
  }

  async deleteProfessor(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/professors/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  async updateStudentPayment(id: string, status: string): Promise<AdminStudent> {
    const res = await fetch(`/api/admin/students/${id}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statutFrais: status })
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour du paiement');
    return res.json();
  }

  async getSchedule(): Promise<AdminSession[]> {
    const res = await fetch('/api/admin/schedule');
    if (!res.ok) throw new Error('Erreur récupération planning');
    return res.json();
  }

  async rescheduleSession(id: string, update: { jourComplet: string; heureStr: string; salle: string }): Promise<AdminSession> {
    const res = await fetch(`/api/admin/schedule/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (!res.ok) throw new Error('Erreur lors de la reprogrammation de la séance');
    return res.json();
  }
}
