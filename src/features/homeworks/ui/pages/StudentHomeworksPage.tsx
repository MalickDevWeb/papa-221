import React, { useState, useRef } from 'react';
import { useHomeworks } from '@/features/homeworks/hooks/useHomeworks';
import { HomeworkColumn } from '../components/HomeworkColumn';
import { HomeworkFilters } from '../components/HomeworkFilters';

export function StudentHomeworksPage() {
  const { homeworks: tasks, submitHomework, startHomework, advanceProgress } = useHomeworks();
  const [selectedCours, setSelectedCours] = useState<string>('Tous les cours');
  const [selectedPriority, setSelectedPriority] = useState<string>('toutes');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'a_faire' | 'en_cours' | 'soumis'>('a_faire');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskIdForUpload, setActiveTaskIdForUpload] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && activeTaskIdForUpload) {
      triggerToast(`Téléversement de "${e.target.files[0].name}"...`);
      const success = await submitHomework(activeTaskIdForUpload, e.target.files[0]);
      triggerToast(success ? "Devoir soumis avec succès!" : "Erreur de soumission.");
      setActiveTaskIdForUpload(null);
    }
  };

  const filtered = tasks.filter(t => (selectedCours === 'Tous les cours' || t.cours === selectedCours) && (selectedPriority === 'toutes' || t.prio === selectedPriority));
  const counts = {
    a_faire: filtered.filter(t => t.statut === 'a_faire').length,
    en_cours: filtered.filter(t => t.statut === 'en_cours').length,
    soumis: filtered.filter(t => t.statut === 'soumis').length,
  };

  return (
    <section id="student-homeworks-section" className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 animate-fade-in relative">
      {showToast && (
        <div id="toast-container" className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-slide-up">
          <span translate="no" className="material-symbols-outlined text-success-green text-[20px]">check_circle</span>
          <span className="text-xs font-bold">{showToast}</span>
        </div>
      )}

      <input id="homework-file-picker" type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.zip,.rar,.docx" />

      <div id="homeworks-page-header" className="mb-5 border-b border-neutral-gray-200/50 pb-4">
        <h2 className="text-xl md:text-2xl text-on-surface font-black tracking-tight leading-tight">Gestion des Devoirs</h2>
        <p className="text-neutral-gray-500 font-semibold text-[11px] md:text-xs mt-1">Gérez vos soumissions, suivez vos échéances et optimisez votre temps.</p>
      </div>

      <HomeworkFilters selectedCours={selectedCours} setSelectedCours={setSelectedCours} selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority} triggerToast={triggerToast} />

      {/* Segmented Control for mobile & tablet (below lg) */}
      <div className="lg:hidden flex bg-[#FAF8F6] p-1.5 rounded-2xl border border-neutral-200/50 mb-6 gap-1.5 shadow-3xs">
        {([
          { id: 'a_faire', label: 'À Faire', dot: 'bg-neutral-400' },
          { id: 'en_cours', label: 'En Cours', dot: 'bg-blue-500' },
          { id: 'soumis', label: 'Soumis', dot: 'bg-success-green' }
        ] as const).map(({ id, label, dot }) => {
          const isActive = activeTab === id;
          const badgeBg = isActive 
            ? (id === 'a_faire' ? 'bg-[#B3181C]/10 text-[#B3181C]' : id === 'en_cours' ? 'bg-blue-50 text-blue-600' : 'bg-success-green/10 text-success-green')
            : 'bg-neutral-200 text-neutral-600';
          const activeText = isActive 
            ? (id === 'a_faire' ? 'text-[#B3181C]' : id === 'en_cours' ? 'text-blue-600' : 'text-success-green')
            : 'text-neutral-500 hover:text-[#291715]';
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 px-1 rounded-xl text-[10px] md:text-[11px] font-black uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${isActive ? 'bg-white shadow-3xs border border-neutral-200/40 ' + activeText : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              <span className={`w-2 h-2 rounded-full ${dot}`}></span>
              <span>{label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${badgeBg}`}>{counts[id]}</span>
            </button>
          );
        })}
      </div>

      <div id="homeworks-kanban-board" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={activeTab === 'a_faire' ? 'block' : 'hidden lg:block'}><HomeworkColumn title="À Faire" dotColor="bg-neutral-gray-400" badgeBg="bg-neutral-gray-100" badgeText="text-secondary" tasks={filtered.filter(t => t.statut === 'a_faire')} emptyMessage="Aucun devoir à faire" onStart={startHomework} triggerToast={triggerToast} /></div>
        
        <div className={activeTab === 'en_cours' ? 'block' : 'hidden lg:block'}><HomeworkColumn title="En Cours / Dépôt actif" dotColor="bg-blue-500" badgeBg="bg-blue-100" badgeText="text-blue-600" tasks={filtered.filter(t => t.statut === 'en_cours')} emptyMessage="Aucun devoir en cours" onAdvance={advanceProgress} onSubmitClick={(id) => { setActiveTaskIdForUpload(id); fileInputRef.current?.click(); }} triggerToast={triggerToast} /></div>

        <div className={activeTab === 'soumis' ? 'block' : 'hidden lg:block'}><HomeworkColumn title="Soumis / Validés" dotColor="bg-success-green" badgeBg="bg-success-green/10" badgeText="text-success-green" tasks={filtered.filter(t => t.statut === 'soumis')} emptyMessage="Aucune soumission" triggerToast={triggerToast} /></div>
      </div>
    </section>
  );
}

