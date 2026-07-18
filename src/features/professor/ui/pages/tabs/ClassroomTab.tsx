import React from 'react';
import type { useProfessorDashboardPage } from '../../../hooks/useProfessorDashboardPage';
import { ProfessorClassroomView } from '../../components/ProfessorClassroomView';

type ViewModel = ReturnType<typeof useProfessorDashboardPage>;

interface Props {
  readonly vm: ViewModel;
}

export function ClassroomTab({ vm }: Props) {
  return (
    <ProfessorClassroomView
      courses={vm.courses}
      onSelectCourse={vm.selectCourse}
      selectedCourse={vm.selectedCourse}
      classroomSubTab={vm.classroomSubTab}
      setClassroomSubTab={vm.setClassroomSubTab}
      profName={vm.profName}
      triggerToast={vm.triggerToast}
      modules={vm.modules}
      reminders={vm.reminders}
      lessons={vm.lessons}
      students={vm.students}
      attendance={vm.attendance}
      onMarkAttendance={vm.handleMarkAttendance}
      activeModuleForLesson={vm.activeModuleForLesson}
      isAddingModule={vm.isAddingModule}
      newModuleTitle={vm.newModuleTitle}
      newModuleDesc={vm.newModuleDesc}
      lessonTitle={vm.lessonTitle}
      lessonDesc={vm.lessonDesc}
      lessonAttachment={vm.lessonAttachment}
      remContent={vm.remContent}
      remIsUrgent={vm.remIsUrgent}
      setIsAddingModule={vm.setIsAddingModule}
      setNewModuleTitle={vm.setNewModuleTitle}
      setNewModuleDesc={vm.setNewModuleDesc}
      setActiveModuleForLesson={vm.setActiveModuleForLesson}
      setLessonTitle={vm.setLessonTitle}
      setLessonDesc={vm.setLessonDesc}
      setLessonAttachment={vm.setLessonAttachment}
      setRemContent={vm.setRemContent}
      setRemIsUrgent={vm.setRemIsUrgent}
      handleCreateModule={vm.handleModuleSubmit}
      handleLessonSubmit={vm.handleLessonSubmit}
      handleReminderSubmit={vm.handleReminderSubmit}

      // Additional grades & homework states + handlers
      grades={vm.grades}
      editingGradeStudentId={vm.editingGradeStudentId}
      editCC={vm.editCC}
      editExam={vm.editExam}
      setEditCC={vm.setEditCC}
      setEditExam={vm.setEditExam}
      handleGradeEditStart={vm.handleGradeEditStart}
      handleGradeSave={vm.handleGradeSave}
      homeworks={vm.homeworks}
      hwTitle={vm.hwTitle}
      hwDesc={vm.hwDesc}
      hwPrio={vm.hwPrio}
      hwDeadline={vm.hwDeadline}
      setHwTitle={vm.setHwTitle}
      setHwDesc={vm.setHwDesc}
      setHwPrio={vm.setHwPrio}
      setHwDeadline={vm.setHwDeadline}
      handleHomeworkSubmit={vm.handleHomeworkSubmit}
    />
  );
}
