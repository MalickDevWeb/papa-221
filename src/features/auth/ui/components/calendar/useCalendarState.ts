import { useState } from 'react';
import { CourseSession, GROUP_CLASSES } from './CalendarData';
import { useAuthStore } from '@/core/store/authStore';
import { ROLE_UTILISATEUR } from '@/shared/constants';

function matchesProfessor(profNameInSession: string | undefined, currentProfNom: string | undefined): boolean {
  const s = (profNameInSession || "").toLowerCase();
  const p = (currentProfNom || "").toLowerCase();
  if (!s || !p) return false;
  return s.includes(p) || p.includes(s) || s.split(/\s+/).some(w => w.length > 2 && p.includes(w));
}

export function useCalendarState() {
  const { utilisateur } = useAuthStore();
  const [level, setLevel] = useState<'L3GL' | 'L2SR' | 'M1IA'>('L3GL');
  const [weekType, setWeekType] = useState<'currentWeek' | 'nextWeek'>('currentWeek');
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [presenceSuccess, setPresenceSuccess] = useState(false);
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedMonthDayIdx, setSelectedMonthDayIdx] = useState<number>(23);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectCourse = (course: CourseSession) => {
    setSelectedCourse(course);
    setSessionNotes(localStorage.getItem(`note_${level}_${course.id}`) || '');
    setIsNotesSaved(false); setPresenceSuccess(false); setShowQRModal(false);
  };

  const handleSaveNotes = () => {
    if (!selectedCourse) return;
    localStorage.setItem(`note_${level}_${selectedCourse.id}`, sessionNotes);
    setIsNotesSaved(true); triggerToast("Notes enregistrées avec succès !");
  };

  const handleDownloadMaterials = (courseId: string) => {
    setDownloadingId(courseId); setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setDownloadingId(null); triggerToast("Dossier enregistré !"); }, 350);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const triggerAttendanceScan = () => {
    setPresenceLoading(true);
    setTimeout(() => {
      setPresenceLoading(false); setPresenceSuccess(true);
      triggerToast("Présence enregistrée !");
    }, 1500);
  };

  let rawSessions = GROUP_CLASSES[level]?.[weekType] || [];
  if (utilisateur && utilisateur.role === ROLE_UTILISATEUR.PROFESSEUR) {
    rawSessions = rawSessions.filter(c => matchesProfessor(c.professeur, utilisateur.nom));
  }

  const displayedSessions = rawSessions.filter(c => {
    const q = (searchQuery || "").toLowerCase();
    return (c.nom || "").toLowerCase().includes(q) || 
           (c.professeur || "").toLowerCase().includes(q) || 
           (c.salle || "").toLowerCase().includes(q);
  });

  return {
    level, setLevel, weekType, setWeekType, viewType, setViewType,
    searchQuery, setSearchQuery, selectedCourse, setSelectedCourse,
    sessionNotes, setSessionNotes, isNotesSaved, showQRModal, setShowQRModal,
    presenceSuccess, presenceLoading, downloadingId, downloadProgress,
    toastMessage, selectedMonthDayIdx, setSelectedMonthDayIdx,
    rawSessions, displayedSessions, handleSelectCourse, handleSaveNotes,
    handleDownloadMaterials, triggerAttendanceScan, triggerToast
  };
}
