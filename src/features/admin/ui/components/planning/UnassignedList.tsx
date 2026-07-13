import React from 'react';
import { UnassignedCourse } from '../../../domain/PlanningModels';

interface Props {
  unassigned: UnassignedCourse[];
  setDraggedId: (id: string | null) => void;
}

export function UnassignedList({ unassigned, setDraggedId }: Props) {
  return (
    <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div>
        <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Cours en Attente</h4>
        <p className="text-[9px] text-neutral-400 font-bold">Glissez les cours dans le calendrier.</p>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto no-scrollbar">
        {unassigned.length === 0 ? (
          <div className="text-center py-8 text-neutral-300 font-black text-[10px] uppercase tracking-wider">
            Tout est planifié ! ✨
          </div>
        ) : (
          unassigned.map((course) => (
            <div
              key={course.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('courseId', course.id);
                setDraggedId(course.id);
              }}
              onDragEnd={() => setDraggedId(null)}
              className="bg-white border border-neutral-200 hover:border-[#B3181C] p-3 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md transition-all space-y-1.5"
            >
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-xs text-[#1E293B] leading-tight">
                  {course.subject}
                </span>
                <span className="text-[8px] font-black bg-neutral-100 text-neutral-500 px-1 py-0.5 rounded uppercase">
                  {course.duration}
                </span>
              </div>
              <div className="text-[9px] text-neutral-400 font-black uppercase leading-none">
                {course.classe}
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-neutral-500 pt-1.5 border-t border-neutral-100">
                <span>{course.prof}</span>
                <span className="bg-neutral-100 text-[#1E293B] font-black px-1.5 py-0.5 rounded text-[8px]">
                  {course.room}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
