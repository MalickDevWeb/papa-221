import React from 'react';
import { Icon } from '@iconify/react';

interface Props {
  readonly selectedCours: string;
  readonly setSelectedCours: (val: string) => void;
  readonly selectedPriority: string;
  readonly setSelectedPriority: (val: string) => void;
  readonly triggerToast?: (msg: string) => void;
}

export function HomeworkFilters({
  selectedCours,
  setSelectedCours,
  selectedPriority,
  setSelectedPriority,
  triggerToast
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 items-center bg-white border border-neutral-gray-200/95 p-4 sm:px-5 sm:py-4 rounded-3xl shadow-3xs mb-8">
      
      {/* Course Filter */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#291715]/60 whitespace-nowrap">
          <Icon icon="lucide:book-open" className="h-4 w-4 text-[#B3181C]" />
          <span>Cours :</span>
        </div>
        <div className="relative flex-1 lg:min-w-[220px]">
          <select
            value={selectedCours}
            onChange={(e) => {
              setSelectedCours(e.target.value);
              triggerToast?.(`Filtré par cours : ${e.target.value}`);
            }}
            className="appearance-none w-full pl-3 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none"
          >
            <option value="Tous les cours">Tous les cours</option>
            <option value="Mobile iOS & Android">Mobile iOS & Android (Flutter)</option>
            <option value="Data Science">Data Science (Base de Données)</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Marketing Digital">Marketing Digital</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450">
            <Icon icon="lucide:chevron-down" className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="h-6 w-px bg-neutral-gray-200 hidden lg:block" />

      {/* Priority Filter */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#291715]/60 whitespace-nowrap">
          <Icon icon="lucide:sliders-horizontal" className="h-4 w-4 text-[#B3181C]" />
          <span>Priorité :</span>
        </div>
        <div className="relative flex-1 lg:min-w-[180px]">
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              triggerToast?.(`Filtré par priorité : ${e.target.value === 'toutes' ? 'Toutes' : e.target.value}`);
            }}
            className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none"
          >
            <option value="toutes">Toutes les priorités</option>
            <option value="haute">🔴 Haute</option>
            <option value="normale">🔵 Normale</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450">
            <Icon 
              icon={
                selectedPriority === 'haute' ? 'lucide:alert-circle' :
                selectedPriority === 'normale' ? 'lucide:info' :
                'lucide:sliders-horizontal'
              } 
              className="h-4 w-4 text-[#B3181C]"
            />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <Icon icon="lucide:chevron-down" className="h-4 w-4" />
          </div>
        </div>
      </div>

    </div>
  );
}
