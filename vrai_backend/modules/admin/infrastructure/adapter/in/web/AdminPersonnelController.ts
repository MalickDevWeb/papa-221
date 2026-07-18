import { Request, Response } from 'express';
import { ManagePersonnelUseCase } from '../../../../application/port/usecase/ManagePersonnelUseCase';

export class AdminPersonnelController {
  constructor(private readonly useCase: ManagePersonnelUseCase) {}

  public getPersonnel = async (req: Request, res: Response): Promise<void> => {
    try {
      const personnel = await this.useCase.getPersonnel();
      res.json(personnel);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur récupération du personnel" });
    }
  };

  public addPersonnel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, role, telephone } = req.body;
      const result = await this.useCase.addPersonnel(name, email, role, telephone);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public deletePersonnel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.useCase.deletePersonnel(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
