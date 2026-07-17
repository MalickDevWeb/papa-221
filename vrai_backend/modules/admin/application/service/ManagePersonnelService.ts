import { ManagePersonnelUseCase } from '../port/usecase/ManagePersonnelUseCase';
import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';

export class ManagePersonnelService implements ManagePersonnelUseCase {
  constructor(private readonly repository: AdminRepositoryPort) {}

  public async getPersonnel(): Promise<any> {
    return this.repository.getPersonnel();
  }

  public async addPersonnel(name: string, email: string, role: string, telephone?: string): Promise<any> {
    if (!name || !email || !role) {
      throw new Error("Le nom, l'email et le rôle sont requis");
    }
    if (role === "Professeur") {
      const newProf = { id: `prof-${Date.now()}`, name, email };
      await this.repository.saveProfessor(newProf);
      return newProf;
    } else {
      const newStaff = {
        id: `staff-${Date.now()}`,
        name,
        email,
        role,
        telephone: telephone || "Non renseigné"
      };
      await this.repository.saveStaff(newStaff);
      return newStaff;
    }
  }

  public async deletePersonnel(id: string): Promise<void> {
    if (id.startsWith("prof-")) {
      const success = await this.repository.deleteProfessor(id);
      if (!success) throw new Error("Professeur introuvable");
    } else {
      const success = await this.repository.deleteStaff(id);
      if (!success) throw new Error("Membre du personnel introuvable");
    }
  }
}
