import { Router } from "express";

export const professorScheduleRouter = Router();

const homeworks = [
  { id: 'hw-1', courseId: 'course-1', titre: 'Projet Dynamique', desc: 'Optimisation de sac à dos', prio: 'haute', deadlineStr: 'Lundi' },
  { id: 'hw-2', courseId: 'course-4', titre: 'Analyse AES', desc: 'Rapport sur AES-256', prio: 'normale', deadlineStr: 'Mardi' }
];

const schedule = [
  { id: 'sess-1', nom: 'Sécurité des SI', jour: 'MAR', jourComplet: 'MARDI', dateStr: '24 Oct', heureDebut: '13:00', heureFin: '16:00', heureStr: '13:00 - 16:00', type: 'CM', salle: 'Amphi B', professeur: 'Prof. S. Diop', description: 'Cryptographie avancée', status: 'a_venir' },
  { id: 'sess-2', nom: 'Algorithmique Avancée', jour: 'LUN', jourComplet: 'LUNDI', dateStr: '23 Oct', heureDebut: '08:00', heureFin: '10:00', heureStr: '08:00 - 10:00', type: 'CM', salle: 'Amphi A', professeur: 'Dr. Aly Diatta', description: 'Programmation dynamique', status: 'a_venir' },
  { id: 'sess-wed-1', nom: 'TD Algorithmique Avancée', jour: 'MER', jourComplet: 'MERCREDI', dateStr: '25 Oct', heureDebut: '12:00', heureFin: '14:00', heureStr: '12:00 - 14:00', type: 'TD', salle: 'Labo 5', professeur: 'Dr. Aly Diatta', description: "Séance pratique d'exercices sur la complexité et les tris.", status: 'a_venir' },
  { id: 'sess-wed-2', nom: "Sécurité des Systèmes d'Information", jour: 'MER', jourComplet: 'MERCREDI', dateStr: '25 Oct', heureDebut: '17:00', heureFin: '20:00', heureStr: '17:00 - 20:00', type: 'CM', salle: 'Amphi B', professeur: 'Dr. Aly Diatta', description: "Cryptographie avancée, modélisation de menaces et protocoles de communication sécurisés.", status: 'a_venir' }
];

professorScheduleRouter.get("/professor/schedule", (req, res) => {
  res.json(schedule);
});

professorScheduleRouter.post("/professor/schedule/:sessionId/cancel", (req, res) => {
  const { sessionId } = req.params;
  const { reason } = req.body;
  const found = schedule.find(s => s.id === sessionId);
  if (found) {
    found.status = 'termine';
    (found as any).cancellationReason = reason;
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Session introuvable" });
  }
});

professorScheduleRouter.post("/professor/schedule/:sessionId/reschedule", (req, res) => {
  const { sessionId } = req.params;
  const { day, time, room } = req.body;
  const found = schedule.find(s => s.id === sessionId);
  if (found) {
    found.jour = String(day).slice(0, 3).toUpperCase();
    found.jourComplet = String(day).toUpperCase();
    found.heureStr = time;
    found.salle = room;
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Session introuvable" });
  }
});

professorScheduleRouter.get("/professor/courses/:courseId/homeworks", (req, res) => {
  res.json(homeworks.filter(h => h.courseId === req.params.courseId));
});

professorScheduleRouter.post("/professor/courses/:courseId/homeworks", (req, res) => {
  const { titre, desc, prio, deadlineStr } = req.body;
  const newHomework = {
    id: 'hw-' + Date.now(),
    courseId: req.params.courseId,
    titre,
    desc,
    prio: prio || 'normale',
    deadlineStr: deadlineStr || 'Dans 1 semaine'
  };
  homeworks.push(newHomework);
  res.json(newHomework);
});

professorScheduleRouter.get("/vigil/check-ins", (req, res) => {
  res.json([
    { id: 'chk-1', studentName: 'Assane Diop', matricule: '221-M382', status: 'Validé', timestamp: 'Aujourd\'hui, 08:02' },
    { id: 'chk-2', studentName: 'Fatou Sow', matricule: '221-M383', status: 'Validé', timestamp: 'Aujourd\'hui, 08:05' }
  ]);
});
