import React from 'react';

export function CourseChaptersTab({ state }: { state: any }) {
  const { course, details } = state;
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-3">
        <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-base">description</span>
          Description & Objectifs Pédagogiques
        </h5>
        <p className="text-xs text-neutral-600 leading-relaxed font-bold font-sans">
          {course.description}
        </p>
        <div className="bg-[#FAF9F7] p-3.5 rounded-2xl border border-neutral-gray-200/50 text-[11px] text-neutral-500 font-bold leading-relaxed font-sans">
          L'École 221 encourage l'esprit d'initiative. Pour ce cours hybride, toutes vos ressources sont synchronisées ci-après. Des quizzes d'auto-évaluation et des rendus de travaux dirigés (TD/TP) sont obligatoires pour valider votre certificat.
        </div>
      </div>

      <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
        <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-base animate-pulse text-[#B3181C]">emergency</span>
          Statut d'enseignement en classe
        </h5>
        
        <div className="relative border-l-2 border-neutral-gray-200 ml-3.5 pl-6 py-2 space-y-6">
          {details.chapitres.map((chap: any, idx: number) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 ${chap.lecons.some((l: any) => l.estDerniereEnseignee) ? 'bg-[#B3181C] border-[#FFF5F5] ring-2 ring-[#B3181C]/20 scale-110' : 'bg-white border-neutral-gray-300'}`} />
              <div className="space-y-2">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-sans">CHAPITRE {idx + 1}</span>
                <h6 className="text-xs font-black text-[#291715] font-sans">{chap.titre}</h6>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {chap.lecons.map((lecon: any, lIdx: number) => (
                    <div key={lIdx} className={`p-3 rounded-2xl border ${lecon.estDerniereEnseignee ? 'bg-[#3f1e1e] text-white border-transparent' : 'bg-neutral-gray-50 border-neutral-gray-150 text-neutral-600'}`}>
                      <div className="flex justify-between items-start gap-2 mb-1.5 font-sans">
                        <span className="text-[10px] font-extrabold leading-snug">{lecon.titre}</span>
                        {lecon.estDerniereEnseignee && <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-[#B3181C] text-[7.5px] font-black uppercase tracking-wider shrink-0 font-sans">Cours prof active</span>}
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider opacity-90 font-sans">
                        <span>Volume : {lecon.duree}</span>
                        <span>{lecon.complete ? '✅ ACCOMPLI' : lecon.estDerniereEnseignee ? '🚀 EN COURS' : '⏳ A VENIR'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
