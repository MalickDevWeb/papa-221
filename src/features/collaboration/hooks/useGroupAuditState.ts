import { useState, useEffect, useCallback } from 'react';
import { AuditLog, GroupEvaluation } from '../domain/TaskWikiModels';
import { subscribeAudits, saveAudit } from '../infrastructure/wikiService';
import { subscribeEvaluations, saveEvaluation } from '../infrastructure/groupService';

export function useGroupAuditState(triggerToast: (msg: string, isSuccess: boolean) => void) {
  const [audits, setAudits] = useState<readonly AuditLog[]>([]);
  const [evaluations, setEvaluations] = useState<readonly GroupEvaluation[]>([]);

  useEffect(() => {
    const unsubAudits = subscribeAudits(setAudits);
    const unsubEvals = subscribeEvaluations(setEvaluations);
    return () => {
      unsubAudits();
      unsubEvals();
    };
  }, []);

  const addAuditLog = useCallback(async (groupId: string, userName: string, action: string) => {
    const timestamp = new Date().toLocaleString('fr-FR');
    const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      groupId,
      timestamp,
      userName,
      action,
      ipAddress: randomIp,
    };
    await saveAudit(newLog);
  }, []);

  const addEvaluation = useCallback(async (
    groupId: string,
    groupGrade: number | undefined,
    individualGrades: Record<string, number>,
    feedback: string,
    criteria: GroupEvaluation['criteria'],
    gradedBy: string
  ) => {
    const newEval: GroupEvaluation = {
      id: `eval-${Date.now()}`,
      groupId,
      groupGrade,
      individualGrades,
      feedback,
      criteria,
      gradedBy,
    };
    await saveEvaluation(newEval);
    triggerToast('Évaluation du groupe enregistrée avec succès !', true);
  }, [triggerToast]);

  return {
    audits,
    evaluations,
    addAuditLog,
    addEvaluation,
  };
}
export default useGroupAuditState;
