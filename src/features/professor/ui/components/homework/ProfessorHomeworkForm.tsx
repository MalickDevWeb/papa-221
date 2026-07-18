import type { FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';

interface Props {
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

export function ProfessorHomeworkForm(props: Props) {
  return (
    <form onSubmit={props.handleHomeworkSubmit} className="rounded-3xl bg-neutral-gray-50 p-6 border border-neutral-gray-200 shadow-sm space-y-4">
      <TextField label="Titre du devoir" value={props.hwTitle} onChange={props.setHwTitle} placeholder="Ex: Mini-projet système d'authentification" />
      <div>
        <label className="text-[10px] font-black uppercase text-secondary">Consigne</label>
        <textarea value={props.hwDesc} onChange={(e) => props.setHwDesc(e.target.value)} rows={4} placeholder="Décrivez les attentes du rendu et les critères d'évaluation" className="mt-2 w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold focus:border-brand-red-deep focus:outline-none resize-none" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[10px] font-black uppercase text-secondary">Priorité</label>
          <select value={props.hwPrio} onChange={(e) => props.setHwPrio(e.target.value as 'haute' | 'normale')} className="mt-2 w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold focus:border-brand-red-deep focus:outline-none">
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
          </select>
        </div>
        <TextField label="Deadline" value={props.hwDeadline} onChange={props.setHwDeadline} placeholder="15 Octobre - 23h59" />
      </div>
      <button className="inline-flex items-center gap-2 rounded-2xl bg-brand-red-deep px-4 py-3 text-xs font-black text-white hover:bg-[#6B0E10] transition">
        <PlusCircle className="w-4 h-4" /> Assigner le devoir
      </button>
    </form>
  );
}

function TextField({ label, value, onChange, placeholder }: { readonly label: string; readonly value: string; readonly onChange: (value: string) => void; readonly placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-secondary">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold focus:border-brand-red-deep focus:outline-none" />
    </div>
  );
}
