import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/core/store/authStore';
import { getVigilCheckInsUseCase } from '../infrastructure/config/dependencies';
import { useProfessorInitialData } from './useProfessorInitialData';
import { useProfessorCourseDetails } from './useProfessorCourseDetails';
import { useProfessorClassroomMutations } from './useProfessorClassroomMutations';
import { useProfessorWorkMutations } from './useProfessorWorkMutations';
import { useProfessorScheduleMutations } from './useProfessorScheduleMutations';

export function useProfessor() {
  const { utilisateur } = useAuthStore();
  const profId = utilisateur?.id || 'usr-prof-01';
  const profNom = utilisateur?.nom || 'Cheikh Anta';
  const profPrenom = 'Dr.';

  const initialData = useProfessorInitialData(profId);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // S'assurer qu'un cours est sélectionné par défaut uniquement si l'utilisateur l'exige, sinon laisser vide pour choix obligatoire
  useEffect(() => {
    // Retiré l'auto-sélection par défaut pour respecter l'obligation d'entrer dans une classe
  }, [initialData.courses, selectedCourseId]);

  const details = useProfessorCourseDetails(selectedCourseId);

  const classroomMutations = useProfessorClassroomMutations(
    selectedCourseId,
    details.setReminders,
    details.setLessons,
    details.setModules,
    details.setCourseQuizzes
  );

  const workMutations = useProfessorWorkMutations(
    selectedCourseId,
    details.setGrades,
    details.setHomeworks
  );

  const scheduleMutations = useProfessorScheduleMutations(
    profId,
    initialData.setSchedule
  );

  const selectCourse = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
  }, []);

  const refreshVigilCheckIns = useCallback(async () => {
    try {
      const loadedCheckIns = await getVigilCheckInsUseCase();
      initialData.setVigilCheckIns(loadedCheckIns);
    } catch (err) {
      console.error("Impossible de rafraîchir les entrées de sécurité :", err);
    }
  }, [initialData]);

  const selectedCourse = initialData.courses.find(c => c.id === selectedCourseId);

  return {
    profName: `${profPrenom} ${profNom}`,
    selectedCourseId,
    selectedCourse,
    ...initialData,
    ...details,
    ...classroomMutations,
    ...workMutations,
    ...scheduleMutations,
    selectCourse,
    refreshVigilCheckIns
  };
}
