import React from 'react';
import { Calendar, Filter, Search } from 'lucide-react';

export function CalendarHeader({ state }: { state: any }) {
  return (
    <div className="space-y-4 shrink-0 mb-4">
      {/* Header title & Week toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#B3181C]/5 flex items-center justify-center rounded-2xl text-[#B3181C] transition-all hover:bg-[#B3181C]/10">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-black text-sm md:text-base text-neutral-800 tracking-tight">
              Emploi du temps
            </h3>
            <p className="text-[10.5px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5">
              Affichage personnalisé
            </p>
          </div>
        </div>

        {/* Week Switcher Pills */}
        <div className="flex items-center bg-neutral-100/80 p-1 rounded-xl self-start sm:self-auto shadow-inner">
          <button
            onClick={() => {
              state.setWeekType('currentWeek');
              state.triggerToast("Semaine Courante");
            }}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              state.weekType === 'currentWeek'
                ? 'bg-white text-[#B3181C] shadow-sm scale-100'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Courante
          </button>
          <button
            onClick={() => {
              state.setWeekType('nextWeek');
              state.triggerToast("Semaine Prochaine");
            }}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              state.weekType === 'nextWeek'
                ? 'bg-white text-[#B3181C] shadow-sm scale-100'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Prochaine
          </button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Class Level Selector */}
        <div className="sm:col-span-4 relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B3181C]" />
          <select
            value={state.level}
            onChange={(e) => state.setLevel(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-black text-neutral-700 outline-none transition-all focus:border-[#B3181C] focus:ring-2 focus:ring-[#B3181C]/10 cursor-pointer appearance-none shadow-sm"
          >
            <option value="L3GL">Licence 3 - GL</option>
            <option value="L2SR">Licence 2 - SR</option>
            <option value="M1IA">Master 1 - IA</option>
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</span>
        </div>

        {/* Search Field */}
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher un cours, prof, salle..."
            value={state.searchQuery}
            onChange={(e) => state.setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#B3181C] focus:ring-2 focus:ring-[#B3181C]/10 shadow-sm"
          />
        </div>

        {/* View Switcher Tabs (Hebdo / Mensuel) */}
        <div className="sm:col-span-3 flex bg-neutral-100/80 p-1 rounded-xl h-10 shadow-inner">
          <button
            onClick={() => state.setViewType('weekly')}
            className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              state.viewType === 'weekly'
                ? 'bg-white text-[#B3181C] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Hebdo
          </button>
          <button
            onClick={() => state.setViewType('monthly')}
            className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              state.viewType === 'monthly'
                ? 'bg-white text-[#B3181C] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Mensuel
          </button>
        </div>
      </div>
    </div>
  );
}

