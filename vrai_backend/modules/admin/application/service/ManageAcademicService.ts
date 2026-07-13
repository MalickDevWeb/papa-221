import { ManageAcademicUseCase } from '../port/usecase/ManageAcademicUseCase';
import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';

export class ManageAcademicService implements ManageAcademicUseCase {
  constructor(private readonly repository: AdminRepositoryPort) {}

  public async getSchedule(): Promise<any[]> {
    return this.repository.getSessions();
  }

  public async rescheduleSession(id: string, jourComplet: string, heureStr: string, salle: string): Promise<any> {
    const session = await this.repository.findSessionById(id);
    if (!session) {
      throw new Error("Séance introuvable");
    }
    if (jourComplet) {
      session.jourComplet = jourComplet.toUpperCase();
      session.jour = jourComplet.substring(0, 3).toUpperCase();
    }
    if (heureStr) session.heureStr = heureStr;
    if (salle) session.salle = salle;

    await this.repository.saveSession(session);
    return session;
  }

  public async createPromotion(name: string, filiere: string, faculte?: string): Promise<any> {
    if (!name || !filiere) {
      throw new Error("Le nom de classe et la filière sont requis");
    }
    const newPromo = {
      id: `p-${Date.now()}`,
      name,
      filiere,
      faculte: faculte || "Sciences & Technologies"
    };
    await this.repository.savePromotion(newPromo);
    return newPromo;
  }

  public async createCourse(
    titre: string,
    coefficient: number,
    professeurId?: string,
    promotionId?: string,
    prochainCours?: string
  ): Promise<any> {
    if (!titre || !promotionId) {
      throw new Error("Le titre et la promotion sont requis");
    }
    const newCourse = {
      id: `c-${Date.now()}`,
      titre,
      coefficient: Number(coefficient) || 3,
      progress: 0,
      unites: ["Chapitre 1: Introduction"],
      professeur_id: professeurId || "",
      promotion_id: promotionId,
      prochain_cours: prochainCours || "À définir"
    };
    await this.repository.saveCourse(newCourse);
    return newCourse;
  }
}
