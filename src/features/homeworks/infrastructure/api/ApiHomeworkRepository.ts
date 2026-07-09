import type { Homework } from '../../domain/Homework';
import type { HomeworkRepository } from '../../domain/HomeworkRepository';

export class ApiHomeworkRepository implements HomeworkRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/homeworks') {
    this.baseUrl = baseUrl;
  }

  async getHomeworks(): Promise<Homework[]> {
    const res = await fetch(this.baseUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error("Erreur de récupération des devoirs");
    return res.json();
  }

  async saveHomework(homework: Homework): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}` 
      },
      body: JSON.stringify(homework)
    });
    if (!res.ok) throw new Error("Erreur lors de la création du devoir");
  }

  async startHomework(homeworkId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${homeworkId}/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error("Erreur lors du démarrage du devoir");
  }

  async advanceHomeworkProgress(homeworkId: string, addedProgress: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${homeworkId}/progress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}` 
      },
      body: JSON.stringify({ addedProgress })
    });
    if (!res.ok) throw new Error("Erreur lors de l'avancement du devoir");
  }

  async submitHomework(homeworkId: string, fileData: File | Blob): Promise<void> {
    const formData = new FormData();
    formData.append('file', fileData);
    
    const res = await fetch(`${this.baseUrl}/${homeworkId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: formData // Pas de Content-Type avec FormData, le navigateur gère le boundary
    });
    if (!res.ok) throw new Error("Erreur lors de la soumission du devoir");
  }
}
