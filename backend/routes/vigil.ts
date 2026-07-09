import { Router } from "express";
import { readDb, writeDb } from "../db";

export const vigilRouter = Router();

let lastScanResult: any = null;

vigilRouter.get("/vigil/profile", (req, res) => {
  res.json({
    id: "usr-vigil-01",
    nom: "Diallo",
    prenom: "Aboulaye",
    badgeId: "VIGIL-001",
    equipe: "Équipe A",
    derniereConnexion: "Aujourd'hui, 08:00",
    statut: "Opérationnel"
  });
});

vigilRouter.post("/vigil/scan", (req, res) => {
  const { badgeId } = req.body;
  if (!badgeId) {
    res.status(400).json({ error: "badgeId est requis" });
    return;
  }

  const db = readDb();
  const students = db.students || [];
  const promotions = db.promotions || [];

  const normBadge = String(badgeId).toLowerCase().trim();

  // Robustly find student matching badge content substring
  const matchedStudent = students.find(s => {
    const normMatricule = s.matricule.toLowerCase().trim();
    const normId = s.id.toLowerCase().trim();
    const normName = s.name.toLowerCase().replace(/\s+/g, '-').trim();
    return normBadge.includes(normMatricule) || 
           normBadge.includes(normId) || 
           normBadge.includes(normName) ||
           normMatricule.includes(normBadge);
  });

  if (!matchedStudent) {
    lastScanResult = {
      badgeOwner: "Inconnu",
      studentId: badgeId,
      statut: "Refusé",
      message: "Code QR non reconnu par l'École 221",
      assiduite: "0%",
      statutFrais: "Inconnu",
      zone: "Portail Entrée",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };
    res.json(lastScanResult);
    return;
  }

  const promotion = promotions.find(p => p.id === matchedStudent.promotion_id);
  const promoName = promotion ? promotion.name : "École 221";

  // Determine attendance type dynamically (Arrival vs Departure)
  const pastAttendances = (db.attendances || []).filter(a => a.student_id === matchedStudent.id);
  const nextType = pastAttendances.length % 2 === 0 ? "arrivée" : "départ";

  const isLatePayment = matchedStudent.statutFrais === "Paiement en retard";

  const newAttendance = {
    id: "att-" + Date.now(),
    student_id: matchedStudent.id,
    timestamp: new Date().toISOString(),
    type: nextType,
    method: "QR Code Scan",
    status: isLatePayment ? "Refusé" : "Validé d'office",
    salle: "Portail Principal",
    location: "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441"
  };

  if (!db.attendances) db.attendances = [];
  db.attendances.unshift(newAttendance);
  writeDb(db);

  lastScanResult = {
    badgeOwner: matchedStudent.name,
    studentId: matchedStudent.matricule,
    statut: isLatePayment ? "Refusé" : "Autorisé",
    message: isLatePayment 
      ? "Accès refusé - Scolarité non réglée"
      : `Accès autorisé - Promotion ${promoName} (${nextType})`,
    assiduite: `${Math.round(matchedStudent.average * 6)}% d'assiduité`,
    statutFrais: isLatePayment ? "Paiement en retard" : "Scolarité à jour",
    zone: "Portail Entrée",
    time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  };

  res.json(lastScanResult);
});

vigilRouter.get("/vigil/last-scan", (req, res) => {
  res.json(lastScanResult || {
    badgeOwner: "Moussa Gueye",
    studentId: "221-M382",
    statut: "Autorisé",
    message: "Accès autorisé - Promotion 221-GL",
    assiduite: "94% d'assiduité",
    statutFrais: "Scolarité à jour",
    zone: "Portail Entrée",
    time: "Dernier scan"
  });
});

vigilRouter.get("/vigil/check-ins", (req, res) => {
  const db = readDb();
  const attendances = db.attendances || [];
  const students = db.students || [];

  const checkIns = attendances.map((a: any) => {
    const s = students.find((st: any) => st.id === a.student_id);
    const dateObj = new Date(a.timestamp);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();

    return {
      id: a.id,
      name: s ? s.name : "Inconnu",
      studentId: s ? s.matricule : (a.student_id || "N/A"),
      statut: (a.status === "Refusé" ? "Refusé" : "Autorisé"),
      time: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      date: isToday ? "Aujourd'hui" : dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      type: a.method || "Scanner",
      avatar: null
    };
  });

  res.json(checkIns);
});
