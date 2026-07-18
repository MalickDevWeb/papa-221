import { useState, useEffect } from 'react';
import { Room, Filiere, Classe, PlanningSlot } from '../../domain/SchoolModels';
import { apiClient } from '@/shared/lib/apiClient';

export function useAdminSchoolState() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [slots, setSlots] = useState<PlanningSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resRooms, resFilieres, resClasses, resSlots] = await Promise.all([
          apiClient.get('/planning/rooms'),
          apiClient.get('/planning/filieres'),
          apiClient.get('/planning/classes'),
          apiClient.get('/planning/slots'),
        ]);
        setRooms(resRooms.data);
        setFilieres(resFilieres.data);
        setClasses(resClasses.data);
        setSlots(resSlots.data);
      } catch (err) {
        console.error("Failed to load school management data from backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateRooms = async (newRooms: Room[]) => {
    setRooms(newRooms);
    try {
      await apiClient.put('/planning/rooms', newRooms);
    } catch (err) {
      console.error(err);
    }
  };

  const addFiliere = async (filiere: Filiere) => {
    const updated = [...filieres, filiere];
    setFilieres(updated);
    try {
      await apiClient.put('/planning/filieres', updated);
    } catch (err) {
      console.error(err);
    }
  };

  const updateFilieres = async (newFilieres: Filiere[]) => {
    setFilieres(newFilieres);
    try {
      await apiClient.put('/planning/filieres', newFilieres);
    } catch (err) {
      console.error(err);
    }
  };

  const addClasse = async (classe: Classe) => {
    const updated = [...classes, classe];
    setClasses(updated);
    try {
      await apiClient.put('/planning/classes', updated);
    } catch (err) {
      console.error(err);
    }
  };

  const updateClasses = async (newClasses: Classe[]) => {
    setClasses(newClasses);
    try {
      await apiClient.put('/planning/classes', newClasses);
    } catch (err) {
      console.error(err);
    }
  };

  const updateSlots = async (newSlots: PlanningSlot[]) => {
    setSlots(newSlots);
    try {
      await apiClient.put('/planning/slots', newSlots);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    rooms,
    updateRooms,
    filieres,
    addFiliere,
    updateFilieres,
    classes,
    addClasse,
    updateClasses,
    slots,
    updateSlots,
    loading,
  };
}
