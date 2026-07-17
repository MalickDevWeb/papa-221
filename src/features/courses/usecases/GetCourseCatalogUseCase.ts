import { Course } from '../domain/Course';
import { CourseRepository } from '../domain/CourseRepository';

export function createGetCourseCatalogUseCase(repository: CourseRepository) {
  return async function execute(): Promise<Course[]> {
    return await repository.getStudentCourses();
  };
}
