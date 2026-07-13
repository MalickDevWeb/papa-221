import React from 'react';

interface Quiz {
  question: string;
  options: string[];
  reponseCorrecte: number;
}

export function CourseQuizzesTab({
  details,
  quizValidated,
  selectedAnswers,
  handleResetQuiz,
  handleSelectOption,
  handleValidateQuiz
}: {
  details: { quizzes: Quiz[] };
  quizValidated: boolean;
  selectedAnswers: Record<number, number>;
  handleResetQuiz: () => void;
  handleSelectOption: (qIdx: number, oIdx: number) => void;
  handleValidateQuiz: () => void;
}) {
  const score = details.quizzes.reduce((acc, q, idx) => acc + (selectedAnswers[idx] === q.reponseCorrecte ? 1 : 0), 0);

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
        <div className="flex justify-between items-start gap-3 border-b border-neutral-gray-150 pb-3">
          <div>
            <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
              <span translate="no" className="material-symbols-outlined text-base">quiz</span>
              Quiz d'Auto-Évaluation
            </h5>
            <p className="text-[10px] text-neutral-500 font-bold">Répondez aux questions clés pour évaluer vos connaissances.</p>
          </div>
          {quizValidated && (
            <button onClick={handleResetQuiz} className="px-3 py-1.5 text-[9px] font-black uppercase bg-[#FAF9F7] border border-neutral-gray-200 text-neutral-500 rounded-xl hover:text-brand-red-deep transition-all cursor-pointer">
              Réessayer
            </button>
          )}
        </div>

        <div className="space-y-5">
          {details.quizzes.map((q, qIdx) => (
            <div key={qIdx} className="space-y-2">
              <h6 className="text-[11px] font-black text-[#291715] flex gap-2">
                <span>Q{qIdx + 1}.</span>
                <span>{q.question}</span>
              </h6>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                {q.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[qIdx] === oIdx;
                  const isCorrect = q.reponseCorrecte === oIdx;
                  let style = isSelected ? "bg-[#3f1e1e] text-white border-transparent" : "border-neutral-gray-200/80 bg-neutral-gray-50 text-neutral-700 hover:border-neutral-300";

                  if (quizValidated) {
                    style = isCorrect ? "bg-emerald-500 text-white border-transparent" : isSelected ? "bg-red-500 text-white border-transparent" : "opacity-40 bg-neutral-100 text-neutral-400 border-neutral-250";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizValidated}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                      className={`p-3 rounded-2xl border text-left text-[11px] font-bold transition-all flex justify-between items-center gap-2 ${!quizValidated ? 'cursor-pointer' : 'cursor-default'} ${style}`}
                    >
                      <span>{option}</span>
                      {quizValidated && isCorrect && <span translate="no" className="material-symbols-outlined text-white text-xs font-black">done</span>}
                      {quizValidated && isSelected && !isCorrect && <span translate="no" className="material-symbols-outlined text-white text-xs font-black">close</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!quizValidated ? (
          <div className="pt-3 border-t border-neutral-gray-150 flex justify-end">
            <button onClick={handleValidateQuiz} className="bg-[#3f1e1e] hover:bg-[#522727] text-white font-black uppercase text-[10px] tracking-wider px-5 py-3 rounded-2xl shadow-md cursor-pointer">
              Valider mes réponses
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-neutral-gray-150 flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-wide bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
            <span className="flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-emerald-500 text-base font-bold">workspace_premium</span>
              Fiche d'exercice validée par l'École 221
            </span>
            <span>Score final : {score} / {details.quizzes.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
