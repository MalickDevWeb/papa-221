import React from 'react';
import { Homework } from '../../domain/Homework';
import { HomeworkCard } from './HomeworkCard';

interface Props {
  readonly title: string;
  readonly dotColor: string;
  readonly badgeBg: string;
  readonly badgeText: string;
  readonly tasks: Homework[];
  readonly emptyMessage: string;
  readonly onStart?: (id: string) => void;
  readonly onAdvance?: (id: string, amount: number) => void;
  readonly onSubmitClick?: (id: string) => void;
  readonly triggerToast?: (message: string) => void;
}

export function HomeworkColumn({
  title,
  dotColor,
  badgeBg,
  badgeText,
  tasks,
  emptyMessage,
  onStart,
  onAdvance,
  onSubmitClick,
  triggerToast
}: Props) {
  // Sort tasks: Urgent (haute) first!
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.prio === 'haute' && b.prio !== 'haute') return -1;
    if (a.prio !== 'haute' && b.prio === 'haute') return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-3 sm:gap-4.5 sm:min-h-[400px] min-h-0">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
          <h4 className="font-extrabold text-xs text-[#291715] uppercase tracking-wider">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeBg} ${badgeText}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-6 sm:py-10 bg-neutral-gray-50/50 border border-neutral-gray-200/50 rounded-2xl">
            <p className="text-[10px] text-neutral-gray-400 font-bold">{emptyMessage}</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <HomeworkCard
              key={task.id}
              task={task}
              onStart={onStart}
              onAdvance={onAdvance}
              onSubmitClick={onSubmitClick}
              triggerToast={triggerToast}
            />
          ))
        )}
      </div>
    </div>
  );
}
