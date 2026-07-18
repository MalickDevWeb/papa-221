import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { QuizQuestion } from '../../../hooks/useModuleQuizzes';

interface Props {
  readonly quizId: string | null;
  readonly questions: readonly QuizQuestion[];
  readonly onAddQuestion: (
    text: string,
    options: readonly string[],
    correctIndex: number,
    points: number
  ) => void;
  readonly onDeleteQuestion: (id: string) => void;
}

export function QuizQuestionFormAndList({ quizId, questions, onAddQuestion, onDeleteQuestion }: Props) {
  const [text, setText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [points, setPoints] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !optA.trim() || !optB.trim()) return;
    const opts = [optA.trim(), optB.trim(), optC.trim() || 'N/A', optD.trim() || 'N/A'];
    onAddQuestion(text.trim(), opts, correctIdx, points);
    setText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
    setPoints(2);
  };

  const activeQuestions = questions.filter((q) => q.quizId === quizId);

  if (!quizId) {
    return (
      <div className="h-full flex items-center justify-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-xs font-bold text-neutral-400">
        Veuillez sélectionner ou créer un quiz pour y ajouter des questions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-150/80 space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Énoncé de la question..."
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none"
          required
        />
        <div className="grid grid-cols-2 gap-2.5">
          <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A (Obligatoire)..." className="px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none" required />
          <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B (Obligatoire)..." className="px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none" required />
          <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C (Optionnel)..." className="px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none" />
          <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D (Optionnel)..." className="px-3 py-2 bg-white border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 block mb-1">Bonne réponse</label>
            <select value={correctIdx} onChange={(e) => setCorrectIdx(parseInt(e.target.value))} className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none">
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 block mb-1">Points</label>
            <input type="number" min={1} max={20} value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 2)} className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-1.5 bg-brand-red-deep hover:bg-brand-red-deep/90 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer border-0">
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Ajouter la question
        </button>
      </form>

      <div className="space-y-2.5 max-h-[160px] overflow-y-auto no-scrollbar">
        {activeQuestions.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-xs font-bold text-neutral-400">Aucune question dans ce quiz.</div>
        ) : (
          activeQuestions.map((q, qIdx) => (
            <div key={q.id} className="p-3.5 bg-white border border-neutral-150 rounded-xl space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h5 className="text-xs font-black text-neutral-800 leading-snug">{qIdx + 1}. {q.questionText} <span className="text-[10px] text-brand-red-deep">({q.points} pts)</span></h5>
                <button type="button" onClick={() => onDeleteQuestion(q.id)} className="text-neutral-300 hover:text-brand-red-deep p-1.5 rounded-lg hover:bg-[#FFF5F5] border-0 bg-transparent cursor-pointer transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => (
                  <span key={oIdx} className={`px-2 py-1.5 text-[9.5px] rounded-lg border font-semibold flex items-center gap-1 ${oIdx === q.correctIndex ? 'bg-emerald-50 text-emerald-700 border-emerald-500/20' : 'bg-neutral-50 border-neutral-100 text-neutral-500'}`}>
                    {oIdx === q.correctIndex && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />}
                    {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
