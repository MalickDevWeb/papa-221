import { Router } from "express";
import { readDb, writeDb } from "../db";

export const candidaturesRouter = Router();

// Get Candidature Settings (Public)
candidaturesRouter.get("/candidatures/settings", (req, res) => {
  const db = readDb();
  const settings = (db as any).candidatureSettings || {
    ouvert: true,
    dateOuverture: "2026-06-01",
    dateFermeture: "2026-09-30",
    messageAvis: "La campagne d'inscription officielle pour l'année universitaire 2026/2027 est active."
  };
  res.json(settings);
});

// Update Candidature Settings (Admin)
candidaturesRouter.post("/admin/candidatures/settings", (req, res) => {
  const { ouvert, dateOuverture, dateFermeture, messageAvis } = req.body;
  const db = readDb();
  
  (db as any).candidatureSettings = {
    ouvert: ouvert === undefined ? true : !!ouvert,
    dateOuverture: dateOuverture || "2026-06-01",
    dateFermeture: dateFermeture || "2026-09-30",
    messageAvis: messageAvis || ""
  };
  
  writeDb(db);
  res.json({ success: true, settings: (db as any).candidatureSettings });
});

// Submit a candidate application (Public)
candidaturesRouter.post("/candidatures", (req, res) => {
  const {
    nomComplet, email, telephone, typeDepot, promotionNom, motivation,
    numeroCni, dernierEtablissement, dernierDiplome,
    nomFichierCni, nomFichierBulletin, nomFichierDiplome
  } = req.body;

  if (!nomComplet || !email || !telephone || !typeDepot || !promotionNom) {
    res.status(400).json({ error: "Tous les champs requis doivent être remplis." });
    return;
  }

  const db = readDb();
  
  // Check campaign dates
  const settings = (db as any).candidatureSettings || {
    ouvert: true,
    dateOuverture: "2026-06-01",
    dateFermeture: "2026-09-30",
    messageAvis: ""
  };

  if (!settings.ouvert) {
    res.status(400).json({ error: "Le dépôt de candidatures est actuellement fermé par l'administration." });
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (settings.dateOuverture && todayStr < settings.dateOuverture) {
    res.status(400).json({ error: `Le dépôt de candidatures n'a pas encore débuté (Ouverture prévue le ${settings.dateOuverture}).` });
    return;
  }
  if (settings.dateFermeture && todayStr > settings.dateFermeture) {
    res.status(400).json({ error: `Le délai de dépôt de candidatures est dépassé (Clôture le ${settings.dateFermeture}).` });
    return;
  }

  const candidatures = (db as any).candidatures || [];

  const newCandidature = {
    id: `cand-${Date.now()}`,
    nomComplet,
    email,
    telephone,
    typeDepot, // 'En ligne' or 'Présentiel'
    promotionNom,
    motivation: motivation || "",
    numeroCni: numeroCni || "N/A",
    dernierEtablissement: dernierEtablissement || "N/A",
    dernierDiplome: dernierDiplome || "N/A",
    nomFichierCni: nomFichierCni || "Non fourni",
    nomFichierBulletin: nomFichierBulletin || "Non fourni",
    nomFichierDiplome: nomFichierDiplome || "Non fourni",
    statut: "En attente", // 'En attente', 'Accepté', 'Refusé'
    dateSoumission: new Date().toISOString()
  };

  candidatures.push(newCandidature);
  (db as any).candidatures = candidatures;
  writeDb(db);

  res.status(201).json({ success: true, item: newCandidature });
});

// Retrieve all applications (Admin)
candidaturesRouter.get("/admin/candidatures", (req, res) => {
  const db = readDb();
  const candidatures = (db as any).candidatures || [];
  res.json(candidatures);
});

// Process application status (Admin)
candidaturesRouter.post("/admin/candidatures/:id/status", (req, res) => {
  const { id } = req.params;
  const { statut } = req.body; // 'Accepté', 'Refusé', 'En attente'
  if (!statut) {
    res.status(400).json({ error: "Le statut est requis." });
    return;
  }

  const db = readDb();
  const candidatures = (db as any).candidatures || [];
  const found = candidatures.find((c: any) => c.id === id);

  if (!found) {
    res.status(404).json({ error: "Candidature introuvable." });
    return;
  }

  found.statut = statut;
  (db as any).candidatures = candidatures;

  // Auto-create student if accepted
  if (statut === "Accepté") {
    db.students = db.students || [];
    const studentExists = db.students.some((s: any) => s.email === found.email || s.name === found.nomComplet);
    if (!studentExists) {
      const randNum = Math.floor(100 + Math.random() * 900);
      const matricule = `221-C${randNum}`;
      // Find a matching promotion or default to p-1
      const promo = (db.promotions || []).find((p: any) => p.name.toLowerCase().includes(found.promotionNom.toLowerCase())) || { id: "p-1" };

      const newStudent = {
        id: `usr-etudiant-cand-${Date.now()}`,
        name: found.nomComplet,
        matricule,
        promotion_id: promo.id,
        average: 12.0,
        gpa: 2.8,
        mood: "Nouveau",
        statutFrais: "Scolarité à jour",
        email: found.email
      };
      db.students.push(newStudent);
    }
  }

  writeDb(db);
  res.json({ success: true, item: found });
});
