import React, { useState } from 'react';
import { Kanban, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CollabTask } from '../../domain/CollaborationModels';
import { TaskStatus } from '../../hooks/useGroupTasksState';

interface Props {
  readonly tasks: readonly CollabTask[];
  readonly groupId: string;
  readonly onAddTask: (groupId: string, title: string, assignedTo: string, deadline: string) => void;
  readonly onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  readonly onToggleCheck: (taskId: string, itemId: string) => void;
  readonly members: readonly { readonly name: string }[];
}

export function WorkspaceKanban({ tasks, groupId, onAddTask, onUpdateStatus, onToggleCheck, members }: Props) {
  const [newTitle, setNewTitle] = useState('');
  const [assigned, setAssigned] = useState('');
  const [showForm, setShowForm] = useState(false);

  const groupTasks = tasks.filter((t) => t.groupId === groupId);
  const columns: readonly TaskStatus[] = ['A faire', 'En cours', 'En révision', 'Validé', 'Bloqué', 'Terminé'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(groupId, newTitle.trim(), assigned || members[0]?.name || 'Amadou Diop', '28/07/2026');
    setNewTitle('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Kanban className="w-5 h-5 text-brand-red-deep" />
          <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wide">Kanban & Planification</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-2.5 py-1 bg-neutral-900 text-white font-bold text-[10px] rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Nouvelle Tâche
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-3 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200">
          <input
            type="text"
            placeholder="Nom de la tâche..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg bg-white"
            required
          />
          <div className="flex gap-2">
            <select
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              className="flex-grow text-xs px-2 py-1.5 border border-neutral-300 rounded-lg bg-white"
            >
              {members.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
            <button type="submit" className="px-3 bg-brand-red-deep text-white font-bold text-xs rounded-lg">Assigner</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto no-scrollbar py-1">
        {columns.map((col) => {
          const colTasks = groupTasks.filter((t) => t.status === col);
          return (
            <div key={col} className="bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100 min-h-[180px] flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase text-neutral-500 border-b border-neutral-200 pb-1 text-center">{col}</span>
              <div className="flex-grow space-y-2">
                {colTasks.map((t) => (
                  <div key={t.id} className="p-2 bg-white rounded-lg border border-neutral-200 shadow-3xs text-[10px] space-y-1">
                    <span className="font-bold text-gray-800 leading-tight block">{t.title}</span>
                    <span className="text-[8px] bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded font-bold block w-fit">👤 {t.assignedTo}</span>
                    
                    <div className="pt-1 border-t border-neutral-100 mt-1 space-y-1">
                      {t.checklist?.map((item) => (
                        <div key={item.id} onClick={() => onToggleCheck(t.id, item.id)} className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                          <input type="checkbox" checked={item.done} readOnly className="h-2.5 w-2.5 rounded text-brand-red-deep focus:ring-0" />
                          <span className={`text-[8px] truncate ${item.done ? 'line-through text-neutral-400' : 'text-neutral-600 font-bold'}`}>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <select
                      value={t.status}
                      onChange={(e) => onUpdateStatus(t.id, e.target.value as TaskStatus)}
                      className="w-full text-[8px] border border-neutral-200 rounded p-0.5 mt-1 bg-white font-bold"
                    >
                      {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default WorkspaceKanban;
