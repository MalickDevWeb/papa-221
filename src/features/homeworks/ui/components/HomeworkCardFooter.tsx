import React from 'react';
import { Icon } from '@iconify/react';
import { Homework } from '../../domain/Homework';

interface Props {
  readonly task: Homework;
  readonly onStart?: (id: string) => void;
  readonly onAdvance?: (id: string, amount: number) => void;
  readonly onSubmitClick?: (id: string) => void;
  readonly triggerToast?: (message: string) => void;
}

export function HomeworkCardFooter({
  task,
  onStart,
  onAdvance,
  onSubmitClick,
  triggerToast
}: Props) {
  return (
    <div id={`hw-card-footer-${task.id}`} className="flex items-center justify-between pt-3 border-t border-neutral-gray-100 mt-1">
      <div id={`hw-card-deadline-${task.id}`} className="flex items-center gap-1 text-[10px] font-extrabold text-neutral-450">
        <Icon icon="lucide:calendar" className="h-3.5 w-3.5" />
        <span>{task.deadlineStr}</span>
      </div>

      {task.statut === 'a_faire' && onStart && (
        <button 
          id={`hw-btn-start-${task.id}`}
          onClick={() => {
            onStart(task.id);
            triggerToast?.(`Devoir commencé : ${task.titre}`);
          }}
          className="text-[9px] font-black text-brand-red-deep bg-red-50 hover:bg-red-100 cursor-pointer px-3 py-1.5 rounded-xl transition-colors border border-red-200/50 flex items-center gap-1"
        >
          <span>Démarrer</span>
          <Icon icon="lucide:arrow-right" className="h-3 w-3" />
        </button>
      )}

      {task.statut === 'en_cours' && onAdvance && onSubmitClick && (
        <div id={`hw-actions-group-${task.id}`} className="flex gap-1.5">
          <button 
            id={`hw-btn-advance-${task.id}`}
            onClick={() => {
              onAdvance(task.id, 20);
              triggerToast?.(`Progression de 20% ajoutée pour : ${task.titre}`);
            }}
            className="text-[9px] font-black text-brand-red-deep bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-xl border border-red-200/30 transition-colors cursor-pointer"
          >
            Avancer +
          </button>
          <button 
            id={`hw-btn-submit-${task.id}`}
            onClick={() => onSubmitClick(task.id)}
            className="text-[9px] font-black text-white bg-success-green hover:bg-success-green/90 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
          >
            <Icon icon="lucide:upload" className="h-3 w-3" />
            <span>Soumettre</span>
          </button>
        </div>
      )}

      {task.statut === 'soumis' && (
        task.note ? (
          <span id={`hw-grade-${task.id}`} className="text-xs font-black text-success-green bg-green-50 px-2.5 py-1 rounded-xl border border-green-200">
            Note : {task.note}
          </span>
        ) : (
          <span id={`hw-pending-${task.id}`} className="text-[9px] font-black text-brand-red-deep bg-red-50 px-2.5 py-1 rounded-xl border border-red-200/50">
            En attente
          </span>
        )
      )}
    </div>
  );
}
