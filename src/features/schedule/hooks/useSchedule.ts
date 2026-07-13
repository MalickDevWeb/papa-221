import { useState, useEffect, useCallback } from 'react';
import { CourseSession, CourseDay, CourseType, CourseStatus } from '../domain/Schedule';
import { getWeeklyScheduleUseCase } from '../infrastructure/config/dependencies';

export function useSchedule() {
  const [schedule, setSchedule] = useState<CourseSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeeklyScheduleUseCase();
      setSchedule(data);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || "Erreur de chargement de l'emploi du temps");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchedule();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSchedule]);

  // Méthodes d'assistance pour le filtrage
  const filterSchedule = (
    day?: CourseDay | 'TOUS', 
    type?: CourseType | 'TOUS', 
    status?: CourseStatus | 'TOUS',
    searchQuery: string = ''
  ) => {
    return schedule.filter(course => {
      const matchesDay = !day || day === 'TOUS' || course.jour === day;
      const matchesType = !type || type === 'TOUS' || course.type === type;
      const matchesStatus = !status || status === 'TOUS' || course.status === status;
      const matchesSearch = searchQuery.trim() === '' || 
        (course.nom || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (course.professeur || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (course.salle || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDay && matchesType && matchesStatus && matchesSearch;
    });
  };

  return {
    schedule,
    isLoading,
    error,
    filterSchedule,
    fetchSchedule
  };
}
