import { Request, Response } from 'express';
import { LoginUseCase } from '../../../../application/port/usecase/LoginUseCase';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email et mot de passe requis" });
        return;
      }

      const result = await this.loginUseCase.execute(email, password);
      res.json({
        user: result.user.toJSON(),
        token: result.token
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Erreur d'authentification" });
    }
  };
}
