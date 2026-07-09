import { Router } from "express";
import { readDb, writeDb } from "../db";

export const adminRouter = Router();

// Retrieve admin dashboard statistics
adminRouter.get("/admin/stats", (req, res) => {
  const db = readDb();
  const studentsCount = db.students?.length || 0;
  const professorsCount = db.professors?.length || 0;
  const coursesCount = db.courses?.length || 0;
  const classesCount = db.promotions?.length || 0;
  
  res.json({
    studentsCount,
    professorsCount,
    coursesCount,
    classesCount,
    presentProfessors: "18 / 20",
    salleOccupation: "85%"
  });
});

// Manage users: retrieve students, professors and promotions
adminRouter.get("/admin/users", (req, res) => {
  const db = readDb();
  res.json({
    students: db.students || [],
    professors: db.professors || [],
    promotions: db.promotions || []
  });
});

// Add/Delete Students & Professors
adminRouter.post("/admin/students", (req, res) => {
  const { name, matricule, promotion_id } = req.body;
  if (!name || !matricule) {
    res.status(400).json({ error: "Le nom et le matricule sont requis" });
    return;
  }
  const db = readDb();
  db.students = db.students || [];
  const newStudent = { id: `usr-etudiant-${Date.now()}`, name, matricule, promotion_id: promotion_id || "p-1", average: 14.0, gpa: 3.2, mood: "Motivé" };
  db.students.push(newStudent);
  writeDb(db);
  res.status(201).json(newStudent);
});

adminRouter.delete("/admin/students/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.students = (db.students || []).filter(s => s.id !== id);
  writeDb(db);
  res.json({ success: true });
});

adminRouter.post("/admin/students/:id/payment", (req, res) => {
  const { id } = req.params;
  const { statutFrais } = req.body;
  const db = readDb();
  const students = db.students || [];
  const found = students.find((s: any) => s.id === id);
  if (found) {
    found.statutFrais = statutFrais;
    db.students = students;
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Étudiant introuvable" });
  }
});

adminRouter.post("/admin/professors", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Le nom et l'email sont requis" });
    return;
  }
  const db = readDb();
  db.professors = db.professors || [];
  const newProf = { id: `prof-${Date.now()}`, name, email };
  db.professors.push(newProf);
  writeDb(db);
  res.status(201).json(newProf);
});

