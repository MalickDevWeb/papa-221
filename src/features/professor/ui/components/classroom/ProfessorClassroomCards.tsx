import React from 'react';
import type { ProfessorCourse } from '../../../domain/ProfessorModels';
import { ProfessorClassroomCard } from './ProfessorClassroomCard';

interface Props {
  readonly courses: readonly ProfessorCourse[];
  readonly selectedCourseId: string;
  readonly onSelectCourse: (id: string) => void;
}

export function ProfessorClassroomCards({ courses, selectedCourseId, onSelectCourse }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-black text-neutral-800 tracking-tight">Mes Salles de Classe</h3>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Sélectionnez la salle de classe active pour en voir les ressources et l&apos;appel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <ProfessorClassroomCard
            key={course.id}
            course={course}
            isSelected={selectedCourseId === course.id}
            onSelect={onSelectCourse}
          />
        ))}
      </div>
    </div>
  );
}

