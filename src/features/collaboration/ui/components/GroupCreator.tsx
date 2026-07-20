import React, { useState } from 'react';
import { Users, Sparkles, UserCheck } from 'lucide-react';
import { GroupingCriterion } from '../../domain/CollaborationAlgorithms';
import { GroupMember } from '../../domain/CollaborationModels';
import { ManualGroupCreator } from './ManualGroupCreator';
import { AutoGroupCreator } from './AutoGroupCreator';

interface Props {
  readonly onAutoGenerate: (
    baseName: string,
    classId: string,
    criterion: GroupingCriterion,
    count: number,
    leaderRule: 'random' | 'gpa' | 'teacher'
  ) => void;
  readonly onCreateManual: (
    name: string,
    description: string,
    classId: string,
    leader: GroupMember,
    members: readonly GroupMember[]
  ) => void;
}

export function GroupCreator({ onAutoGenerate, onCreateManual }: Props) {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-xs text-gray-900">Espace Création des Groupes</h3>
          <p className="text-[10px] text-gray-500">Outils de répartition pour l&apos;enseignant</p>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Création Manuelle</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('auto')}
          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'auto' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Algorithme Automatique</span>
        </button>
      </div>

      <div className="border-t border-gray-100 pt-3">
        {activeTab === 'manual' ? (
          <ManualGroupCreator onCreateManual={onCreateManual} />
        ) : (
          <AutoGroupCreator onAutoGenerate={onAutoGenerate} />
        )}
      </div>
    </div>
  );
}
export default GroupCreator;
