import { useState, useEffect } from 'react';
import { 
  getCoursesUseCase, 
  getScheduleUseCase, 
  getVigilCheckInsUseCase 
} from '../infrastructure/config/dependencies';
import type { 
  ProfessorCourse, 
  ProfessorSchedule, 
  VigilCheckIn 
} from '../domain/ProfessorModels';

export function useProfessorInitialData(profId: string) {
  const [courses, setCourses] = useState<ProfessorCourse[]>([]);
  const [schedule, setSchedule] = useState<ProfessorSchedule[]>([]);
  const [vigilCheckIns, setVigilCheckIns] = useState<VigilCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const loadedCourses = await getCoursesUseCase(profId);
        const loadedSchedule = await getScheduleUseCase(profId);
        const loadedCheckIns = await getVigilCheckInsUseCase();
        
        if (isMounted) {
          setCourses(loadedCourses);
          setSchedule(loadedSchedule);
          setVigilCheckIns(loadedCheckIns);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || "Erreur de chargement des données");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    init();
    return () => { isMounted = false; };
  }, [profId]);

  return {
    courses,
    setCourses,
    schedule,
    setSchedule,
    vigilCheckIns,
    setVigilCheckIns,
    isLoading,
    setIsLoading,
    error,
    setError
  };
}
