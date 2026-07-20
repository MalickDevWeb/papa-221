import React from 'react';
import { Homework } from '../../domain/Homework';
import { HomeworkPriorityBadge } from './HomeworkPriorityBadge';
import { HomeworkCardFooter } from './HomeworkCardFooter';

interface Props {
  readonly task: Homework;
  readonly onStart?: (id: string) => void;
  readonly onAdvance?: (id: string, amount: number) => void;
  readonly onSubmitClick?: (id: string) => void;
  readonly triggerToast?: (message: string) => void;
}

export function HomeworkCard({
  task,
  onStart,
  onAdvance,
  onSubmitClick,
  triggerToast
}: Props) {
  const isHigh = task.prio === 'haute';
  const borderClass = isHigh 
    ? 'border-l-4 border-l-red-500 border-y border-r border-red-100 bg-red-50/10' 
    : 'border-l-4 border-l-sky-500 border-y border-r border-sky-100 bg-sky-50/10';

  return (
    <div 
      id={`hw-card-${task.id}`}
      className={`bg-white p-4 rounded-r-2xl rounded-l-md shadow-3xs hover:shadow-2xs transition-all duration-300 group flex flex-col justify-between relative h-auto gap-4 ${borderClass}`}
    >
      <div className="flex flex-col gap-3">
        <div id={`hw-card-header-${task.id}`} className="flex justify-between items-center gap-2">
          <span id={`hw-card-course-${task.id}`} className="bg-neutral-gray-100 text-neutral-800 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
            {task.coursLabel}
          </span>
          <HomeworkPriorityBadge priority={task.prio} />
        </div>

        <div id={`hw-card-body-${task.id}`} className="space-y-1.5">
          <h5 id={`hw-card-title-${task.id}`} className="font-bold text-xs text-[#291715] group-hover:text-brand-red-deep transition-colors leading-tight">
            {task.titre}
          </h5>
          <p id={`hw-card-desc-${task.id}`} className="text-[11px] text-neutral-gray-550 leading-relaxed line-clamp-2">
            {task.desc}
          </p>
        </div>

        {task.statut === 'en_cours' && (
          <div id={`hw-card-progress-section-${task.id}`} className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-neutral-400">Progression</span>
              <span className={isHigh ? 'text-red-600' : 'text-sky-600'}>{task.progress || 0}%</span>
            </div>
            <div className="w-full bg-neutral-gray-150 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-red-500' : 'bg-sky-500'}`} 
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <HomeworkCardFooter
        task={task}
        onStart={onStart}
        onAdvance={onAdvance}
        onSubmitClick={onSubmitClick}
        triggerToast={triggerToast}
      />
    </div>
  );
}
