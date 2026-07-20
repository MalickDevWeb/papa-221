import { useState, useEffect, useCallback } from 'react';
import { WikiPage, CollabNote } from '../domain/TaskWikiModels';
import { subscribeWikis, saveWiki, subscribeNotes, saveNote } from '../infrastructure/wikiService';

export function useGroupWikiState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [wikiPages, setWikiPages] = useState<readonly WikiPage[]>([]);
  const [notes, setNotes] = useState<readonly CollabNote[]>([]);

  useEffect(() => {
    const unsubWikis = subscribeWikis(setWikiPages);
    const unsubNotes = subscribeNotes(setNotes);
    return () => {
      unsubWikis();
      unsubNotes();
    };
  }, []);

  const addWikiPage = useCallback(async (groupId: string, title: string, content: string, author: string) => {
    const newPage: WikiPage = {
      id: `wiki-${Date.now()}`,
      groupId,
      title,
      content,
      author,
      updatedAt: new Date().toLocaleDateString('fr-FR'),
    };
    await saveWiki(newPage);
    triggerToast(`Page de Wiki "${title}" créée !`, true);
  }, [triggerToast]);

  const addNote = useCallback(async (
    groupId: string,
    title: string,
    content: string,
    isPrivate: boolean,
    authorId: string,
    authorName: string
  ) => {
    const newNote: CollabNote = {
      id: `note-${Date.now()}`,
      groupId,
      title,
      content,
      isPrivate,
      authorId,
      authorName,
    };
    await saveNote(newNote);
    triggerToast(`Note sauvegardée avec succès !`, true);
  }, [triggerToast]);

  return {
    wikiPages,
    notes,
    addWikiPage,
    addNote,
  };
}
export default useGroupWikiState;
