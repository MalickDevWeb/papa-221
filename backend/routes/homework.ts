import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

export const homeworkRouter = Router();

homeworkRouter.get("/homeworks", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const list = db.homeworks || [];
  const courses = db.courses || [];

  // Filter tasks belonging to courses of this student's promotion
  const studentCourseIds = new Set(context.courses.map((c) => c.id));
  const filtered = list.filter((t) => studentCourseIds.has(t.course_id));

  // Join with the courses table to populate course labels dynamically
  const joined = filtered.map((t) => {
    const course = courses.find((c) => c.id === t.course_id);
    const courseName = course ? course.titre : "Cours";
    return {
      ...t,
      cours: courseName,
      coursLabel: courseName
    };
  });

  res.json(joined);
});

homeworkRouter.post("/homeworks/:id/submit", (req, res) => {
  const { id } = req.params;
  const { fileName, comments } = req.body;
  const db = readDb();
  if (!db.homeworks) {
    db.homeworks = [];
  }
  const idx = db.homeworks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    db.homeworks[idx].statut = "soumis";
    if (!db.homeworks[idx].submittedFiles) {
      db.homeworks[idx].submittedFiles = [];
    }
    db.homeworks[idx].submittedFiles.push(fileName || "rendu_final_etudiant.zip");
    const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    db.homeworks[idx].deadlineStr = `Fini le ${dateStr}`;
    db.homeworks[idx].comments = comments || "";
    writeDb(db);
    res.json({ success: true, task: db.homeworks[idx] });
  } else {
    res.status(404).json({ error: "Homework task not found" });
  }
});
