import React from 'react';
import { CourseModalHeader } from './CourseModalHeader';
import { CourseModalLeftColumn } from './CourseModalLeftColumn';
import { CourseModalRightColumn } from './CourseModalRightColumn';

const LEVEL_LABELS: Record<string, string> = {
  L3GL: 'L3 developpement Web',
  L2SR: 'L2 Systèmes & Réseaux',
  M1IA: 'M1 Intelligence Artificielle',
};

export function CourseModal({ state }: { readonly state: any }) {
  const { selectedCourse } = state;
  if (!selectedCourse) return null;

  const classLabel = LEVEL_LABELS[state.level] || 'L3 developpement Web';

  return (
    <div 
      className="fixed inset-0 z-[250] flex items-center justify-center bg-zinc-950/45 backdrop-blur-xs p-4 select-none animate-fade-in"
      onClick={() => state.setSelectedCourse(null)}
    >
      <div 
        className="bg-white rounded-[28px] border border-neutral-200 max-w-2xl w-full flex flex-col justify-start overflow-hidden shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <CourseModalHeader 
          selectedCourse={selectedCourse} 
          classLabel={classLabel} 
          onClose={() => state.setSelectedCourse(null)} 
        />

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <CourseModalLeftColumn 
              selectedCourse={selectedCourse} 
              state={state} 
            />
            <CourseModalRightColumn 
              selectedCourse={selectedCourse} 
              state={state} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
