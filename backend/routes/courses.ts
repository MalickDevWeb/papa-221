import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

export const coursesRouter = Router();

coursesRouter.get("/courses", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const professors = db.professors || [];
  
  // Join courses with professor name using foreign key
  const studentCourses = context.courses.map((c) => {
    const prof = professors.find((p) => p.id === c.professeur_id);
    return {
      id: c.id,
      titre: c.titre,
      coefficient: c.coefficient,
      progress: c.progress,
      unites: c.unites,
      professeur: prof ? prof.name : "Professeur",
      prochain_cours: c.prochain_cours
    };
  });

  res.json(studentCourses);
});

coursesRouter.post("/courses/:id/progress", (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  const db = readDb();
  if (!db.courses) db.courses = [];
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx !== -1) {
    db.courses[idx].progress = progress;
    writeDb(db);
    res.json({ success: true, course: db.courses[idx] });
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});
