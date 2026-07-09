import React from 'react';
import { useModuleQuizzes } from '../../../hooks/useModuleQuizzes';
import { QuizSidebar } from './QuizSidebar';
import { QuizQuestionFormAndList } from './QuizQuestionFormAndList';

interface Props {
  readonly moduleId: string;
}

export function ModuleQuizSection({ moduleId }: Props) {
  const {
    quizzes,
    questions,
    activeQuizId,
    setActiveQuizId,
    addQuiz,
    addQuestion,
    deleteQuiz,
    deleteQuestion,
  } = useModuleQuizzes(moduleId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      <div className="lg:col-span-4">
        <QuizSidebar
          quizzes={quizzes}
          activeQuizId={activeQuizId}
          onSelectQuiz={setActiveQuizId}
          onAddQuiz={addQuiz}
          onDeleteQuiz={deleteQuiz}
        />
      </div>
      <div className="lg:col-span-8">
        <QuizQuestionFormAndList
          quizId={activeQuizId}
          questions={questions}
          onAddQuestion={addQuestion}
          onDeleteQuestion={deleteQuestion}
        />
      </div>
    </div>
  );
}
