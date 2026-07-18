import { useState, useEffect, useCallback } from 'react';

export interface Homework {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly description: string;
  readonly maxPoints: number;
  readonly dueDate: string;
  readonly workType: 'devoir' | 'td' | 'test' | 'quiz';
  readonly allowedFormat: 'pdf' | 'word' | 'zip' | 'link' | 'image' | 'audio' | 'any';
}

export interface HomeworkGrade {
  readonly id: string;
  readonly homeworkId: string;
  readonly studentId: string;
  readonly grade: number | '';
  readonly feedback: string;
}

export function useModuleHomework(moduleId: string) {
  const [homeworks, setHomeworks] = useState<readonly Homework[]>([]);
  const [grades, setGrades] = useState<readonly HomeworkGrade[]>([]);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const allHw = JSON.parse(localStorage.getItem('p_homeworks') || '[]');
    const allGr = JSON.parse(localStorage.getItem('p_homework_grades') || '[]');
    const filteredHw = allHw.filter((h: any) => h.moduleId === moduleId);
    setHomeworks(filteredHw);
    setGrades(allGr);
    if (filteredHw.length > 0 && !activeHomeworkId) {
      setActiveHomeworkId(filteredHw[0].id);
    }
  }, [moduleId, activeHomeworkId]);

  useEffect(() => { loadData(); }, [loadData]);

  const addHomework = (
    title: string,
    description: string,
    maxPoints: number,
    dueDate: string,
    workType: 'devoir' | 'td' | 'test' | 'quiz' = 'devoir',
    allowedFormat: 'pdf' | 'word' | 'zip' | 'link' | 'image' | 'audio' | 'any' = 'pdf'
  ) => {
    const newHw = { id: `hw-${Date.now()}`, moduleId, title, description, maxPoints, dueDate, workType, allowedFormat };
    const all = JSON.parse(localStorage.getItem('p_homeworks') || '[]');
    all.push(newHw);
    localStorage.setItem('p_homeworks', JSON.stringify(all));
    setActiveHomeworkId(newHw.id);
    loadData();
  };

  const deleteHomework = (hwId: string) => {
    const allHw = JSON.parse(localStorage.getItem('p_homeworks') || '[]');
    const allGr = JSON.parse(localStorage.getItem('p_homework_grades') || '[]');
    localStorage.setItem('p_homeworks', JSON.stringify(allHw.filter((h: any) => h.id !== hwId)));
    localStorage.setItem('p_homework_grades', JSON.stringify(allGr.filter((g: any) => g.homeworkId !== hwId)));
    if (activeHomeworkId === hwId) setActiveHomeworkId(null);
    loadData();
  };

  const submitGrade = (homeworkId: string, studentId: string, grade: number | '', feedback: string) => {
    const all: HomeworkGrade[] = JSON.parse(localStorage.getItem('p_homework_grades') || '[]');
    const index = all.findIndex((g) => g.homeworkId === homeworkId && g.studentId === studentId);
    const updated = { id: index !== -1 ? all[index].id : `g-${Date.now()}`, homeworkId, studentId, grade, feedback };
    if (index !== -1) all[index] = updated; else all.push(updated);
    localStorage.setItem('p_homework_grades', JSON.stringify(all));
    loadData();
  };

  return { homeworks, grades, activeHomeworkId, setActiveHomeworkId, addHomework, deleteHomework, submitGrade };
}
