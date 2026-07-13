import { ManageStudentUseCase } from '../port/usecase/ManageStudentUseCase';
import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';

export class ManageStudentService implements ManageStudentUseCase {
  constructor(private readonly repository: AdminRepositoryPort) {}

  public async addStudent(name: string, matricule: string, promotionId?: string): Promise<any> {
    if (!name || !matricule) {
      throw new Error("Le nom et le matricule sont requis");
    }
    const newStudent = {
      id: `usr-etudiant-${Date.now()}`,
      name,
      matricule,
      promotion_id: promotionId || "p-1",
      average: 14.0,
      gpa: 3.2,
      mood: "Motivé"
    };
    await this.repository.saveStudent(newStudent);
    return newStudent;
  }

  public async deleteStudent(id: string): Promise<void> {
    const success = await this.repository.deleteStudent(id);
    if (!success) {
      throw new Error("Étudiant introuvable");
    }
  }

  public async updatePayment(id: string, statutFrais: string): Promise<any> {
    const student = await this.repository.findStudentById(id);
    if (!student) {
      throw new Error("Étudiant introuvable");
    }
    student.statutFrais = statutFrais;
    await this.repository.saveStudent(student);
    return student;
  }

  public async addObservation(studentId: string, text: string, type?: string, auteur?: string): Promise<any> {
    if (!text) {
      throw new Error("Le texte de l'observation est requis");
    }
    const student = await this.repository.findStudentById(studentId);
    if (!student) {
      throw new Error("Étudiant introuvable");
    }
    student.observations = student.observations || [];
    student.observations.push({
      id: `obs-${Date.now()}`,
      text,
      type: type || "Général",
      date: new Date().toISOString().split('T')[0],
      auteur: auteur || "Administrateur"
    });
    await this.repository.saveStudent(student);
    return student;
  }

  public async bulkImport(students: any[]): Promise<any> {
    if (!students || !Array.isArray(students)) {
      throw new Error("Liste d'étudiants invalide");
    }
    const imported: any[] = [];
    for (const s of students) {
      if (!s.name) continue;
      const newStud = {
        id: `usr-etudiant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: s.name,
        matricule: s.matricule || `221-M${Math.floor(100 + Math.random() * 900)}`,
        promotion_id: s.promotion_id || "p-1",
        average: s.average ? Number(s.average) : 12.0,
        gpa: s.gpa ? Number(s.gpa) : 2.5,
        mood: s.mood || "Nouveau",
        statutFrais: s.statutFrais || "Régler",
        observations: s.observations || []
      };
      await this.repository.saveStudent(newStud);
      imported.push(newStud);
    }
    return { success: true, count: imported.length, imported };
  }
}
