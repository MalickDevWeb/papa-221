import { Router } from 'express';
import { JsonEleveRepositoryAdapter } from '../adapter/out/persistence/JsonEleveRepositoryAdapter';
import { GetEleveProfileService } from '../../application/service/GetEleveProfileService';
import { UpdateEleveMoodService } from '../../application/service/UpdateEleveMoodService';
import { EleveController } from '../adapter/in/web/EleveController';
import { MobileCacheManager } from '../../../../shared/cache/MobileCacheManager';

export class EleveModuleConfig {
  public static bootstrap(): Router {
    const router = Router();

    // 1. Instantiate Outbound Persistence Adapters
    const repository = new JsonEleveRepositoryAdapter();

    // 2. Instantiate Application Services (Use Cases)
    const getProfileUseCase = new GetEleveProfileService(repository);
    const updateMoodUseCase = new UpdateEleveMoodService(repository);

    // 3. Instantiate Inbound Web Controller
    const controller = new EleveController(getProfileUseCase, updateMoodUseCase);

    // 4. Map endpoints with mobile cache optimization
    router.get('/student/profile', MobileCacheManager.middleware(30000), controller.getProfile);
    router.post('/student/mood', controller.updateMood);

    return router;
  }
}
