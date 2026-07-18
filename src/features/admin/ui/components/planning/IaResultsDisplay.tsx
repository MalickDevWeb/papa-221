import React from 'react';

interface Props {
  isGenerating: boolean;
  generatedResult: any;
  handleApply: () => void;
}

export function IaResultsDisplay({ isGenerating, generatedResult, handleApply }: Props) {
  return (
    <div className="border border-neutral-200 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
      {isGenerating && (
        <div className="my-auto space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-neutral-200 rounded w-1/3" />
              <div className="h-2 bg-neutral-200 rounded w-2/3" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-2 bg-neutral-200 rounded w-full" />
            <div className="h-2 bg-neutral-200 rounded w-5/6" />
            <div className="h-2 bg-neutral-200 rounded w-4/5" />
          </div>
          <div className="text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest pt-4">
            Optimisation combinatoire en cours...
          </div>
        </div>
      )}

      {!isGenerating && !generatedResult && (
        <div className="my-auto text-center py-12 text-neutral-300 flex flex-col items-center space-y-2">
          <span translate="no" className="material-symbols-outlined text-4xl">
            auto_awesome
          </span>
          <p className="text-xs font-black uppercase tracking-wider">Prêt à optimiser</p>
          <p className="text-[10px] text-neutral-400 font-semibold max-w-xs">
            Saisissez des consignes ou activez des règles, puis lancez la génération assistée par IA.
          </p>
        </div>
      )}

      {!isGenerating && generatedResult && (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#B3181C]/5 p-3 rounded-xl border border-[#B3181C]/20">
              <div>
                <div className="text-[10px] text-neutral-400 font-black uppercase">Score d'Optimisation</div>
                <div className="text-xl font-black text-[#B3181C]">{generatedResult.score}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neutral-400 font-black uppercase">Conflits Logistiques</div>
                <div className="text-sm font-black text-emerald-600">✓ {generatedResult.conflits} Conflit</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-neutral-400 font-black uppercase block">Rapport de Résolution</span>
              <ul className="space-y-1.5 text-[10px] font-semibold text-neutral-600">
                {generatedResult.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span translate="no" className="material-symbols-outlined text-emerald-600 text-xs shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span translate="no" className="material-symbols-outlined text-sm">
              check
            </span>
            <span>Appliquer le planning optimisé</span>
          </button>
        </div>
      )}
    </div>
  );
}
