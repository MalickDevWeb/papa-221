import { Router } from 'express';
import { JsonAdminRepositoryAdapter } from '../adapter/out/persistence/JsonAdminRepositoryAdapter';
import { GetAdminStatsService } from '../../application/service/GetAdminStatsService';
import { GetAdminUsersService } from '../../application/service/GetAdminUsersService';
import { ManageStudentService } from '../../application/service/ManageStudentService';
import { ManagePersonnelService } from '../../application/service/ManagePersonnelService';
import { ManageAcademicService } from '../../application/service/ManageAcademicService';

import { AdminStatsController } from '../adapter/in/web/AdminStatsController';
import { AdminStudentController } from '../adapter/in/web/AdminStudentController';
import { AdminPersonnelController } from '../adapter/in/web/AdminPersonnelController';
import { AdminAcademicController } from '../adapter/in/web/AdminAcademicController';
import { MobileCacheManager } from '../../../../shared/cache/MobileCacheManager';

export class AdminModuleConfig {
  public static bootstrap(): Router {
    const router = Router();

    // 1. Instancier l'adaptateur de persistence
    const repository = new JsonAdminRepositoryAdapter();

    // 2. Instancier les Services d'Application (Use Cases)
    const getStatsUseCase = new GetAdminStatsService(repository);
    const getUsersUseCase = new GetAdminUsersService(repository);
    const manageStudentUseCase = new ManageStudentService(repository);
    const managePersonnelUseCase = new ManagePersonnelService(repository);
    const manageAcademicUseCase = new ManageAcademicService(repository);

    // 3. Instancier les Contrôleurs Web
    const statsController = new AdminStatsController(getStatsUseCase, getUsersUseCase);
    const studentController = new AdminStudentController(manageStudentUseCase);
    const personnelController = new AdminPersonnelController(managePersonnelUseCase);
    const academicController = new AdminAcademicController(manageAcademicUseCase);

    // 4. Définir les routes avec cache d'optimisation mobile (GETs)
    router.get('/admin/stats', MobileCacheManager.middleware(15000), statsController.getStats);
    router.get('/admin/users', MobileCacheManager.middleware(15000), statsController.getUsers);
    router.get('/admin/personnel', MobileCacheManager.middleware(15000), personnelController.getPersonnel);
    router.get('/admin/schedule', MobileCacheManager.middleware(15000), academicController.getSchedule);

    // Mutations (Pas de cache, invalide le cache correspondant)
    router.post('/admin/students', studentController.addStudent);
    router.delete('/admin/students/:id', studentController.deleteStudent);
    router.post('/admin/students/:id/payment', studentController.updatePayment);
    router.post('/admin/students/:id/observations', studentController.addObservation);
    router.post('/admin/students/bulk', studentController.bulkImport);

    router.post('/admin/professors', personnelController.addPersonnel); // Rétro-compatibilité
    router.post('/admin/personnel', personnelController.addPersonnel);
    router.delete('/admin/personnel/:id', personnelController.deletePersonnel);

    router.post('/admin/schedule/:id/reschedule', academicController.rescheduleSession);
    router.post('/admin/promotions', academicController.createPromotion);
    router.post('/admin/courses', academicController.createCourse);

    return router;
  }
}
