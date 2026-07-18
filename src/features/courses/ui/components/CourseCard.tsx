import React from 'react';
import { CoursItem } from './types';

interface CourseCardProps {
  cours: CoursItem;
  onSelect: (cours: CoursItem) => void;
}

export function CourseCard({ cours, onSelect }: CourseCardProps) {
  const getStatusColor = (status: string) => {
    if (status === 'en_cours') return 'bg-brand-red-deep';
    return status === 'termine' ? 'bg-emerald-600' : 'bg-neutral-500';
  };

  return (
    <div 
      onClick={() => onSelect(cours)}
      className="bg-white border border-neutral-200/80 rounded-[28px] overflow-hidden group hover:scale-[1.015] hover:border-brand-red-deep/20 hover:shadow-[0_16px_36px_rgba(41,23,21,0.05)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-44 overflow-hidden shrink-0 select-none">
        <img 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" 
          src={cours.image} 
          alt={cours.nom} 
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 font-extrabold text-[9px] uppercase tracking-wider rounded-lg text-white shadow-xs ${getStatusColor(cours.statut)}`}>
            {cours.statut === 'en_cours' ? 'En Cours' : cours.statut === 'termine' ? 'Terminé' : 'Non démarré'}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-neutral-900/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
          {cours.categorie === 'Informatique & Dév' ? '💻 TECH' : cours.categorie === 'Management & Business' ? '📈 BIZ' : '⭐ SOFT'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-[16px] font-black text-on-surface leading-snug group-hover:text-brand-red-deep transition-colors line-clamp-2">
              {cours.nom}
            </h3>
            {cours.statut === 'termine' && (
              <span translate="no" className="material-symbols-outlined text-emerald-600 font-bold text-[18px] shrink-0 animate-fade-in" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 font-medium">
            {cours.description}
          </p>
        </div>

        <div className="space-y-4 pt-3.5 border-t border-neutral-100">
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wide">
              <span className="text-neutral-400">Progression</span>
              <span className="text-brand-red-deep">{cours.progression}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-red-deep rounded-full transition-all duration-500" style={{ width: `${cours.progression}%` }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-bold truncate flex-grow">
              <span translate="no" className="material-symbols-outlined text-[14px] text-brand-red-deep shrink-0">person</span>
              <span className="truncate">{cours.professeur}</span>
              {cours.statut === 'termine' && cours.noteFinale && (
                <>
                  <span className="text-neutral-350 mx-0.5">•</span>
                  <span className="text-emerald-600 font-black shrink-0 flex items-center gap-0.5" title={`Note: ${cours.noteFinale}`}>
                    <span translate="no" className="material-symbols-outlined text-[12px] text-emerald-600">stars</span>
                    {cours.noteFinale}
                  </span>
                </>
              )}
              {cours.statut === 'non_demarre' && cours.avis && (
                <>
                  <span className="text-neutral-350 mx-0.5">•</span>
                  <span className="text-amber-500 font-black shrink-0 flex items-center gap-0.5" title={`Avis: ${cours.avis}`}>
                    <span translate="no" className="material-symbols-outlined text-[12px] fill-amber-500 text-amber-500">star</span>
                    {cours.avis.split(' ')[0]}
                  </span>
                </>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(cours);
              }}
              className="px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 select-none cursor-pointer hover:scale-[1.03] active:scale-[0.97] shrink-0 bg-brand-red-light/80 text-brand-red-deep hover:bg-brand-red-deep hover:text-white"
            >
              <span>Détails</span>
              <span translate="no" className="material-symbols-outlined text-xs font-black transition-transform group-hover:translate-x-0.5">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

