import React from 'react';

export function CourseTabsNav({ state }: { state: any }) {
  const { activeTab, setActiveTab, details } = state;
  return (
    <div className="flex border-b border-neutral-gray-200 bg-white shrink-0 overflow-x-auto no-scrollbar">
      <button onClick={() => setActiveTab('chapters')} className={`flex-grow sm:flex-1 py-4 px-3 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'chapters' ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'}`}>
        <span translate="no" className="material-symbols-outlined text-lg">auto_stories</span>
        Détails & Progression
      </button>
      <button onClick={() => setActiveTab('resources')} className={`flex-grow sm:flex-1 py-4 px-3 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'resources' ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'}`}>
        <span translate="no" className="material-symbols-outlined text-lg">folder_open</span>
        Ressources ({details.ressources.length})
      </button>
      <button onClick={() => setActiveTab('quizzes')} className={`flex-grow sm:flex-1 py-4 px-3 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'quizzes' ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'}`}>
        <span translate="no" className="material-symbols-outlined text-lg">quiz</span>
        Quiz Évaluation
      </button>
      <button onClick={() => setActiveTab('homework')} className={`flex-grow sm:flex-1 py-4 px-3 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'homework' ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'}`}>
        <span translate="no" className="material-symbols-outlined text-lg">upload_file</span>
        Rendu devoirs
      </button>
    </div>
  );
}
