import type { ReactNode } from 'react';
import type { ClassroomReminder, ProfessorLesson } from '../../../domain/ProfessorModels';

interface Props {
  readonly reminders: readonly ClassroomReminder[];
  readonly lessons: readonly ProfessorLesson[];
}

export function ProfessorPublishedLists({ reminders, lessons }: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <PublishedCard title="Rappels envoyés" emptyText="Aucun rappel envoyé pour l'instant.">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="rounded-3xl border border-neutral-gray-200 bg-neutral-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-on-surface">{reminder.content}</p>
              {reminder.isUrgent ? <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-black text-rose-600">Urgent</span> : null}
            </div>
            <p className="mt-2 text-[10px] text-secondary">{reminder.dateStr}</p>
          </div>
        ))}
      </PublishedCard>
      <PublishedCard title="Leçons et supports" emptyText="Aucune leçon publiée pour le moment.">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="rounded-3xl border border-neutral-gray-200 bg-neutral-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-on-surface">{lesson.title}</h4>
                <p className="mt-2 text-xs text-secondary">{lesson.description}</p>
              </div>
              <span className="rounded-full bg-brand-red-deep/10 px-3 py-1 text-[10px] font-black text-brand-red-deep">
                {lesson.attachmentName ?? 'Sans fichier'}
              </span>
            </div>
            <p className="mt-3 text-[10px] text-secondary">{lesson.dateStr}</p>
          </div>
        ))}
      </PublishedCard>
    </section>
  );
}

function PublishedCard({ title, emptyText, children }: { readonly title: string; readonly emptyText: string; readonly children: ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
      <h3 className="text-sm font-black text-on-surface">{title}</h3>
      <div className="mt-5 space-y-4">
        {hasChildren ? children : (
          <div className="rounded-3xl border border-dashed border-neutral-gray-300 bg-neutral-gray-50 p-6 text-center text-xs font-bold text-secondary">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
