import React from 'react';

export function CourseSidebar({ course, details }: { course: any, details: any }) {
  return (
    <div className="w-full lg:w-80 bg-white lg:border-r border-b lg:border-b-0 border-neutral-gray-150 flex flex-col shrink-0 p-5 space-y-4">
      <div className="bg-[#FAF9F7] rounded-2xl border border-neutral-gray-250 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center text-brand-red-deep shrink-0 border border-brand-red-deep/10">
            <span translate="no" className="material-symbols-outlined text-[22px]">person_book</span>
          </div>
          <div>
            <h5 className="font-extrabold text-[#291715] text-xs">Enseignant responsable</h5>
            <p className="text-[11px] text-neutral-500 font-bold leading-none">{course.professeur}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-neutral-500 pt-2 border-t border-neutral-gray-200/60">
          <div>
            <span className="block text-neutral-400 text-[8px] uppercase tracking-wider">SALLE</span>
            <span className="text-[#3f1e1e] font-sans">{course.salle || 'En Ligne'}</span>
          </div>
          <div>
            <span className="block text-neutral-400 text-[8px] uppercase tracking-wider">PROCHAIN COURS</span>
            <span className="text-[#3f1e1e] truncate block font-sans">{course.prochainCours || 'A définir'}</span>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-[10px] font-black uppercase tracking-wider text-[#3f1e1e] mb-2.5 px-1 flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-base">list_alt</span>
          Index des Chapitres ({details.chapitres.length})
        </h5>
        
        <div className="space-y-2">
          {details.chapitres.map((chap: any, idx: number) => {
            const hasActiveLesson = chap.lecons.some((l: any) => l.estDerniereEnseignee);
            return (
              <div key={idx} className={`p-3 rounded-2xl border transition-all text-left ${hasActiveLesson ? 'bg-[#FFF8F7] border-brand-red-deep/30 shadow-3xs' : 'bg-white border-neutral-gray-200/70 hover:bg-[#FAF9F7]'}`}>
                <h6 className="text-[11px] font-black text-[#291715] line-clamp-1 mb-1.5 font-sans">
                  {chap.titre}
                </h6>
                <div className="space-y-1">
                  {chap.lecons.map((lecon: any, lIdx: number) => (
                    <div key={lIdx} className={`p-2 rounded-xl text-[10px] font-bold flex items-center justify-between gap-1.5 font-sans ${lecon.estDerniereEnseignee ? 'bg-[#3f1e1e] text-white' : 'bg-[#FAF9F7]/70 text-neutral-600'}`}>
                      <span className="truncate flex-1">{lecon.titre}</span>
                      {lecon.estDerniereEnseignee ? (
                        <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-[#3f1e1e] text-[8px] font-black uppercase tracking-widest animate-pulse font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B3181C]" /> ACTIVE (PROF)
                        </span>
                      ) : lecon.complete ? (
                        <span translate="no" className="material-symbols-outlined text-emerald-500 text-sm shrink-0 font-black">check_circle</span>
                      ) : (
                        <span className="text-[8.5px] font-bold text-neutral-400 shrink-0 font-sans">{lecon.duree}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-200 text-[10px] text-neutral-500 font-bold leading-relaxed">
        💡 <strong className="text-[#3f1e1e]">Suivi des leçons :</strong> Le repère <span className="bg-[#3f1e1e] text-white px-1 py-0.5 rounded text-[8px] font-black font-mono">ACTIVE (PROF)</span> pointe sur le chapitre où se situe l'enseignant.
      </div>
    </div>
  );
}
