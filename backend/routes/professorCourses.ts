import { Router } from "express";

export const professorCoursesRouter = Router();

const modules = [
  { id: 'mod-1', courseId: 'course-4', title: 'Module 1 : Cryptographie Symétrique', description: 'AES, DES, etc.' },
  { id: 'mod-2', courseId: 'course-4', title: 'Module 2 : Sécurité Réseau', description: 'TLS, SSL, etc.' },
  { id: 'mod-4', courseId: 'course-1', title: 'Module 1 : Analyse de Complexité', description: 'Grand O' }
];

const lessons = [
  { id: 'les-1', courseId: 'course-4', moduleId: 'mod-1', title: "Chapitre 1 : Introduction", description: "Bases.", dateStr: "Publié", attachmentName: "Cours.pdf" }
];

const reminders = [
  { id: 'rem-1', courseId: 'course-1', content: "Projet final programmation dynamique à soumettre.", dateStr: "Aujourd'hui", isUrgent: true }
];

const quizzes = [
  { id: 'quiz-1', moduleId: 'mod-1', title: 'Quiz 1 : AES', description: 'AES rounds', questions: [] }
];

const studentsEnrolled = [
  { id: 'stud-1', name: 'Assane Diop', matricule: '221-M382', progress: 85, attendanceRate: 95 },
  { id: 'stud-2', name: 'Fatou Sow', matricule: '221-M383', progress: 90, attendanceRate: 98 }
];

const studentGrades = [
  { studentId: 'stud-1', studentName: 'Assane Diop', matricule: '221-M382', cc: 15, examen: 16 },
  { studentId: 'stud-2', studentName: 'Fatou Sow', matricule: '221-M383', cc: 17, examen: 18 }
];

professorCoursesRouter.get("/professor/courses", (req, res) => {
  res.json([
    { id: 'course-4', titre: "Sécurité des SI", coefficient: 4, progress: 10, unites: ['Crypto'], prochainCours: 'Mardi à 13h00', salle: 'Amphi B', classe: 'M1 GL' },
    { id: 'course-1', titre: 'Algorithmique Avancée', coefficient: 5, progress: 80, unites: ['Graphes'], prochainCours: 'Lundi à 08h00', salle: 'Amphi A', classe: 'M1 GL' }
  ]);
});

professorCoursesRouter.get("/professor/courses/:courseId/students", (req, res) => {
  res.json(studentsEnrolled);
});

professorCoursesRouter.get("/professor/courses/:courseId/grades", (req, res) => {
  res.json(studentGrades);
});

professorCoursesRouter.post("/professor/courses/:courseId/grades/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { cc, examen } = req.body;
  const found = studentGrades.find(g => g.studentId === studentId);
  if (found) {
    found.cc = Number(cc);
    found.examen = Number(examen);
    res.json(found);
  } else {
    res.status(404).json({ error: "Étudiant introuvable" });
  }
});

professorCoursesRouter.get("/professor/courses/:courseId/reminders", (req, res) => {
  res.json(reminders.filter(r => r.courseId === req.params.courseId));
});

professorCoursesRouter.post("/professor/courses/:courseId/reminders", (req, res) => {
  const { content, isUrgent } = req.body;
  const newReminder = { id: 'rem-' + Date.now(), courseId: req.params.courseId, content, dateStr: "Aujourd'hui", isUrgent: !!isUrgent };
  reminders.push(newReminder);
  res.json(newReminder);
});

professorCoursesRouter.get("/professor/courses/:courseId/lessons", (req, res) => {
  res.json(lessons.filter(l => l.courseId === req.params.courseId));
});

professorCoursesRouter.post("/professor/courses/:courseId/lessons", (req, res) => {
  const { title, description, attachmentName, attachmentUrl, moduleId } = req.body;
  const newLesson = { id: 'les-' + Date.now(), courseId: req.params.courseId, moduleId, title, description, dateStr: "Publié", attachmentName };
  lessons.push(newLesson);
  res.json(newLesson);
});

professorCoursesRouter.get("/professor/courses/:courseId/modules", (req, res) => {
  res.json(modules.filter(m => m.courseId === req.params.courseId));
});

professorCoursesRouter.post("/professor/courses/:courseId/modules", (req, res) => {
  const { title, description } = req.body;
  const newModule = { id: 'mod-' + Date.now(), courseId: req.params.courseId, title, description };
  modules.push(newModule);
  res.json(newModule);
});

professorCoursesRouter.get("/professor/courses/:courseId/quizzes", (req, res) => {
  res.json(quizzes);
});

professorCoursesRouter.post("/professor/modules/:moduleId/quizzes", (req, res) => {
  const { title, description, questions } = req.body;
  const newQuiz = { id: 'quiz-' + Date.now(), moduleId: req.params.moduleId, title, description, questions: questions || [] };
  quizzes.push(newQuiz);
  res.json(newQuiz);
});
