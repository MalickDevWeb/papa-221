import { Course } from './Course';

export interface CourseRepository {
  /**
   * Récupère le catalogue des cours de l'étudiant
   */
  getStudentCourses(): Promise<Course[]>;
}
