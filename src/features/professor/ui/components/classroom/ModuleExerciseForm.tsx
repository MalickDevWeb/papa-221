import React, { useState } from 'react';
import { Plus, Check, Users } from 'lucide-react';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';

interface Props {
  readonly students: readonly StudentEnrolled[];
  readonly onExerciseAdded: (exe: {
    readonly title: string;
    readonly description: string;
    readonly dueDate: string;
    readonly assignedStudentIds: readonly string[];
  }) => void;
}

export function ModuleExerciseForm({ students, onExerciseAdded }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedIds, setAssignedIds] = useState<readonly string[]>([]);
  const [success, setSuccess] = useState(false);

  const toggleStudent = (id: string) => {
    setAssignedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (assignedIds.length === students.length) {
      setAssignedIds([]);
    } else {
      setAssignedIds(students.map((s) => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onExerciseAdded({
      title: title.trim(),
      description: desc.trim(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedStudentIds: assignedIds,
    });

    setTitle('');
    setDesc('');
    setDueDate('');
    setAssignedIds([]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/80 space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black uppercase text-[#291715] tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-base text-brand-red-deep">assignment_add</span>
          Créer un exercice ciblé
        </h4>
        <span className="text-[9px] font-bold text-neutral-400 bg-white px-2 py-0.5 rounded-lg border border-neutral-200">
          Optionnel: cibler certains élèves
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du devoir / exercice..."
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none"
          required
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Consignes..."
          rows={1}
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none resize-none"
        />
        <div className="flex gap-2 items-center">
          <label className="text-[10px] font-bold text-neutral-400 shrink-0">Date limite:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-1 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none text-neutral-600 flex-grow"
          />
        </div>
      </div>

      <div className="border-t border-neutral-200/60 pt-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black uppercase text-neutral-500 flex items-center gap-1">
            <Users className="h-3 w-3 text-neutral-400" /> Assigner à qui ?
          </span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[9px] font-black text-brand-red-deep hover:underline cursor-pointer border-0 bg-transparent"
          >
            {assignedIds.length === students.length ? 'Tout décocher' : 'Tous les élèves'}
          </button>
        </div>

        <div className="max-h-[110px] overflow-y-auto no-scrollbar border border-neutral-200 bg-white rounded-xl p-2 space-y-1">
          {students.map((student) => {
            const isAssigned = assignedIds.includes(student.id);
            return (
              <label
                key={student.id}
                className={`flex items-center justify-between p-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                  isAssigned ? 'bg-[#FFF5F5] text-brand-red-deep' : 'hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <span>{student.prenom} {student.nom}</span>
                <input
                  type="checkbox"
                  checked={isAssigned}
                  onChange={() => toggleStudent(student.id)}
                  className="rounded text-brand-red-deep focus:ring-brand-red-deep h-3.5 w-3.5 border-neutral-300"
                />
              </label>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-brand-red-deep hover:bg-brand-red-deep/90 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-3xs cursor-pointer"
      >
        {success ? (
          <>
            <Check className="h-3.5 w-3.5 stroke-[2.5]" /> Exercice Ajouté !
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Ajouter l&apos;exercice au module
          </>
        )}
      </button>
    </form>
  );
}
