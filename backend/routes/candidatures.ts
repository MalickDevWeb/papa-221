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

  // Pre-create pending user for Online/Visitor
  const users = (db as any).users || [];
  const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!userExists) {
    users.push({
      id: `usr-cand-${Date.now()}`,
      email: email.toLowerCase().trim(),
      nom: nomComplet,
      prenom: "Candidat",
      role: "VISITEUR",
      isActivated: false,
      password: null,
      token: `fake-jwt-token-visitor-${Date.now()}`
    });
    (db as any).users = users;
  }

  writeDb(db);
  res.status(201).json({ success: true, item: newCandidature, token: `fake-jwt-token-visitor-${Date.now()}` });
});

// Canal B: Online application submit (Alternative Route)
candidaturesRouter.post("/admissions/online", (req, res) => {
  const {
    nomComplet, email, telephone, promotionNom, motivation,
    numeroCni, dernierEtablissement, dernierDiplome,
    nomFichierCni, nomFichierBulletin, nomFichierDiplome
  } = req.body;

  if (!nomComplet || !email || !telephone || !promotionNom) {
    res.status(400).json({ error: "Le nom, email, téléphone et la promotion sont requis." });
    return;
  }

  const db = readDb();
  const candidatures = (db as any).candidatures || [];

  const newCandidature = {
    id: `cand-${Date.now()}`,
    nomComplet,
    email,
    telephone,
    typeDepot: "En ligne",
    promotionNom,
    motivation: motivation || "",
    numeroCni: numeroCni || "N/A",
    dernierEtablissement: dernierEtablissement || "N/A",
    dernierDiplome: dernierDiplome || "Baccalauréat Général",
    nomFichierCni: nomFichierCni || "Non fourni",
    nomFichierBulletin: nomFichierBulletin || "Non fourni",
    nomFichierDiplome: nomFichierDiplome || "Non fourni",
    statut: "En attente",
    dateSoumission: new Date().toISOString()
  };

  candidatures.push(newCandidature);
  (db as any).candidatures = candidatures;

  // Add visitor user record
  const users = (db as any).users || [];
  const existingUserIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
  
  const token = `fake-jwt-token-visitor-${Date.now()}`;
  const newUser = {
    id: `usr-cand-${Date.now()}`,
    email: email.toLowerCase().trim(),
    nom: nomComplet,
    prenom: "Candidat",
    role: "VISITEUR",
    isActivated: false,
    password: null,
    token
  };

  if (existingUserIndex === -1) {
    users.push(newUser);
  } else {
    users[existingUserIndex].role = "VISITEUR";
    users[existingUserIndex].token = token;
  }
  
  (db as any).users = users;
  writeDb(db);

  res.status(201).json({
    success: true,
    item: newCandidature,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      nom: newUser.nom,
      role: "VISITEUR"
    }
  });
});

// Canal A: Physical Dépôt by Admin
candidaturesRouter.post("/admin/admissions/physical", (req, res) => {
  const { nomComplet, email, telephone, promotionNom, motivation, numeroCni } = req.body;

  if (!nomComplet || !email || !telephone || !promotionNom) {
    res.status(400).json({ error: "Tous les champs obligatoires (Nom, Email, Téléphone, Promotion) doivent être fournis." });
    return;
  }

  const db = readDb();
  const candidatures = (db as any).candidatures || [];

  const newCandidature = {
    id: `cand-${Date.now()}`,
    nomComplet,
    email,
    telephone,
    typeDepot: "Présentiel",
    promotionNom,
    motivation: motivation || "",
    numeroCni: numeroCni || "N/A",
    dernierEtablissement: "N/A",
    dernierDiplome: "Baccalauréat",
    nomFichierCni: "Présenté physiquement",
    nomFichierBulletin: "Présenté physiquement",
    nomFichierDiplome: "Présenté physiquement",
    statut: "En attente",
    dateSoumission: new Date().toISOString()
  };

  candidatures.push(newCandidature);
  (db as any).candidatures = candidatures;

  // Generate temporary identifier and activation token
  const tempIdentifier = `PHYS-${Math.floor(1000 + Math.random() * 9000)}`;
  const activationToken = `ACT-${Math.floor(100000 + Math.random() * 900000)}`;

  // Store in pending users list
  const users = (db as any).users || [];
  users.push({
    id: `usr-cand-${Date.now()}`,
    email: email.toLowerCase().trim(),
    nom: nomComplet,
    prenom: "Candidat",
    role: "VISITEUR",
    isActivated: false,
    tempIdentifier,
    activationToken,
    password: activationToken, // Allows using activation token as password at login
    token: `fake-jwt-token-phys-${Date.now()}`
  });

  (db as any).users = users;
  writeDb(db);

  res.json({
    success: true,
    item: newCandidature,
    tempIdentifier,
    activationToken
  });
});

