import { useState, useEffect, useCallback } from 'react';
import type { AdminSession } from '../domain/AdminModels';
import { manageAdminUseCase } from '../infrastructure/config/dependencies';

export function useAdminPlanning() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(false);

  const chargerSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await manageAdminUseCase.fetchSchedule();
      setSessions(data);
    } catch (err) {
      console.error('Erreur récupération planning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reprogrammerSession = async (
    id: string,
    update: { jourComplet: string; heureStr: string; salle: string }
  ) => {
    try {
      await manageAdminUseCase.updateSessionPlanning(id, update);
      await chargerSessions();
      return true;
    } catch (err) {
      console.error('Erreur lors de la reprogrammation:', err);
      return false;
    }
  };

  useEffect(() => {
    chargerSessions();
  }, [chargerSessions]);

  return {
    sessions,
    loading,
    reprogrammerSession
  };
}
