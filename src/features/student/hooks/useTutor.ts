import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/core/store/authStore';

export interface Message { role: 'user' | 'model'; text: string; file?: { name: string; mimeType: string } };
export interface Grade { id: string; module: string; prof: string; cc: number; examen: number; moyPromo: number; }
export interface Course { id: string; titre: string; coefficient: number; progress: number; unites?: string[]; }
export interface Homework { id: string; statut: string; titre: string; deadlineStr: string; prio: string; }
export interface TutorSession { id: string; title: string; messages: Message[]; createdAt: string; }

const SESSIONS_KEY = 'mon_ecole_ai_tutor_sessions_v3';

export function useTutor() {
  const { utilisateur } = useAuthStore();
  const studentName = utilisateur?.nom || 'Assane Diop';
  const [grades, setGrades] = useState<Grade[]>([]), [courses, setCourses] = useState<Course[]>([]), [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(false), [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; mimeType: string; data: string } | null>(null);
  const [sessions, setSessions] = useState<TutorSession[]>(() => {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/student/grades').then(r => Array.isArray(r.data) ? r.data : []),
      axios.get('/api/student/courses').then(r => Array.isArray(r.data) ? r.data : []),
      axios.get('/api/student/homeworks').then(r => Array.isArray(r.data) ? r.data : [])
    ]).then(([g, c, h]) => { setGrades(g); setCourses(c); setHomeworks(h); })
      .catch(err => console.error("Data error:", err));
  }, []);

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (grades.length > 0 && sessions.length === 0) {
      const getAvg = (g: Grade) => (g.cc + g.examen) / 2;
      const overallAvg = (grades.reduce((acc, g) => acc + getAvg(g), 0) / grades.length).toFixed(2);
      const weakest = [...grades].sort((a, b) => getAvg(a) - getAvg(b))[0]?.module || 'vos matières';
      const welcomeText = `Bonjour ${studentName} ! Je suis votre **Tuteur IA Personnel**.\n\nEn analysant votre dossier :\n- 📈 Votre moyenne est de **${overallAvg}/20**.\n- ⚠️ Axe d'amélioration : **${weakest}**.\n\nComment puis-je vous aider aujourd'hui ? Joignez un fichier ou posez une question !`;
      
      const defaultSess: TutorSession = {
        id: 'default', title: 'Discussion Générale',
        messages: [{ role: 'model', text: welcomeText }], createdAt: new Date().toLocaleDateString()
      };
      setSessions([defaultSess]); setCurrentSessionId('default');
    } else if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [grades, studentName, sessions, currentSessionId]);

  const activeSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  const createSession = (titleName?: string) => {
    const newId = `session_${Date.now()}`;
    const newSess: TutorSession = {
      id: newId, title: titleName || `Session #${sessions.length + 1}`,
      messages: [{ role: 'model', text: `Nouvelle discussion ouverte. Posez votre question ou téléversez un document !` }],
      createdAt: new Date().toLocaleDateString()
    };
    setSessions(prev => [newSess, ...prev]); setCurrentSessionId(newId);
  };

  const deleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (currentSessionId === id) setCurrentSessionId(filtered[0].id);
  };

  const renameSession = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleSend = async (text: string) => {
    if ((!text.trim() && !attachedFile) || isLoading || !activeSession) return;

    const userMsg: Message = {
      role: 'user', text: text.trim() || `Fichier envoyé: ${attachedFile?.name}`,
      file: attachedFile ? { name: attachedFile.name, mimeType: attachedFile.mimeType } : undefined
    };
    const updatedMessages = [...activeSession.messages, userMsg];
    setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, messages: updatedMessages } : s));
    setInput(''); const filePayload = attachedFile; setAttachedFile(null); setIsLoading(true);

    try {
      const res = await axios.post('/api/student/tutor/chat', { message: userMsg.text, history: activeSession.messages, file: filePayload });
      const modelMsg: Message = { role: 'model', text: res.data.text };
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, messages: [...updatedMessages, modelMsg] } : s));
    } catch (e) {
      const errMsg: Message = { role: 'model', text: "Désolé, une erreur est survenue lors du traitement." };
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, messages: [...updatedMessages, errMsg] } : s));
    } finally { setIsLoading(false); }
  };

  return {
    sessions, currentSessionId, activeSession, createSession, deleteSession, renameSession, setCurrentSessionId,
    input, setInput, attachedFile, setAttachedFile, isLoading, grades, courses, homeworks, handleSend
  };
}
