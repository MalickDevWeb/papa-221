import React from 'react';

interface ClassesProps {
  readonly courses: any[];
  readonly selectedCourseId: string;
  readonly activeTab: string;
  readonly onSelectCourse: (id: string) => void;
  readonly onSelectTab: (tab: string) => void;
  readonly triggerToast: (msg: string) => void;
}

export function ProfessorSidebarClasses({
  courses,
  selectedCourseId,
  activeTab,
  onSelectCourse,
  onSelectTab,
  triggerToast
}: ClassesProps) {
  return (
    <div className="my-2 border-t border-neutral-gray-250 pt-3 select-none">
      <span className="px-3 text-[10px] font-black uppercase text-[#64748B] tracking-wider block mb-2">Mes Classes</span>
      <div className="space-y-1">
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id && activeTab === 'classroom';
          return (
            <button
              key={course.id}
              onClick={() => {
                onSelectCourse(course.id);
                onSelectTab('classroom');
                triggerToast(`Classe : ${course.classe || course.titre}`);
              }}
              className={`w-full flex flex-row items-center gap-3 px-3 py-2 rounded-xl transition-all text-left cursor-pointer border-0 ${
                isSelected
                  ? 'bg-brand-red-deep/10 text-brand-red-deep border-l-2 border-brand-red-deep'
                  : 'text-secondary hover:bg-neutral-100 hover:translate-x-1'
              }`}
            >
              <span translate="no" className="material-symbols-outlined text-lg shrink-0">
                {isSelected ? 'co_present' : 'class'}
              </span>
              <div className="flex flex-col truncate min-w-0 flex-grow">
                <span className={`truncate text-xs font-black leading-tight ${isSelected ? 'text-brand-red-deep' : 'text-[#291715]'}`}>
                  {course.classe || 'L3-GL'}
                </span>
                <span className="truncate text-[10px] text-neutral-400 font-bold leading-tight mt-0.5">
                  {course.titre}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
