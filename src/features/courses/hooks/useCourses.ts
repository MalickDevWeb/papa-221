import { useState, useEffect, useCallback } from 'react';
import { Course } from '../domain/Course';
import { getCourseCatalogUseCase } from '../infrastructure/config/dependencies';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourseCatalogUseCase();
      setCourses(data);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Impossible de récupérer les cours');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // Statistiques dérivées
  const countEnCours = courses.filter(c => c.statut === 'en_cours').length;
  const countTermine = courses.filter(c => c.statut === 'termine').length;
  const countNonDemarre = courses.filter(c => c.statut === 'non_demarre').length;

  return {
    courses,
    isLoading,
    error,
    countEnCours,
    countTermine,
    countNonDemarre,
    fetchCourses
  };
}
