export function getDynamicDetails(targetId: string, courseId: string | undefined, staticDetails: any) {
  const dMods = JSON.parse(localStorage.getItem('p_modules') || '[]') as any[];
  const dLess = JSON.parse(localStorage.getItem('p_lessons') || '[]') as any[];
  const dQuiz = JSON.parse(localStorage.getItem('p_quizzes') || '[]') as any[];

  const cMods = dMods.filter(m => m.courseId === targetId || m.courseId === courseId);
  const cLess = dLess.filter(l => l.courseId === targetId || l.courseId === courseId);
  const cQuiz = dQuiz.filter(q => cMods.map(m => m.id).includes(q.moduleId));

  const chapitres = cMods.length > 0
    ? cMods.map(mod => ({
        titre: mod.title,
        lecons: cLess.filter(l => l.moduleId === mod.id).length > 0
          ? cLess.filter(l => l.moduleId === mod.id).map((l, i) => ({
              titre: `${i + 1}.1 ${l.title}`,
              estDerniereEnseignee: i === 0,
              duree: "45 min",
              complete: false
            }))
          : [{ titre: "Aucune leçon publiée pour le moment", duree: "-", complete: false }]
      }))
    : staticDetails.chapitres;

  const ressources = [
    ...(staticDetails.ressources || []),
    ...cLess.filter(l => l.attachmentName).map(l => ({
      titre: l.attachmentName!,
      type: l.attachmentName!.toLowerCase().endsWith('.pdf') ? ('pdf' as const) : ('code' as const),
      taille: "Support de Cours"
    }))
  ];

  const quizzes = cQuiz.length > 0
    ? cQuiz.flatMap(q => q.questions.map((quest: any) => ({
        question: quest.questionText,
        options: quest.options,
        reponseCorrecte: quest.correctAnswerIndex
      })))
    : staticDetails.quizzes;

  return { chapitres, ressources, quizzes, devoirs: staticDetails.devoirs };
}

export function loadReminders(targetId: string, courseId: string | undefined, id: string | undefined) {
  const saved = localStorage.getItem('p_reminders');
  if (!saved) return [];
  try {
    return JSON.parse(saved).filter((r: any) => r.courseId === targetId || r.courseId === courseId || r.courseId === id);
  } catch {
    return [];
  }
}
