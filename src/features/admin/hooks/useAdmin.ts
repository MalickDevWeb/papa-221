import { useState, useEffect, useCallback } from 'react';
import type { AdminStats, AdminStudent, AdminProfessor, AdminPromotion } from '../domain/AdminModels';
import { manageAdminUseCase } from '../infrastructure/config/dependencies';

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [professors, setProfessors] = useState<AdminProfessor[]>([]);
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(false);

  const chargerDonnees = useCallback(async () => {
    setLoading(true);
    try {
      const [sData, uData] = await Promise.all([
        manageAdminUseCase.fetchStats(),
        manageAdminUseCase.fetchUsers()
      ]);
      setStats(sData);
      setStudents(uData.students || []);
      setProfessors(uData.professors || []);
      setPromotions(uData.promotions || []);
    } catch (err) {
      console.error("Erreur lors du chargement des données d'administration:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const ajouterEtudiant = async (e: { name: string; matricule: string; promotion_id: string }) => {
    try {
      await manageAdminUseCase.createStudent(e);
      await chargerDonnees();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const supprimerEtudiant = async (id: string) => {
    try {
      const success = await manageAdminUseCase.removeStudent(id);
      if (success) await chargerDonnees();
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const ajouterProfesseur = async (p: { name: string; email: string }) => {
    try {
      await manageAdminUseCase.createProfessor(p);
      await chargerDonnees();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const supprimerProfesseur = async (id: string) => {
    try {
      const success = await manageAdminUseCase.removeProfessor(id);
      if (success) await chargerDonnees();
      return success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const modifierPaiement = async (id: string, status: string) => {
    try {
      await manageAdminUseCase.setStudentPaymentStatus(id, status);
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
