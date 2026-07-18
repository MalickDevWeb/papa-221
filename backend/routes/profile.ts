import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

export const profileRouter = Router();

profileRouter.get("/profile", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student profile not found" });
    return;
  }
  const { student, promotion } = context;
  res.json({
    name: student.name,
    matricule: student.matricule,
    promotion: promotion.name,
    filiere: promotion.filiere,
    faculte: promotion.faculte,
    average: student.average,
    gpa: student.gpa,
    mood: student.mood
  });
});

profileRouter.post("/mood", (req, res) => {
  const { mood } = req.body;
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student profile not found" });
    return;
  }
  
  const db = readDb();
  if (db.students) {
    const idx = db.students.findIndex((s) => s.id === context.student.id);
    if (idx !== -1) {
      db.students[idx].mood = mood;
      writeDb(db);
    }
  }

  res.json({ success: true, mood });
});
