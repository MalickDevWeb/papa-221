import type { Course } from '../../domain/Course';
import type { CourseRepository } from '../../domain/CourseRepository';

export class ApiCourseRepository implements CourseRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/courses') {
    this.baseUrl = baseUrl;
  }

  async getStudentCourses(): Promise<Course[]> {
    const res = await fetch(this.baseUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error("Impossible de charger les cours");
    return res.json();
  }
}