// Finalize visitor password setup
candidaturesRouter.post("/admissions/finalize-account", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "L'adresse email et le mot de passe sont obligatoires." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
    return;
  }

  const db = readDb();
  const users = (db as any).users || [];
  const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!foundUser) {
    res.status(404).json({ error: "Aucun dossier candidat trouvé pour cet email." });
    return;
  }

  foundUser.password = password;
  foundUser.isActivated = true;
  foundUser.token = `fake-jwt-token-active-${Date.now()}`;
  
  (db as any).users = users;
  writeDb(db);

  res.json({
    success: true,
    token: foundUser.token,
    user: {
      id: foundUser.id,
      email: foundUser.email,
      nom: foundUser.nom,
      role: "VISITEUR"
    }
  });
});

// Real-time admission status for student
candidaturesRouter.get("/student/admission-status", (req, res) => {
  const email = req.query.email as string;

  if (!email) {
    res.status(400).json({ error: "Email requis pour consulter l'avancement." });
    return;
  }

  const db = readDb();
  const candidatures = (db as any).candidatures || [];
  const foundCand = candidatures.find((c: any) => c.email.toLowerCase() === email.toLowerCase().trim());

  const users = (db as any).users || [];
  const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());

  const role = foundUser ? foundUser.role : "VISITEUR";

  if (!foundCand) {
    // If no candidate record, but user exists
    res.json({
      statut: "Dossier Déposé",
      role
    });
    return;
  }

  res.json({
    statut: foundCand.statut, // 'En attente', 'Accepté', 'Refusé'
    role
  });
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

// Activate Student and mutate role from VISITEUR to STUDENT
candidaturesRouter.post("/admin/students/:id/activate", (req, res) => {
  const { id } = req.params; // candidature id or student ID
  const db = readDb();

  const candidatures = (db as any).candidatures || [];
  const foundCand = candidatures.find((c: any) => c.id === id || c.email === id);

  if (!foundCand) {
    res.status(404).json({ error: "Dossier d'inscription introuvable." });
    return;
  }

  // Set candidature status to accepted
  foundCand.statut = "Accepté";

  // Upgrade the user associated with this email
  const users = (db as any).users || [];
  const foundUser = users.find((u: any) => u.email.toLowerCase() === foundCand.email.toLowerCase());

  const matricule = `221-ETU-${Math.floor(1000 + Math.random() * 9000)}`;
  const qrCodeToken = `QR-STU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  if (foundUser) {
    foundUser.role = "ETUDIANT";
  } else {
    // If no user existed, create one
    users.push({
      id: `usr-etu-${Date.now()}`,
      email: foundCand.email.toLowerCase(),
      nom: foundCand.nomComplet,
      prenom: "Étudiant",
      role: "ETUDIANT",
      password: "ecole221",
      isActivated: true,
      token: `fake-jwt-token-stu-${Date.now()}`
    });
  }

  (db as any).users = users;

  // Add to active students list
  db.students = db.students || [];
  const studentIndex = db.students.findIndex((s: any) => s.email.toLowerCase() === foundCand.email.toLowerCase());
  
  const studentData = {
    id: `stu-${Date.now()}`,
    name: foundCand.nomComplet,
    matricule,
    promotion_id: "p-1",
    average: 14.5,
    gpa: 3.4,
    mood: "🎓 Admis officiellement à l'École 221 !",
    statutFrais: "Scolarité à jour",
    email: foundCand.email,
    qrCode: qrCodeToken
  };

  if (studentIndex === -1) {
    db.students.push(studentData);
  } else {
    db.students[studentIndex].matricule = matricule;
    db.students[studentIndex].qrCode = qrCodeToken;
    db.students[studentIndex].mood = "🎓 Admis officiellement à l'École 221 !";
  }

  writeDb(db);

  res.json({
    success: true,
    matricule,
    qrCode: qrCodeToken,
    email: foundCand.email
  });
});
