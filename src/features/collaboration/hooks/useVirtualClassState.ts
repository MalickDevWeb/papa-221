import { useState, useEffect, useCallback } from 'react';
import { VirtualClass, AdminMeeting, MeetAttendance } from '../domain/CollaborationModels';
import { subscribeMeets, saveMeet, subscribeAdminMeets, saveAdminMeet, subscribeAttendances, saveAttendance } from '../infrastructure/msgService';

export function useVirtualClassState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [meets, setMeets] = useState<readonly VirtualClass[]>([]);
  const [adminMeets, setAdminMeets] = useState<readonly AdminMeeting[]>([]);
  const [attendances, setAttendances] = useState<readonly MeetAttendance[]>([]);

  useEffect(() => {
    const unsubMeets = subscribeMeets(setMeets);
    const unsubAdmin = subscribeAdminMeets(setAdminMeets);
    const unsubAtts = subscribeAttendances(setAttendances);
    return () => {
      unsubMeets();
      unsubAdmin();
      unsubAtts();
    };
  }, []);

  const createVirtualClass = useCallback(async (
    classIds: readonly string[],
    classNames: readonly string[],
    subjectName: string,
    teacherName: string,
    rawLink: string,
    autoGen: boolean,
    restrict: boolean
  ) => {
    if (classIds.length === 0) {
      triggerToast('Erreur : vous devez affecter le cours à au moins une classe !', false);
      return;
    }
    const meetLink = autoGen ? `https://meet.google.com/aut-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}` : rawLink.trim();
    if (!meetLink.includes('meet.google.com/')) {
      triggerToast('Erreur : lien Google Meet invalide ! Ex: https://meet.google.com/xxx-yyyy-zzz', false);
      return;
    }

    const newMeet: VirtualClass = {
      id: `meet-${Date.now()}`,
      classIds,
      classNames,
      subjectName,
      teacherName,
      meetLink,
      isPublished: true,
      date: 'Aujourd\'hui',
      time: '14h00 - 16h00',
      restrictToGoogleAccount: restrict,
    };

    await saveMeet(newMeet);
    triggerToast(`Classe virtuelle publiée pour ${classNames.join(', ')} !`, true);
  }, [triggerToast]);

  const createAdminMeeting = useCallback(async (
    title: string,
    organizer: string,
    scope: AdminMeeting['targetScope'],
    details: string,
    type: AdminMeeting['type'],
    meetLink: string
  ) => {
    if (!title || !meetLink) {
      triggerToast('Veuillez remplir tous les champs obligatoires.', false);
      return;
    }
    const newMeet: AdminMeeting = {
      id: `admin-meet-${Date.now()}`,
      title,
      organizer,
      targetScope: scope,
      targetDetails: details,
      type,
      meetLink,
      date: 'Aujourd\'hui',
      time: '15h30',
    };
    await saveAdminMeet(newMeet);
    triggerToast(`Réunion administrative "${title}" créée avec succès.`, true);
  }, [triggerToast]);

  const recordAttendance = useCallback(async (meetId: string, studentName: string, emailUsed: string, isAuthorized: boolean) => {
    const newAttendance: MeetAttendance = {
      id: `att-${Date.now()}`,
      meetId,
      studentName,
      emailUsed,
      entryTime: new Date().toLocaleTimeString('fr-FR'),
      durationMinutes: Math.floor(Math.random() * 60) + 30,
      participationScore: Math.floor(Math.random() * 5) + 1,
      isAuthorizedAccount: isAuthorized,
    };
    await saveAttendance(newAttendance);
  }, []);

  return { meets, adminMeets, attendances, createVirtualClass, createAdminMeeting, recordAttendance };
}
