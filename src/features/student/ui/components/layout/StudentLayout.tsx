import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

import { SearchModal } from './modals/SearchModal';
import { SettingsModal, SettingsPrefs } from './modals/SettingsModal';
import { SupportModal } from './modals/SupportModal';
import { DocModal } from './modals/DocModal';
import { LegalModal } from './modals/LegalModal';
import { CalendarModal } from './modals/CalendarModal';
import { MobileNav } from './nav/MobileNav';
import { NotificationAlertToast } from './NotificationAlertToast';
import { notificationRepository } from '@/features/notifications/infrastructure/config/dependencies';

// ─── Données statiques ─────────────────────────────────────
const ACADEMIC_ANNOUNCEMENTS = [
  { id: 1, title: "Correction Programmation Mobile S1", tag: "Examen", tagBg: "bg-amber-500/10 border-amber-500/20", tagText: "text-amber-500", content: "Les copies du premier semestre ont été entièrement réévaluées. Les notes finales révisées sont publiées.", date: "Aujourd'hui à 11:15", author: "Scolarité Master GL" },
  { id: 2, title: "Soutenance des Projets de Recherche L3", tag: "Soutenance", tagBg: "bg-indigo-500/10 border-indigo-500/20", tagText: "text-indigo-400", content: "Les plannings de passage devant le jury sont officiellement validés. Consultez l'affichage du hall.", date: "Hier à 16:40", author: "Pr. Aly Niang" },
  { id: 3, title: "Clôture Hackathon Annuel 2026", tag: "Événement", tagBg: "bg-emerald-500/10 border-emerald-500/20", tagText: "text-[#10B981]", content: "La constitution des équipes se termine ce soir à 23h59. Aucun délai supplémentaire.", date: "22 Juin 2026", author: "Club Tech École 221" },
  { id: 4, title: "Cérémonie de Remise des Diplômes", tag: "Officiel", tagBg: "bg-red-500/10 border-red-500/20", tagText: "text-[#B3181C]", content: "La cérémonie aura lieu au Grand Théâtre National de Dakar de 09h00 à 13h00.", date: "11 Juillet 2026", author: "Secrétariat Général" },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Nouveau devoir planifié", desc: "Machine Learning Basics - TP1 à rendre", time: "Il y a 10 min", read: false, icon: "assignment", color: "text-brand-red-deep bg-brand-red-light" },
  { id: 2, title: "Note publiée d'excellence", desc: "Projet Web Framework - Note de 18.5/20", time: "Il y a 1 heure", read: false, icon: "grade", color: "text-[#E3A857] bg-[#E3A857]/10" },
  { id: 3, title: "Rappel de cours en ligne", desc: "La séance de Dr. Cheikh Anta démarre dans 15min", time: "Il y a 2 heures", read: true, icon: "video_camera_front", color: "text-blue-600 bg-blue-50" },
  { id: 4, title: "Message du Directeur", desc: "Ouverture des inscriptions pour le Hackathon", time: "Il y a 1 jour", read: true, icon: "campaign", color: "text-green-600 bg-green-50" },
  { id: 5, title: "Paiement de scolarité validé", desc: "Votre règlement de scolarité pour Juillet a été reçu et validé par l'administration", time: "Il y a 2 jours", read: true, icon: "payments", color: "text-emerald-600 bg-emerald-50" },
];

type StudentNotification = (typeof INITIAL_NOTIFICATIONS)[number];

