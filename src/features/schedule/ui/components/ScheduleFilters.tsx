import React from 'react';
import { Search, X, LayoutGrid, CalendarDays } from 'lucide-react';
import { Icon } from '@iconify/react';

export function ScheduleFilters({ state }: { state: any }) {
  return (
    <div className="bg-white border border-neutral-gray-200 rounded-3xl p-5 mb-8 space-y-5 shadow-3xs print:hidden">
      <div className="flex flex-col lg:flex-row gap-4.5 justify-between items-stretch lg:items-center">
        <div className="flex bg-[#FAF8F6] p-1.5 rounded-2xl select-none w-full lg:w-auto border border-neutral-200/60 shadow-3xs">
          <button onClick={() => { state.setViewMode('grid'); state.triggerToast('Format hebdomadaire activé !'); }} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${state.viewMode === 'grid' ? 'bg-white text-[#B3181C] shadow-sm font-black border border-neutral-200/50' : 'text-neutral-gray-400 hover:text-neutral-gray-650'}`}>
            <LayoutGrid className="h-3.5 w-3.5" /> Grille de la semaine
          </button>
          <button onClick={() => { state.setViewMode('timeline'); state.triggerToast('Format journalier activé !'); }} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${state.viewMode === 'timeline' ? 'bg-white text-[#B3181C] shadow-sm font-black border border-neutral-200/50' : 'text-neutral-gray-400 hover:text-neutral-gray-650'}`}>
            <CalendarDays className="h-3.5 w-3.5" /> Planning par jour
          </button>
        </div>

        <div className="relative flex-grow max-w-full lg:max-w-md w-full">
          <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={state.searchQuery} onChange={(e) => state.setSearchQuery(e.target.value)} placeholder="Rechercher un cours, un enseignant, une classe, une salle..." className="w-full pl-11 pr-10 py-3 bg-[#FAF8F6] rounded-2xl border border-neutral-200 text-xs font-bold leading-normal focus:outline-none focus:border-[#B3181C] focus:bg-white placeholder-neutral-400 transition-all border-neutral-gray-200 focus:shadow-xs" />
          {state.searchQuery && <button onClick={() => state.setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer flex items-center justify-center"><X className="h-3.5 w-3.5" /></button>}
        </div>
      </div>

      <div className="h-px bg-neutral-100 w-full" />

      <div className="flex flex-row items-center gap-x-4 sm:gap-x-6 overflow-x-auto w-full justify-start py-1 whitespace-nowrap no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#291715]/60 whitespace-nowrap"><Icon icon="lucide:sliders-horizontal" className="h-4 w-4 text-[#B3181C]" /><span>Format :</span></div>
          <div className="relative min-w-[130px] sm:min-w-[180px]">
            <select value={state.filterType} onChange={(e) => { state.setFilterType(e.target.value); state.triggerToast(`Affichage format : ${e.target.value}`); }} className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none">
              <option value="TOUS">Tous les cours</option><option value="CM">CM (Magistral)</option><option value="TD">TD (Dirigés)</option><option value="TP">TP (Pratiques)</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450"><Icon icon={state.filterType === 'CM' ? 'lucide:graduation-cap' : state.filterType === 'TD' ? 'lucide:file-text' : state.filterType === 'TP' ? 'lucide:laptop' : 'lucide:sparkles'} className="h-4 w-4 text-[#B3181C]" /></div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"><Icon icon="lucide:chevron-down" className="h-4 w-4" /></div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#291715]/60 whitespace-nowrap"><Icon icon="lucide:check-circle-2" className="h-4 w-4 text-green-600" /><span>Statut :</span></div>
          <div className="relative" style={{ width: '174.5px' }}>
            <select value={state.filterStatus} onChange={(e) => { state.setFilterStatus(e.target.value); state.triggerToast(`Filtre statut : ${e.target.value}`); }} style={{ width: '174.5px' }} className="appearance-none w-full pl-9 pr-10 py-2.5 bg-[#FAF8F6] hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] cursor-pointer transition-all outline-none">
              <option value="TOUS">Tous les statuts</option><option value="actuel">🟢 Actuels / En cours</option><option value="a_venir">📅 À Venir</option><option value="termine">✅ Terminés</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450"><Icon icon={state.filterStatus === 'actuel' ? 'lucide:play-circle' : state.filterStatus === 'a_venir' ? 'lucide:calendar' : state.filterStatus === 'termine' ? 'lucide:check-circle-2' : 'lucide:check-square'} className="h-4 w-4 text-[#B3181C]" /></div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"><Icon icon="lucide:chevron-down" className="h-4 w-4" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
