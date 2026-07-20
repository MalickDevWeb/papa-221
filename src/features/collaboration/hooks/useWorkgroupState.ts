import { useState, useEffect, useCallback } from 'react';
import { Workgroup, GroupMember } from '../domain/CollaborationModels';
import { subscribeWorkgroups, saveWorkgroup } from '../infrastructure/groupService';
import { apiClient } from '@/shared/lib/apiClient';

export function useWorkgroupState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [workgroups, setWorkgroups] = useState<readonly Workgroup[]>([]);

  useEffect(() => {
    return subscribeWorkgroups((groups) => {
      setWorkgroups(groups);
    });
  }, []);

  const createManualGroup = useCallback(async (
    name: string,
    description: string,
    classId: string,
    leader: GroupMember,
    members: readonly GroupMember[]
  ) => {
    const newGroup: Workgroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      creationDate: new Date().toLocaleDateString('fr-FR'),
      leaderId: leader.id,
      leaderName: leader.name,
      members,
      projects: ['Projet Académique'],
      classId,
    };
    await saveWorkgroup(newGroup);
    triggerToast(`Groupe de travail "${name}" créé avec succès !`, true);
  }, [triggerToast]);

  const generateAutoGroups = useCallback(async (
    baseName: string,
    classId: string,
    criterion: string,
    targetCount: number
  ) => {
    try {
      await apiClient.post('/collaboration/workgroups', {
        name: baseName,
        classId,
        type: 'balanced',
        criteria: criterion,
        numGroups: targetCount
      });
      triggerToast(`Groupes équilibrés créés automatiquement par critère ${criterion} !`, true);
    } catch (e) {
      console.error(e);
      triggerToast('Erreur lors de la génération automatique des groupes.', false);
    }
  }, [triggerToast]);

  const changeGroupLeader = useCallback(async (groupId: string, newLeaderId: string, newLeaderName: string) => {
    const existing = workgroups.find((g) => g.id === groupId);
    if (existing) {
      const updated = { ...existing, leaderId: newLeaderId, leaderName: newLeaderName };
      await saveWorkgroup(updated);
      triggerToast('Le chef de groupe a été mis à jour avec succès.', true);
    }
  }, [workgroups, triggerToast]);

  return { workgroups, createManualGroup, generateAutoGroups, changeGroupLeader };
}
