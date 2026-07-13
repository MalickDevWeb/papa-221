import React from 'react';
import { Search, X, LayoutGrid, CalendarDays } from 'lucide-react';
import { Icon } from '@iconify/react';

interface Props {
  readonly viewMode: 'grid' | 'timeline';
  readonly setViewMode: (mode: 'grid' | 'timeline') => void;
  readonly searchQuery: string;
  readonly setSearchQuery: (q: string) => void;
  readonly filterType: string;
  readonly setFilterType: (t: any) => void;
  readonly filterStatus: string;
  readonly setFilterStatus: (s: any) => void;
  readonly filterClass: string;
  readonly setFilterClass: (c: string) => void;
  readonly classesList: readonly string[];
  readonly triggerToast: (msg: string) => void;
}

export function ProfessorScheduleFilters({
  viewMode, setViewMode, searchQuery, setSearchQuery,
  filterType, setFilterType, filterStatus, setFilterStatus,
  filterClass, setFilterClass, classesList, triggerToast,
}: Props) {
  return (
    <div className="bg-white border border-neutral-gray-200 rounded-3xl p-5 mb-6 space-y-4 shadow-3xs print:hidden">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex bg-[#FAF8F6] p-1.5 rounded-2xl select-none w-full lg:w-auto border border-neutral-200/60 shadow-3xs">
          <button onClick={() => { setViewMode('grid'); triggerToast('Format hebdomadaire activé !'); }} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-0 ${viewMode === 'grid' ? 'bg-white text-[#B3181C] shadow-sm font-black border border-neutral-200/50' : 'text-neutral-gray-400 hover:text-neutral-gray-650'}`}><LayoutGrid className="h-3.5 w-3.5" /> Grille de la semaine</button>
          <button onClick={() => { setViewMode('timeline'); triggerToast('Format journalier activé !'); }} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-0 ${viewMode === 'timeline' ? 'bg-white text-[#B3181C] shadow-sm font-black border border-neutral-200/50' : 'text-neutral-gray-400 hover:text-neutral-gray-650'}`}><CalendarDays className="h-3.5 w-3.5" /> Planning par jour</button>
        </div>
        <div className="relative flex-grow max-w-full lg:max-w-md w-full">
          <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un cours, une classe, une salle..." className="w-full pl-11 pr-10 py-3 bg-[#FAF8F6] rounded-2xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#B3181C] placeholder-neutral-400 transition-all focus:shadow-xs" />
          {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer flex items-center justify-center border-0 bg-transparent"><X className="h-3.5 w-3.5" /></button>)}
        </div>
      </div>
      <div className="h-px bg-neutral-100 w-full" />
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#291715]/60"><Icon icon="lucide:users" className="h-4 w-4 text-[#B3181C]" /><span>Classe :</span></div>
          <div className="relative min-w-[160px]">
            <select value={filterClass} onChange={(e) => { setFilterClass(e.target.value); triggerToast(`Filtre classe : ${e.target.value}`); }} className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none">
              <option value="TOUS">Toutes les classes</option>
              {classesList.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#B3181C]"><Icon icon="lucide:school" className="h-4 w-4" /></div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"><Icon icon="lucide:chevron-down" className="h-4 w-4" /></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#291715]/60"><Icon icon="lucide:sliders-horizontal" className="h-4 w-4 text-[#B3181C]" /><span>Format :</span></div>
          <div className="relative min-w-[140px]">
            <select value={filterType} onChange={(e) => { setFilterType(e.target.value); triggerToast(`Affichage format : ${e.target.value}`); }} className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none">
              <option value="TOUS">Tous formats</option>
              <option value="CM">CM (Magistral)</option>
              <option value="TD">TD (Dirigés)</option>
              <option value="TP">TP (Pratiques)</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#B3181C]"><Icon icon={filterType === 'CM' ? 'lucide:graduation-cap' : filterType === 'TD' ? 'lucide:file-text' : filterType === 'TP' ? 'lucide:laptop' : 'lucide:sparkles'} className="h-4 w-4" /></div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"><Icon icon="lucide:chevron-down" className="h-4 w-4" /></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#291715]/60"><Icon icon="lucide:check-circle-2" className="h-4 w-4 text-green-600" /><span>Statut :</span></div>
          <div className="relative min-w-[150px]">
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); triggerToast(`Filtre statut : ${e.target.value}`); }} className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none">
              <option value="TOUS">Tous les statuts</option>
              <option value="a_venir">📅 À Venir</option>
              <option value="annule">❌ Annulés</option>
              <option value="reprogramme">🔄 Reprogrammés</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#B3181C]"><Icon icon={filterStatus === 'annule' ? 'lucide:x-circle' : filterStatus === 'reprogramme' ? 'lucide:refresh-cw' : 'lucide:calendar'} className="h-4 w-4" /></div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"><Icon icon="lucide:chevron-down" className="h-4 w-4" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
