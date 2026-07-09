import { InMemoryCourseRepository } from '../local/InMemoryCourseRepository';
import { ApiCourseRepository } from '../api/ApiCourseRepository';
import { createGetCourseCatalogUseCase } from '../../usecases/GetCourseCatalogUseCase';

const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const courseRepository = isMock 
  ? new InMemoryCourseRepository() 
  : new ApiCourseRepository();

export const getCourseCatalogUseCase = createGetCourseCatalogUseCase(courseRepository);
