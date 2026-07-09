import { useState, useEffect, useCallback } from 'react';

export interface Chapter {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
}

export interface Lesson {
  readonly id: string;
  readonly chapterId: string;
  readonly title: string;
  readonly type: 'text' | 'video' | 'pdf' | 'doc' | 'link';
  readonly content: string;
}

export function useModuleLessons(moduleId: string) {
  const [chapters, setChapters] = useState<readonly Chapter[]>([]);
  const [lessons, setLessons] = useState<readonly Lesson[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const allCh = JSON.parse(localStorage.getItem('p_chapters') || '[]');
    const allLes = JSON.parse(localStorage.getItem('p_lessons') || '[]');
    const filteredCh = allCh.filter((c: any) => c.moduleId === moduleId);
    setChapters(filteredCh);
    setLessons(allLes);
    if (filteredCh.length > 0 && !activeChapterId) {
      setActiveChapterId(filteredCh[0].id);
    }
  }, [moduleId, activeChapterId]);

  useEffect(() => { loadData(); }, [loadData]);

  const addChapter = (title: string) => {
    const newCh = { id: `ch-${Date.now()}`, moduleId, title };
    const all = JSON.parse(localStorage.getItem('p_chapters') || '[]');
    all.push(newCh);
    localStorage.setItem('p_chapters', JSON.stringify(all));
    setActiveChapterId(newCh.id);
    loadData();
  };

  const addLesson = (title: string, type: 'text' | 'video' | 'pdf' | 'doc' | 'link', content: string) => {
    if (!activeChapterId) return;
    const newLes = { id: `les-${Date.now()}`, chapterId: activeChapterId, title, type, content };
    const all = JSON.parse(localStorage.getItem('p_lessons') || '[]');
    all.push(newLes);
    localStorage.setItem('p_lessons', JSON.stringify(all));
    loadData();
  };

  const deleteChapter = (chId: string) => {
    const allCh = JSON.parse(localStorage.getItem('p_chapters') || '[]');
    const allLes = JSON.parse(localStorage.getItem('p_lessons') || '[]');
    localStorage.setItem('p_chapters', JSON.stringify(allCh.filter((c: any) => c.id !== chId)));
    localStorage.setItem('p_lessons', JSON.stringify(allLes.filter((l: any) => l.chapterId !== chId)));
    if (activeChapterId === chId) setActiveChapterId(null);
    loadData();
  };

  const deleteLesson = (lesId: string) => {
    const allLes = JSON.parse(localStorage.getItem('p_lessons') || '[]');
    localStorage.setItem('p_lessons', JSON.stringify(allLes.filter((l: any) => l.id !== lesId)));
    loadData();
  };

  return {
    chapters,
    lessons,
    activeChapterId,
    setActiveChapterId,
    addChapter,
    addLesson,
    deleteChapter,
    deleteLesson,
  };
}
