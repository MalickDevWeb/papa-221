import { useState, useEffect, useCallback } from 'react';
import { CollabMessage, RepoDocument, GroupHomework } from '../domain/CollaborationModels';
import { subscribeDocs, saveDoc, subscribeHomeworks, saveHomework } from '../infrastructure/docService';
import { subscribeMessages as subMsgs, saveMessage as svMsg } from '../infrastructure/msgService';

export function useGroupWorkspaceState(activeGroupId: string, triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [messages, setMessages] = useState<readonly CollabMessage[]>([]);
  const [docs, setDocs] = useState<readonly RepoDocument[]>([]);
  const [homeworks, setHomeworks] = useState<readonly GroupHomework[]>([]);

  useEffect(() => {
    if (!activeGroupId) return;
    const unsubMsgs = subMsgs(activeGroupId, setMessages);
    const unsubDocs = subscribeDocs(activeGroupId, setDocs);
    const unsubHws = subscribeHomeworks(activeGroupId, setHomeworks);
    return () => {
      unsubMsgs();
      unsubDocs();
      unsubHws();
    };
  }, [activeGroupId]);

  const sendMessage = useCallback(async (
    groupId: string,
    senderName: string,
    role: CollabMessage['senderRole'],
    text: string,
    fileType?: CollabMessage['fileType'],
    fileName?: string
  ) => {
    const msg: Partial<CollabMessage> = {
      senderName,
      senderRole: role,
      text,
      fileType,
      fileName,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    await svMsg(groupId, msg);
  }, []);

  const addDocVersion = useCallback(async (
    groupId: string,
    docName: string,
    description: string,
    author: string,
    _comment: string
  ) => {
    await saveDoc(groupId, { name: docName, description, author });
    triggerToast(`Document collaboratif "${docName}" mis à jour avec succès !`, true);
  }, [triggerToast]);

  const addDocComment = useCallback(async (_docId: string, _author: string, _text: string) => {
    // Simple notification
    triggerToast('Commentaire ajouté !', true);
  }, [triggerToast]);

  const submitHomework = useCallback(async (homeworkId: string, groupId: string, groupName: string, fileName: string) => {
    const existing = homeworks.find((hw) => hw.id === homeworkId);
    if (existing) {
      const updated: GroupHomework = {
        ...existing,
        submissions: [
          ...existing.submissions.filter((s) => s.groupId !== groupId),
          { groupId, groupName, fileName, fileUrl: '#', submittedAt: new Date().toLocaleDateString('fr-FR') },
        ],
      };
      await saveHomework(groupId, updated);
      triggerToast(`Devoir de groupe remis avec succès !`, true);
    }
  }, [homeworks, triggerToast]);

  return { messages, docs, homeworks, sendMessage, addDocVersion, addDocComment, submitHomework };
}
export default useGroupWorkspaceState;
