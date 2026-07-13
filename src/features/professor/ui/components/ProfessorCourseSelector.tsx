import React from 'react';

interface ProfessorCourse {
  readonly id: string;
  readonly titre: string;
  readonly classe?: string;
}

interface Props {
  readonly courses: readonly ProfessorCourse[];
  readonly selectedCourseId: string;
  readonly activeTab: string;
  readonly onSelectCourse: (courseId: string) => void;
}

export function ProfessorCourseSelector({
  courses,
  selectedCourseId,
  activeTab,
  onSelectCourse,
}: Props) {
  if (!(activeTab === 'grades' || activeTab === 'homework' || activeTab === 'classroom')) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-3xl border border-neutral-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <span className="text-[10px] font-black uppercase text-brand-red-deep tracking-wider">Sélection de la classe active</span>
        <h3 className="text-sm font-black text-on-surface">Sélectionnez la matière à administrer :</h3>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={selectedCourseId}
          onChange={(e) => onSelectCourse(e.target.value)}
          className="bg-neutral-gray-50 border border-neutral-gray-350 rounded-xl px-4 py-2.5 text-xs font-black text-on-surface focus:outline-none focus:border-brand-red-deep cursor-pointer"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.classe ? `${course.classe} - ${course.titre}` : course.titre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