adminRouter.delete("/admin/professors/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.professors = (db.professors || []).filter(p => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Retrieve and update class schedule (sessions)
adminRouter.get("/admin/schedule", (req, res) => {
  const db = readDb();
  res.json((db as any).sessions || []);
});

adminRouter.post("/admin/schedule/:id/reschedule", (req, res) => {
  const { id } = req.params;
  const { jourComplet, heureStr, salle } = req.body;
  const db = readDb();
  const sessions = (db as any).sessions || [];
  const found = sessions.find((s: any) => s.id === id);
  if (found) {
    if (jourComplet) {
      found.jourComplet = jourComplet.toUpperCase();
      found.jour = jourComplet.substring(0, 3).toUpperCase();
    }
    if (heureStr) found.heureStr = heureStr;
    if (salle) found.salle = salle;
    (db as any).sessions = sessions;
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Séance introuvable" });
  }
});

// CREATE PROMOTIONS (CLASSES / FILIÈRES)
adminRouter.post("/admin/promotions", (req, res) => {
  const { name, filiere, faculte } = req.body;
  if (!name || !filiere) {
    res.status(400).json({ error: "Le nom de classe et la filière sont requis" });
    return;
  }
  const db = readDb();
  db.promotions = db.promotions || [];
  const newPromo = {
    id: `p-${Date.now()}`,
    name,
    filiere,
    faculte: faculte || "Sciences & Technologies"
  };
  db.promotions.push(newPromo);
  writeDb(db);
  res.status(201).json(newPromo);
});

// CREATE COURSES / MATIÈRES
adminRouter.post("/admin/courses", (req, res) => {
  const { titre, coefficient, professeur_id, promotion_id, prochain_cours } = req.body;
  if (!titre || !promotion_id) {
    res.status(400).json({ error: "Le titre et la promotion sont requis" });
    return;
  }
  const db = readDb();
  db.courses = db.courses || [];
  const newCourse = {
    id: `c-${Date.now()}`,
    titre,
    coefficient: Number(coefficient) || 3,
    progress: 0,
    unites: ["Chapitre 1: Introduction"],
    professeur_id: professeur_id || "",
    promotion_id,
    prochain_cours: prochain_cours || "À définir"
  };
  db.courses.push(newCourse);
  writeDb(db);
  res.status(201).json(newCourse);
});

// BULK IMPORT STUDENTS WITH COLUMN MAPPING
adminRouter.post("/admin/students/bulk", (req, res) => {
  const { students } = req.body;
  if (!students || !Array.isArray(students)) {
    res.status(400).json({ error: "Liste d'étudiants invalide" });
    return;
  }
  const db = readDb();
  db.students = db.students || [];
  
  const imported: any[] = [];
  students.forEach((s: any) => {
    if (!s.name) return;
    const newStud = {
      id: `usr-etudiant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: s.name,
      matricule: s.matricule || `221-M${Math.floor(100 + Math.random() * 900)}`,
      promotion_id: s.promotion_id || "p-1",
      average: s.average ? Number(s.average) : 12.0,
      gpa: s.gpa ? Number(s.gpa) : 2.5,
      mood: s.mood || "Nouveau",
      statutFrais: s.statutFrais || "Régler",
      observations: s.observations || []
    };
    db.students.push(newStud);
    imported.push(newStud);
  });
  
  writeDb(db);
  res.status(201).json({ success: true, count: imported.length, imported });
});

// ADD OBSERVATION / FOLLOW-UP NOTE ON A STUDENT
adminRouter.post("/admin/students/:id/observations", (req, res) => {
  const { id } = req.params;
  const { text, type, auteur } = req.body;
  if (!text) {
    res.status(400).json({ error: "Le texte de l'observation est requis" });
    return;
  }
  const db = readDb();
  db.students = db.students || [];
  const found = db.students.find((s: any) => s.id === id);
  if (found) {
    found.observations = found.observations || [];
    found.observations.push({
      id: `obs-${Date.now()}`,
      text,
      type: type || "Général",
      date: new Date().toISOString().split('T')[0],
      auteur: auteur || "Administrateur"
    });
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Étudiant introuvable" });
  }
});

// PERSONNEL MANAGEMENT (GET, POST, DELETE)
adminRouter.get("/admin/personnel", (req, res) => {
  const db = readDb();
  const professors = db.professors || [];
  const staff = (db as any).staff || [
    { id: "staff-1", name: "Malick Sow", email: "malick.sow@ecole221.sn", role: "Scolarité", telephone: "77 123 45 67" },
    { id: "staff-2", name: "Fatoumata Ba", email: "fatou.ba@ecole221.sn", role: "Administrateur", telephone: "78 456 12 34" },
    { id: "staff-3", name: "Ousmane Fall", email: "vigile221@gmail.com", role: "Vigile", telephone: "70 987 65 43" }
  ];
  res.json({ professors, staff });
});

adminRouter.post("/admin/personnel", (req, res) => {
  const { name, email, role, telephone } = req.body;
  if (!name || !email || !role) {
    res.status(400).json({ error: "Le nom, l'email et le rôle sont requis" });
    return;
  }
  const db = readDb();
  if (role === "Professeur") {
    db.professors = db.professors || [];
    const newProf = { id: `prof-${Date.now()}`, name, email };
    db.professors.push(newProf);
    writeDb(db);
    res.status(201).json(newProf);
  } else {
    (db as any).staff = (db as any).staff || [];
    const newStaff = { id: `staff-${Date.now()}`, name, email, role, telephone: telephone || "Non renseigné" };
    (db as any).staff.push(newStaff);
    writeDb(db);
    res.status(201).json(newStaff);
  }
});

adminRouter.delete("/admin/personnel/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (id.startsWith("prof-")) {
    db.professors = (db.professors || []).filter((p: any) => p.id !== id);
  } else {
    (db as any).staff = ((db as any).staff || []).filter((s: any) => s.id !== id);
  }
  writeDb(db);
  res.json({ success: true });
});
