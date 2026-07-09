import React, { useEffect, useRef } from 'react';
import { DAYS_ORDER } from './CalendarData';
import { getNextCourse } from './CalendarUtils';
import { WeeklyCard } from './WeeklyCard';

export function WeeklyView({ state }: { readonly state: any }) {
  const nextCourse = getNextCourse(state.displayedSessions);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      const cards = Array.from(containerRef.current?.children || []) as HTMLElement[];
      if (cards.length === 0) return;

      // 1. Try to find a card that is live/direct
      let target = cards.find((card) => card.getAttribute('data-direct') === 'true');

      // 2. Try next course card
      if (!target) {
        target = cards.find((card) => card.getAttribute('data-next') === 'true');
      }

      // 3. Try today's card
      if (!target) {
        target = cards.find((card) => card.getAttribute('data-today') === 'true');
      }

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [state.displayedSessions, nextCourse]);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 h-full items-stretch">
      {DAYS_ORDER.map((dayObj) => {
        const session = state.displayedSessions.find((s: any) => s.jour === dayObj.key);
        const isToday = dayObj.key === 'MER';

        return (
          <WeeklyCard
            key={dayObj.key}
            dayKey={dayObj.key}
            dayName={dayObj.name}
            session={session}
            isToday={isToday}
            nextCourse={nextCourse}
            onSelect={state.handleSelectCourse}
          />
        );
      })}
    </div>
  );
}
