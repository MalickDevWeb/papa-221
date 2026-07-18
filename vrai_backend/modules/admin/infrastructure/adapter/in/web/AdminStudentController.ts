import { Request, Response } from 'express';
import { ManageStudentUseCase } from '../../../../application/port/usecase/ManageStudentUseCase';

export class AdminStudentController {
  constructor(private readonly useCase: ManageStudentUseCase) {}

  public addStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, matricule, promotion_id } = req.body;
      const student = await this.useCase.addStudent(name, matricule, promotion_id);
      res.status(201).json(student);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.useCase.deleteStudent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  public updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { statutFrais } = req.body;
      const student = await this.useCase.updatePayment(id, statutFrais);
      res.json({ success: true, item: student });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  public addObservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { text, type, auteur } = req.body;
      const student = await this.useCase.addObservation(id, text, type, auteur);
      res.json({ success: true, item: student });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public bulkImport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { students } = req.body;
      const result = await this.useCase.bulkImport(students);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
