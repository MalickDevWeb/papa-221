import React from 'react';
import { ModuleDetailHeader } from './ModuleDetailHeader';
import { ModuleExerciseForm } from './ModuleExerciseForm';
import { ModuleExerciseList } from './ModuleExerciseList';
import { useModuleExercises } from '../../../hooks/useModuleExercises';
import type { CourseModule, StudentEnrolled } from '../../../domain/ProfessorModels';

interface Props {
  readonly module: CourseModule;
  readonly students: readonly StudentEnrolled[];
  readonly title: string;
  readonly description: string;
  readonly isDraft: boolean;
  readonly onTitleChange: (v: string) => void;
  readonly onDescriptionChange: (v: string) => void;
  readonly onToggleDraft: () => void;
  readonly onSaveModule: () => void;
}

export function ModuleGeneralSection({
  module,
  students,
  title,
  description,
  isDraft,
  onTitleChange,
  onDescriptionChange,
  onToggleDraft,
  onSaveModule,
}: Props) {
  const {
    exercises,
    addExercise,
    deleteExercise,
    toggleStudentComplete,
  } = useModuleExercises(module.id);

  return (
    <div className="space-y-6">
      <ModuleDetailHeader
        title={title}
        description={description}
        isDraft={isDraft}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onToggleDraft={onToggleDraft}
        onSaveModule={onSaveModule}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <ModuleExerciseForm
          students={students}
          onExerciseAdded={addExercise}
        />
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-[#291715] tracking-wider">
            Exercices personnalisés ({exercises.length})
          </h4>
          <ModuleExerciseList
            exercises={exercises}
            students={students}
            onDelete={deleteExercise}
            onToggleStudentComplete={toggleStudentComplete}
          />
        </div>
      </div>
    </div>
  );
}
