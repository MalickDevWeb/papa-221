import { Request, Response } from 'express';
import { ManageAcademicUseCase } from '../../../../application/port/usecase/ManageAcademicUseCase';

export class AdminAcademicController {
  constructor(private readonly useCase: ManageAcademicUseCase) {}

  public getSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const schedule = await this.useCase.getSchedule();
      res.json(schedule);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur récupération de l'emploi du temps" });
    }
  };

  public rescheduleSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { jourComplet, heureStr, salle } = req.body;
      const session = await this.useCase.rescheduleSession(id, jourComplet, heureStr, salle);
      res.json({ success: true, item: session });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  public createPromotion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, filiere, faculte } = req.body;
      const promotion = await this.useCase.createPromotion(name, filiere, faculte);
      res.status(201).json(promotion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { titre, coefficient, professeur_id, promotion_id, prochain_cours } = req.body;
      const course = await this.useCase.createCourse(
        titre,
        coefficient,
        professeur_id,
        promotion_id,
        prochain_cours
      );
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
