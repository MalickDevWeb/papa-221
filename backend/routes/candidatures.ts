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
    messageAvis: "La campagne d'inscription officielle pour l'année universitaire 2026/2027 est active.",
    showRegisterButton: true
  };
  res.json(settings);
});

// Update Candidature Settings (Admin)
candidaturesRouter.post("/admin/candidatures/settings", (req, res) => {
  const { ouvert, dateOuverture, dateFermeture, messageAvis, showRegisterButton } = req.body;
  const db = readDb();
  
  (db as any).candidatureSettings = {
    ouvert: ouvert === undefined ? true : !!ouvert,
    dateOuverture: dateOuverture || "2026-06-01",
    dateFermeture: dateFermeture || "2026-09-30",
    messageAvis: messageAvis || "",
    showRegisterButton: showRegisterButton === undefined ? true : !!showRegisterButton
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

// Get the entire Admissions/Candidatures state (dynamic, persistent)
candidaturesRouter.get("/admissions/db", (req, res) => {
  const db = readDb();
  let modified = false;

  if (!db.admissions_campaigns) {
    db.admissions_campaigns = [
      {
        id: "camp-1",
        title: "Licence 1 Génie Logiciel 2026",
        code: "BAC",
        state: "Ouverte",
        deadline: "2026-10-31",
        fees: 50000,
        requirements: ["Relevé de notes du Bac", "Copie de la CNI / Passeport", "Photo d'identité"],
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-2",
        title: "Admission Spécifique Licence 2 (L2)",
        code: "L2",
        state: "Ouverte",
        deadline: "2026-10-31",
        fees: 50000,
        requirements: ["Relevé de notes de L1", "Relevé de notes du Bac", "Justificatif de transfert"],
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-3",
        title: "Master 1 & 2 Management & Big Data",
        code: "M1",
        state: "Suspendue",
        deadline: "2026-08-30",
        fees: 75000,
        requirements: ["Diplôme de Licence", "Lettre de recommandation", "CV détaillé"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-4",
        title: "Validation des Acquis de l'Expérience (VAE)",
        code: "VAE",
        state: "Ouverte",
        deadline: "2026-11-15",
        fees: 50000,
        requirements: ["CV professionnel", "Justificatifs d'expérience (3 ans min)", "Lettre de motivation"],
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-5",
        title: "Doctorat en Intelligence Artificielle",
        code: "DOC",
        state: "Planifiée",
        deadline: "2026-07-31",
        fees: 100000,
        requirements: ["Projet de thèse", "Diplôme de Master", "Accord d'un directeur de thèse"],
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60"
      }
    ];
    modified = true;
  }

  if (!db.admissions_candidates) {
    db.admissions_candidates = [
      {
        id: "cand-2026-001",
        name: "Nafissatou Diallo",
        email: "nafi.diallo@gmail.com",
        type: "BAC",
        course: "Licence 1 Génie Logiciel",
        step: "new",
        docs: { diploma: true, idCard: false },
        registrationFeePaid: false,
        notifications: [
          { id: "not-1", type: "dossier_recu", message: "Dossier de candidature en L1 reçu par la scolarité.", sentAt: "2026-07-01T10:00:00Z" }
        ]
      },
      {
        id: "cand-2026-002",
        name: "Ibrahima Ba",
        email: "ibrahima.ba@gmail.com",
        type: "TRANSFER",
        course: "Licence 2 Génie Civil",
        step: "docs",
        docs: { diploma: true, idCard: true, transcripts: true, originalUniDecision: true },
        registrationFeePaid: false,
        details: {
          universityOfOrigin: "Université Cheikh Anta Diop (UCAD)",
          facultyOfOrigin: "FST",
          departmentOfOrigin: "Physique-Chimie",
          validatedCredits: 60,
          transferReason: "Rapprochement familial à Dakar",
          originalUniDecision: "Accord favorable du Doyen"
        },
        equivalence: {
          status: "pending",
          comparedProgram: "L1 Sciences de l'Ingénieur vs L1 Génie Civil",
          validatedCredits: 50,
          dispenses: ["Physique Générale", "Algèbre 1"],
          complements: ["Dessin Technique de Bâtiment"],
          decisionBy: "Commission Pédagogique"
        },
        notifications: [
          { id: "not-2", type: "dossier_recu", message: "Dossier de transfert universitaire enregistré.", sentAt: "2026-07-02T11:30:00Z" },
          { id: "not-3", type: "etude_equivalences", message: "Mise en étude des équivalences par la commission pédagogique.", sentAt: "2026-07-03T09:00:00Z" }
        ]
      },
      {
        id: "cand-2026-003",
        name: "Amadou Sow",
        email: "amadou.sow@gmail.com",
        type: "CHANGE_FILIERE",
        course: "Licence 2 Réseaux & Télécoms",
        step: "new",
        docs: { diploma: true, idCard: true, transcripts: true },
        registrationFeePaid: true,
        details: {
          oldFiliere: "Licence 1 Génie Civil",
          newFiliere: "Licence 2 Réseaux & Télécoms",
          reorientationReason: "Réalignement avec mon projet professionnel dans la cybersécurité"
        },
        notifications: []
      },
      {
        id: "cand-2026-004",
        name: "Fatou Bensouda",
        email: "fatou.bensouda@int.sn",
        type: "INT",
        course: "Master 1 Management & Big Data",
        step: "docs",
        docs: { diploma: true, idCard: true, passport: true, visa: true, equivalenceLetter: true },
        registrationFeePaid: false,
        details: {
          passportNumber: "N-SEN-1299831",
          visaStatus: "Visa d'études validé",
          insuranceChecked: true
        },
        notifications: [
          { id: "not-4", type: "dossier_recu", message: "Candidature internationale reçue.", sentAt: "2026-07-05T14:20:00Z" },
          { id: "not-5", type: "demande_pieces", message: "Copie de l'attestation d'équivalence consulaire validée.", sentAt: "2026-07-06T10:00:00Z" }
        ]
      },
      {
        id: "cand-2026-005",
        name: "Khadim Rassoul",
        email: "khadim.rassoul@gmail.com",
        type: "REINSCRIPTION",
        course: "Licence 3 Informatique",
        step: "admitted",
        docs: { diploma: true, idCard: true },
        registrationFeePaid: true,
        details: {
          previousYearValidated: true,
          unpaidDues: 0,
          sanctionsCount: 0
        },
        notifications: [
          { id: "not-6", type: "dossier_recu", message: "Demande de réinscription déposée.", sentAt: "2026-07-10T08:00:00Z" },
          { id: "not-7", type: "admission_conditionnelle", message: "Réinscription admissible après audit automatique des frais et du bulletin.", sentAt: "2026-07-11T12:00:00Z" }
        ]
      },
      {
        id: "cand-2026-006",
        name: "Chérif Ousmane Sarr",
        email: "cherif.sarr@gmail.com",
        type: "REINSCRIPTION",
        course: "Master 2 Administration des Affaires",
        step: "new",
        docs: { diploma: true, idCard: true },
        registrationFeePaid: false,
        details: {
          previousYearValidated: true,
          unpaidDues: 150000,
          sanctionsCount: 1
        },
        notifications: [
          { id: "not-8", type: "dossier_incomplet", message: "Alerte auto-check : Bloqué pour arriérés de paiement de l'année passée.", sentAt: "2026-07-12T09:15:00Z" }
        ]
      },
      {
        id: "cand-2026-007",
        name: "Marie-Antoinette Gomes",
        email: "marie.gomes@pro.sn",
        type: "VAE",
        course: "Master 2 Génie Logiciel (VAE)",
        step: "docs",
        docs: { diploma: true, idCard: true, transcripts: true },
        registrationFeePaid: true,
        details: {
          vaeExperienceYears: 8,
          vaeTargetDegree: "Master Professionnel Génie Logiciel"
        },
        notifications: [
          { id: "not-9", type: "etude_equivalences", message: "Dossier VAE transféré aux jurys académiques.", sentAt: "2026-07-12T16:00:00Z" }
        ]
      },
      {
        id: "cand-2026-008",
        name: "Souleymane Camara",
        email: "souleymane.camara@gmail.com",
        type: "EXCEPT",
        course: "Licence 3 Réseaux",
        step: "docs",
        docs: { diploma: true, idCard: true, officialDecisionDoc: true },
        registrationFeePaid: true,
        details: {
          exceptionalJustification: "Sportif sénégalais de haut niveau (Médaillé d'Or aux Jeux de l'UEMOA)",
          exceptionalAuthority: "Doyen de la Faculté / Convention Ministère des Sports",
          officialDecisionRef: "DEC-RECT-2026-342"
        },
        notifications: [
          { id: "not-10", type: "dossier_recu", message: "Dossier d'admission dérogatoire / exceptionnelle enregistré sous référence DEC-RECT-2026-342.", sentAt: "2026-07-13T10:00:00Z" }
        ]
      }
    ];
    modified = true;
  }

  if (!db.admissions_logs) {
    db.admissions_logs = [];
    modified = true;
  }

  if (!db.admissions_messages) {
    db.admissions_messages = [];
    modified = true;
  }

  if (modified) {
    writeDb(db);
  }

  res.json({
    candidates: db.admissions_candidates,
    campaigns: db.admissions_campaigns,
    auditLogs: db.admissions_logs,
    messages: db.admissions_messages
  });
});

// Update the full or partial Admissions state
candidaturesRouter.post("/admissions/db", (req, res) => {
  const { candidates, campaigns, auditLogs, messages } = req.body;
  const db = readDb();

  if (candidates !== undefined) db.admissions_candidates = candidates;
  if (campaigns !== undefined) db.admissions_campaigns = campaigns;
  if (auditLogs !== undefined) db.admissions_logs = auditLogs;
  if (messages !== undefined) db.admissions_messages = messages;

  writeDb(db);
  res.json({ success: true });
});
