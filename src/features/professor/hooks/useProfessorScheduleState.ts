import { useState } from 'react';

export function useProfessorScheduleState() {
  const [cancellingSessionId, setCancellingSessionId] = useState<string | null>(null);
  const [reschedulingSessionId, setReschedulingSessionId] = useState<string | null>(null);
  const [rescheduleDay, setRescheduleDay] = useState('Lundi');
  const [rescheduleTime, setRescheduleTime] = useState('08:00 - 11:00');
  const [rescheduleRoom, setRescheduleRoom] = useState('Amphi A');
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  return {
    cancellingSessionId,
    setCancellingSessionId,
    reschedulingSessionId,
    setReschedulingSessionId,
    rescheduleDay,
    setRescheduleDay,
    rescheduleTime,
    setRescheduleTime,
    rescheduleRoom,
    setRescheduleRoom,
    scheduleError,
    setScheduleError,
  };
}
