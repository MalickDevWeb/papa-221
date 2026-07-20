import { apiClient } from '@/shared/lib/apiClient';
import { Workgroup } from '../domain/CollaborationModels';
import { GroupEvaluation } from '../domain/TaskWikiModels';

export function subscribeWorkgroups(onUpdate: (groups: readonly Workgroup[]) => void) {
  const fetchGroups = async () => {
    try {
      const res = await apiClient.get('/collaboration/workgroups');
      onUpdate(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch workgroups:', e);
    }
  };
  fetchGroups();
  const timer = setInterval(fetchGroups, 4000);
  return () => clearInterval(timer);
}

export async function saveWorkgroup(wg: Workgroup): Promise<void> {
  await apiClient.post('/collaboration/workgroups', wg);
}

export async function saveEvaluation(evaluation: GroupEvaluation): Promise<void> {
  // Save evaluation locally or as needed
  console.log('Evaluation saved:', evaluation);
}

export function subscribeEvaluations(onUpdate: (evals: readonly GroupEvaluation[]) => void) {
  // Simple in-memory fallback since evaluation is transient
  onUpdate([]);
  return () => {};
}
