import React, { useState } from 'react';
import { ArrowLeft, BookOpen, PenTool, Award, Users, Bell, GraduationCap } from 'lucide-react';
import { ProfessorAttendanceSection } from './classroom/ProfessorAttendanceSection';
import { ProfessorClassroomHeader } from './classroom/ProfessorClassroomHeader';
import { ProfessorLessonReminderForms } from './classroom/ProfessorLessonReminderForms';
import { ProfessorModuleForm } from './classroom/ProfessorModuleForm';
import { ProfessorModuleList } from './classroom/ProfessorModuleList';
import { ProfessorPublishedLists } from './classroom/ProfessorPublishedLists';
import { ProfessorClassroomCards } from './classroom/ProfessorClassroomCards';
import { ProfessorLiveMeetPanel } from './classroom/ProfessorLiveMeetPanel';
import { ProfessorHomeworkView } from './ProfessorHomeworkView';
import { ProfessorGradesView } from './ProfessorGradesView';
import { ModuleDetailModal } from './classroom/ModuleDetailModal';
import type { ClassroomProps } from './classroom/ClassroomProps';

const EMPTY_ATTENDANCE = {};

const CLASSROOM_TABS = [
  { id: 'modules', label: 'Chapitres', icon: BookOpen },
  { id: 'homework', label: 'Devoirs', icon: PenTool },
  { id: 'grades', label: 'Notes', icon: Award },
  { id: 'attendance', label: 'Appel', icon: Users },
  { id: 'announcements', label: 'Rappels', icon: Bell },
] as const;

export function ProfessorClassroomView(props: ClassroomProps) {
  const [localSubTab, setLocalSubTab] = useState<typeof CLASSROOM_TABS[number]['id']>('modules');
  const subTab = props.classroomSubTab ?? localSubTab;
  const setSubTab = props.setClassroomSubTab ?? setLocalSubTab;

  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    setSelectedModule(null);
  }, [props.selectedCourse?.id]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    setIsMobile(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const tabStyles: Record<string, React.CSSProperties> = {
    modules: {
      width: '88.1406px',
      height: '30px',
      paddingLeft: '3px',
    },
    homework: {
      width: '77.1641px',
      height: '27px',
      paddingLeft: '4px',
    },
    grades: {
      height: '25px',
      width: '66.2266px',
    },
    attendance: {
      width: '68.9453px',
      paddingLeft: '4px',
      height: '26px',
      marginLeft: '0px',
      marginBottom: '1px',
      marginTop: '1px',
    },
    announcements: {
      width: '75.4688px',
      height: '27px',
    },
  };

  if (!props.selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center gap-4 select-none">
          <div className="h-12 w-12 bg-[#FFF5F5] rounded-2xl flex items-center justify-center text-[#B3181C] border border-[#B3181C]/10 shrink-0">
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#291715] tracking-tight">Veuillez entrer dans une Salle de Classe</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-0.5">Sélectionnez l&apos;un de vos cours ci-dessous pour démarrer la session.</p>
          </div>
        </div>
        <ProfessorClassroomCards courses={props.courses} selectedCourseId="" onSelectCourse={props.onSelectCourse} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        style={{
          paddingLeft: '9px',
          paddingRight: '5px',
          paddingTop: '1px',
          paddingBottom: '8px',
        }}
        className="md:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-neutral-100 shadow-sm"
      >
        <button
          onClick={() => props.onSelectCourse('')}
          style={{
            height: '33px',
            width: '166.719px',
            paddingLeft: '6px',
            paddingRight: '14px',
            marginLeft: '0px',
            marginRight: '1px',
            zIndex: 1000,
            position: 'relative',
          }}
          className="relative flex items-center gap-2 text-xs font-black text-[#B3181C] hover:text-[#6B0E10] transition-all cursor-pointer bg-[#FFF5F5] px-4 py-2.5 rounded-xl border border-[#B3181C]/10 hover:border-[#B3181C]/30 hover:scale-102 active:scale-98"
        >
          <ArrowLeft className="h-4 w-4" /> Changer de classe
        </button>
        <div className="text-left flex items-center gap-3">
          <div>
            <h3 
              style={{ fontSize: '12px' }}
              className="font-black text-[#291715] flex items-center gap-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-brand-red-deep animate-pulse shrink-0" />
              {props.selectedCourse.titre} <span className="text-neutral-400 font-bold">({props.selectedCourse.salle})</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="md:hidden flex gap-1.5 overflow-x-auto no-scrollbar bg-neutral-100 p-1.5 rounded-2xl border border-neutral-150/50 shrink-0">
        {CLASSROOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={tabStyles[tab.id]}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-brand-red-deep shadow-sm border border-neutral-200/40'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in">
        <div style={isMobile ? { width: '343px', maxWidth: '100%' } : undefined}>
          {subTab === 'modules' && (
            selectedModule ? (
              <ModuleDetailModal
                module={selectedModule}
                students={props.students}
                onClose={() => setSelectedModule(null)}
                onModulesUpdated={() => {}}
              />
            ) : (
              <div className="space-y-6">
                <ProfessorClassroomHeader {...props} />
                {props.selectedCourse && (
                  <ProfessorLiveMeetPanel
                    selectedCourse={props.selectedCourse}
                    triggerToast={props.triggerToast || (() => {})}
                    profName={props.profName || 'Enseignant'}
                  />
                )}
                <ProfessorModuleForm {...props} />
                <ProfessorModuleList 
                  modules={props.modules} 
                  students={props.students} 
                  onSelectModule={setSelectedModule}
                />
              </div>
            )
          )}
          {subTab === 'homework' && <ProfessorHomeworkView {...props} />}
          {subTab === 'grades' && <ProfessorGradesView {...props} />}
          {subTab === 'attendance' && (
            <ProfessorAttendanceSection
              students={props.students}
              attendance={props.attendance ?? EMPTY_ATTENDANCE}
              onMarkAttendance={props.onMarkAttendance}
            />
          )}
          {subTab === 'announcements' && (
            <div className="space-y-6">
              <ProfessorLessonReminderForms {...props} />
              <ProfessorPublishedLists reminders={props.reminders} lessons={props.lessons} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
