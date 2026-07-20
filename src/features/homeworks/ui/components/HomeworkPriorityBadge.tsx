import React from 'react';
import { Icon } from '@iconify/react';
import { HomeworkPriority } from '../../domain/Homework';

interface Props {
  readonly priority: HomeworkPriority;
}

export function HomeworkPriorityBadge({ priority }: Props) {
  if (priority === 'haute') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
        <Icon icon="lucide:alert-circle" className="h-3.5 w-3.5 text-white animate-pulse" />
        <span>Urgent</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-250 text-neutral-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
      <Icon icon="lucide:info" className="h-3.5 w-3.5 text-neutral-500" />
      <span>Normal</span>
    </span>
  );
}
