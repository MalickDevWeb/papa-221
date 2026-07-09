import type { ProfessorCourse, ProfessorHomework } from '../../../domain/ProfessorModels';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly homeworks: readonly ProfessorHomework[];
}

export function ProfessorHomeworkList({ selectedCourse, homeworks }: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 border border-neutral-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-on-surface">Devoirs en cours</h3>
          <p className="mt-1 text-xs text-secondary">
            {selectedCourse?.titre ?? 'Classe'} • {homeworks.length} publication(s)
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
        {homeworks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-gray-300 bg-neutral-gray-50 p-6 text-center text-xs font-bold text-secondary">
            Aucun devoir assigné pour l'instant.
          </div>
        ) : (
          homeworks.map((homework) => (
            <div key={homework.id} className="rounded-3xl border border-neutral-gray-200 bg-neutral-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-on-surface">{homework.titre}</h4>
                  <p className="mt-2 text-xs text-secondary">{homework.desc}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-600">
                  {homework.prio}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-secondary">
                <span>Deadline : {homework.deadlineStr}</span>
                <span>{homework.submissionsCount} rendus</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
