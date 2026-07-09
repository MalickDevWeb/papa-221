import type { FormEvent } from 'react';
import type { ProfessorCourse, ProfessorHomework } from '../../domain/ProfessorModels';
import { ProfessorHomeworkForm } from './homework/ProfessorHomeworkForm';
import { ProfessorHomeworkList } from './homework/ProfessorHomeworkList';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly homeworks: readonly ProfessorHomework[];
  readonly hwTitle: string;
  readonly hwDesc: string;
  readonly hwPrio: 'haute' | 'normale';
  readonly hwDeadline: string;
  readonly setHwTitle: (value: string) => void;
  readonly setHwDesc: (value: string) => void;
  readonly setHwPrio: (value: 'haute' | 'normale') => void;
  readonly setHwDeadline: (value: string) => void;
  readonly handleHomeworkSubmit: (e: FormEvent) => Promise<void>;
}

export function ProfessorHomeworkView(props: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
        <h2 className="text-base font-black text-on-surface">Devoirs et projets</h2>
        <p className="mt-2 text-xs text-secondary">Créez rapidement un devoir pour la classe sélectionnée.</p>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ProfessorHomeworkForm {...props} />
        <ProfessorHomeworkList selectedCourse={props.selectedCourse} homeworks={props.homeworks} />
      </section>
    </div>
  );
}
