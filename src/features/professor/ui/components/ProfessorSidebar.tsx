import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import { ROUTES } from '@/shared/constants';

import { ProfessorSidebarHeader } from './ProfessorSidebarHeader';
import { ProfessorSidebarNav } from './ProfessorSidebarNav';
import { ProfessorSidebarClasses } from './ProfessorSidebarClasses';
import { ProfessorProfileSection } from './ProfessorProfileSection';
import { ProfessorClassroomSidebar } from './ProfessorClassroomSidebar';

interface Props {
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly profName: string;
  readonly triggerToast: (msg: string) => void;
  readonly courses: any[];
  readonly selectedCourseId: string;
  readonly onSelectCourse: (id: string) => void;
  readonly classroomSubTab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements';
  readonly setClassroomSubTab: (tab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements') => void;
  readonly schedule: readonly any[];
}

export function ProfessorSidebar({ 
  activeTab, 
  onSelectTab, 
  profName, 
  triggerToast,
  courses,
  selectedCourseId,
  onSelectCourse,
  classroomSubTab,
  setClassroomSubTab,
  schedule
}: Props) {
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();

  const initials = profName
    .replace('Dr.', '')
    .replace('Mme.', '')
    .trim()
    .split(/\s+/)
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    deconnexion();
    localStorage.removeItem('access_token');
    triggerToast('Déconnexion réussie !');
    setTimeout(() => navigate(ROUTES.login), 800);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  if (selectedCourse) {
    return (
      <ProfessorClassroomSidebar
        selectedCourse={selectedCourse}
        onSelectCourse={onSelectCourse}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        classroomSubTab={classroomSubTab}
        setClassroomSubTab={setClassroomSubTab}
        schedule={schedule}
        profName={profName}
        initials={initials}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <aside className="hidden md:flex flex-col h-screen pb-8 gap-4 bg-surface-container-low border-r border-neutral-gray-250 w-64 fixed left-0 top-0 z-50 px-4 select-none overflow-y-auto no-scrollbar">
      <ProfessorSidebarHeader onSelectTab={onSelectTab} />
      
      <ProfessorSidebarNav activeTab={activeTab} onSelectTab={onSelectTab} />

      <ProfessorSidebarClasses 
        courses={courses}
        selectedCourseId={selectedCourseId}
        activeTab={activeTab}
        onSelectCourse={onSelectCourse}
        onSelectTab={onSelectTab}
        triggerToast={triggerToast}
      />

      <ProfessorProfileSection 
        profName={profName} 
        initials={initials} 
        onLogout={handleLogout} 
      />
    </aside>
  );
}
