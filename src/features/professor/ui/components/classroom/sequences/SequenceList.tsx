import React from 'react';

interface Sequence {
  id: string;
  title: string;
  duration: string;
  prerequisites: string;
  competency: string;
  pdf: string;
  code: string;
  releaseRule: string;
  version: string;
}

interface Props {
  readonly sequences: readonly Sequence[];
}

export function SequenceList({ sequences }: Props) {
  const getReleaseLabel = (rule: string) => {
    switch (rule) {
      case 'immediate': return 'Immédiat';
      case 'after_quiz': return 'Après Quiz';
      case 'timed': return 'Planifié (Date)';
      default: return 'Progression';
    }
  };

  const getReleaseColor = (rule: string) => {
    switch (rule) {
      case 'immediate': return 'bg-emerald-50 text-emerald-800 border-emerald-500/15';
      case 'after_quiz': return 'bg-amber-50 text-amber-800 border-amber-500/15';
      default: return 'bg-neutral-50 text-neutral-500 border-neutral-200';
    }
  };

  return (
    <div className="space-y-3.5" id="sequence-list">
      {sequences.map((seq, idx) => (
        <div key={seq.id} className="border border-neutral-150 bg-white hover:shadow-sm transition-all rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 bg-[#FFF5F5] text-brand-red-deep font-mono font-black border border-brand-red-deep/15 rounded-xl flex items-center justify-center shrink-0">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h5 className="font-extrabold text-[#1E293B] text-[12px]">{seq.title}</h5>
                <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono text-[8px] font-black">{seq.version}</span>
                <span className={`px-1.5 py-0.5 rounded border text-[8px] font-black uppercase ${getReleaseColor(seq.releaseRule)}`}>
                  Dévérouillage : {getReleaseLabel(seq.releaseRule)}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-bold">
                <span className="text-neutral-400">Compétence :</span> {seq.competency}
              </p>
              <p className="text-[10px] text-neutral-400 font-bold">
                Prérequis : <span className="text-neutral-600">{seq.prerequisites}</span> | Durée : <span className="text-neutral-600">{seq.duration}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center shrink-0 w-full md:w-auto md:justify-end">
            <a href={seq.pdf} target="_blank" rel="noopener noreferrer" className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-sm text-[#B3181C]">picture_as_pdf</span>
              <span className="text-[9px] uppercase font-extrabold">Support</span>
            </a>
            <a href={seq.code} target="_blank" rel="noopener noreferrer" className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-sm text-[#1E293B]">code</span>
              <span className="text-[9px] uppercase font-extrabold">Dépôt</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
