import { Router } from "express";
import { readDb, writeDb } from "../db";
import { validateDynamicBadge } from "../qrSecurity";

export const interopSecurityRouter = Router();

// GET /api/security/checkpoint-status
interopSecurityRouter.get("/security/checkpoint-status", (req, res) => {
  const db = readDb() as any;
  const assignment = db.gateAssignment || {
    gate: "Portail Principal",
    guard: "Diallo Aboulaye",
    qrCode: "SESSION-QR-DEFAULT"
  };
  res.json({
    status: "Actif",
    ...assignment,
    lastUpdated: new Date().toISOString()
  });
});

// POST /api/security/scan-logs
interopSecurityRouter.post("/security/scan-logs", (req, res) => {
  const { badgeId } = req.body;
  if (!badgeId) {
    res.status(400).json({ error: "badgeId est requis" });
    return;
  }

  const db = readDb() as any;
  const students = db.students || [];

  const timestamp = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  let scanResult: any;

  const validation = validateDynamicBadge(badgeId);
  if (!validation.valid) {
    scanResult = {
      id: `scan-${Date.now()}`,
      badgeOwner: "Inconnu",
      studentId: badgeId.substring(0, 15) + (badgeId.length > 15 ? "..." : ""),
      statut: "Refusé",
      message: validation.error || "Badge non reconnu par le système",
      time: timeStr,
      timestamp
    };
  } else {
    const targetMatricule = validation.matricule!.toLowerCase().trim();
    const matched = students.find((s: any) => s.matricule.toLowerCase().trim() === targetMatricule);

    if (!matched) {
      scanResult = {
        id: `scan-${Date.now()}`,
        badgeOwner: "Inconnu",
        studentId: validation.matricule,
        statut: "Refusé",
        message: "Étudiant non enregistré dans la base de données",
        time: timeStr,
        timestamp
      };
    } else {
      const isLatePayment = matched.statutFrais === "Paiement en retard";
      const status = isLatePayment ? "Refusé" : "Autorisé";
      const message = isLatePayment ? "Accès refusé - Scolarité non réglée" : "Accès autorisé - Étudiant en règle";

      if (!isLatePayment) {
        matched.presenceStatus = "Présent";
        if (!db.attendances) db.attendances = [];
        db.attendances.unshift({
          id: `att-${Date.now()}`,
          student_id: matched.id,
          timestamp,
          type: "arrivée",
          method: "Vigil Mobile Scan",
          status: "Validé d'office",
          salle: "Portail Principal",
          location: "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441"
        });
      }

      scanResult = {
        id: `scan-${Date.now()}`,
        badgeOwner: matched.name,
        studentId: matched.matricule,
        statut: status,
        message,
        time: timeStr,
        timestamp
      };
    }
  }

  db.scanLogs = db.scanLogs || [];
  db.scanLogs.unshift(scanResult);
  if (db.scanLogs.length > 50) {
    db.scanLogs = db.scanLogs.slice(0, 50);
  }

  writeDb(db);
  res.json(scanResult);
});
