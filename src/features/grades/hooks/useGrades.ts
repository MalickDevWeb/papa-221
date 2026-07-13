import { useState, useEffect } from 'react';
import { Grade, calculateMoyenneGenerale, calculateFinalNote } from '../domain/Grade';
import { getStudentGradesUseCase } from '../infrastructure/config/dependencies';

export function useGrades() {
  const [baseGrades, setBaseGrades] = useState<Grade[]>([]);
  const [simulatedGrades, setSimulatedGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGrades() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudentGradesUseCase();
        if (isMounted) {
          setBaseGrades(data);
          setSimulatedGrades(data); // Au départ, simulation = réalité
        }
      } catch (err) {
        if (isMounted) {
          const errorObj = err as Error;
          setError(errorObj.message || 'Impossible de récupérer les notes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchGrades();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fonction pour modifier la note d'un module en simulation
  const simulateGradeChange = (moduleName: string, type: 'cc' | 'examen', val: number) => {
    setSimulatedGrades(prev => prev.map(m => {
      if (m.module === moduleName) {
        return { ...m, [type]: val };
      }
      return m;
    }));
  };

  // Restaurer les vraies notes
  const resetSimulation = (moduleName?: string) => {
    if (moduleName) {
      setSimulatedGrades(prev => prev.map(m => {
        if (m.module === moduleName) {
          const original = baseGrades.find(b => b.module === moduleName);
          return original ? { ...m, cc: original.cc, examen: original.examen } : m;
        }
        return m;
      }));
    } else {
      setSimulatedGrades([...baseGrades]);
    }
  };

  // Calculs sur les notes simulées pour l'UI
  const totalECTS = simulatedGrades.reduce((sum, g) => sum + g.ects, 0);
  const averageMoyenne = calculateMoyenneGenerale(simulatedGrades);
  
  const calculatedGrades = simulatedGrades.map(g => ({
    module: g.module,
    prof: g.prof,
    ects: g.ects,
    note: calculateFinalNote(g.cc, g.examen),
    moyPromo: g.moyPromo,
  }));

  const validatedECTS = simulatedGrades.reduce((sum, g) => {
    const finalNote = calculateFinalNote(g.cc, g.examen);
    return finalNote >= 10 ? sum + g.ects : sum;
  }, 0);

  const currentGPA = (() => {
    if (averageMoyenne >= 16) return 4.0;
    if (averageMoyenne >= 14) return 3.7;
    if (averageMoyenne >= 12) return 3.3;
    if (averageMoyenne >= 10) return 3.0;
    return 0.0;
  })();

  return {
    grades: simulatedGrades, // On expose les simulées
    baseGrades,
    calculatedGrades,
    totalECTS,
    validatedECTS,
    averageMoyenne,
    currentGPA,
    isLoading,
    error,
    simulateGradeChange,
    resetSimulation
  };
}
