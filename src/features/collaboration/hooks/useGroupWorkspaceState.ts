import { useState, useCallback } from 'react';
import { CollabMessage, RepoDocument, CollabTask, GroupHomework } from '../domain/CollaborationModels';
import { INITIAL_MESSAGES, INITIAL_DOCUMENTS, INITIAL_TASKS, INITIAL_HOMEWORKS } from '../domain/CollaborationMockData';

export function useGroupWorkspaceState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [messages, setMessages] = useState<readonly CollabMessage[]>(INITIAL_MESSAGES);
  const [docs, setDocs] = useState<readonly RepoDocument[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<readonly CollabTask[]>(INITIAL_TASKS);
  const [homeworks, setHomeworks] = useState<readonly GroupHomework[]>(INITIAL_HOMEWORKS);

  const sendMessage = useCallback((groupId: string, senderName: string, role: CollabMessage['senderRole'], text: string, fileType?: CollabMessage['fileType'], fileName?: string) => {
    const msg: CollabMessage = {
      id: `msg-${Date.now()}`,
      groupId,
      senderName,
      senderRole: role,
      text,
      fileType,
      fileName,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const addDocVersion = useCallback((groupId: string, docName: string, description: string, author: string, comment: string) => {
    const existing = docs.find((d) => d.name === docName && d.groupId === groupId);
    const timeStr = new Date().toLocaleString('fr-FR');
    if (existing) {
      const nextVer = existing.latestVersion + 1;
      setDocs((prev) =>
        prev.map((d) =>
          d.id === existing.id
            ? {
                ...d,
                latestVersion: nextVer,
                updatedBy: author,
                updatedAt: timeStr,
                history: [...d.history, { version: nextVer, author, fileUrl: '#', updatedAt: timeStr, comment }],
              }
            : d
        )
      );
      triggerToast(`Nouvelle version v${nextVer} committée pour "${docName}" !`, true);
    } else {
      const newDoc: RepoDocument = {
        id: `doc-${Date.now()}`,
        groupId,
        name: docName,
        description,
        latestVersion: 1,
        updatedBy: author,
        updatedAt: timeStr,
        history: [{ version: 1, author, fileUrl: '#', updatedAt: timeStr, comment }],
        status: 'En attente',
        comments: [],
      };
      setDocs((prev) => [...prev, newDoc]);
      triggerToast(`Document collaboratif "${docName}" publié sur le dépôt !`, true);
    }
  }, [docs, triggerToast]);

  const addDocComment = useCallback((docId: string, author: string, text: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              comments: [...d.comments, { id: `c-${Date.now()}`, author, text, timestamp: new Date().toLocaleString('fr-FR') }],
            }
          : d
      )
    );
  }, []);

  const addTask = useCallback((groupId: string, title: string, assignedTo: string, deadline: string) => {
    const newTask: CollabTask = {
      id: `task-${Date.now()}`,
      groupId,
      title,
      status: 'A faire',
      assignedTo,
      deadline,
      checklist: [],
    };
    setTasks((prev) => [...prev, newTask]);
    triggerToast(`Tâche "${title}" assignée à ${assignedTo} !`, true);
  }, [triggerToast]);

  const submitHomework = useCallback((homeworkId: string, groupId: string, groupName: string, fileName: string) => {
    setHomeworks((prev) =>
      prev.map((hw) =>
        hw.id === homeworkId
          ? {
              ...hw,
              submissions: [
                ...hw.submissions.filter((s) => s.groupId !== groupId),
                { groupId, groupName, fileName, fileUrl: '#', submittedAt: new Date().toLocaleDateString('fr-FR') },
              ],
            }
          : hw
      )
    );
    triggerToast(`Devoir de groupe remis avec succès par le chef de groupe !`, true);
  }, [triggerToast]);

  return { messages, docs, tasks, homeworks, sendMessage, addDocVersion, addDocComment, addTask, submitHomework };
}
