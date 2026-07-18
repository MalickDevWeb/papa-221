import { Router } from "express";
import { readDb, writeDb } from "../db";
import { generateQRToken } from "../qrSecurity";

export const interopStudentProfRouter = Router();

// GET /api/student/dashboard
interopStudentProfRouter.get("/student/dashboard", (req, res) => {
  const db = readDb();
  const student = (db.students && db.students[0]) || { id: "usr-etudiant-01", name: "Assane Diop", matricule: "221-M382" };
  const absences = (db.attendances || []).filter(a => a.student_id === student.id && a.status === "Absent").length;
  res.json({
    student,
    gradesCount: 4,
    absences,
    scheduleTodayCount: 2
  });
});

// GET /api/student/digital-badge
interopStudentProfRouter.get("/student/digital-badge", (req, res) => {
  const db = readDb();
  const student = (db.students && db.students[0]) || { id: "usr-etudiant-01", name: "Assane Diop", matricule: "221-M382" };
  const minuteEpoch = Math.floor(Date.now() / 60000);
  const token = generateQRToken(student.matricule, minuteEpoch);
  res.json({
    matricule: student.matricule,
    name: student.name,
    qrContent: `STU_SECURE:${student.matricule}:${minuteEpoch}:${token}`,
    allowedAccess: (student as any).statutFrais !== "Paiement en retard"
  });
});

// GET /api/prof/classes/:id/students
interopStudentProfRouter.get("/prof/classes/:id/students", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const students = db.students || [];
  const filtered = students.filter(s => s.promotion_id === id);
  res.json(filtered);
});

// POST /api/prof/attendance/submit
interopStudentProfRouter.post("/prof/attendance/submit", (req, res) => {
  const { classId, absences } = req.body;
  if (!classId || !Array.isArray(absences)) {
    res.status(400).json({ error: "classId et absences (array) sont requis" });
    return;
  }
  const db = readDb() as any;
  db.attendances = db.attendances || [];
  absences.forEach((sId: string) => {
    db.attendances.unshift({
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      student_id: sId,
      timestamp: new Date().toISOString(),
      type: "absence",
      method: "Prof Roll Call",
      status: "Absent",
      salle: "Salle de classe",
      location: "Dakar Campus"
    });
  });
  writeDb(db);
  res.json({ success: true, count: absences.length });
});

// GET /api/prof/today-schedule
interopStudentProfRouter.get("/prof/today-schedule", (req, res) => {
  const db = readDb() as any;
  const sessions = db.sessions || [];
  res.json(sessions);
});
