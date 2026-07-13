import React from 'react';
import { useModuleHomework } from '../../../hooks/useModuleHomework';
import { HomeworkSidebar } from './HomeworkSidebar';
import { HomeworkGrader } from './HomeworkGrader';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';

interface Props {
  readonly moduleId: string;
  readonly students: readonly StudentEnrolled[];
}

export function ModuleHomeworkSection({ moduleId, students }: Props) {
  const {
    homeworks,
    grades,
    activeHomeworkId,
    setActiveHomeworkId,
    addHomework,
    deleteHomework,
    submitGrade,
  } = useModuleHomework(moduleId);

  const activeHw = homeworks.find((h) => h.id === activeHomeworkId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      <div className="lg:col-span-4">
        <HomeworkSidebar
          homeworks={homeworks}
          activeHomeworkId={activeHomeworkId}
          onSelectHomework={setActiveHomeworkId}
          onAddHomework={addHomework}
          onDeleteHomework={deleteHomework}
        />
      </div>
      <div className="lg:col-span-8">
        <HomeworkGrader
          homework={activeHw}
          students={students}
          grades={grades}
          onSaveGrade={(studentId, grade, feedback) => {
            if (activeHomeworkId) {
              submitGrade(activeHomeworkId, studentId, grade, feedback);
            }
          }}
        />
      </div>
    </div>
  );
}