// ─── Composant principal ────────────────────────────────────
export function StudentLayout() {
  const navigate = useNavigate();

  // UI visibility states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'conditions' | 'privacy' | 'mentions' | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');
  const triggerLayoutToast = (message: string, icon = 'check_circle') => {
    setToastMessage(message); setToastIcon(icon);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Profile mood
  const [studentMood, setStudentMood] = useState('📚 En pleine préparation des examens de l\'École 221');
  const [tempMood, setTempMood] = useState(studentMood);
  const [isEditingMood, setIsEditingMood] = useState(false);

  // Notifications & settings
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<StudentNotification[]>(() => {
    const saved = localStorage.getItem('student_notifications');
    if (saved) {
      try { return JSON.parse(saved) as StudentNotification[]; } catch (e) { return INITIAL_NOTIFICATIONS; }
    }
    // Set initial ones if empty
    localStorage.setItem('student_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  });
  const [settingsPrefs, setSettingsPrefs] = useState<SettingsPrefs>({ emailNotifs: true, paymentNotifs: true, proactiveAiTutor: true, smoothScroll: true, language: 'Français', experimentalDark: false });
  const [alertNotif, setAlertNotif] = useState<StudentNotification | null>(null);

  // Sync to localStorage and poll for updates in real time
  useEffect(() => {
    localStorage.setItem('student_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Subscribe to real-time Firestore notifications
  useEffect(() => {
    const startTime = Date.now();
    const unsubscribe = notificationRepository.subscribeToNotifications((fsNotifs) => {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map(n => String(n.id)));
        const updated = [...prev];
        let hasNew = false;
        let newestNotif: any = null;

        fsNotifs.forEach((fn) => {
          if (!existingIds.has(String(fn.id))) {
            hasNew = true;
            // Only trigger alert toast for notifications created *after* layout was loaded (real-time)
            if (fn.createdAt > startTime - 5000) {
              newestNotif = fn;
            }
            updated.unshift({
              id: fn.id as any,
              title: fn.title,
              desc: fn.desc,
              time: fn.time,
              read: fn.read,
              icon: fn.icon,
              color: fn.color
            });
          }
        });

        if (newestNotif) {
          setAlertNotif({
            id: newestNotif.id,
            title: newestNotif.title,
            desc: newestNotif.desc,
            time: newestNotif.time,
            read: newestNotif.read,
            icon: newestNotif.icon,
            color: newestNotif.color
          } as any);
        }

        if (hasNew) {
          localStorage.setItem('student_notifications', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('student_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StudentNotification[];
          if (JSON.stringify(parsed) !== JSON.stringify(notifications)) {
            // Find new unread notifications that aren't in current list
            const currentIds = new Set(notifications.map(n => String(n.id)));
            const newUnreads = parsed.filter(n => !n.read && !currentIds.has(String(n.id)));
            if (newUnreads.length > 0) {
              setAlertNotif(newUnreads[0]);
            }
            setNotifications(parsed);
          }
        } catch (e) {
          console.warn("Failed to sync notifications", e);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [notifications]);

  // Support ticket
  const [ticketCategory, setTicketCategory] = useState('Technique');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSendingTicket, setIsSendingTicket] = useState(false);
  const [openDocSection, setOpenDocSection] = useState<number | null>(0);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Refs for click-outside
  const notifRef = useRef<HTMLDivElement>(null);
  const calendarPopRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (calendarPopRef.current && !calendarPopRef.current.contains(e.target as Node)) setShowCalendar(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(prev => !prev); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMarkAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerLayoutToast('Toutes vos notifications ont été lues', 'notifications_active'); };
  const handleNotifClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const item = notifications.find(n => n.id === id);
    if (item) {
      triggerLayoutToast(`Accès : ${item.title}`);
      setShowNotifications(false);
      const titleLower = item.title.toLowerCase();
      const descLower = item.desc.toLowerCase();
      if (titleLower.includes('devoir') || titleLower.includes('dosier') || titleLower.includes('planif') || descLower.includes('tp')) {
        navigate(ROUTES.student.devoirs);
      } else if (titleLower.includes('note') || titleLower.includes('publi') || titleLower.includes('excellence')) {
        navigate(ROUTES.student.notes);
      } else if (titleLower.includes('cours') || titleLower.includes('séance') || titleLower.includes('direct') || titleLower.includes('rappel')) {
        navigate(ROUTES.student.cours);
      } else if (titleLower.includes('paiement') || titleLower.includes('scolarité') || titleLower.includes('piement')) {
        // Show profile dropdown or active stream or just user info
        setShowProfile(true);
      } else {
        navigate(ROUTES.student.dashboard);
      }
    }
  };
  const handleSendTicket = (e: React.FormEvent) => { e.preventDefault(); if (!ticketSubject.trim() || !ticketDescription.trim()) { triggerLayoutToast('Veuillez remplir tous les champs !', 'error'); return; } setIsSendingTicket(true); setTimeout(() => { setIsSendingTicket(false); setShowSupportModal(false); setTicketSubject(''); setTicketDescription(''); triggerLayoutToast('Votre ticket a bien été créé !', 'check_circle'); }, 1500); };

  const searchItems = [
    { name: "Tableau de Bord / Accueil", type: "Page", path: ROUTES.student.dashboard, icon: "dashboard", keywords: "home main dashboard accueil" },
    { name: "Mes Cours Favoris & Récents", type: "Page", path: ROUTES.student.cours, icon: "school", keywords: "cours classe matieres" },
    { name: "Planning & Emploi du Temps", type: "Page", path: ROUTES.student.planning, icon: "calendar_today", keywords: "emploi temps horaire" },
    { name: "Gestion des Travaux & Devoirs", type: "Page", path: ROUTES.student.devoirs, icon: "assignment", keywords: "devoirs soumission travaux" },
    { name: "Notes & Résultats Académiques", type: "Page", path: ROUTES.student.notes, icon: "grade", keywords: "notes resultats bulletins" },
    { name: "Démarrer le Tuteur IA Interactif", type: "Raccourci", action: "ai_tutor", icon: "smart_toy", keywords: "ia ai tutor chat" },
    { name: "Créer un Ticket de Support", type: "Action", action: "support", icon: "support_agent", keywords: "support ticket aide" },
    { name: "Documentation École 221", type: "Action", action: "docs", icon: "menu_book", keywords: "documentation reglement" },
  ];
  const filteredSearchItems = searchItems.filter(i => { const q = searchQuery.toLowerCase(); return i.name.toLowerCase().includes(q) || i.keywords.includes(q); });

  const handleAiTutor = () => {
    navigate(ROUTES.student.tuteur);
    triggerLayoutToast('Ouverture du Tuteur IA');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex selection:bg-brand-red-light selection:text-brand-red-deep overflow-x-hidden">

      {/* Real-time alert pop-up for schedule updates */}
      {alertNotif && (
        <NotificationAlertToast
          title={alertNotif.title}
          desc={alertNotif.desc}
          icon={alertNotif.icon}
          onClose={() => setAlertNotif(null)}
        />
      )}

      {/* Layout Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 bg-neutral-gray-900 border border-white/10 text-white rounded-2xl py-3.5 px-6 shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-bold min-w-[320px] max-w-[500px]">
          <span translate="no" className="material-symbols-outlined text-[20px] text-[#E3A857]">{toastIcon}</span>
          <p className="flex-grow mr-2">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white transition-colors"><span translate="no" className="material-symbols-outlined text-[16px]">close</span></button>
        </div>
      )}

      {/* Sidebar */}
      <StudentSidebar
        onOpenSettings={() => setShowSettings(true)}
        triggerToast={triggerLayoutToast}
      />

      {/* Main content */}
      <div className="flex-1 md:ml-64 bg-background min-h-screen pb-24 md:pb-0 flex flex-col min-w-0 max-w-full">
        <StudentHeader
          notifications={notifications}
          unreadCount={unreadCount}
          notifFilter={notifFilter}
          setNotifFilter={setNotifFilter}

          showNotifications={showNotifications} setShowNotifications={setShowNotifications}
          showCalendar={showCalendar} setShowCalendar={setShowCalendar}
          showProfile={showProfile} setShowProfile={setShowProfile}
          notifRef={notifRef} calendarPopRef={calendarPopRef} profileRef={profileRef}
          studentMood={studentMood} tempMood={tempMood} setTempMood={setTempMood}
          isEditingMood={isEditingMood} setIsEditingMood={setIsEditingMood}
          onMarkAllRead={handleMarkAllRead}
          onNotifClick={handleNotifClick}
          onOpenSettings={() => setShowSettings(true)}
          onOpenSupport={() => setShowSupportModal(true)}
          triggerToast={triggerLayoutToast}
          onMoodSave={() => { setStudentMood(tempMood); setIsEditingMood(false); triggerLayoutToast("Statut mis à jour !"); }}
        />

        <main className="flex-grow"><Outlet /></main>
      </div>

      <MobileNav />

      {/* Modals Isolés */}
      <SearchModal
        showSearch={showSearch} setShowSearch={setShowSearch}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        filteredSearchItems={filteredSearchItems}
        onSearchAction={(item) => {
          setShowSearch(false); setSearchQuery('');
          if (item.path) { navigate(item.path); triggerLayoutToast(`Navigation vers : ${item.name}`); }
          else if (item.action === 'ai_tutor') handleAiTutor();
          else if (item.action === 'support') setShowSupportModal(true);
          else if (item.action === 'docs') setShowDocModal(true);
        }}
      />
      <SettingsModal
        showSettings={showSettings} setShowSettings={setShowSettings}
        settingsPrefs={settingsPrefs} setSettingsPrefs={setSettingsPrefs}
        triggerToast={triggerLayoutToast}
      />
      <SupportModal
        showSupportModal={showSupportModal} setShowSupportModal={setShowSupportModal}
        ticketCategory={ticketCategory} setTicketCategory={setTicketCategory}
        ticketSubject={ticketSubject} setTicketSubject={setTicketSubject}
        ticketDescription={ticketDescription} setTicketDescription={setTicketDescription}
        isSendingTicket={isSendingTicket}
        onSendTicket={handleSendTicket}
      />
      <DocModal
        showDocModal={showDocModal} setShowDocModal={setShowDocModal}
        openDocSection={openDocSection} setOpenDocSection={setOpenDocSection}
      />
      <LegalModal
        showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
      />
      <CalendarModal
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />
    </div>
  );
}
