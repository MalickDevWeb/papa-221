import { useState, useEffect, useCallback, useMemo } from 'react';
import { DbProfile, Attendance, LiveSession } from '../domain/Dashboard';
import { CoursItem } from '@/features/student/types';
import { getDashboardDataUseCase, sendLiveReactionUseCase, sendLiveChatUseCase } from '../infrastructure/config/dependencies';
import { useDashboardClockIn } from './useDashboardClockIn';
import { COURS_DATA_DASHBOARD } from '@/features/student/data/mockCourses';
import { getHighlightState } from '@/shared/utils/calendarHighlight';

export function useDashboard() {
  const { enCoursId, prochainId, initialDay } = useMemo(() => {
    const mapped = COURS_DATA_DASHBOARD.map(c => {
      const [s, e] = c.heure.split('-').map(str => str.trim());
      return { id: c.id, day: c.jour, startTime: s || '', endTime: e || '' };
    });
    const state = getHighlightState(mapped);
    const target = COURS_DATA_DASHBOARD.find(c => c.id === (state.enCoursId || state.prochainId));
    return { ...state, initialDay: (target?.jour || 'MER') as 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM' };
  }, []);
  const [selectedDay, setSelectedDay] = useState<'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM'>(initialDay);
  const [activeDetailCourse, setActiveDetailCourse] = useState<CoursItem | null>(null);
  const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedLiveId, setSelectedLiveId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [lastActiveId, setLastActiveId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const selectedLive = liveSessions.find(s => s && s.id === selectedLiveId) || null;
  const triggerToast = useCallback((msg: string) => {
    setShowToast(msg); setTimeout(() => setShowToast(null), 3500);
  }, []);

  useEffect(() => {
    const activeSes = liveSessions.find(s => s && s.status === 'active');
    if (activeSes && activeSes.id !== lastActiveId) {
      setLastActiveId(activeSes.id);
      triggerToast(`🔴 COURS EN LIVE : "${activeSes.courseName}" par ${activeSes.teacherName} a commencé !`);
    } else if (!activeSes && lastActiveId !== null) {
      setLastActiveId(null);
    }
  }, [liveSessions, lastActiveId, triggerToast]);

  const loadData = useCallback(async () => {
    try {
      const data = await getDashboardDataUseCase();
      setDbProfile(data.profile);
      setAttendances(Array.isArray(data.attendances) ? data.attendances : []);
      setLiveSessions(Array.isArray(data.liveSessions) ? data.liveSessions : []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinLiveId = params.get('joinLive');
    if (joinLiveId && liveSessions.length > 0 && liveSessions.some(s => s.id === joinLiveId)) {
      setSelectedLiveId(joinLiveId);
      window.history.replaceState(null, '', window.location.pathname);
      triggerToast("Rejoint avec succès !");
    }
  }, [liveSessions, triggerToast]);

  const clockInState = useDashboardClockIn({ triggerToast, loadData });

  const sendLiveReaction = async (type: string) => {
    if (!selectedLive) return;
    try {
      const reactions = await sendLiveReactionUseCase(selectedLive.id, type);
      setLiveSessions(prev => prev.map(s => s.id === selectedLive.id ? { ...s, reactions } : s));
    } catch (e) { console.error(e); }
  };

  const sendLiveChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedLive) return;
    const user = dbProfile?.name || "Étudiant";
    setChatInput("");
    try {
      const updated = await sendLiveChatUseCase(selectedLive.id, user, chatInput);
      setLiveSessions(prev => prev.map(s => s.id === selectedLive.id ? updated : s));
    } catch (e) { console.error(e); }
  };

  const handleJoinLive = useCallback((id: string) => {
    const active = liveSessions.find(s => s && s.id === id);
    if (!active || !active.hlsUrl) return;
    window.open(active.hlsUrl, '_blank', 'noopener,noreferrer');
    triggerToast("Redirection vers la visioconférence Google Meet...");
    setSelectedLiveId(id);
  }, [liveSessions, triggerToast]);

  return {
    selectedDay, setSelectedDay, activeDetailCourse, setActiveDetailCourse, dbProfile, attendances,
    liveSessions, selectedLiveId, setSelectedLiveId, selectedLive, showToast, triggerToast, chatInput, setChatInput,
    sendLiveReaction, sendLiveChat, handleJoinLive, enCoursId, prochainId, ...clockInState
  };
}
export default useDashboard;
