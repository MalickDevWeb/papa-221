import React from 'react';
import { Video } from 'lucide-react';
import { VirtualClass } from '../../domain/CollaborationModels';

interface Props {
  readonly meets: readonly VirtualClass[];
  readonly activeMeetId: string;
  readonly onSelectMeet: (id: string) => void;
  readonly onJoinMeet: (meetId: string, meetLink: string) => void;
}

export function ActiveClassesList({ meets, activeMeetId, onSelectMeet, onJoinMeet }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-4 shadow-sm space-y-3">
      <h3 className="font-bold text-xs text-gray-900 flex items-center gap-2 uppercase tracking-wide">
        <Video className="w-4 h-4 text-brand-red-deep" /> Classes Virtuelles Actives
      </h3>
      <div className="space-y-2">
        {meets.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelectMeet(m.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeMeetId === m.id
                ? 'border-brand-red-deep bg-brand-red-light/20'
                : 'border-neutral-gray-100 hover:border-neutral-200 bg-neutral-gray-50/50'
            }`}
          >
            <span className="font-bold text-xs text-gray-800 block">{m.subjectName}</span>
            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-semibold mt-1">
              <span>{m.teacherName} • {m.time}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinMeet(m.id, m.meetLink);
                }}
                className="px-2 py-1 bg-brand-red-deep text-white font-bold rounded-lg hover:scale-105 transition-all text-[9px]"
              >
                Rejoindre
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ActiveClassesList;
