import React from 'react';

interface Resource {
  titre: string;
  type: 'pdf' | 'video' | 'code' | 'link';
  taille: string;
}

interface Course {
  professeur: string;
}

interface Details {
  ressources: Resource[];
}

interface CourseResourcesTabProps {
  course: Course;
  details: Details;
  triggerToast: (msg: string) => void;
}

export function CourseResourcesTab({ course, details, triggerToast }: CourseResourcesTabProps) {
  return (
    <div className="space-y-4 animate-fade-in font-sans">
      <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl">
        <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-base">cloud_download</span>
          Supports & Documents Officiels
        </h5>
        <p className="text-[10px] text-neutral-500 font-bold mb-4 font-sans">
          Documents pédagogiques partagés par votre professeur ({course.professeur}). Cliquez pour les ouvrir.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.ressources.map((res, idx) => (
            <div 
              key={idx} 
              className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-200 hover:border-brand-red-deep/30 hover:shadow-2xs transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  res.type === 'pdf' ? 'bg-red-50 text-red-600 border-red-100' :
                  res.type === 'video' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                  res.type === 'code' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  <span translate="no" className="material-symbols-outlined text-[20px]">
                    {res.type === 'pdf' ? 'picture_as_pdf' :
                     res.type === 'video' ? 'video_library' :
                     res.type === 'code' ? 'code' : 'link'}
                  </span>
                </div>
                <div className="min-w-0 font-sans">
                  <h6 className="text-xs font-extrabold text-[#291715] truncate group-hover:text-brand-red-deep transition-colors font-sans">
                    {res.titre}
                  </h6>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-sans">
                    {res.taille} • {res.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => triggerToast(`Ouverture de la ressource : ${res.titre}`)}
                className="shrink-0 p-2 rounded-xl bg-white border border-neutral-gray-250 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center justify-center"
              >
                <span translate="no" className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex items-start gap-2.5">
        <span translate="no" className="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">lightbulb</span>
        <p className="text-[10px] text-amber-800 font-bold leading-relaxed font-sans">
          <strong>Tuteur IA Intégré :</strong> Ces ressources sont également lues par votre Tuteur IA. Vous pouvez lui poser des questions ou générer des quiz supplémentaires sur n'importe quel document via le menu latéral principal de l'application !
        </p>
      </div>
    </div>
  );
}
