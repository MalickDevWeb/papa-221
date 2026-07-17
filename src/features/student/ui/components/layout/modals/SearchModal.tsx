import React from 'react';
import { createPortal } from 'react-dom';

export interface SearchItem {
  name: string; type: string; icon: string; keywords: string;
  path?: string; action?: string;
}

interface Props {
  showSearch: boolean; setShowSearch: (v: boolean) => void;
  searchQuery: string; setSearchQuery: (v: string) => void;
  filteredSearchItems: SearchItem[];
  onSearchAction: (item: SearchItem) => void;
}

export function SearchModal({ showSearch, setShowSearch, searchQuery, setSearchQuery, filteredSearchItems, onSearchAction }: Props) {
  if (!showSearch) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-[#291715]/40 backdrop-blur-xs z-[100] flex items-start justify-center p-4 pt-10 sm:pt-20 animate-fade-in"
      onClick={() => setShowSearch(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg border border-neutral-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-[min(80vh,42rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-neutral-gray-150 flex items-center gap-3 shrink-0">
          <span translate="no" className="material-symbols-outlined text-brand-red-deep font-bold">search</span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-[#291715]" placeholder="Tapez un mot-clé (devoirs, notes, IA...)" />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="bg-neutral-gray-100 hover:bg-neutral-gray-200 p-1.5 rounded-full text-secondary transition-colors">
            <span translate="no" className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>
        <div className="flex-1 p-3 space-y-4 overflow-hidden">
          {filteredSearchItems.length === 0 ? (
            <div className="py-12 text-center text-secondary">
              <span className="material-symbols-outlined text-[40px] text-neutral-gray-300">mood_bad</span>
              <p className="text-xs font-extrabold mt-2 text-neutral-gray-650">Aucun résultat trouvé pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="px-3 py-1 block text-[9.5px] font-black uppercase tracking-widest text-neutral-gray-400 select-none">Suggestions ({filteredSearchItems.length})</span>
              {filteredSearchItems.map((item, idx) => (
                <div key={idx} onClick={() => onSearchAction(item)} className="px-3.5 py-3 rounded-2xl hover:bg-brand-red-light/35 flex items-center justify-between cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-gray-50 group-hover:bg-brand-red-light text-secondary group-hover:text-brand-red-deep flex items-center justify-center transition-colors">
                      <span translate="no" className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#291715] group-hover:text-brand-red-deep transition-colors">{item.name}</p>
                      <span className="text-[9px] bg-neutral-gray-150 px-1.5 py-0.5 rounded text-neutral-gray-500 uppercase font-black tracking-wider">{item.type}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-xs text-neutral-gray-300 group-hover:text-brand-red-deep group-hover:translate-x-0.5 transition-all">chevron_right</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 bg-neutral-gray-50 border-t border-neutral-gray-150 text-center select-none shrink-0">
          <p className="text-[10px] text-neutral-gray-400 font-bold">Appuyez sur Esc ou cliquez à l'extérieur pour fermer</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
