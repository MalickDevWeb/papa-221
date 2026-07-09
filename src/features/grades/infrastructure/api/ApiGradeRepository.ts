import type { Grade } from '../../domain/Grade';
import type { GradeRepository } from '../../domain/GradeRepository';

export class ApiGradeRepository implements GradeRepository {
  private readonly baseUrl: string;

  // Ici on injecterait le httpClient axios.
  constructor(baseUrl: string = '/api/grades') {
    this.baseUrl = baseUrl;
  }

  async getStudentGrades(): Promise<Grade[]> {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des notes');
    }
    
    const data = await response.json();
    return data; // Assumer que le backend renvoie le format exact. Sinon on fait un toDomain()
  }

  async requestGradeReview(gradeId: string, reason: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${gradeId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      throw new Error('Impossible de soumettre la demande de révision');
    }
  }
}
