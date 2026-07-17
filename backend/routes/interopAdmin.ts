import { Router } from "express";
import { readDb, writeDb } from "../db";

export const interopAdminRouter = Router();

// POST /api/admin/gates/assign
interopAdminRouter.post("/admin/gates/assign", (req, res) => {
  const { gate, guard } = req.body;
  if (!gate || !guard) {
    res.status(400).json({ error: "La porte et le vigile sont requis" });
    return;
  }
  const db = readDb() as any;
  db.gateAssignment = { gate, guard, qrCode: `SESSION-QR-${Date.now()}` };
  writeDb(db);
  res.json({ success: true, assignment: db.gateAssignment });
});

// PATCH /api/admin/students/:id/status
interopAdminRouter.patch("/admin/students/:id/status", (req, res) => {
  const { id } = req.params;
  const { statutFrais } = req.body;
  const db = readDb();
  const students = db.students || [];
  const student = students.find(s => s.id === id);
  if (!student) {
    res.status(404).json({ error: "Étudiant introuvable" });
    return;
  }
  (student as any).statutFrais = statutFrais;
  writeDb(db);
  res.json({ success: true, student });
});

// POST /api/admin/schedule/assign
interopAdminRouter.post("/admin/schedule/assign", (req, res) => {
  const { courseId, day, time, room, professorId } = req.body;
  if (!courseId || !day || !time || !room) {
    res.status(400).json({ error: "Tous les champs de planification sont requis" });
    return;
  }
  const db = readDb() as any;
  db.sessions = db.sessions || [];
  const newSession = {
    id: `session-${Date.now()}`,
    course_id: courseId,
    jour: day.substring(0, 3).toUpperCase(),
    jourComplet: day,
    heureStr: time,
    salle: room,
    professeur_id: professorId || ""
  };
  db.sessions.push(newSession);
  writeDb(db);
  res.json({ success: true, session: newSession });
});

// GET /api/admin/realtime-logs
interopAdminRouter.get("/admin/realtime-logs", (req, res) => {
  const db = readDb() as any;
  const scans = db.scanLogs || [];
  res.json(scans);
});

// GET /api/admin/students/:id/documents
interopAdminRouter.get("/admin/students/:id/documents", (req, res) => {
  const { id } = req.params;
  const db = readDb() as any;
  if (!db.studentDocs) {
    db.studentDocs = {};
  }
  const docs = db.studentDocs[id] || [
    { id: "doc-1", name: "Carte_Identite_Senegal.pdf", size: "1.2 Mo", url: "https://res.cloudinary.com/qudmvipg/image/upload/v1/ecole221/sample.pdf" },
    { id: "doc-2", name: "Baccalaureat_Officiel.pdf", size: "840 Ko", url: "https://res.cloudinary.com/qudmvipg/image/upload/v1/ecole221/sample.pdf" }
  ];
  res.json(docs);
});

// POST /api/admin/students/:id/documents
interopAdminRouter.post("/admin/students/:id/documents", (req, res) => {
  const { id } = req.params;
  const { name, size, url } = req.body;
  if (!name || !size || !url) {
    res.status(400).json({ error: "Les champs name, size et url sont requis" });
    return;
  }
  const db = readDb() as any;
  if (!db.studentDocs) {
    db.studentDocs = {};
  }
  if (!db.studentDocs[id]) {
    db.studentDocs[id] = [
      { id: "doc-1", name: "Carte_Identite_Senegal.pdf", size: "1.2 Mo", url: "https://res.cloudinary.com/qudmvipg/image/upload/v1/ecole221/sample.pdf" },
      { id: "doc-2", name: "Baccalaureat_Officiel.pdf", size: "840 Ko", url: "https://res.cloudinary.com/qudmvipg/image/upload/v1/ecole221/sample.pdf" }
    ];
  }
  const newDoc = {
    id: `doc-${Date.now()}`,
    name,
    size,
    url
  };
  db.studentDocs[id].push(newDoc);
  writeDb(db);
  res.json({ success: true, documents: db.studentDocs[id] });
});

