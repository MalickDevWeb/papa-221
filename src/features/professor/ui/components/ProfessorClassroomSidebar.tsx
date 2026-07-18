import React from 'react';
import { ArrowLeft, Users, BookOpen, PenTool, Award } from 'lucide-react';
import { ProfessorProfileSection } from './ProfessorProfileSection';

interface ClassroomSidebarProps {
  readonly selectedCourse: any;
  readonly onSelectCourse: (id: string) => void;
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly classroomSubTab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements';
  readonly setClassroomSubTab: (tab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements') => void;
  readonly schedule: readonly any[];
  readonly profName?: string;
  readonly initials?: string;
  readonly onLogout?: () => void;
}

export function ProfessorClassroomSidebar({
  selectedCourse,
  onSelectCourse,
  activeTab,
  onSelectTab,
  classroomSubTab,
  setClassroomSubTab,
  schedule,
  profName,
  initials,
  onLogout,
}: ClassroomSidebarProps) {
  const classSessions = schedule.filter(
    (s) => s && selectedCourse && (s.courseId === selectedCourse.id || (s.courseTitle || "").toLowerCase() === (selectedCourse.titre || "").toLowerCase())
  );

  const handleSubTabClick = (subTab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements') => {
    onSelectTab('classroom');
    setClassroomSubTab(subTab);
  };

  return (
    <aside className="hidden md:flex flex-col h-screen pb-6 gap-4 bg-surface-container-low border-r border-neutral-gray-250 w-64 fixed left-0 top-0 z-50 px-4 select-none overflow-y-auto no-scrollbar animate-fade-in">
      {/* Header */}
      <div className="pt-5 shrink-0">
        <div 
          style={{
            paddingLeft: '11px',
            paddingRight: '1px',
            paddingTop: '7px',
            paddingBottom: '9px',
            marginLeft: '0px',
            marginTop: '-13px',
            marginRight: '0px',
            marginBottom: '0px',
          }}
          className="bg-gradient-to-br from-brand-red-deep to-[#8e1215] text-white rounded-2xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <span className="text-[8.5px] font-black uppercase tracking-wider text-white/95">Saisie active</span>
          </div>
          <h3 className="font-sans font-black text-xs leading-tight tracking-tight line-clamp-1">{selectedCourse.classe || 'L3-GL'}</h3>
          <p className="text-[10px] text-white/70 font-semibold truncate mt-0.5">{selectedCourse.titre}</p>
          <div className="mt-2 text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded inline-block">Salle: {selectedCourse.salle}</div>
        </div>
      </div>

      <button 
        onClick={() => onSelectCourse('')} 
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-neutral-50 text-brand-red-deep text-xs font-black rounded-xl border border-neutral-gray-200 hover:border-brand-red-deep/30 transition-all cursor-pointer shadow-3xs shrink-0"
      >
        <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" /> Quitter la classe
      </button>

      {/* Navigation */}
      <div className="flex-grow space-y-4">
        <div>
          <span className="px-3 text-[10px] font-black uppercase text-[#64748B] tracking-wider block mb-1.5">Espace pédagogique</span>
          <nav className="flex flex-col gap-1">
            {[
              { id: 'attendance', label: 'Présence & Appel', icon: Users },
              { id: 'modules', label: 'Chapitres & Supports', icon: BookOpen },
              { id: 'homework', label: 'Devoirs de classe', icon: PenTool },
              { id: 'grades', label: 'Notes d\'Évaluation', icon: Award },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === 'classroom' && classroomSubTab === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => handleSubTabClick(item.id as any)} 
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all text-left cursor-pointer border-0 ${
                    isActive 
                      ? 'bg-primary-container text-on-primary-container font-black shadow-3xs' 
                      : 'text-secondary hover:bg-secondary-container/50 hover:translate-x-1 font-semibold'
                  }`}
                >
                  <IconComp className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sessions */}
        {classSessions.length > 0 && (
          <div className="border-t border-neutral-gray-200 pt-3">
            <span className="px-3 text-[10px] font-black uppercase text-[#64748B] tracking-wider block mb-2">Séances pour la classe</span>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto no-scrollbar">
              {classSessions.map((session) => (
                <div key={session.id} className="p-2.5 bg-white border border-neutral-200/60 rounded-xl flex flex-col justify-between shadow-3xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[8px] font-black text-brand-red-deep bg-[#FFF5F5] px-1 rounded">{session.day}</span>
                    <span className="text-[8px] font-black uppercase text-neutral-400">{session.type}</span>
                  </div>
                  <h4 className="text-[9.5px] font-black text-neutral-700 truncate">{session.courseTitle}</h4>
                  <div className="flex items-center justify-between text-[8.5px] text-neutral-400 font-bold mt-1">
                    <span>{session.time}</span>
                    <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded text-[7.5px]">Confirmé</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {profName && initials && onLogout && (
        <ProfessorProfileSection 
          profName={profName} 
          initials={initials} 
          onLogout={onLogout} 
        />
      )}
    </aside>
  );
}
