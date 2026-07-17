import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';

interface Props {
  readonly studentId: string;
  readonly courseId: string;
  readonly onExerciseAdded: () => void;
}

export function ExerciseForm({ studentId, courseId, onExerciseAdded }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'haute' | 'normale'>('normale');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newExercise = {
      id: crypto.randomUUID(),
      studentId,
      courseId,
      title: title.trim(),
      description: desc.trim(),
      priority,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem('mon_ecole_custom_exercises');
    const list = stored ? JSON.parse(stored) : [];
    list.push(newExercise);
    localStorage.setItem('mon_ecole_custom_exercises', JSON.stringify(list));

    setTitle('');
    setDesc('');
    setPriority('normale');
    setDueDate('');
    setSuccess(true);
    onExerciseAdded();

    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-50 p-4.5 rounded-2xl border border-neutral-100/80 space-y-3.5">
      <h4 className="text-xs font-black uppercase text-[#291715] tracking-wider flex items-center gap-1">
        <span className="material-symbols-outlined text-base text-brand-red-deep">edit_note</span>
        Donner un travail / exercice
      </h4>
      <div className="space-y-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'exercice..."
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#B3181C] text-xs font-semibold rounded-xl outline-none transition-colors"
          required
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Consignes ou description du travail..."
          rows={2}
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#B3181C] text-xs font-medium rounded-xl outline-none resize-none transition-colors"
        />
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 block mb-1">Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'haute' | 'normale')}
              className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none"
            >
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 block mb-1">Date limite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none text-neutral-600"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-brand-red-deep hover:bg-brand-red-deep/90 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer shadow-3xs"
      >
        {success ? (
          <>
            <Check className="h-3.5 w-3.5 stroke-[2.5]" /> Assigné avec succès
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Assigner l'exercice
          </>
        )}
      </button>
    </form>
  );
}
