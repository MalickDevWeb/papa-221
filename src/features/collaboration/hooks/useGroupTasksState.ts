import { useState, useEffect, useCallback } from 'react';
import { CollabTask } from '../domain/CollaborationModels';
import { subscribeTasks, saveTask } from '../infrastructure/taskService';

export type TaskStatus = 'A faire' | 'En cours' | 'En révision' | 'Validé' | 'Bloqué' | 'Terminé';

export function useGroupTasksState(activeGroupId: string, triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [tasks, setTasks] = useState<readonly CollabTask[]>([]);

  useEffect(() => {
    if (!activeGroupId) return;
    return subscribeTasks(activeGroupId, setTasks);
  }, [activeGroupId]);

  const addTask = useCallback(async (groupId: string, title: string, assignedTo: string, deadline: string) => {
    const newTask: CollabTask = {
      id: `task-${Date.now()}`,
      groupId,
      title,
      status: 'A faire',
      assignedTo,
      deadline,
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Spécification de la tâche', done: false },
        { id: `c-${Date.now()}-2`, text: 'Implémentation initiale', done: false },
      ],
    };
    await saveTask(groupId, newTask);
    triggerToast(`Tâche "${title}" assignée à ${assignedTo} !`, true);
  }, [triggerToast]);

  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (existing) {
      const validStatus = (status === 'En révision' || status === 'Bloqué' || status === 'En cours')
        ? 'En cours'
        : (status === 'Validé' || status === 'Terminé')
          ? 'Terminé'
          : 'A faire';

      const updated: CollabTask = { ...existing, status: validStatus };
      await saveTask(existing.groupId, updated);
      triggerToast(`Statut mis à jour vers: ${status}`, true);
    }
  }, [tasks, triggerToast]);

  const toggleChecklistItem = useCallback(async (taskId: string, checklistItemId: string) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (existing) {
      const updated: CollabTask = {
        ...existing,
        checklist: existing.checklist.map((item) =>
          item.id === checklistItemId ? { ...item, done: !item.done } : item
        ),
      };
      await saveTask(existing.groupId, updated);
    }
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTaskStatus,
    toggleChecklistItem,
  };
}
export default useGroupTasksState;
