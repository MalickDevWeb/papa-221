import { apiClient } from '@/shared/lib/apiClient';
import { CollabMessage, VirtualClass, AdminMeeting, MeetAttendance } from '../domain/CollaborationModels';

export function subscribeMessages(groupId: string, onUpdate: (messages: readonly CollabMessage[]) => void) {
  const fetchMsgs = async () => {
    if (!groupId) return;
    try {
      const res = await apiClient.get(`/collaboration/workgroups/${groupId}/messages`);
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  };
  fetchMsgs();
  const timer = setInterval(fetchMsgs, 3000);
  return () => clearInterval(timer);
}

// Keep compatible signature for legacy subscribeMessages if needed
export function subscribeMessagesLegacy(onUpdate: (messages: readonly CollabMessage[]) => void) {
  const fetchMsgs = async () => {
    try {
      const res = await apiClient.get('/collaboration/workgroups/group-1/messages');
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  };
  fetchMsgs();
  const timer = setInterval(fetchMsgs, 3000);
  return () => clearInterval(timer);
}

export async function saveMessage(groupId: string, m: Partial<CollabMessage>): Promise<void> {
  await apiClient.post(`/collaboration/workgroups/${groupId}/messages`, m);
}

export function subscribeMeets(onUpdate: (meets: readonly VirtualClass[]) => void) {
  const fetchMeets = async () => {
    try {
      const res = await apiClient.get('/collaboration/meets');
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch meets:', e);
    }
  };
  fetchMeets();
  const timer = setInterval(fetchMeets, 4000);
  return () => clearInterval(timer);
}

export async function saveMeet(mt: VirtualClass): Promise<void> {
  await apiClient.post('/collaboration/meets', mt);
}

export function subscribeAdminMeets(onUpdate: (meets: readonly AdminMeeting[]) => void) {
  const fetchAdmin = async () => {
    try {
      const res = await apiClient.get('/collaboration/admin-meets');
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch admin meets:', e);
    }
  };
  fetchAdmin();
  const timer = setInterval(fetchAdmin, 5000);
  return () => clearInterval(timer);
}

export async function saveAdminMeet(am: AdminMeeting): Promise<void> {
  // Can be implemented if needed, or simple mock
  console.log('Save admin meet called:', am);
}

export function subscribeAttendances(onUpdate: (atts: readonly MeetAttendance[]) => void) {
  onUpdate([]);
  return () => {};
}

export async function saveAttendance(att: MeetAttendance): Promise<void> {
  console.log('Save attendance called:', att);
}
