import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

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

academicRouter.post("/homeworks/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { fileStr } = req.body;
  const db = readDb();
  const homeworks = db.homeworks || [];
  const found = homeworks.find(h => h.id === id);
  if (!found) {
    res.status(404).json({ error: "Devoir introuvable" });
    return;
  }

  let fileUrl = "devoir_soumission_" + Date.now() + ".pdf";
  if (fileStr) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({
        cloud_name: "qudmvipg",
        api_key: "423861318775332",
        api_secret: "LwQXYD_L2befowdg2wNItSF-s0A"
      });
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        resource_type: "auto",
        folder: "ecole221"
      });
      fileUrl = uploadResponse.secure_url;
    } catch (err) {
      console.error("Cloudinary submit error:", err);
    }
  }

  found.statut = "soumis";
  found.progress = 100;
  found.submittedFiles = found.submittedFiles || [];
  found.submittedFiles.push(fileUrl);
  writeDb(db);
  res.json({ success: true, item: found });
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
  const db = readDb() as any;
  const context = getStudentContext(req.headers.authorization || "");
  const slots = db.planningSlots || [];

  if (!context) {
    res.json(db.sessions || []);
    return;
  }

  const promoId = context.promotion.id; // "p-1", "p-2", etc.
  const mappedClassId = promoId === "p-2" ? "c-2" : "c-1"; 

  const studentSlots = slots.filter((s: any) => s.classeId === mappedClassId);

  const mappedSessions = studentSlots.map((s: any) => {
    const dayMap: Record<string, string> = {
      'Lundi': 'LUN',
      'Mardi': 'MAR',
      'Mercredi': 'MER',
      'Jeudi': 'JEU',
      'Vendredi': 'VEN',
      'Samedi': 'VEN'
    };
    
    let heureDebut = "08:00";
    let heureFin = "10:00";
    if (s.slot && s.slot.includes('-')) {
      const parts = s.slot.split('-');
      const cleanPart = (p: string) => {
        const num = parseInt(p.replace(/[^\d]/g, ''), 10);
        return isNaN(num) ? "08" : String(num).padStart(2, '0');
      };
      heureDebut = `${cleanPart(parts[0])}:00`;
      heureFin = `${cleanPart(parts[1])}:00`;
    }

    return {
      id: s.id,
      nom: s.subject || "Cours",
      jour: dayMap[s.day] || "LUN",
      jourComplet: s.day || "LUNDI",
      dateStr: "Aujourd'hui",
      heureDebut,
      heureFin,
      heureStr: s.slot || "08:00 - 10:00",
      type: "CM",
      salle: s.roomName || "Salle de classe",
      professeur: s.prof || "Professeur",
      description: `Cours de ${s.subject || "Cours"} dispensé par ${s.prof || "Professeur"} en ${s.roomName || "Salle de classe"}.`,
      status: s.isAbsent || s.status === 'annule' ? "annule" : (s.isLive ? "actuel" : "a_venir"),
      cancellationReason: s.cancellationReason || ""
    };
  });

  res.json(mappedSessions);
});
