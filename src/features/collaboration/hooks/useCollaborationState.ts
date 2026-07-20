import { useState, useCallback } from 'react';
import { useVirtualClassState } from './useVirtualClassState';
import { useWorkgroupState } from './useWorkgroupState';
import { useGroupWorkspaceState } from './useGroupWorkspaceState';
import { useGroupTasksState } from './useGroupTasksState';
import { useGroupWikiState } from './useGroupWikiState';
import { useGroupAuditState } from './useGroupAuditState';

export function useCollaborationState() {
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>('group-1');

  const triggerToast = useCallback((message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const virtualClassState = useVirtualClassState(triggerToast);
  const workgroupState = useWorkgroupState(triggerToast);
  const workspaceState = useGroupWorkspaceState(activeGroupId, triggerToast);
  const tasksState = useGroupTasksState(activeGroupId, triggerToast);
  const wikiState = useGroupWikiState(triggerToast);
  const auditState = useGroupAuditState(triggerToast);

  return {
    toast,
    triggerToast,
    activeGroupId,
    setActiveGroupId,
    ...virtualClassState,
    ...workgroupState,
    ...workspaceState,
    ...tasksState,
    ...wikiState,
    ...auditState,
  };
}
export default useCollaborationState;
