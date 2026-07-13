import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

export const attendanceRouter = Router();

attendanceRouter.get("/attendances", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const list = db.attendances || [];
  const filtered = list.filter((a) => a.student_id === context.student.id);
  res.json(filtered);
});

attendanceRouter.post("/attendances", (req, res) => {
  const { type, method, location, salle } = req.body;
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  if (!db.attendances) {
    db.attendances = [];
  }
  const newLog = {
    id: "att-" + Date.now(),
    student_id: context.student.id, // Relational Foreign Key
    timestamp: new Date().toISOString(),
    type: type || "arrivée",
    method: method || "QR Code",
    status: "Validé d'office",
    salle: salle || "Amphi A",
    location: location || "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441"
  };
  db.attendances.unshift(newLog);
  writeDb(db);
  res.json({ success: true, item: newLog });
});
