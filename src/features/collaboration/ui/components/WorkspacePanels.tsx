import React, { useState } from 'react';
import { WorkspaceDashboard } from './WorkspaceDashboard';
import { WorkspaceKanban } from './WorkspaceKanban';
import { WorkspaceWiki } from './WorkspaceWiki';
import { GroupEvaluationPanel } from './GroupEvaluationPanel';
import { WorkspaceAuditLogs } from './WorkspaceAuditLogs';
import { Workgroup } from '../../domain/CollaborationModels';

interface Props {
  readonly activeGroup: Workgroup;
  readonly state: any;
  readonly isTeacher: boolean;
  readonly userName: string;
}

export function WorkspacePanels({ activeGroup, state, isTeacher, userName }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanban' | 'wiki' | 'evaluation' | 'audit'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Tableau de bord & IA' },
    { id: 'kanban', label: '📋 Kanban & Tâches' },
    { id: 'wiki', label: '📝 Wiki & Notes' },
    { id: 'evaluation', label: '🎓 Évaluation & Suivi' },
    { id: 'audit', label: '🛡️ Audit' },
  ] as const;

  const handleAudit = (action: string) => {
    state.addAuditLog(activeGroup.id, userName, action);
  };

  const completedCount = state.tasks.filter((t: any) => t.groupId === activeGroup.id && t.status === 'Terminé').length;
  const totalCount = state.tasks.filter((t: any) => t.groupId === activeGroup.id).length;

  return (
    <div className="space-y-4">
      {/* Tabs list */}
      <div className="flex border-b border-neutral-gray-200 overflow-x-auto no-scrollbar gap-1.5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              handleAudit(`Navigation vers l'onglet : ${tab.label}`);
            }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-500 border border-neutral-gray-200 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel rendering */}
      {activeTab === 'dashboard' && (
        <WorkspaceDashboard
          group={activeGroup}
          tasksCount={totalCount}
          completedTasksCount={completedCount}
          onAuditLog={handleAudit}
        />
      )}

      {activeTab === 'kanban' && (
        <WorkspaceKanban
          tasks={state.tasks}
          groupId={activeGroup.id}
          onAddTask={(gId, title, assigned, deadline) => {
            state.addTask(gId, title, assigned, deadline);
            handleAudit(`Création de la tâche : ${title}`);
          }}
          onUpdateStatus={(taskId, status) => {
            state.updateTaskStatus(taskId, status);
            handleAudit(`Changement du statut de tâche pour : ${status}`);
          }}
          onToggleCheck={(taskId, itemId) => {
            state.toggleChecklistItem(taskId, itemId);
            handleAudit('Modification d\'un élément de checklist de tâche');
          }}
          members={activeGroup.members}
        />
      )}

      {activeTab === 'wiki' && (
        <WorkspaceWiki
          wikiPages={state.wikiPages}
          notes={state.notes}
          groupId={activeGroup.id}
          onAddWiki={(gId, title, content, author) => {
            state.addWikiPage(gId, title, content, author);
            handleAudit(`Création de la page Wiki : ${title}`);
          }}
          onAddNote={(gId, title, content, isPriv, authId, authName) => {
            state.addNote(gId, title, content, isPriv, authId, authName);
            handleAudit(`Création d'une note ${isPriv ? 'privée' : 'partagée'} : ${title}`);
          }}
          userName={userName}
        />
      )}

      {activeTab === 'evaluation' && (
        <GroupEvaluationPanel
          group={activeGroup}
          isTeacher={isTeacher}
          evaluations={state.evaluations}
          onSaveEvaluation={(gId, gG, iG, f, c, graded) => {
            state.addEvaluation(gId, gG, iG, f, c, graded);
            handleAudit('Enregistrement de l\'évaluation par le professeur');
          }}
          userName={userName}
        />
      )}

      {activeTab === 'audit' && (
        <WorkspaceAuditLogs audits={state.audits} groupId={activeGroup.id} />
      )}
    </div>
  );
}
export default WorkspacePanels;
