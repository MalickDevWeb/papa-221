import type { FormEvent } from 'react';
import type { CourseModule } from '../../../domain/ProfessorModels';
import { BookOpen } from 'lucide-react';

interface Props {
  readonly modules: readonly CourseModule[];
  readonly activeModuleForLesson: string | null;
  readonly lessonTitle: string;
  readonly lessonDesc: string;
  readonly lessonAttachment: string;
  readonly remContent: string;
  readonly remIsUrgent: boolean;
  readonly setActiveModuleForLesson: (value: string | null) => void;
  readonly setLessonTitle: (value: string) => void;
  readonly setLessonDesc: (value: string) => void;
  readonly setLessonAttachment: (value: string) => void;
  readonly setRemContent: (value: string) => void;
  readonly setRemIsUrgent: (value: boolean) => void;
  readonly handleLessonSubmit: (e: FormEvent) => Promise<void>;
  readonly handleReminderSubmit: (e: FormEvent) => Promise<void>;
}

export function ProfessorLessonReminderForms(props: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <LessonForm {...props} />
      <ReminderForm {...props} />
    </section>
  );
}

function LessonForm({
  modules, activeModuleForLesson, lessonTitle, lessonDesc, lessonAttachment,
  setActiveModuleForLesson, setLessonTitle, setLessonDesc, setLessonAttachment, handleLessonSubmit,
}: Props) {
  return (
    <form onSubmit={handleLessonSubmit} className="rounded-3xl bg-neutral-gray-50 p-6 border border-neutral-gray-200 shadow-sm space-y-4">
      <SectionTitle text="Créer une leçon / un support" />
      <select value={activeModuleForLesson ?? ''} onChange={(e) => setActiveModuleForLesson(e.target.value || null)} className="w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold">
        <option value="">Aucun module spécifique</option>
        {modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}
      </select>
      <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Titre de la leçon" className="w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold" />
      <textarea value={lessonDesc} onChange={(e) => setLessonDesc(e.target.value)} rows={3} placeholder="Description" className="w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold resize-none" />
      <input value={lessonAttachment} onChange={(e) => setLessonAttachment(e.target.value)} placeholder="URL du support ou nom du fichier" className="w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold" />
      <SubmitButton label="Publier la leçon" />
    </form>
  );
}

function ReminderForm({ remContent, remIsUrgent, setRemContent, setRemIsUrgent, handleReminderSubmit }: Props) {
  return (
    <form onSubmit={handleReminderSubmit} className="rounded-3xl bg-neutral-gray-50 p-6 border border-neutral-gray-200 shadow-sm space-y-4">
      <SectionTitle text="Envoi d'un rappel aux élèves" />
      <textarea value={remContent} onChange={(e) => setRemContent(e.target.value)} rows={4} placeholder="Message" className="w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold resize-none" />
      <label className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-secondary">
        <input type="checkbox" checked={remIsUrgent} onChange={(e) => setRemIsUrgent(e.target.checked)} className="h-4 w-4 rounded border-neutral-gray-300 text-brand-red-deep" />
        Urgent
      </label>
      <SubmitButton label="Envoyer le rappel" />
    </form>
  );
}

function SectionTitle({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center gap-2 text-brand-red-deep text-xs font-black uppercase tracking-[0.22em]">
      <BookOpen className="w-4 h-4" />
      {text}
    </div>
  );
}

function SubmitButton({ label }: { readonly label: string }) {
  return <button type="submit" className="rounded-2xl bg-brand-red-deep px-4 py-3 text-xs font-black text-white hover:bg-[#6B0E10] transition">{label}</button>;
}
