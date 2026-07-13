import { Request, Response } from 'express';
import { GetEleveProfileUseCase } from '../../../../application/port/usecase/GetEleveProfileUseCase';
import { UpdateEleveMoodUseCase } from '../../../../application/port/usecase/UpdateEleveMoodUseCase';
import { getStudentContext } from '../../../../../../../backend/authHelper';

export class EleveController {
  constructor(
    private readonly getProfileUseCase: GetEleveProfileUseCase,
    private readonly updateMoodUseCase: UpdateEleveMoodUseCase
  ) {}

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization || '';
      const context = getStudentContext(authHeader);
      if (!context) {
        res.status(401).json({ error: 'Accès non autorisé ou profil étudiant introuvable' });
        return;
      }

      const profile = await this.getProfileUseCase.execute(context.student.id);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur lors de la récupération du profil" });
    }
  };

  public updateMood = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization || '';
      const context = getStudentContext(authHeader);
      if (!context) {
        res.status(401).json({ error: 'Accès non autorisé ou profil étudiant introuvable' });
        return;
      }

      const { mood } = req.body;
      if (!mood) {
        res.status(400).json({ error: 'Le champ mood est requis' });
        return;
      }

      await this.updateMoodUseCase.execute(context.student.id, mood);
      res.json({ success: true, mood });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur lors de la mise à jour du mood" });
    }
  };
}
