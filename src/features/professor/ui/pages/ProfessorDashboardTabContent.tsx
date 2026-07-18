import React from 'react';
import type { useProfessorDashboardPage } from '../../hooks/useProfessorDashboardPage';
import { DashboardTab } from './tabs/DashboardTab';
import { ClassroomTab } from './tabs/ClassroomTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { CollaborationPage } from '@/features/collaboration/ui/pages/CollaborationPage';

type ViewModel = ReturnType<typeof useProfessorDashboardPage>;

interface Props {
  readonly vm: ViewModel;
}

export function ProfessorDashboardTabContent({ vm }: Props) {
  return (
    <main className="p-4 md:p-8 max-w-[1280px] mx-auto w-full flex-grow animate-fade-in relative min-h-screen">
      {vm.activeTab === 'dashboard' && <DashboardTab vm={vm} />}
      {vm.activeTab === 'classroom' && <ClassroomTab vm={vm} />}
      {vm.activeTab === 'schedule' && <ScheduleTab vm={vm} />}
      {vm.activeTab === 'collaboration' && <CollaborationPage />}
    </main>
  );
}
