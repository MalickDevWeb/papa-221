import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { COURS_CATALOGUE } from '../types';
import { COURSE_DETAILS, DEFAULT_COURSE_DETAILS } from './CourseDetailsData';
import { getDynamicDetails, loadReminders } from './CourseDetailHelpers';

export function useCourseDetailState() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, isLoading } = useCourses();
  
  let targetId = id || 'course-1';
  if (targetId && typeof targetId === 'string' && targetId.startsWith('c') && targetId.length === 2) {
    targetId = `course-${targetId.charAt(1)}`;
  }

  const course = courses.find(c => c.id === targetId || c.id === id) || COURS_CATALOGUE.find(c => c.id === targetId || c.id === id);
  const staticDetails = COURSE_DETAILS[targetId] || COURSE_DETAILS[course?.id || ''] || DEFAULT_COURSE_DETAILS;
  const details = getDynamicDetails(targetId, course?.id, staticDetails);

  const [showToast, setShowToast] = useState<string | null>(null);
  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const [activeTab, setActiveTab] = useState<'chapters' | 'resources' | 'quizzes' | 'homework' | 'parcours'>('parcours');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizValidated, setQuizValidated] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: string }>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [homeworkStatus, setHomeworkStatus] = useState<Record<string, 'A rendre' | 'Soumis'>>(() => {
    const initial: Record<string, 'A rendre' | 'Soumis'> = {};
    if (details && details.devoirs) {
      details.devoirs.forEach(dev => initial[dev.id] = dev.statut as any);
    }
    return initial;
  });

  const [courseReminders, setCourseReminders] = useState<any[]>([]);

  useEffect(() => {
    const loadRem = () => setCourseReminders(loadReminders(targetId, course?.id, id));
    loadRem();
    const interval = setInterval(loadRem, 2000);
    return () => clearInterval(interval);
  }, [id, targetId, course]);

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (!quizValidated) setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleValidateQuiz = () => {
    if (Object.keys(selectedAnswers).length < details.quizzes.length) {
      return triggerToast("Veuillez répondre à toutes les questions avant de valider !");
    }
    setQuizValidated(true);
    const correct = details.quizzes.filter((q, idx) => selectedAnswers[idx] === q.reponseCorrecte).length;
    triggerToast(`Quiz terminé ! Score : ${correct}/${details.quizzes.length}`);
  };

  const simulateUpload = (homeworkId: string, fileName: string) => {
    if (uploadingId) return;
    setUploadingId(homeworkId);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadedFiles(prev => ({ ...prev, [homeworkId]: { name: fileName, size: "1.4 Mo" } }));
            setHomeworkStatus(prev => ({ ...prev, [homeworkId]: 'Soumis' }));
            setUploadingId(null);
            triggerToast("Devoir importé et remis avec succès !");
          }, 300);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return {
    navigate, course, details, isLoading, showToast, activeTab, setActiveTab,
    selectedAnswers, quizValidated, uploadedFiles, setUploadedFiles,
    uploadingId, uploadProgress, homeworkStatus, setHomeworkStatus, courseReminders,
    handleSelectOption, handleValidateQuiz, handleResetQuiz: () => { setSelectedAnswers({}); setQuizValidated(false); },
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, hwId: string) => {
      if (e.target.files?.[0]) simulateUpload(hwId, e.target.files[0].name);
    },
    triggerToast
  };
}
