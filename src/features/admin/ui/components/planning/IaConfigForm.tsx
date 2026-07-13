import React from 'react';

interface Props {
  promptInput: string;
  setPromptInput: (val: string) => void;
  rules: {
    noGaps: boolean;
    respectQuota: boolean;
    prioritizeLargeAmphis: boolean;
    evenDistribution: boolean;
  };
  setRules: (val: any) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
}

export function IaConfigForm({
  promptInput,
  setPromptInput,
  rules,
  setRules,
  isGenerating,
  handleGenerate,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] text-neutral-400 font-black uppercase">Consignes en langage naturel</label>
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ex : Organise le planning de Génie Civil en évitant les cours de Dr. Diallo le mercredi après-midi et priorise les amphis..."
            className="w-full h-24 px-3.5 py-2.5 border border-neutral-200 rounded-xl font-bold text-xs focus:outline-none focus:border-[#B3181C] resize-none pr-8 bg-[#FAF8F6]"
          />
          <span translate="no" className="material-symbols-outlined absolute right-2.5 bottom-2.5 text-neutral-300">
            chat_bubble
          </span>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3">
        <span className="text-[10px] text-neutral-400 font-black uppercase block">Moteur de Contraintes (Rules Engine)</span>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rules.noGaps}
              onChange={(e) => setRules({ ...rules, noGaps: e.target.checked })}
              className="rounded text-[#B3181C] focus:ring-[#B3181C]"
            />
            <span>Éviter les "trous" (heures creuses) pour les étudiants</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rules.respectQuota}
              onChange={(e) => setRules({ ...rules, respectQuota: e.target.checked })}
              className="rounded text-[#B3181C] focus:ring-[#B3181C]"
            />
            <span>Respecter les quotas mensuels des professeurs vacataires</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rules.prioritizeLargeAmphis}
              onChange={(e) => setRules({ ...rules, prioritizeLargeAmphis: e.target.checked })}
              className="rounded text-[#B3181C] focus:ring-[#B3181C]"
            />
            <span>Prioriser les grands amphis pour les fortes promotions</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl font-extrabold uppercase tracking-wider text-[11px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span translate="no" className={`material-symbols-outlined text-base ${isGenerating ? 'animate-spin' : ''}`}>
          {isGenerating ? 'progress_activity' : 'magic_button'}
        </span>
        <span>{isGenerating ? 'Calcul Quantique des variables...' : 'Générer le Planning Idéal par IA'}</span>
      </button>
    </div>
  );
}
