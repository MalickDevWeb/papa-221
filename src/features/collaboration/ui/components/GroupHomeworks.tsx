import React, { useState } from 'react';
import { BookOpen, Calendar, CheckSquare, Award } from 'lucide-react';
import { GroupHomework } from '../../domain/CollaborationModels';

interface Props {
  readonly homeworks: readonly GroupHomework[];
  readonly groupId: string;
  readonly groupName: string;
  readonly onDeliver: (homeworkId: string, groupId: string, name: string, file: string) => void;
  readonly isLeader: boolean;
}

export function GroupHomeworks({ homeworks, groupId, groupName, onDeliver, isLeader }: Props) {
  const [fileName, setFileName] = useState('');

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-brand-red-light text-brand-red-deep">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-gray-900">Devoirs & Livrables de Groupe</h3>
          <p className="text-[10px] text-neutral-500 font-semibold">Tâches académiques affectées à votre groupe de travail</p>
        </div>
      </div>

      <div className="space-y-4">
        {homeworks.length === 0 ? (
          <p className="text-center text-xs text-neutral-400 py-4 font-semibold">Aucun devoir de groupe en cours.</p>
        ) : (
          homeworks.map((hw) => {
            const groupSub = hw.submissions.find((s) => s.groupId === groupId);

            return (
              <div key={hw.id} className="p-4 border border-neutral-100 rounded-2xl bg-neutral-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-gray-800 block">{hw.title}</span>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold">{hw.description}</p>
                  <div className="flex items-center gap-2 text-[9px] text-neutral-400 font-black">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Échéance : {hw.deadline}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {groupSub ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <div className="text-[10px]">
                        <span className="font-bold text-emerald-800 block">Livrable soumis</span>
                        <span className="text-neutral-500 font-semibold font-mono block text-[9px]">{groupSub.fileName}</span>
                        {groupSub.grade !== undefined && (
                          <span className="font-black text-brand-red-deep block mt-1">Note : {groupSub.grade}/20</span>
                        )}
                      </div>
                    </div>
                  ) : isLeader ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Fichier de soumission.zip"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="text-[10px] px-3 py-1.5 border border-neutral-200 rounded-xl bg-white"
                      />
                      <button
                        onClick={() => {
                          if (fileName) {
                            onDeliver(hw.id, groupId, groupName, fileName);
                            setFileName('');
                          }
                        }}
                        className="px-3 py-1.5 bg-brand-red-deep text-white font-bold text-[10px] rounded-xl hover:bg-brand-red-deep/90 transition-all shadow-sm"
                      >
                        Remettre
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl text-amber-800 text-[9px] font-bold">
                      Seul le Chef de Groupe ({groupName}) peut soumettre les livrables.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default GroupHomeworks;
