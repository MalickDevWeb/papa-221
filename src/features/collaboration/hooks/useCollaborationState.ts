import { useState, useCallback } from 'react';
import { useVirtualClassState } from './useVirtualClassState';
import { useWorkgroupState } from './useWorkgroupState';
import { useGroupWorkspaceState } from './useGroupWorkspaceState';

export function useCollaborationState() {
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const triggerToast = useCallback((message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const virtualClassState = useVirtualClassState(triggerToast);
  const workgroupState = useWorkgroupState(triggerToast);
  const workspaceState = useGroupWorkspaceState(triggerToast);

  return {
    toast,
    triggerToast,
    ...virtualClassState,
    ...workgroupState,
    ...workspaceState,
  };
}
