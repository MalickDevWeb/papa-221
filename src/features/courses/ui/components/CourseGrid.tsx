import React from 'react';
import { CoursItem } from './types';
import { CourseCard } from './CourseCard';

interface CourseGridProps {
  coursFiltrés: CoursItem[];
  setActiveDetailCourse: (cours: CoursItem) => void;
}

export function CourseGrid({ coursFiltrés, setActiveDetailCourse }: CourseGridProps) {
  if (coursFiltrés.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white/80 border border-neutral-gray-200 rounded-3xl space-y-3">
        <span translate="no" className="material-symbols-outlined text-neutral-gray-400 text-5xl">folder_off</span>
        <p className="font-bold text-on-surface">Aucun cours ne correspond à vos critères.</p>
        <p className="text-xs text-neutral-gray-500">Essayez de modifier votre recherche ou de réinitialiser les filtres.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
      {coursFiltrés.map((cours) => (
        <CourseCard
          key={cours.id}
          cours={cours}
          onSelect={setActiveDetailCourse}
        />
      ))}
    </div>
  );
}

