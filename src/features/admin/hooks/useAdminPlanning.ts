import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminSession } from '../domain/AdminModels';
import { ApiAdminRepository } from '../infrastructure/ApiAdminRepository';
import { ManageAdminUseCase } from '../usecases/ManageAdminUseCase';

export function useAdminPlanning() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(false);

  const useCase = useMemo(() => new ManageAdminUseCase(new ApiAdminRepository()), []);

  const chargerSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await useCase.fetchSchedule();
      setSessions(data);
    } catch (err) {
      console.error('Erreur récupération planning:', err);
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  const reprogrammerSession = async (id: string, update: { jourComplet: string; heureStr: string; salle: string }) => {
    try {
      await useCase.updateSessionPlanning(id, update);
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
