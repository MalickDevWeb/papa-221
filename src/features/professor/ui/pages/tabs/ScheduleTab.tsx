import React from 'react';
import type { useProfessorDashboardPage } from '../../../hooks/useProfessorDashboardPage';
import { ProfessorScheduleView } from '../../components/ProfessorScheduleView';

type ViewModel = ReturnType<typeof useProfessorDashboardPage>;

interface Props {
  readonly vm: ViewModel;
}

export function ScheduleTab({ vm }: Props) {
  return (
    <ProfessorScheduleView
      schedule={vm.schedule}
      handleCancelCourse={vm.handleCancelCourse}
      handleRescheduleCourse={vm.handleRescheduleCourse}
      onEnterCourse={vm.handleEnterCourse}
      liveSessions={vm.liveSessions}
    />
  );
}
