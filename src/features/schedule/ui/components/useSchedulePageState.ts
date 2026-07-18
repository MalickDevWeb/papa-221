import { useState, useRef, useEffect, useMemo } from 'react';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { CourseSession, CourseDay } from '@/features/schedule/domain/Schedule';
import { syncAllCoursesToGoogleCalendar } from '@/features/schedule/utils/googleCalendarSync';
import { apiClient } from '@/shared/lib/apiClient';
import { getHighlightState } from '@/shared/utils/calendarHighlight';

export function useSchedulePageState() {
  const { schedule } = useSchedule();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => 
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('google_access_token') : null
  );
  const [isSyncingWithGoogle, setIsSyncingWithGoogle] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  
  const { enCoursId, prochainId, initialDay } = useMemo(() => {
    const mapped = schedule.map(c => ({ id: c.id, day: c.jour, startTime: c.heureDebut, endTime: c.heureFin }));
    const s = getHighlightState(mapped);
    const target = schedule.find(c => c.id === (s.enCoursId || s.prochainId));
    return { ...s, initialDay: (target?.jour || 'MER') as CourseDay };
  }, [schedule]);

  const [selectedDayMobile, setSelectedDayMobile] = useState<CourseDay>(initialDay);
  const [activePlanCourse, setActivePlanCourse] = useState<CourseSession | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [filterType, setFilterType] = useState<'TOUS' | 'CM' | 'TD' | 'TP'>('TOUS');
  const [filterStatus, setFilterStatus] = useState<'TOUS' | 'termine' | 'actuel' | 'a_venir'>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSelectedDayMobile(initialDay); }, [initialDay]);

  useEffect(() => {
    const fetchLive = async () => {
      try { const res = await apiClient.get('/student/live-sessions'); setLiveSessions(Array.isArray(res.data) ? res.data : []); } catch (e) { console.error(e); }
    };
    fetchLive();
    const timer = setInterval(fetchLive, 12000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => { setShowToast(msg); setTimeout(() => setShowToast(null), 3500); };

  const handleJoinLive = (s: any) => {
    if (!s) return;
    const isStream = !!s.hlsUrl && (s.hlsUrl.includes('.m3u8') || s.hlsUrl.includes('test-streams.mux.dev') || s.hlsUrl.includes('.mp4'));
    if (isStream) { window.location.href = `/etudiant?joinLive=${s.id}`; }
    else if (s.hlsUrl) { window.open(s.hlsUrl, '_blank', 'noopener,noreferrer'); triggerToast("Ouverture de Google Meet..."); }
  };

  const handleFullSync = async () => {
    if (!googleAccessToken) return;
    setIsSyncingWithGoogle(true);
    setSyncProgress({ current: 0, total: schedule.length });
    try {
      const res = await syncAllCoursesToGoogleCalendar(googleAccessToken, schedule, (c, t) => setSyncProgress({ current: c, total: t }));
      triggerToast(`${res.successCount} cours synchronisés sur Google Calendar !`);
      setIsSyncModalOpen(false);
    } catch (e) { console.error(e); triggerToast("Erreur lors de la synchronisation."); }
    finally { setIsSyncingWithGoogle(false); }
  };

  const handleGoogleDisconnect = () => {
    sessionStorage.removeItem('google_access_token'); setGoogleAccessToken(null); triggerToast("Déconnecté de Google.");
  };

  const scrollGrid = (dir: 'left' | 'right') => {
    if (gridContainerRef.current) gridContainerRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const fitsFilters = (c: CourseSession) => {
    const mType = filterType === 'TOUS' || c.type === filterType;
    const mStatus = filterStatus === 'TOUS' || c.status === filterStatus;
    const mSearch = !searchQuery.trim() || [c.nom, c.professeur, c.salle].some(v => (v || "").toLowerCase().includes(searchQuery.toLowerCase()));
    return mType && mStatus && mSearch;
  };

  const resetAllFilters = () => { setFilterType('TOUS'); setFilterStatus('TOUS'); setSearchQuery(''); triggerToast('Filtres réinitialisés !'); };

  useEffect(() => {
    document.body.style.overflow = activePlanCourse ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activePlanCourse]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        sessionStorage.setItem('google_access_token', token);
        setTimeout(() => { setGoogleAccessToken(token); setIsSyncModalOpen(true); triggerToast('Connexion Google Calendar réussie !'); }, 0);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return {
    schedule, isSyncModalOpen, setIsSyncModalOpen, googleAccessToken, setGoogleAccessToken,
    isSyncingWithGoogle, setIsSyncingWithGoogle, syncProgress, setSyncProgress,
    selectedDayMobile, setSelectedDayMobile, activePlanCourse, setActivePlanCourse,
    showToast, setShowToast, viewMode, setViewMode, filterType, setFilterType,
    filterStatus, setFilterStatus, searchQuery, setSearchQuery, gridContainerRef,
    triggerToast, handleFullSync, handleGoogleDisconnect, scrollGrid, fitsFilters, resetAllFilters,
    liveSessions, handleJoinLive, enCoursId, prochainId
  };
}
