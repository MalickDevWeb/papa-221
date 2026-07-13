import { useState, useCallback, FormEvent, MouseEvent } from 'react';
import type { QuizQuestion, CourseQuiz } from '../domain/ProfessorModels';

interface QuestionDraft {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface ProfessorWithQuiz {
  quizzes: CourseQuiz[];
  handleCreateQuiz: (moduleId: string, title: string, description: string, questions: QuizQuestion[]) => Promise<any>;
}

export function useProfessorQuizFormState(professor: ProfessorWithQuiz, triggerToast: (msg: string) => void) {
  const [activeModuleForQuiz, setActiveModuleForQuiz] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuestionDraft[]>([]);
  const [tempQuestionText, setTempQuestionText] = useState('');
  const [tempOpt1, setTempOpt1] = useState('');
  const [tempOpt2, setTempOpt2] = useState('');
  const [tempOpt3, setTempOpt3] = useState('');
  const [tempOpt4, setTempOpt4] = useState('');
  const [tempCorrectIndex, setTempCorrectIndex] = useState(0);
  const [testingAnswers, setTestingAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);

  const handleAddQuestionDraft = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (!tempQuestionText.trim()) {
      triggerToast('Le texte de la question est requis');
      return;
    }
    const options = [tempOpt1, tempOpt2, tempOpt3, tempOpt4].filter(opt => opt.trim() !== '');
    if (options.length < 2) {
      triggerToast('Veuillez renseigner au moins 2 options de réponse');
      return;
    }
    if (tempCorrectIndex < 0 || tempCorrectIndex >= options.length) {
      triggerToast('Veuillez sélectionner un index de réponse correct valide');
      return;
    }
    setQuizQuestions(prev => [
      ...prev,
      { questionText: tempQuestionText, options, correctAnswerIndex: tempCorrectIndex }
    ]);
    setTempQuestionText('');
    setTempOpt1('');
    setTempOpt2('');
    setTempOpt3('');
    setTempOpt4('');
    setTempCorrectIndex(0);
    triggerToast('Question ajoutée à la liste du quiz !');
  }, [tempCorrectIndex, tempOpt1, tempOpt2, tempOpt3, tempOpt4, tempQuestionText, triggerToast]);

  const handleLmsQuizSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!activeModuleForQuiz) return;
    if (!quizTitle.trim()) {
      triggerToast('Le titre du quiz est requis');
      return;
    }
    if (quizQuestions.length === 0) {
      triggerToast('Le quiz doit contenir au moins une question');
      return;
    }
    try {
      await professor.handleCreateQuiz(
        activeModuleForQuiz,
        quizTitle,
        quizDesc,
        quizQuestions.map((q, idx) => ({
          id: `q-${idx}-${Date.now()}`,
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex
        }))
      );
      setQuizTitle('');
      setQuizDesc('');
      setQuizQuestions([]);
      setActiveModuleForQuiz(null);
      triggerToast('Nouveau Quiz d\'évaluation publié avec succès !');
    } catch (err) {
      triggerToast('Erreur de publication du quiz');
    }
  }, [activeModuleForQuiz, professor, quizDesc, quizQuestions, quizTitle, triggerToast]);

  const handleTestQuizSubmit = useCallback((quizId: string) => {
    const quiz = professor.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    const correct = quiz.questions.reduce((acc, q) => acc + (testingAnswers[q.id] === q.correctAnswerIndex ? 1 : 0), 0);
    setQuizScore({ correct, total: quiz.questions.length });
  }, [professor.quizzes, testingAnswers]);

  return {
    activeModuleForQuiz, setActiveModuleForQuiz,
    quizTitle, setQuizTitle, quizDesc, setQuizDesc,
    quizQuestions, setQuizQuestions, tempQuestionText, setTempQuestionText,
    tempOpt1, setTempOpt1, tempOpt2, setTempOpt2, tempOpt3, setTempOpt3, tempOpt4, setTempOpt4,
    tempCorrectIndex, setTempCorrectIndex, testingAnswers, setTestingAnswers,
    quizScore, handleAddQuestionDraft, handleLmsQuizSubmit, handleTestQuizSubmit,
  };
}
