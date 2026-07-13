import { useState, useEffect } from 'react';
import { 
  getGradesUseCase,
  getHomeworksUseCase,
  getRemindersUseCase,
  getLessonsUseCase,
  getModulesUseCase,
  getQuizzesUseCase,
  getStudentsUseCase
} from '../infrastructure/config/dependencies';
import type { 
  StudentGrade, 
  ProfessorHomework, 
  ClassroomReminder,
  ProfessorLesson,
  CourseModule,
  CourseQuiz,
  StudentEnrolled
} from '../domain/ProfessorModels';

export function useProfessorCourseDetails(selectedCourseId: string) {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [homeworks, setHomeworks] = useState<ProfessorHomework[]>([]);
  const [reminders, setReminders] = useState<ClassroomReminder[]>([]);
  const [lessons, setLessons] = useState<ProfessorLesson[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [quizzes, setCourseQuizzes] = useState<CourseQuiz[]>([]);
  const [students, setStudents] = useState<StudentEnrolled[]>([]);

  useEffect(() => {
    if (!selectedCourseId) return;
    
    let isMounted = true;
    async function loadCourseDetails() {
      try {
        const loadedGrades = await getGradesUseCase(selectedCourseId);
        const loadedHomeworks = await getHomeworksUseCase(selectedCourseId);
        const loadedReminders = await getRemindersUseCase(selectedCourseId);
        const loadedLessons = await getLessonsUseCase(selectedCourseId);
        const loadedModules = await getModulesUseCase(selectedCourseId);
        const loadedQuizzes = await getQuizzesUseCase(selectedCourseId);
        const loadedStudents = await getStudentsUseCase(selectedCourseId);
        if (isMounted) {
          setGrades(loadedGrades);
          setHomeworks(loadedHomeworks);
          setReminders(loadedReminders);
          setLessons(loadedLessons);
          setModules(loadedModules);
          setCourseQuizzes(loadedQuizzes);
          setStudents(loadedStudents);
        }
      } catch (err) {
        console.error("Erreur de chargement des détails du cours :", err);
      }
    }
    
    loadCourseDetails();
    return () => { isMounted = false; };
  }, [selectedCourseId]);

  return {
    grades,
    setGrades,
    homeworks,
    setHomeworks,
    reminders,
    setReminders,
    lessons,
    setLessons,
    modules,
    setModules,
    quizzes,
    setCourseQuizzes,
    students,
    setStudents
  };
}
