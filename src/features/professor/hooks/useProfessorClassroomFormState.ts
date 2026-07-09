import { useState, useCallback, useEffect, FormEvent } from 'react';
import type { AttendanceByStudent, AttendanceStatus } from '../domain/ProfessorAttendance';

interface ProfessorWithClassroom {
  selectedCourseId: string;
  handleCreateReminder: (content: string, isUrgent: boolean) => Promise<any>;
  handleCreateLesson: (title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string) => Promise<any>;
  handleCreateModule: (title: string, description: string) => Promise<any>;
}

export function useProfessorClassroomFormState(professor: ProfessorWithClassroom, triggerToast: (msg: string) => void) {
  const [remContent, setRemContent] = useState('');
  const [remIsUrgent, setRemIsUrgent] = useState(false);

  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonAttachment, setLessonAttachment] = useState('');
  const [attendance, setAttendance] = useState<AttendanceByStudent>({});

  useEffect(() => {
    setAttendance({});
  }, [professor.selectedCourseId]);

  const handleMarkAttendance = useCallback((studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    triggerToast('Présence mise à jour');
  }, [triggerToast]);

  const handleReminderSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!remContent.trim()) {
      triggerToast('Veuillez saisir le contenu du rappel');
      return;
    }
    try {
      await professor.handleCreateReminder(remContent, remIsUrgent);
      setRemContent('');
      setRemIsUrgent(false);
      triggerToast('Rappel envoyé avec succès aux étudiants !');
    } catch (err) {
      triggerToast('Erreur de création du rappel');
    }
  }, [professor, remContent, remIsUrgent, triggerToast]);

  const handleLessonSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonDesc.trim()) {
      triggerToast('Veuillez saisir un titre et une description pour le cours');
      return;
    }
    try {
      await professor.handleCreateLesson(
        lessonTitle,
        lessonDesc,
        lessonAttachment.trim() || undefined,
        lessonAttachment.trim() ? '#' : undefined,
        activeModuleForLesson || undefined
      );
      setLessonTitle('');
      setLessonDesc('');
      setLessonAttachment('');
      setActiveModuleForLesson(null);
      triggerToast('Support de cours / leçon publié avec succès !');
    } catch (err) {
      triggerToast('Erreur de publication du cours');
    }
  }, [activeModuleForLesson, lessonAttachment, lessonDesc, lessonTitle, professor, triggerToast]);

  const handleModuleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) {
      triggerToast('Le titre du module/chapitre est requis');
      return;
    }
    try {
      await professor.handleCreateModule(newModuleTitle, newModuleDesc);
      setNewModuleTitle('');
      setNewModuleDesc('');
      setIsAddingModule(false);
      triggerToast('Nouveau module de cours créé avec succès !');
    } catch (err) {
      triggerToast('Erreur lors de la création du module');
    }
  }, [newModuleDesc, newModuleTitle, professor, triggerToast]);

  return {
    remContent, setRemContent, remIsUrgent, setRemIsUrgent,
    isAddingModule, setIsAddingModule, newModuleTitle, setNewModuleTitle,
    newModuleDesc, setNewModuleDesc, activeModuleForLesson, setActiveModuleForLesson,
    lessonTitle, setLessonTitle, lessonDesc, setLessonDesc,
    lessonAttachment, setLessonAttachment, attendance, setAttendance,
    handleMarkAttendance, handleReminderSubmit, handleLessonSubmit, handleModuleSubmit,
  };
}
