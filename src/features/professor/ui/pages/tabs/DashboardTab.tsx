import React from 'react';
import type { useProfessorDashboardPage } from '../../../hooks/useProfessorDashboardPage';
import { ProfessorDashboardView } from '../../components/ProfessorDashboardView';

type ViewModel = ReturnType<typeof useProfessorDashboardPage>;

interface Props {
  readonly vm: ViewModel;
}

export function DashboardTab({ vm }: Props) {
  const classAvg = vm.grades.length > 0
    ? Math.round((vm.grades.reduce((sum, g) => sum + g.finalGrade, 0) / vm.grades.length) * 10) / 10
    : 0;

  return (
    <ProfessorDashboardView
      profName={vm.profName}
      courses={vm.courses}
      homeworksCount={vm.homeworks.length}
      validatedGrades={vm.grades.filter((g) => g.status === 'Validé').length}
      classAvg={classAvg}
      schedule={vm.schedule}
      students={vm.students}
      onMarkAttendance={vm.handleMarkAttendance}
      onEnterCourse={vm.handleEnterCourse}
    />
  );
}
