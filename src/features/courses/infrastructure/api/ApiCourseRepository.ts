import type { Course } from '../../domain/Course';
import type { CourseRepository } from '../../domain/CourseRepository';
import { COURS_CATALOGUE } from '../../ui/components/types';

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
    const rawData = await res.json();
    
    // Ensure rawData is an array, otherwise fall back to standard catalogue
    if (!Array.isArray(rawData)) {
      return COURS_CATALOGUE;
    }

    // Map each API course to a rich Course object using COURS_CATALOGUE as a fallback/enricher
    return rawData.map((c: any, index: number) => {
      // Find a matching course in the local catalogue by ID or name
      const localCourse = COURS_CATALOGUE.find(lc => 
        lc.id === c.id || 
        lc.id.replace('course-', 'c-') === c.id || 
        c.id?.replace('c-', 'course-') === lc.id ||
        lc.nom.toLowerCase().includes((c.titre || c.nom || '').toLowerCase())
      ) || COURS_CATALOGUE[index % COURS_CATALOGUE.length];

      return {
        id: c.id || localCourse.id,
        nom: c.titre || c.nom || localCourse.nom,
        description: c.description || localCourse.description,
        categorie: c.categorie || localCourse.categorie,
        statut: c.statut || (c.progress === 100 ? 'termine' : (c.progress && c.progress > 0) ? 'en_cours' : 'non_demarre'),
        image: c.image || localCourse.image,
        progression: typeof c.progress === 'number' ? c.progress : typeof c.progression === 'number' ? c.progression : localCourse.progression,
        noteFinale: c.noteFinale || localCourse.noteFinale,
        professeur: c.professeur || localCourse.professeur,
        salle: c.salle || localCourse.salle,
        avis: c.avis || localCourse.avis,
        volumeHoraire: c.volumeHoraire || localCourse.volumeHoraire,
        prochainCours: c.prochainCours || c.prochain_cours || localCourse.prochainCours
      };
    });
  }
}

