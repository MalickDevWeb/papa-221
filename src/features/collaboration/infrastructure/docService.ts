import { apiClient } from '@/shared/lib/apiClient';
import { RepoDocument, GroupHomework } from '../domain/CollaborationModels';

export function subscribeDocs(groupId: string, onUpdate: (docs: readonly RepoDocument[]) => void) {
  const fetchDocs = async () => {
    if (!groupId) return;
    try {
      const res = await apiClient.get(`/collaboration/workgroups/${groupId}/documents`);
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch documents:', e);
    }
  };
  fetchDocs();
  const timer = setInterval(fetchDocs, 4000);
  return () => clearInterval(timer);
}

export async function saveDoc(groupId: string, d: { name: string; description: string; author: string }): Promise<void> {
  await apiClient.post(`/collaboration/workgroups/${groupId}/documents`, d);
}

export function subscribeHomeworks(groupId: string, onUpdate: (homeworks: readonly GroupHomework[]) => void) {
  const fetchHomeworks = async () => {
    if (!groupId) return;
    try {
      const res = await apiClient.get(`/collaboration/workgroups/${groupId}/homeworks`);
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch homeworks:', e);
    }
  };
  fetchHomeworks();
  const timer = setInterval(fetchHomeworks, 5000);
  return () => clearInterval(timer);
}

export async function saveHomework(groupId: string, hw: GroupHomework): Promise<void> {
  await apiClient.post(`/collaboration/workgroups/${groupId}/homeworks`, hw);
}
