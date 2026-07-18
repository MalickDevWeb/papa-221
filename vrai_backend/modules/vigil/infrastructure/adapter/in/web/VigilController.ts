import { Request, Response } from 'express';
import { SubmitScanUseCase } from '../../../../application/port/usecase/SubmitScanUseCase';
import { BadgeScanRepositoryPort } from '../../../../domain/port/repository/BadgeScanRepositoryPort';

export class VigilController {
  constructor(
    private readonly submitScanUseCase: SubmitScanUseCase,
    private readonly repository: BadgeScanRepositoryPort
  ) {}

  public handleProfile = async (req: Request, res: Response): Promise<void> => {
    res.json({
      id: "usr-vigil-01",
      nom: "Diallo",
      prenom: "Aboulaye",
      badgeId: "VIGIL-001",
      equipe: "Équipe A",
      derniereConnexion: "Aujourd'hui, 08:00",
      statut: "Opérationnel"
    });
  };

  public handleScan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { badgeId } = req.body;
      if (!badgeId) {
        res.status(400).json({ error: "badgeId est requis" });
        return;
      }

      const scanResult = await this.submitScanUseCase.execute({
        badgeId,
        type: req.body.type || 'Scanner',
        zone: req.body.zone || 'Portail Entrée'
      });

      res.json(scanResult.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Erreur lors du scan du badge" });
    }
  };

  public handleLastScan = async (req: Request, res: Response): Promise<void> => {
    try {
      const lastScan = await this.repository.findRecent();
      if (!lastScan) {
        res.json({
          badgeOwner: "Moussa Gueye",
          studentId: "221-M382",
          statut: "Autorisé",
          message: "Accès autorisé - Promotion 221-GL",
          assiduite: "94% d'assiduité",
          statutFrais: "Scolarité à jour",
          zone: "Portail Entrée",
          time: "Dernier scan"
        });
        return;
      }
      res.json(lastScan.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: "Erreur lors de la récupération du dernier scan" });
    }
  };

  public handleCheckIns = async (req: Request, res: Response): Promise<void> => {
    try {
      const allScans = await this.repository.findAll();
      res.json(allScans.map(s => s.toJSON()));
    } catch (error: any) {
      res.status(500).json({ error: "Erreur lors de la récupération des pointages" });
    }
  };
}
