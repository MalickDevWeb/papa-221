import { useState, useCallback } from 'react';
import { Workgroup, GroupMember } from '../domain/CollaborationModels';
import { INITIAL_WORKGROUPS, COLLAB_STUDENTS_MOCK } from '../domain/CollaborationMockData';
import { splitIntoBalancedGroups, GroupingCriterion } from '../domain/CollaborationAlgorithms';

export function useWorkgroupState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [workgroups, setWorkgroups] = useState<readonly Workgroup[]>(INITIAL_WORKGROUPS);

  const createManualGroup = useCallback((name: string, description: string, classId: string, leader: GroupMember, members: readonly GroupMember[]) => {
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
    setWorkgroups((prev) => [...prev, newGroup]);
    triggerToast(`Groupe de travail "${name}" créé avec succès !`, true);
  }, [triggerToast]);

  const generateAutoGroups = useCallback((
    baseName: string,
    classId: string,
    criterion: GroupingCriterion,
    targetCount: number,
    leaderSelection: 'random' | 'gpa' | 'teacher'
  ) => {
    const students = COLLAB_STUDENTS_MOCK;
    const splitGroups = splitIntoBalancedGroups(students, targetCount, criterion);

    const newGroups = splitGroups.map((groupStudents, i) => {
      let leader = groupStudents[0];
      if (leaderSelection === 'gpa') {
        leader = [...groupStudents].sort((a, b) => b.gpa - a.gpa)[0];
      } else if (leaderSelection === 'random') {
        leader = groupStudents[Math.floor(Math.random() * groupStudents.length)];
      }

      return {
        id: `group-auto-${Date.now()}-${i}`,
        name: `${baseName} - Groupe ${i + 1}`,
        description: `Groupe généré par algorithme répartiteux (${criterion})`,
        creationDate: new Date().toLocaleDateString('fr-FR'),
        leaderId: leader?.id || '',
        leaderName: leader?.name || 'Aucun',
        members: groupStudents,
        projects: ['Projet Automatique'],
        classId,
      };
    });

    setWorkgroups((prev) => [...prev, ...newGroups]);
    triggerToast(`${newGroups.length} groupes équilibrés créés automatiquement par l'algorithme !`, true);
  }, [triggerToast]);

  const changeGroupLeader = useCallback((groupId: string, newLeaderId: string, newLeaderName: string) => {
    setWorkgroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, leaderId: newLeaderId, leaderName: newLeaderName } : g))
    );
    triggerToast('Le chef de groupe a été mis à jour avec succès.', true);
  }, [triggerToast]);

  return { workgroups, createManualGroup, generateAutoGroups, changeGroupLeader };
}
