import { useState, useEffect, useCallback } from 'react';
import { Homework, CreateHomeworkCommand } from '../domain/Homework';
import { 
  getHomeworksUseCase, 
  addHomeworkUseCase, 
  submitHomeworkUseCase,
  startHomeworkUseCase,
  advanceHomeworkProgressUseCase
} from '../infrastructure/config/dependencies';

export function useHomeworks() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeworks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHomeworksUseCase();
      setHomeworks(data);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Impossible de charger les devoirs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHomeworks();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHomeworks]);

  const addHomework = async (cmd: CreateHomeworkCommand) => {
    setIsAdding(true);
    setError(null);
    try {
      await addHomeworkUseCase(cmd);
      await fetchHomeworks();
      return true;
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || "Erreur de création du devoir");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const startHomework = async (id: string) => {
    try {
      await startHomeworkUseCase(id);
      await fetchHomeworks();
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || "Erreur lors du démarrage du devoir");
    }
  };

  const advanceProgress = async (id: string, amount: number) => {
    try {
      await advanceHomeworkProgressUseCase(id, amount);
      await fetchHomeworks();
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || "Erreur lors de la mise à jour de la progression");
    }
  };

  const submitHomework = async (id: string, file: File | Blob) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitHomeworkUseCase(id, file);
      await fetchHomeworks();
      return true;
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || "Erreur de soumission du devoir");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    homeworks,
    isLoading,
    isAdding,
    isSubmitting,
    error,
    addHomework,
    submitHomework,
    startHomework,
    advanceProgress,
    fetchHomeworks
  };
}

