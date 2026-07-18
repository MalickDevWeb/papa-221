import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { useHomeworks } from '@/features/homeworks/hooks/useHomeworks';
import { HomeworkPriority } from '@/features/homeworks/domain/Homework';

export function StudentHomeworksPage() {
  const {
    homeworks: tasks,
    addHomework,
    submitHomework,
    startHomework,
    advanceProgress
  } = useHomeworks();

  const [selectedCours, setSelectedCours] = useState<string>('Tous les cours');
  const [selectedPriority, setSelectedPriority] = useState<string>('toutes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // New task form states
  const [newTitre, setNewTitre] = useState('');
  const [newCours, setNewCours] = useState('Développement Fullstack');
  const [newDesc, setNewDesc] = useState('');
  const [newPrio, setNewPrio] = useState<HomeworkPriority>('normale');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskIdForUpload, setActiveTaskIdForUpload] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitre.trim()) return;

    const success = await addHomework({
      titre: newTitre,
      cours: newCours,
      desc: newDesc || "Pas de description fournie.",
      prio: newPrio,
    });

    if (success) {
      setShowAddModal(false);
      setNewTitre('');
      setNewDesc('');
      triggerToast(`Nouveau devoir ajouté : ${newTitre}`);
    } else {
      triggerToast("Erreur lors de l'ajout du devoir");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeTaskIdForUpload) {
      const fileName = e.target.files[0].name;
      triggerToast(`Téléversement de "${fileName}" en cours...`);
      const success = await submitHomework(activeTaskIdForUpload, e.target.files[0]);
      if (success) {
        triggerToast(`Devoir soumis avec succès! En attente de correction.`);
      } else {
        triggerToast(`Erreur lors de la soumission.`);
      }
      setActiveTaskIdForUpload(null);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesCours = selectedCours === 'Tous les cours' || task.cours === selectedCours;
    const matchesPriority = selectedPriority === 'toutes' || task.prio === selectedPriority;
    return matchesCours && matchesPriority;
  });

  const todoTasks = filteredTasks.filter(t => t.statut === 'a_faire');
  const ongoingTasks = filteredTasks.filter(t => t.statut === 'en_cours');
  const submittedTasks = filteredTasks.filter(t => t.statut === 'soumis');

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 animate-fade-in relative">
      
      {/* Toast Feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-slide-up">
          <span translate="no" className="material-symbols-outlined text-success-green text-[20px]">check_circle</span>
          <span className="text-xs font-bold">{showToast}</span>
        </div>
      )}

      {/* Hidden file selector */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.zip,.rar,.docx"
      />

      {/* Add Task Modal */}
      {showAddModal && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-gray-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-brand-red-deep text-white flex justify-between items-center">
              <h4 className="text-lg font-black">Planifier un devoir</h4>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <span translate="no" className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">Intitulé du devoir</label>
                <input 
                  type="text" 
                  value={newTitre} 
                  onChange={(e) => setNewTitre(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-red-deep"
                  placeholder="ex: TP n°5 Algorithmes de tri"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">Matière / Cours</label>
                <select 
                  value={newCours} 
                  onChange={(e) => setNewCours(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-gray-250 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:border-brand-red-deep"
                >
                  <option value="Développement Fullstack">Développement Fullstack</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">Niveau de Priorité</label>
                <div className="flex gap-2">
                  {(['normale', 'haute'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPrio(p)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                        newPrio === p 
                          ? 'bg-brand-red-light border-brand-red-deep text-brand-red-deep' 
                          : 'bg-white border-neutral-gray-200 text-neutral-gray-500'
                      }`}
                    >
                      {p === 'haute' ? '🔴 Haute' : '🔵 Normale'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">Instructions ou détails</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-red-deep resize-none"
                  placeholder="Instructions détaillées..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-center border border-neutral-gray-255 rounded-xl font-bold text-xs text-secondary hover:bg-neutral-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-center bg-brand-red-deep text-white rounded-xl font-bold text-xs hover:opacity-95 shadow-sm"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-headline-lg text-[26px] md:text-[32px] text-on-surface font-black tracking-tight leading-tight">
            Gestion des Travaux Académiques
          </h2>
          <p className="text-secondary font-semibold text-xs md:text-sm mt-1.5 max-w-2xl">
            Gérez vos soumissions, suivez vos échéances et optimisez votre temps avec l'analyse prédictive IA.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-neutral-gray-100 p-1 rounded-xl shrink-0">
            <button className="p-2 rounded-lg bg-white shadow-3xs text-brand-red-deep flex items-center justify-center cursor-pointer">
              <span translate="no" className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button className="p-2 rounded-lg text-neutral-gray-400 hover:text-neutral-gray-700 flex items-center justify-center cursor-pointer">
              <span translate="no" className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none bg-brand-red-deep text-white px-5 h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#B3181C]/15 cursor-pointer shrink-0"
          >
            <span translate="no" className="material-symbols-outlined text-[18px]">add</span>
            Planifier Devoir
          </button>
        </div>
      </div>

      {/* AI Insights Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3 bg-[#291715] text-white p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden group border border-white/5 shadow-xs">
          <div className="relative z-10 space-y-3 max-w-xl">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
              <span translate="no" className="material-symbols-outlined text-[#E3A857] text-[16px] animate-pulse">auto_awesome</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-white/90">Workload Intelligence</span>
            </div>
            <h3 className="font-headline-md text-lg md:text-xl font-bold leading-snug">Charge de travail élevée prévue pour la semaine 12</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Nous prévoyons un pic de 24h de travail personnel. Nous vous suggérons de commencer le <span className="text-[#E3A857] font-bold">"Projet Web Avancé"</span> dès aujourd'hui pour lisser votre effort académique.
            </p>
            <div className="pt-2 flex gap-3">
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <span className="block text-xl font-extrabold text-[#E3A857]">85%</span>
                <span className="text-[8px] uppercase opacity-60 font-bold">Saturation</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <span className="block text-xl font-extrabold text-[#E3A857]">3</span>
                <span className="text-[8px] uppercase opacity-60 font-bold">Deadlines</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block translate-y-4 translate-x-4 shrink-0 pointer-events-none opacity-20 group-hover:scale-105 duration-500 transition-transform">
            <span translate="no" className="material-symbols-outlined text-[140px] text-white">donut_large</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-gray-200/90 p-6 rounded-3xl flex flex-col justify-between shadow-3xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-secondary uppercase font-extrabold tracking-wider">Moyenne de Classe</span>
            <span translate="no" className="material-symbols-outlined text-neutral-gray-400">trending_up</span>
          </div>
          <div>
            <span className="text-4xl font-black text-[#291715]">15.4</span>
            <span className="text-neutral-gray-400 text-xs font-black ml-1.5">/ 20</span>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-gray-150">
            <p className="text-secondary text-[11px] font-bold">Félicitations, vous êtes dans le top 15% de la cohorte !</p>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar with Horizontally Scrollable options and interactive filters on Mobile */}
      <div className="bg-white border border-neutral-gray-200 rounded-3xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 shadow-3xs">
        
        {/* Dropdown Cours */}
        <div className="flex-grow min-w-[200px] relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450">
            <Icon icon="lucide:book-open" className="h-4 w-4 text-[#B3181C]" />
          </div>
          <select 
            value={selectedCours}
            onChange={(e) => {
              setSelectedCours(e.target.value);
              triggerToast(`Filtre matière : ${e.target.value}`);
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F6] rounded-2xl border border-neutral-250/85 focus:outline-none focus:border-[#B3181C] text-xs font-extrabold text-neutral-800 appearance-none cursor-pointer transition-all outline-none"
          >
            <option value="Tous les cours">Tous les cours</option>
            <option value="Développement Fullstack">Développement Fullstack</option>
            <option value="Data Science">Data Science (Base de Données)</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Marketing Digital">Marketing Digital</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-450">
            <Icon icon="lucide:chevron-down" className="h-4 w-4" />
          </div>
        </div>

        <div className="h-6 w-px bg-neutral-gray-200 hidden md:block" />

        {/* Priority Filter as Select Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#291715]/60 whitespace-nowrap">
            <Icon icon="lucide:sliders-horizontal" className="h-4 w-4 text-[#B3181C]" />
            <span>Priorité :</span>
          </div>
          <div className="relative min-w-[180px]">
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                triggerToast(`Priorité filtrée : ${e.target.value === 'toutes' ? 'Toutes' : e.target.value}`);
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

        <div className="h-6 w-px bg-neutral-gray-200 hidden md:block" />

        <div className="flex items-center gap-4 ml-auto shrink-0 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">Trier par :</span>
            <button 
              onClick={() => triggerToast('Tri par date d\'échéance appliqué !')}
              className="flex items-center gap-1.5 text-xs font-black text-[#291715] hover:text-brand-red-deep transition-colors cursor-pointer bg-neutral-gray-50 px-3 py-1.5 rounded-lg border border-neutral-200"
            >
              Échéance
              <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* À Faire */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-gray-400"></span>
              <h4 className="font-extrabold text-xs text-[#291715] uppercase tracking-wider">À Faire</h4>
              <span className="text-[10px] bg-neutral-gray-100 px-2 py-0.5 rounded-full text-secondary font-bold">{todoTasks.length}</span>
            </div>
            <button translate="no" className="material-symbols-outlined text-neutral-gray-400 hover:text-secondary text-[18px]">more_horiz</button>
          </div>
          
          {todoTasks.length === 0 ? (
            <div className="text-center py-10 bg-neutral-gray-50/50 border border-neutral-gray-200/50 rounded-2xl">
              <p className="text-[10px] text-neutral-gray-400 font-bold">Aucun devoir à faire</p>
            </div>
          ) : (
            todoTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-white border border-neutral-gray-200/80 p-4 rounded-2xl shadow-3xs hover:shadow-2xs transition-shadow group relative"
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="bg-brand-red-light text-brand-red-deep text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                    {task.coursLabel}
                  </span>
                  
                  {task.prio === 'haute' && (
                    <span className="bg-[#FFF8F7] text-brand-red-deep text-[8px] font-black border border-[#B3181C]/10 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      🔴 Urgent
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-xs text-[#291715] mb-1.5 group-hover:text-brand-red-deep transition-colors leading-tight">{task.titre}</h5>
                <p className="text-[11px] text-neutral-gray-550 leading-relaxed line-clamp-2 mb-4">{task.desc}</p>
                
                <div className="flex items-center justify-between pt-1 border-t border-neutral-gray-100 mt-2">
                  <div className="flex items-center gap-1.5 text-[#B3181C] text-[10px] font-extrabold">
                    <span translate="no" className="material-symbols-outlined text-[13px]">schedule</span>
                    {task.deadlineStr}
                  </div>
                  
                  <button 
                    onClick={async () => {
                      await startHomework(task.id);
                      triggerToast(`Devoir déplacé vers "En Cours" : ${task.titre}`);
                    }}
                    className="text-[9px] font-black text-brand-red-deep bg-[#FFF8F7] hover:bg-[#FFF8F7]/80 cursor-pointer px-2.5 py-1 rounded-lg transition-colors border border-[#B3181C]/5 flex items-center gap-1"
                  >
                    Démarrer
                    <span translate="no" className="material-symbols-outlined text-[10px] font-black">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* En Cours / Dépôt */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h4 className="font-extrabold text-xs text-[#291715] uppercase tracking-wider">En Cours / Dépôt actif</h4>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{ongoingTasks.length}</span>
            </div>
            <button translate="no" className="material-symbols-outlined text-neutral-gray-400 hover:text-secondary text-[18px]">more_horiz</button>
          </div>
          
          {/* Enhanced Drag & Drop Interface */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#FFF8F7]/40 border-2 border-dashed border-[#B3181C]/20 hover:border-brand-red-deep p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-3xs group-hover:scale-105 duration-300 transition-transform text-brand-red-deep border border-neutral-gray-100">
              <span translate="no" className="material-symbols-outlined">upload_file</span>
            </div>
            <h5 className="font-black text-xs text-[#291715] mb-1">Dépôt actif sécurisé</h5>
            <p className="text-[10px] text-neutral-gray-400 leading-normal max-w-[200px] mb-3">Glissez-déposez ou parcourez pour soumettre (PDF, ZIP, Word)</p>
            <span className="text-[10px] font-black text-brand-red-deep group-hover:underline">[ Choisir un fichier ]</span>
          </div>

          {ongoingTasks.length === 0 ? (
            <div className="text-center py-8 bg-neutral-gray-50/50 border border-neutral-gray-200/50 rounded-2xl">
              <p className="text-[10px] text-neutral-gray-400 font-bold">Aucun devoir en cours activé</p>
            </div>
          ) : (
            ongoingTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-white border-l-4 border-l-brand-red-deep border-y border-r border-neutral-gray-200 p-4 rounded-r-2xl rounded-l-md shadow-3xs"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-neutral-gray-100 text-[#291715] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {task.coursLabel}
                  </span>
                  <span className="text-[10px] text-brand-red-deep font-extrabold">{task.progress || 0}%</span>
                </div>
                
                <h5 className="font-bold text-xs text-[#291715] mb-1.5 leading-snug">{task.titre}</h5>
                
                <div className="w-full bg-neutral-gray-200 h-1.5 rounded-full mb-3.5 overflow-hidden">
                  <div className="bg-brand-red-deep h-1.5 rounded-full duration-500 transition-all" style={{ width: `${task.progress || 0}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-1.5 border-t border-neutral-gray-100">
                  <span className="text-[9px] text-neutral-gray-400 font-bold">{task.deadlineStr}</span>
                  
                  <div className="flex gap-1.5">
                    <button 
                      onClick={async () => {
                        await advanceProgress(task.id, 20);
                        triggerToast(`Progression modifiée pour : ${task.titre}`);
                      }}
                      className="text-[9px] font-black text-brand-red-deep bg-[#FFF8F7] hover:bg-[#FFF8F7]/80 px-2 py-1 rounded-lg border border-[#B3181C]/5 transition-colors cursor-pointer"
                    >
                      Avancer +
                    </button>
                    
                    <button 
                      onClick={() => {
                        setActiveTaskIdForUpload(task.id);
                        fileInputRef.current?.click();
                      }}
                      className="text-[9px] font-black text-white bg-success-green hover:bg-success-green/90 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Soumettre
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Soumis / Terminé */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success-green"></span>
              <h4 className="font-extrabold text-xs text-[#291715] uppercase tracking-wider">Soumis / Validés</h4>
              <span className="text-[10px] bg-success-green/10 text-success-green px-2 py-0.5 rounded-full font-bold">{submittedTasks.length}</span>
            </div>
            <button translate="no" className="material-symbols-outlined text-neutral-gray-400 hover:text-secondary text-[18px]">more_horiz</button>
          </div>
          
          {submittedTasks.length === 0 ? (
            <div className="text-center py-10 bg-neutral-gray-50/50 border border-neutral-gray-200/50 rounded-2xl">
              <p className="text-[10px] text-neutral-gray-400 font-bold">Aucune soumission encore effectuée</p>
            </div>
          ) : (
            submittedTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-neutral-gray-50 border border-neutral-gray-200 p-4 rounded-2xl cursor-pointer relative hover:border-success-green/40 transition-colors"
                onClick={() => triggerToast(`Ce devoir a été validé !`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-neutral-gray-200/70 text-secondary text-[9px] font-black px-2 py-0.5 rounded uppercase">
                    {task.coursLabel}
                  </span>
                  
                  <span translate="no" className="material-symbols-outlined text-success-green text-[18px]">check_circle</span>
                </div>
                
                <h5 className="font-bold text-xs text-neutral-gray-600 line-through mb-1 opacity-75">{task.titre}</h5>
                
                {task.note ? (
                  <div className="mt-2.5 pt-2 border-t border-neutral-gray-200 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-secondary">Note attribuée</span>
                    <span className="text-xs font-black text-success-green">Moy: {task.note}</span>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-2 border-t border-neutral-gray-200 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-secondary">Correction</span>
                    <span className="text-[9px] font-black text-brand-red-deep bg-[#FFF8F7] px-2 py-0.5 rounded-lg border border-[#B3181C]/5">En attente</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
