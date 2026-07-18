import { Router } from 'express';
import { JsonBadgeScanRepositoryAdapter } from '../adapter/out/persistence/JsonBadgeScanRepositoryAdapter';
import { ConsoleSecurityEventPublisherAdapter } from '../adapter/out/messaging/ConsoleSecurityEventPublisherAdapter';
import { SubmitScanService } from '../../application/service/SubmitScanService';
import { VigilController } from '../adapter/in/web/VigilController';
import { MobileCacheManager } from '../../../../shared/cache/MobileCacheManager';

export class VigilModuleConfig {
  public static bootstrap(): Router {
    const router = Router();

    const repositoryAdapter = new JsonBadgeScanRepositoryAdapter();
    const eventPublisherAdapter = new ConsoleSecurityEventPublisherAdapter();
    const submitScanUseCase = new SubmitScanService(repositoryAdapter, eventPublisherAdapter);
    const controller = new VigilController(submitScanUseCase, repositoryAdapter);

    router.get('/vigil/profile', MobileCacheManager.middleware(60000), controller.handleProfile);
    router.post('/vigil/scan', controller.handleScan);
    router.get('/vigil/last-scan', MobileCacheManager.middleware(5000), controller.handleLastScan);
    router.get('/vigil/check-ins', MobileCacheManager.middleware(10000), controller.handleCheckIns);

    return router;
  }
}
