import { useState, useEffect, useCallback } from 'react';

export interface Quiz {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly quizId: string;
  readonly questionText: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly points: number;
}

export function useModuleQuizzes(moduleId: string) {
  const [quizzes, setQuizzes] = useState<readonly Quiz[]>([]);
  const [questions, setQuestions] = useState<readonly QuizQuestion[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const storedQuizzes = localStorage.getItem('p_quizzes');
    const storedQuestions = localStorage.getItem('p_questions');
    const allQ = storedQuizzes ? JSON.parse(storedQuizzes) : [];
    const allQues = storedQuestions ? JSON.parse(storedQuestions) : [];

    const filteredQuizzes = allQ.filter((q: any) => q.moduleId === moduleId);
    setQuizzes(filteredQuizzes);
    setQuestions(allQues);

    if (filteredQuizzes.length > 0 && !activeQuizId) {
      setActiveQuizId(filteredQuizzes[0].id);
    }
  }, [moduleId, activeQuizId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addQuiz = (title: string) => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      moduleId,
      title,
    };
    const stored = localStorage.getItem('p_quizzes');
    const all = stored ? JSON.parse(stored) : [];
    all.push(newQuiz);
    localStorage.setItem('p_quizzes', JSON.stringify(all));
    setActiveQuizId(newQuiz.id);
    loadData();
  };

  const addQuestion = (
    text: string,
    options: readonly string[],
    correctIndex: number,
    points: number
  ) => {
    if (!activeQuizId) return;
    const newQuestion: QuizQuestion = {
      id: `ques-${Date.now()}`,
      quizId: activeQuizId,
      questionText: text,
      options,
      correctIndex,
      points,
    };
    const stored = localStorage.getItem('p_questions');
    const all = stored ? JSON.parse(stored) : [];
    all.push(newQuestion);
    localStorage.setItem('p_questions', JSON.stringify(all));
    loadData();
  };

  const deleteQuiz = (quizId: string) => {
    const storedQuizzes = localStorage.getItem('p_quizzes');
    const storedQuestions = localStorage.getItem('p_questions');
    if (storedQuizzes) {
      const filtered = JSON.parse(storedQuizzes).filter((q: any) => q.id !== quizId);
      localStorage.setItem('p_quizzes', JSON.stringify(filtered));
    }
    if (storedQuestions) {
      const filtered = JSON.parse(storedQuestions).filter((q: any) => q.quizId !== quizId);
      localStorage.setItem('p_questions', JSON.stringify(filtered));
    }
    if (activeQuizId === quizId) {
      setActiveQuizId(null);
    }
    loadData();
  };

  const deleteQuestion = (quesId: string) => {
    const stored = localStorage.getItem('p_questions');
    if (stored) {
      const filtered = JSON.parse(stored).filter((q: any) => q.id !== quesId);
      localStorage.setItem('p_questions', JSON.stringify(filtered));
      loadData();
    }
  };

  return {
    quizzes,
    questions,
    activeQuizId,
    setActiveQuizId,
    addQuiz,
    addQuestion,
    deleteQuiz,
    deleteQuestion,
  };
}
