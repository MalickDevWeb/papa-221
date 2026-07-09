import { useState, useCallback, useEffect } from 'react';
import { useProfessor } from './useProfessor';
import { useProfessorGradeForm } from './useProfessorGradeForm';
import { useProfessorHomeworkFormState } from './useProfessorHomeworkFormState';
import { useProfessorClassroomFormState } from './useProfessorClassroomFormState';
import { useProfessorQuizFormState } from './useProfessorQuizFormState';
import { useProfessorScheduleState } from './useProfessorScheduleState';
import { apiClient } from '@/shared/lib/apiClient';

export function useProfessorDashboardPage() {
  const professor = useProfessor();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [classroomSubTab, setClassroomSubTab] = useState<'modules' | 'homework' | 'grades' | 'attendance' | 'announcements'>('modules');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  const fetchLiveSessions = useCallback(async () => {
    try {
      const res = await apiClient.get('/student/live-sessions');
      setLiveSessions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveSessions]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const gradeForm = useProfessorGradeForm(professor, triggerToast);
  const homeworkForm = useProfessorHomeworkFormState(professor, triggerToast);
  const classroomForm = useProfessorClassroomFormState(professor, triggerToast);
  const quizForm = useProfessorQuizFormState(professor, triggerToast);
  const scheduleState = useProfessorScheduleState();

  const handleEnterCourse = useCallback((courseId: string) => {
    professor.selectCourse(courseId);
    setActiveTab('classroom');
    triggerToast('Ouverture du cours en classe');
  }, [professor, triggerToast]);

  return {
    ...professor,
    activeTab,
    setActiveTab,
    classroomSubTab,
    setClassroomSubTab,
    toastMessage,
    ...gradeForm,
    ...homeworkForm,
    ...classroomForm,
    ...quizForm,
    ...scheduleState,
    triggerToast,
    handleEnterCourse,
    handleCreateModule: classroomForm.handleModuleSubmit,
    liveSessions,
  };
}
