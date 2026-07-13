import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminStats, AdminStudent, AdminProfessor, AdminPromotion } from '../domain/AdminModels';
import { ApiAdminRepository } from '../infrastructure/ApiAdminRepository';
import { ManageAdminUseCase } from '../usecases/ManageAdminUseCase';

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [professors, setProfessors] = useState<AdminProfessor[]>([]);
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(false);

  const useCase = useMemo(() => new ManageAdminUseCase(new ApiAdminRepository()), []);

  const chargerDonnees = useCallback(async () => {
    setLoading(true);
    try {
      const [sData, uData] = await Promise.all([
        useCase.fetchStats(),
        useCase.fetchUsers()
      ]);
      setStats(sData);
      setStudents(uData.students || []);
      setProfessors(uData.professors || []);
      setPromotions(uData.promotions || []);
    } catch (err) {
      console.error('Erreur lors du chargement des données d\'administration:', err);
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  const ajouterEtudiant = async (e: { name: string; matricule: string; promotion_id: string }) => {
    try {
      await useCase.createStudent(e);
      await chargerDonnees();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const supprimerEtudiant = async (id: string) => {
    try {
      const success = await useCase.removeStudent(id);
      if (success) await chargerDonnees();
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const ajouterProfesseur = async (p: { name: string; email: string }) => {
    try {
      await useCase.createProfessor(p);
      await chargerDonnees();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const supprimerProfesseur = async (id: string) => {
    try {
      const success = await useCase.removeProfessor(id);
      if (success) await chargerDonnees();
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const modifierPaiement = async (id: string, status: string) => {
    try {
      await useCase.setStudentPaymentStatus(id, status);
      await chargerDonnees();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  return {
    stats,
    students,
    professors,
    promotions,
    loading,
    ajouterEtudiant,
    supprimerEtudiant,
    ajouterProfesseur,
    supprimerProfesseur,
    modifierPaiement,
    chargerDonnees
  };
}
