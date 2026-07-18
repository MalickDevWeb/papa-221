import { Request, Response } from 'express';
import { GetAdminStatsUseCase } from '../../../../application/port/usecase/GetAdminStatsUseCase';
import { GetAdminUsersUseCase } from '../../../../application/port/usecase/GetAdminUsersUseCase';

export class AdminStatsController {
  constructor(
    private readonly getStatsUseCase: GetAdminStatsUseCase,
    private readonly getUsersUseCase: GetAdminUsersUseCase
  ) {}

  public getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.getStatsUseCase.execute();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur récupération des statistiques" });
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.getUsersUseCase.execute();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur récupération des utilisateurs" });
    }
  };
}
