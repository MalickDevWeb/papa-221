import { Router } from "express";
import { readDb, writeDb } from "../db";
import { validateDynamicBadge } from "../qrSecurity";

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

  const validation = validateDynamicBadge(badgeId);
  if (!validation.valid) {
    lastScanResult = {
      badgeOwner: "Inconnu",
      studentId: badgeId.substring(0, 15) + (badgeId.length > 15 ? "..." : ""),
      statut: "Refusé",
      message: validation.error || "Code QR non reconnu par l'École 221",
      assiduite: "0%",
      statutFrais: "Inconnu",
      zone: "Portail Entrée",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };
    res.json(lastScanResult);
    return;
  }

  const targetMatricule = validation.matricule!.toLowerCase().trim();
  const matchedStudent = students.find(s => s.matricule.toLowerCase().trim() === targetMatricule);

  if (!matchedStudent) {
    lastScanResult = {
      badgeOwner: "Inconnu",
      studentId: validation.matricule,
      statut: "Refusé",
      message: "Étudiant non enregistré dans la base de données",
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

  // Determine attendance type dynamically (Arrival vs Departure) based on successful/valid scans
  const pastAttendances = (db.attendances || []).filter(a => a.student_id === matchedStudent.id);
  const validAttendances = pastAttendances.filter(a => a.status !== "Refusé");
  const nextType = validAttendances.length % 2 === 0 ? "arrivée" : "départ";

  const isLatePayment = matchedStudent.statutFrais === "Paiement en retard";

  let scanStatus = isLatePayment ? "Refusé" : "Validé d'office";
  let scanMessage = isLatePayment 
    ? "Accès refusé - Scolarité non réglée"
    : `Accès autorisé - Promotion ${promoName} (${nextType})`;

  // Rule: Must wait at least 2 minutes (simulating 1 hour) between entry (arrivée) and exit (départ)
  if (!isLatePayment && nextType === "départ" && validAttendances.length > 0) {
    const lastArrival = validAttendances[0];
    const lastArrivalTime = new Date(lastArrival.timestamp).getTime();
    const currentTime = Date.now();
    const diffMs = currentTime - lastArrivalTime;
    const delayMs = 2 * 60 * 1000; // 2 minutes to simulate 1 hour

    if (diffMs < delayMs) {
      const remainingSec = Math.ceil((delayMs - diffMs) / 1000);
      scanStatus = "Refusé";
      scanMessage = `Tu es déjà entré. Veuillez attendre encore ${remainingSec} seconde(s) avant de pouvoir marquer votre sortie.`;
    }
  }

  const newAttendance = {
    id: "att-" + Date.now(),
    student_id: matchedStudent.id,
    timestamp: new Date().toISOString(),
    type: nextType,
    method: "QR Code Scan",
    status: scanStatus,
    salle: "Portail Principal",
    location: "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441"
  };

  if (!db.attendances) db.attendances = [];
  db.attendances.unshift(newAttendance);
  writeDb(db);

  lastScanResult = {
    badgeOwner: matchedStudent.name,
    studentId: matchedStudent.matricule,
    statut: scanStatus === "Refusé" ? "Refusé" : "Autorisé",
    message: scanMessage,
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
