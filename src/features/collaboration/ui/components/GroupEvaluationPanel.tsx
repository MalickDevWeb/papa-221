import React, { useState } from 'react';
import { Award, Star, CheckSquare, Sparkles } from 'lucide-react';
import { Workgroup } from '../../domain/CollaborationModels';
import { GroupEvaluation } from '../../domain/TaskWikiModels';

interface Props {
  readonly group: Workgroup;
  readonly isTeacher: boolean;
  readonly evaluations: readonly GroupEvaluation[];
  readonly onSaveEvaluation: (
    groupId: string,
    groupGrade: number | undefined,
    individualGrades: Record<string, number>,
    feedback: string,
    criteria: GroupEvaluation['criteria'],
    gradedBy: string
  ) => void;
  readonly userName: string;
}

export function GroupEvaluationPanel({ group, isTeacher, evaluations, onSaveEvaluation, userName }: Props) {
  const [groupGrade, setGroupGrade] = useState('16');
  const [feedback, setFeedback] = useState('Excellent travail de collaboration, les commits sont réguliers.');
  const [qual, setQual] = useState(4);
  const [collab, setCollab] = useState(5);

  const groupEval = evaluations.find((e) => e.groupId === group.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const indGrades: Record<string, number> = {};
    group.members.forEach((m) => {
      indGrades[m.id] = parseFloat(groupGrade) + (m.gpa > 3.5 ? 1 : -0.5);
    });
    onSaveEvaluation(group.id, parseFloat(groupGrade), indGrades, feedback, {
      quality: qual,
      collaboration: collab,
      commitFrequency: 4,
      promptness: 5,
    }, userName);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-brand-red-deep animate-bounce" />
        <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wide">Suivi, Audit & Évaluation Enseignant</h3>
      </div>

      {isTeacher ? (
        <form onSubmit={handleSubmit} className="space-y-3 bg-neutral-50/50 p-3.5 rounded-xl border border-neutral-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 mb-1">Note Globale du Groupe (/20)</label>
              <input type="number" min="0" max="20" value={groupGrade} onChange={(e) => setGroupGrade(e.target.value)} className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white font-bold text-brand-red-deep" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 mb-1">Qualité de Collaboration (1-5)</label>
              <input type="number" min="1" max="5" value={collab} onChange={(e) => setCollab(parseInt(e.target.value))} className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white" required />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 mb-1">Commentaire & Axes d&apos;Amélioration</label>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white h-12 resize-none" required />
          </div>

          <button type="submit" className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1">
            <CheckSquare className="w-4 h-4 text-emerald-400" /> Enregistrer les Notes & Feedbacks
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {groupEval ? (
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-emerald-800">Évaluation Disponible</span>
                <span className="text-sm font-black text-brand-red-deep">Note Projet : {groupEval.groupGrade}/20</span>
              </div>
              <p className="text-[10px] text-neutral-600 font-semibold leading-relaxed">&quot;{groupEval.feedback}&quot;</p>
              
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-neutral-500 pt-2 border-t border-emerald-100">
                <span className="flex items-center gap-1 text-amber-600"><Star className="w-3.5 h-3.5 fill-current" /> Collaboration : {groupEval.criteria.collaboration}/5</span>
                <span className="flex items-center gap-1 text-emerald-600"><Star className="w-3.5 h-3.5 fill-current" /> Qualité Livrables : {groupEval.criteria.quality}/5</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl text-center text-[10px] font-bold text-amber-800">
              L&apos;enseignant n&apos;a pas encore publié d&apos;évaluation pour ce groupe. Continuez à committer et à participer !
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default GroupEvaluationPanel;
