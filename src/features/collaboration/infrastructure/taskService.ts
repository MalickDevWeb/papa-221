import { apiClient } from '@/shared/lib/apiClient';
import { CollabTask } from '../domain/CollaborationModels';

export function subscribeTasks(groupId: string, onUpdate: (tasks: readonly CollabTask[]) => void) {
  const fetchTasks = async () => {
    if (!groupId) return;
    try {
      const res = await apiClient.get(`/collaboration/workgroups/${groupId}/tasks`);
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  };
  fetchTasks();
  const timer = setInterval(fetchTasks, 4000);
  return () => clearInterval(timer);
}

export async function saveTask(groupId: string, t: CollabTask): Promise<void> {
  await apiClient.post(`/collaboration/workgroups/${groupId}/tasks`, t);
}
