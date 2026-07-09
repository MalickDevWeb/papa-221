import { Router } from "express";
import { readDb, writeDb } from "../db";

export const academicRouter = Router();

academicRouter.get("/courses", (req, res) => {
  const db = readDb();
  res.json(db.courses || []);
});

academicRouter.get("/homeworks", (req, res) => {
  const db = readDb();
  res.json(db.homeworks || []);
});

academicRouter.post("/homeworks/:id/start", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const homeworks = db.homeworks || [];
  const found = homeworks.find(h => h.id === id);
  if (found) {
    found.statut = "en_cours";
    found.progress = found.progress || 0;
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Devoir introuvable" });
  }
});

academicRouter.post("/homeworks/:id/progress", (req, res) => {
  const { id } = req.params;
  const { addedProgress } = req.body;
  const db = readDb();
  const homeworks = db.homeworks || [];
  const found = homeworks.find(h => h.id === id);
  if (found) {
    found.progress = Math.min(100, (found.progress || 0) + (addedProgress || 0));
    if (found.progress >= 100) {
      found.statut = "soumis";
    }
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Devoir introuvable" });
  }
});

academicRouter.post("/homeworks/:id/submit", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const homeworks = db.homeworks || [];
  const found = homeworks.find(h => h.id === id);
  if (found) {
    found.statut = "soumis";
    found.progress = 100;
    found.submittedFiles = found.submittedFiles || [];
    found.submittedFiles.push("devoir_soumission_" + Date.now() + ".pdf");
    writeDb(db);
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Devoir introuvable" });
  }
});

academicRouter.get("/grades", (req, res) => {
  const db = readDb();
  res.json(db.grades || []);
});

academicRouter.post("/grades/:id/review", (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Demande de révision soumise pour la note ${id}` });
});

academicRouter.get("/schedule", (req, res) => {
  const db = readDb();
  res.json(db.sessions || []);
});
