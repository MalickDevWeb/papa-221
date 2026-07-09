import React from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';

interface Props {
  readonly title: string;
  readonly description: string;
  readonly isDraft: boolean;
  readonly onTitleChange: (v: string) => void;
  readonly onDescriptionChange: (v: string) => void;
  readonly onToggleDraft: () => void;
  readonly onSaveModule: () => void;
}

export function ModuleDetailHeader({
  title,
  description,
  isDraft,
  onTitleChange,
  onDescriptionChange,
  onToggleDraft,
  onSaveModule,
}: Props) {
  return (
    <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-150/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Édition du Module</span>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isDraft ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-700">
              {isDraft ? 'Mode Brouillon (Non visible aux élèves)' : 'Publié à la classe'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleDraft}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-300 text-[11px] font-black text-neutral-600 hover:text-brand-red-deep hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isDraft ? (
              <>
                <Eye className="h-3.5 w-3.5" /> Publier vers la classe
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Mettre en brouillon
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onSaveModule}
            className="px-3.5 py-1.5 rounded-xl bg-brand-red-deep hover:bg-brand-red-deep/90 text-white text-[11px] font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
          >
            <Save className="h-3.5 w-3.5" /> Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-[#64748B]">Titre du chapitre / module</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-250 focus:border-brand-red-deep text-xs font-bold rounded-xl outline-none"
            placeholder="Entrez le titre du module..."
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-[#64748B]">Description du cours ou objectifs</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2 bg-white border border-neutral-250 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none resize-none"
            placeholder="Qu'allez-vous enseigner dans ce module ?"
          />
        </div>
      </div>
    </div>
  );
}
