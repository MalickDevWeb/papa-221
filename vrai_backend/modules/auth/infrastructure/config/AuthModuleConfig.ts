import { Router } from 'express';
import { JsonAuthRepositoryAdapter } from '../adapter/out/persistence/JsonAuthRepositoryAdapter';
import { LoginService } from '../../application/service/LoginService';
import { AuthController } from '../adapter/in/web/AuthController';

export class AuthModuleConfig {
  public static bootstrap(): Router {
    const router = Router();

    // 1. Instantiate Outbound Persistence Adapters
    const repository = new JsonAuthRepositoryAdapter();

    // 2. Instantiate Application Services (Use Cases)
    const loginUseCase = new LoginService(repository);

    // 3. Instantiate Inbound Web Controller
    const controller = new AuthController(loginUseCase);

    // 4. Map endpoints
    router.post('/auth/login', controller.login);

    return router;
  }
}
