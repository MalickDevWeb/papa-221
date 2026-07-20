import React from 'react';
import { Users } from 'lucide-react';
import { Workgroup } from '../../domain/CollaborationModels';

interface Props {
  readonly workgroups: readonly Workgroup[];
  readonly activeGroupId: string;
  readonly onSelectGroup: (id: string) => void;
}

export function WorkgroupsList({ workgroups, activeGroupId, onSelectGroup }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-4 shadow-sm space-y-3">
      <h3 className="font-bold text-xs text-gray-900 flex items-center gap-2 uppercase tracking-wide">
        <Users className="w-4 h-4 text-neutral-900" /> Groupes de Travail Actifs
      </h3>
      <div className="space-y-2">
        {workgroups.map((g) => (
          <div
            key={g.id}
            onClick={() => onSelectGroup(g.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeGroupId === g.id
                ? 'border-neutral-900 bg-neutral-gray-100'
                : 'border-neutral-100 hover:border-neutral-200'
            }`}
          >
            <span className="font-bold text-xs text-gray-800 block">{g.name}</span>
            <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">
              Chef : {g.leaderName} • {g.members.length} membres
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WorkgroupsList;
