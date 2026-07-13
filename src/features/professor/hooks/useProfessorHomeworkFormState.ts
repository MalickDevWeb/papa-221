import { useState, useCallback, FormEvent } from 'react';

interface ProfessorWithHomework {
  handleCreateHomework: (title: string, desc: string, prio: 'haute' | 'normale', deadline: string) => Promise<any>;
}

export function useProfessorHomeworkFormState(professor: ProfessorWithHomework, triggerToast: (msg: string) => void) {
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwPrio, setHwPrio] = useState<'haute' | 'normale'>('normale');
  const [hwDeadline, setHwDeadline] = useState('');

  const handleHomeworkSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwDesc.trim() || !hwDeadline.trim()) {
      triggerToast('Veuillez remplir tous les champs du devoir');
      return;
    }
    try {
      await professor.handleCreateHomework(hwTitle, hwDesc, hwPrio, hwDeadline);
      setHwTitle('');
      setHwDesc('');
      setHwDeadline('');
      triggerToast('Nouveau devoir assigné avec succès !');
    } catch (err) {
      triggerToast('Erreur de création du devoir');
    }
  }, [hwTitle, hwDesc, hwDeadline, hwPrio, professor, triggerToast]);

  return {
    hwTitle,
    hwDesc,
    hwPrio,
    hwDeadline,
    setHwTitle,
    setHwDesc,
    setHwPrio,
    setHwDeadline,
    handleHomeworkSubmit,
  };
}
