// backend/api-index.ts
import express from "express";
import cors from "cors";

// backend/studentRouter.ts
import { Router as Router8 } from "express";

// backend/routes/profile.ts
import { Router } from "express";

// backend/db.ts
import fs from "fs";
import path from "path";

// backend/postgresDb.ts
import pg from "pg";

// backend/postgresSchema.ts
var TABLE_SCHEMAS = [
  `CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculte VARCHAR(255),
    filiere VARCHAR(255)
  );`,
  `CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    matricule VARCHAR(255) UNIQUE,
    gpa NUMERIC(4,2),
    average NUMERIC(5,2),
    mood VARCHAR(255),
    statut_frais VARCHAR(255),
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE SET NULL ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS professors (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
  );`,
  `CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    unites JSONB NOT NULL DEFAULT '[]'::jsonb,
    progress INTEGER DEFAULT 0,
    coefficient INTEGER DEFAULT 1,
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    professeur_id VARCHAR(255) REFERENCES professors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    prochain_cours VARCHAR(255)
  );`,
  `CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50),
    salle VARCHAR(255),
    method VARCHAR(100),
    status VARCHAR(100),
    location VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE,
    student_id VARCHAR(255) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS homeworks (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT,
    prio VARCHAR(50),
    titre VARCHAR(255),
    statut VARCHAR(100),
    progress INTEGER DEFAULT 0,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    deadline_str VARCHAR(255),
    submitted_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    note VARCHAR(100)
  );`,
  `CREATE TABLE IF NOT EXISTS live_sessions (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hls_url VARCHAR(500),
    status VARCHAR(50),
    end_time VARCHAR(50),
    start_time VARCHAR(50),
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    reactions JSONB DEFAULT '{}'::jsonb,
    chat_messages JSONB DEFAULT '[]'::jsonb,
    attendees_count INTEGER DEFAULT 0,
    thumbnail VARCHAR(500)
  );`,
  `CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(255) PRIMARY KEY,
    module VARCHAR(255) NOT NULL,
    prof VARCHAR(255),
    ects INTEGER,
    cc NUMERIC(5,2),
    examen NUMERIC(5,2),
    moy_promo NUMERIC(5,2)
  );`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    jour VARCHAR(10),
    type VARCHAR(50),
    salle VARCHAR(100),
    status VARCHAR(50),
    date_str VARCHAR(100),
    heure_fin VARCHAR(10),
    heure_str VARCHAR(50),
    heure_debut VARCHAR(10),
    professeur VARCHAR(255),
    description TEXT,
    jour_complet VARCHAR(20)
  );`,
  `CREATE TABLE IF NOT EXISTS candidatures (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    statut VARCHAR(50),
    numero_cni VARCHAR(100),
    telephone VARCHAR(100),
    type_depot VARCHAR(100),
    motivation TEXT,
    nom_complet VARCHAR(255),
    promotion_nom VARCHAR(255),
    nom_fichier_cni VARCHAR(255),
    date_soumission TIMESTAMP WITH TIME ZONE,
    dernier_diplome VARCHAR(255),
    nom_fichier_diplome VARCHAR(255),
    nom_fichier_bulletin VARCHAR(255),
    dernier_etablissement VARCHAR(255)
  );`,
  `CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(100),
    telephone VARCHAR(100)
  );`,
  `CREATE TABLE IF NOT EXISTS badge_scans (
    id VARCHAR(255) PRIMARY KEY,
    badge_id VARCHAR(255),
    badge_owner VARCHAR(255),
    student_id VARCHAR(255),
    statut VARCHAR(100),
    message VARCHAR(500),
    assiduite VARCHAR(100),
    statut_frais VARCHAR(100),
    zone VARCHAR(255),
    time VARCHAR(50),
    date VARCHAR(50),
    type VARCHAR(50)
  );`,
  `CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(255) PRIMARY KEY,
    event_name VARCHAR(255),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payload JSONB DEFAULT '{}'::jsonb
  );`
];

// backend/postgresDb.ts
var connectionString = "postgresql://neondb_owner:npg_0BmIzioWCZ7d@ep-young-smoke-atbll7kk-pooler.c-9.us-east-1.aws.neon.tech/ecole-221?sslmode=require&channel_binding=require";
var pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
async function initPostgres() {
  const client = await pool.connect();
  try {
    for (const schema of TABLE_SCHEMAS) {
      await client.query(schema);
    }
    console.log("All PostgreSQL relational database tables initialized successfully with references.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL relational tables:", error);
  } finally {
    client.release();
  }
}

// backend/postgresMapper.ts
function mapStudent(r) {
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    matricule: r.matricule,
    gpa: r.gpa ? parseFloat(r.gpa) : 0,
    average: r.average ? parseFloat(r.average) : 0,
    mood: r.mood,
    statutFrais: r.statut_frais,
    promotion_id: r.promotion_id
  };
}
function mapHomework(r) {
  if (!r) return null;
  return {
    id: r.id,
    desc: r.description,
    prio: r.prio,
    titre: r.titre,
    statut: r.statut,
    progress: r.progress,
    course_id: r.course_id,
    deadlineStr: r.deadline_str,
    submittedFiles: r.submitted_files || [],
    note: r.note
  };
}
function mapLiveSession(r) {
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    hlsUrl: r.hls_url,
    status: r.status,
    endTime: r.end_time,
    startTime: r.start_time,
    course_id: r.course_id,
    reactions: r.reactions || {},
    chatMessages: r.chat_messages || [],
    attendeesCount: r.attendees_count || 0,
    thumbnail: r.thumbnail
  };
}
function mapSession(r) {
  if (!r) return null;
  return {
    id: r.id,
    nom: r.nom,
    jour: r.jour,
    type: r.type,
    salle: r.salle,
    status: r.status,
    dateStr: r.date_str,
    heureFin: r.heure_fin,
    heureStr: r.heure_str,
    heureDebut: r.heure_debut,
    professeur: r.professeur,
    description: r.description,
    jourComplet: r.jour_complet
  };
}
function mapCandidature(r) {
  if (!r) return null;
  return {
    id: r.id,
    email: r.email,
    statut: r.statut,
    numeroCni: r.numero_cni,
    telephone: r.telephone,
    typeDepot: r.type_depot,
    motivation: r.motivation,
    nomComplet: r.nom_complet,
    promotionNom: r.promotion_nom,
    nomFichierCni: r.nom_fichier_cni,
    dateSoumission: r.date_soumission,
    dernierDiplome: r.dernier_diplome,
    nomFichierDiplome: r.nom_fichier_diplome,
    nomFichierBulletin: r.nom_fichier_bulletin,
    dernierEtablissement: r.dernier_etablissement
  };
}
function mapBadgeScan(r) {
  if (!r) return null;
  return {
    id: r.id,
    badgeId: r.badge_id,
    badgeOwner: r.badge_owner,
    studentId: r.student_id,
    statut: r.statut,
    message: r.message,
    assiduite: r.assiduite,
    statutFrais: r.statut_frais,
    zone: r.zone,
    time: r.time,
    date: r.date,
    type: r.type
  };
}

// backend/postgresUpsert.ts
async function upsertRecord(client, table, idField, record, mappings) {
  if (!record || typeof record !== "object") return;
  const colMap = /* @__PURE__ */ new Map();
  Object.entries(record).forEach(([key, val]) => {
    const colName = mappings[key] || key;
    const isMappedKey = Object.prototype.hasOwnProperty.call(mappings, key);
    if (!colMap.has(colName) || isMappedKey) {
      colMap.set(colName, val);
    }
  });
  const columns = [];
  const values = [];
  const updateParts = [];
  Array.from(colMap.entries()).forEach(([colName, val], idx) => {
    columns.push(colName);
    if (Array.isArray(val) || val !== null && typeof val === "object" && !(val instanceof Date)) {
      values.push(JSON.stringify(val));
    } else {
      values.push(val);
    }
  });
  columns.forEach((col, idx) => {
    if (col !== idField) {
      updateParts.push(`${col} = $${idx + 1}`);
    }
  });
  const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(", ");
  const sql = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders})
    ON CONFLICT (${idField})
    DO UPDATE SET ${updateParts.join(", ")}
  `;
  await client.query(sql, values);
}

// backend/postgresSync.ts
async function fetchFromPostgres() {
  const client = await pool.connect();
  try {
    const [
      promotions,
      students,
      professors,
      courses,
      attendances,
      homeworks2,
      liveSessions,
      grades,
      sessions,
      candidatures,
      staff,
      badgeScans,
      securityEvents
    ] = await Promise.all([
      client.query("SELECT * FROM promotions"),
      client.query("SELECT * FROM students"),
      client.query("SELECT * FROM professors"),
      client.query("SELECT * FROM courses"),
      client.query("SELECT * FROM attendances"),
      client.query("SELECT * FROM homeworks"),
      client.query("SELECT * FROM live_sessions"),
      client.query("SELECT * FROM grades"),
      client.query("SELECT * FROM sessions"),
      client.query("SELECT * FROM candidatures"),
      client.query("SELECT * FROM staff"),
      client.query("SELECT * FROM badge_scans"),
      client.query("SELECT * FROM security_events")
    ]);
    return {
      promotions: promotions.rows,
      students: students.rows.map(mapStudent),
      professors: professors.rows,
      courses: courses.rows,
      attendances: attendances.rows,
      homeworks: homeworks2.rows.map(mapHomework),
      liveSessions: liveSessions.rows.map(mapLiveSession),
      grades: grades.rows.map((r) => {
        const { moy_promo, ...rest } = r;
        return {
          ...rest,
          moyPromo: r.moy_promo ? parseFloat(r.moy_promo) : 0
        };
      }),
      sessions: sessions.rows.map(mapSession),
      candidatures: candidatures.rows.map(mapCandidature),
      staff: staff.rows,
      badgeScans: badgeScans.rows.map(mapBadgeScan),
      securityEvents: securityEvents.rows.map((r) => ({
        id: r.id,
        eventName: r.event_name,
        occurredAt: r.occurred_at,
        payload: r.payload
      }))
    };
  } finally {
    client.release();
  }
}
async function saveToPostgres(dbData) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (dbData.promotions) {
      for (const p of dbData.promotions) {
        await upsertRecord(client, "promotions", "id", p, {});
      }
    }
    if (dbData.professors) {
      for (const p of dbData.professors) {
        await upsertRecord(client, "professors", "id", p, {});
      }
    }
    if (dbData.students) {
      for (const s of dbData.students) {
        await upsertRecord(client, "students", "id", s, { statutFrais: "statut_frais" });
      }
    }
    if (dbData.courses) {
      for (const c of dbData.courses) {
        await upsertRecord(client, "courses", "id", c, {});
      }
    }
    if (dbData.attendances) {
      for (const a of dbData.attendances) {
        await upsertRecord(client, "attendances", "id", a, {});
      }
    }
    if (dbData.homeworks) {
      for (const h of dbData.homeworks) {
        await upsertRecord(client, "homeworks", "id", h, { desc: "description", deadlineStr: "deadline_str", submittedFiles: "submitted_files" });
      }
    }
    if (dbData.liveSessions) {
      for (const ls of dbData.liveSessions) {
        await upsertRecord(client, "live_sessions", "id", ls, { hlsUrl: "hls_url", endTime: "end_time", startTime: "start_time", chatMessages: "chat_messages", attendeesCount: "attendees_count" });
      }
    }
    if (dbData.grades) {
      for (const g of dbData.grades) {
        await upsertRecord(client, "grades", "id", g, { moyPromo: "moy_promo" });
      }
    }
    if (dbData.sessions) {
      for (const s of dbData.sessions) {
        await upsertRecord(client, "sessions", "id", s, { dateStr: "date_str", heureFin: "heure_fin", heureStr: "heure_str", heureDebut: "heure_debut", jourComplet: "jour_complet" });
      }
    }
    if (dbData.candidatures) {
      for (const cd of dbData.candidatures) {
        await upsertRecord(client, "candidatures", "id", cd, { numeroCni: "numero_cni", typeDepot: "type_depot", nomComplet: "nom_complet", promotionNom: "promotion_nom", nomFichierCni: "nom_fichier_cni", dateSoumission: "date_soumission", dernierDiplome: "dernier_diplome", nomFichierDiplome: "nom_fichier_diplome", nomFichierBulletin: "nom_fichier_bulletin", dernierEtablissement: "dernier_etablissement" });
      }
    }
    if (dbData.staff) {
      for (const sf of dbData.staff) {
        await upsertRecord(client, "staff", "id", sf, {});
      }
    }
    if (dbData.badgeScans) {
      for (const bs of dbData.badgeScans) {
        await upsertRecord(client, "badge_scans", "id", bs, { badgeId: "badge_id", badgeOwner: "badge_owner", studentId: "student_id", statutFrais: "statut_frais" });
      }
    }
    if (dbData.securityEvents) {
      for (const se of dbData.securityEvents) {
        await upsertRecord(client, "security_events", "id", se, { eventName: "event_name", occurredAt: "occurred_at" });
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// backend/db.ts
var DB_PATH = path.resolve(process.cwd(), "backend", "db.json");
var cachedDb = null;
function readDb() {
  if (cachedDb) return cachedDb;
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    cachedDb = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    return cachedDb;
  } catch (err) {
    console.error("Error reading db.json, returning empty:", err);
    return {};
  }
}
function writeDb(data) {
  cachedDb = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    saveToPostgres(data).catch((err) => console.error("Async Postgres write error:", err));
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}
async function syncFromPostgres() {
  try {
    await initPostgres();
    const localDb = readDb();
    const client = await pool.connect();
    try {
      const checkRes = await client.query("SELECT COUNT(*) as count FROM promotions");
      const count = parseInt(checkRes.rows[0].count, 10);
      if (count === 0 && Object.keys(localDb).length > 0) {
        console.log("PostgreSQL relational database is empty. Seeding from local db.json...");
        await saveToPostgres(localDb);
        console.log("Seeding complete!");
      } else {
        console.log("Fetching relational data from PostgreSQL...");
        const pgDb = await fetchFromPostgres();
        Object.assign(localDb, pgDb);
        cachedDb = localDb;
        fs.writeFileSync(DB_PATH, JSON.stringify(localDb, null, 2), "utf-8");
        console.log("Database successfully synchronized from PostgreSQL tables.");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to sync database with PostgreSQL:", error);
  }
}

// backend/authHelper.ts
function getStudentContext(authHeader) {
  const token = (authHeader || "").replace("Bearer ", "").trim();
  const db = readDb();
  const students = db.students || [];
  const promotions = db.promotions || [];
  const courses = db.courses || [];
  let studentId = "usr-etudiant-01";
  if (token === "fake-jwt-token-etudiant-222") {
    studentId = "usr-etudiant-02";
  } else if (token === "fake-jwt-token-etudiant-223") {
    studentId = "usr-etudiant-03";
  }
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;
  const promotion = promotions.find((p) => p.id === student.promotion_id) || {
    id: "p-1",
    name: "221-GL",
    filiere: "Master 1 GL",
    faculte: "Sciences & Technologies"
  };
  const studentCourses = courses.filter((c) => c.promotion_id === promotion.id);
  return {
    student,
    promotion,
    courses: studentCourses
  };
}

// backend/routes/profile.ts
var profileRouter = Router();
profileRouter.get("/profile", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student profile not found" });
    return;
  }
  const { student, promotion } = context;
  res.json({
    name: student.name,
    matricule: student.matricule,
    promotion: promotion.name,
    filiere: promotion.filiere,
    faculte: promotion.faculte,
    average: student.average,
    gpa: student.gpa,
    mood: student.mood
  });
});
profileRouter.post("/mood", (req, res) => {
  const { mood } = req.body;
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student profile not found" });
    return;
  }
  const db = readDb();
  if (db.students) {
    const idx = db.students.findIndex((s) => s.id === context.student.id);
    if (idx !== -1) {
      db.students[idx].mood = mood;
      writeDb(db);
    }
  }
  res.json({ success: true, mood });
});

// backend/routes/attendance.ts
import { Router as Router2 } from "express";
var attendanceRouter = Router2();
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
    student_id: context.student.id,
    // Relational Foreign Key
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    type: type || "arriv\xE9e",
    method: method || "QR Code",
    status: "Valid\xE9 d'office",
    salle: salle || "Amphi A",
    location: location || "Dakar Campus - Coordonn\xE9es GPS: 14.6937, -17.4441"
  };
  db.attendances.unshift(newLog);
  writeDb(db);
  res.json({ success: true, item: newLog });
});

// backend/routes/homework.ts
import { Router as Router3 } from "express";
var homeworkRouter = Router3();
homeworkRouter.get("/homeworks", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const list = db.homeworks || [];
  const courses = db.courses || [];
  const studentCourseIds = new Set(context.courses.map((c) => c.id));
  const filtered = list.filter((t) => studentCourseIds.has(t.course_id));
  const joined = filtered.map((t) => {
    const course = courses.find((c) => c.id === t.course_id);
    const courseName = course ? course.titre : "Cours";
    return {
      ...t,
      cours: courseName,
      coursLabel: courseName
    };
  });
  res.json(joined);
});
homeworkRouter.post("/homeworks/:id/submit", (req, res) => {
  const { id } = req.params;
  const { fileName, comments } = req.body;
  const db = readDb();
  if (!db.homeworks) {
    db.homeworks = [];
  }
  const idx = db.homeworks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    db.homeworks[idx].statut = "soumis";
    if (!db.homeworks[idx].submittedFiles) {
      db.homeworks[idx].submittedFiles = [];
    }
    db.homeworks[idx].submittedFiles.push(fileName || "rendu_final_etudiant.zip");
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    db.homeworks[idx].deadlineStr = `Fini le ${dateStr}`;
    db.homeworks[idx].comments = comments || "";
    writeDb(db);
    res.json({ success: true, task: db.homeworks[idx] });
  } else {
    res.status(404).json({ error: "Homework task not found" });
  }
});

// backend/routes/live.ts
import { Router as Router4 } from "express";
var liveRouter = Router4();
liveRouter.get("/live-sessions", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const list = db.liveSessions || [];
  const courses = db.courses || [];
  const professors = db.professors || [];
  const studentCourseIds = new Set(context.courses.map((c) => c.id));
  const filtered = list.filter((s) => studentCourseIds.has(s.course_id) || s.status === "active");
  const joined = filtered.map((s) => {
    const course = courses.find((c) => c.id === s.course_id);
    const prof = course ? professors.find((p) => p.id === course.professeur_id) : null;
    return {
      id: s.id,
      course_id: s.course_id,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
      attendeesCount: s.attendeesCount,
      thumbnail: s.thumbnail,
      hlsUrl: s.hlsUrl,
      reactions: s.reactions || { heart: 0, like: 0, clap: 0, mindblown: 0 },
      chatMessages: s.chatMessages || [],
      courseName: s.courseName || (course ? course.titre : "Cours"),
      teacherName: s.teacherName || (prof ? prof.name : "Professeur")
    };
  });
  res.json(joined);
});
liveRouter.post("/live-sessions", (req, res) => {
  const { courseName, teacherName, title, meetUrl } = req.body;
  const db = readDb();
  if (!db.liveSessions) db.liveSessions = [];
  db.liveSessions = db.liveSessions.map((s) => {
    if (s.status === "active") return { ...s, status: "finished" };
    return s;
  });
  let finalMeetUrl = meetUrl;
  if (!finalMeetUrl) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    finalMeetUrl = `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`;
  }
  const courses = db.courses || [];
  let matchedCourse = courses.find((c) => (c.titre || "").toLowerCase() === (courseName || "").toLowerCase());
  if (!matchedCourse && courseName) {
    matchedCourse = courses.find(
      (c) => (c.titre || "").toLowerCase().includes(courseName.toLowerCase()) || courseName.toLowerCase().includes((c.titre || "").toLowerCase())
    );
  }
  const courseId = matchedCourse ? matchedCourse.id : "c-3";
  const newSession = {
    id: "live-" + Date.now(),
    course_id: courseId,
    title: title || "Cours Magistral Interactif",
    startTime: (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    endTime: "",
    status: "active",
    attendeesCount: 0,
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    hlsUrl: finalMeetUrl,
    reactions: { heart: 0, like: 0, clap: 0, mindblown: 0 },
    chatMessages: [],
    courseName,
    teacherName
  };
  db.liveSessions.push(newSession);
  writeDb(db);
  res.status(201).json(newSession);
});
liveRouter.delete("/live-sessions/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (db.liveSessions) {
    db.liveSessions = db.liveSessions.filter((s) => s.id !== id);
    writeDb(db);
  }
  res.json({ success: true });
});

// backend/routes/liveInteractions.ts
import { Router as Router5 } from "express";
var liveInteractionsRouter = Router5();
liveInteractionsRouter.post("/live-sessions/:id/reaction", (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const db = readDb();
  const idx = db.liveSessions?.findIndex((s) => s.id === id);
  if (idx !== void 0 && idx !== -1) {
    const session = db.liveSessions[idx];
    if (!session.reactions) {
      session.reactions = { heart: 0, like: 0, clap: 0, mindblown: 0 };
    }
    if (type && type in session.reactions) {
      session.reactions[type] = (session.reactions[type] || 0) + 1;
    }
    writeDb(db);
    res.json({ success: true, reactions: session.reactions });
  } else {
    res.status(404).json({ error: "Live session not found" });
  }
});
liveInteractionsRouter.post("/live-sessions/:id/chat", (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body;
  const db = readDb();
  const idx = db.liveSessions?.findIndex((s) => s.id === id);
  if (idx !== void 0 && idx !== -1) {
    const s = db.liveSessions[idx];
    if (!s.chatMessages) {
      s.chatMessages = [];
    }
    const activeUser = user || db.students?.[0]?.name || "\xC9colier Anonyme";
    const now = /* @__PURE__ */ new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg = {
      id: "msg-" + Date.now(),
      user: activeUser,
      text: text || "",
      timestamp: timeStr,
      isTeacher: false
    };
    s.chatMessages.push(newMsg);
    writeDb(db);
    res.json({ success: true, message: newMsg });
  } else {
    res.status(404).json({ error: "Live session not found" });
  }
});

// backend/routes/courses.ts
import { Router as Router6 } from "express";
var coursesRouter = Router6();
coursesRouter.get("/courses", (req, res) => {
  const context = getStudentContext(req.headers.authorization || "");
  if (!context) {
    res.status(404).json({ error: "Student context not found" });
    return;
  }
  const db = readDb();
  const professors = db.professors || [];
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

// backend/routes/tutor.ts
import { Router as Router7 } from "express";
import { GoogleGenAI } from "@google/genai";
var tutorRouter = Router7();
var aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}
tutorRouter.post("/tutor/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: "Le message est requis" });
    return;
  }
  const context = getStudentContext(req.headers.authorization || "");
  const studentName = context ? context.student.name : "Assane Diop";
  const studentMatricule = context ? context.student.matricule : "#221-M382";
  const studentId = context ? context.student.id : "usr-etudiant-01";
  const db = readDb();
  const grades = db.grades || [];
  const courses = db.courses || [];
  const homeworks2 = db.homeworks || [];
  const attendances = db.attendances || [];
  const studentAttendances = attendances.filter((a) => a.student_id === studentId);
  const getAvg = (g) => (parseFloat(g.cc) + parseFloat(g.examen)) / 2;
  const overallAvg = grades.length > 0 ? (grades.reduce((acc, g) => acc + getAvg(g), 0) / grades.length).toFixed(2) : context ? context.student.average : "15.42";
  const sortedGrades = [...grades].sort((a, b) => getAvg(a) - getAvg(b));
  const weakest = sortedGrades[0]?.module || "Cybersecurity Essentials";
  const strongest = sortedGrades[sortedGrades.length - 1]?.module || "Ethics in Technology";
  const gradesInfo = grades.map((g) => {
    const avg = getAvg(g).toFixed(2);
    return `- ${g.module} (Enseignant: ${g.prof}): Note CC: ${g.cc}/20, Note Examen: ${g.examen}/20, Moyenne: ${avg}/20 (Moyenne promotion: ${g.moyPromo}/20)`;
  }).join("\n");
  const homeworksInfo = homeworks2.map((h) => {
    return `- ${h.titre} [Statut: ${h.statut}] (Date limite: ${h.deadlineStr}, Prio: ${h.prio}, Note si not\xE9: ${h.note || "N/A"})`;
  }).join("\n");
  const coursesInfo = courses.map((c) => {
    return `- ${c.titre} (Coef: ${c.coefficient}, Progr\xE8s: ${c.progress}%) [Sujets: ${c.unites?.join(", ")}]`;
  }).join("\n");
  const absencesCount = studentAttendances.filter((a) => a.status === "Refus\xE9" || a.status === "Absence").length;
  const presencesCount = studentAttendances.filter((a) => a.status !== "Refus\xE9" && a.status !== "Absence").length;
  const systemInstruction = `Tu es le "Tuteur IA de l'\xC9cole 221", un conseiller p\xE9dagogique d'exception et mentor acad\xE9mique d\xE9vou\xE9.
Tu disposes d'un acc\xE8s en temps r\xE9el au dossier de l'\xE9tudiant nomm\xE9 ${studentName} (matricule: ${studentMatricule}).

Voici ses notes et donn\xE9es extraites en temps r\xE9el de la plateforme de l'\xC9cole 221 :
- Moyenne g\xE9n\xE9rale : ${overallAvg}/20
- Point fort principal : ${strongest}
- Point faible / Axe d'am\xE9lioration principal : ${weakest}

D\xC9TAIL COMPLET DE SES NOTES :
${gradesInfo}

TRAVAUX PRATIQUES & DEVOIRS ACTUELS :
${homeworksInfo}

PROGRAMMES DE COURS SUIVIS :
${coursesInfo}

ASSIDUIT\xC9 & PR\xC9SENCE :
- Pr\xE9sences valid\xE9es : ${presencesCount}
- Absences / Refus d'acc\xE8s : ${absencesCount}

TES ROLES ET INSTRUCTIONS :
1. ANALYSE PERSONNALIS\xC9E : Identifie et discute de ses faiblesses en d\xE9tails. Propose-lui des solutions d'\xE9tude adapt\xE9es et pr\xE9cises. Encourage-le \xE0 travailler sur sa mati\xE8re la plus faible (${weakest}) pour remonter son niveau.
2. MEMORISATION & METHODE : Propose-lui des astuces de m\xE9morisation efficaces, de la m\xE9thodologie ou de petits exercices rapides d'entra\xEEnement sous forme de questions-r\xE9ponses interactives.
3. ENCOURAGEMENT : Reste motivant, professionnel, pr\xE9cis et chaleureux. Utilise toujours le pr\xE9nom ${studentName.split(" ")[0]} pour t'adresser \xE0 lui.
4. FORMATAGE EXCELLENT : Formate tes r\xE9ponses de mani\xE8re claire avec du Markdown (mots importants en gras **, listes, codes blocks).`;
  try {
    const ai = getAiClient();
    const { file } = req.body;
    const getLocalResponse = (msg, fileData) => {
      const lower = msg.toLowerCase();
      if (fileData) {
        return `Bonjour Assane ! J'ai bien re\xE7u votre fichier **${fileData.name}** (${fileData.mimeType}). 

Voici une analyse et un **r\xE9sum\xE9 d'apprentissage** :

- **Type de contenu** : ${fileData.mimeType.split("/")[0].toUpperCase()}
- **Sujets principaux d\xE9tect\xE9s** : M\xE9thodologie \xC9cole 221, concepts avanc\xE9s et points de r\xE9vision strat\xE9giques.
- **Plan de r\xE9vision** : R\xE9visez ce document attentivement et concentrez-vous sur l'application pratique pour remonter votre moyenne g\xE9n\xE9rale de **${overallAvg}/20**.

*Quelle partie du document souhaitez-vous que je vous explique en d\xE9tail ?*`;
      }
      if (lower.includes("quiz") || lower.includes("question") || lower.includes("test")) {
        return `Bonjour Assane ! C'est votre **Tuteur IA**. Faisons un quiz d'entra\xEEnement rapide sur votre mati\xE8re cible : **${weakest}**.

**Question 1 :** Quel est le principe fondamental pour am\xE9liorer l'efficacit\xE9 dans cette mati\xE8re ?

*R\xE9pondez \xE0 cette question et je vous guiderai pas \xE0 pas !*`;
      }
      if (lower.includes("r\xE9vision") || lower.includes("planning") || lower.includes("\xE9tude") || lower.includes("aide")) {
        return `Bonjour Assane ! C'est votre **Tuteur IA**. En analysant vos notes en temps r\xE9el, votre moyenne est de **${overallAvg}/20**.

Votre point faible actuel est **${weakest}**.

**Mon plan d'attaque personnalis\xE9 :**
1. Consacrez 45 minutes par jour aux concepts de **${weakest}**.
2. R\xE9visez vos travaux pratiques r\xE9cents pour am\xE9liorer votre CC.
3. Entra\xEEnez-vous avec des mini-quiz interactifs.

*Souhaitez-vous qu'on commence un quiz d'entra\xEEnement sur ${weakest} ?*`;
      }
      return `Bonjour Assane ! En tant que **Tuteur IA de l'\xC9cole 221**, je suis ravi de vous accompagner.

D'apr\xE8s votre dossier :
- \u{1F4C8} **Moyenne actuelle** : ${overallAvg}/20
- \u{1F31F} **Votre point fort** : ${strongest}
- \u26A0\uFE0F **Votre axe d'am\xE9lioration** : ${weakest}

Comment puis-je vous aider aujourd'hui ? N'h\xE9sitez pas \xE0 me poser une question de cours ou \xE0 importer un fichier de r\xE9vision.`;
    };
    if (!ai) {
      console.warn("GEMINI_API_KEY is missing. Using high-fidelity local tutor engine.");
      res.json({ text: getLocalResponse(message, file) });
      return;
    }
    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach((h) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    const userParts = [];
    if (file) {
      userParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
      userParts.push({
        text: `[L'\xE9tudiant a joint le fichier: "${file.name}" (Mime-Type: ${file.mimeType})]

${message}`
      });
    } else {
      userParts.push({ text: message });
    }
    contents.push({
      role: "user",
      parts: userParts
    });
    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let apiResponse = null;
    let apiSuccess = false;
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        if (response && response.text) {
          apiResponse = response;
          apiSuccess = true;
          console.log(`Success with model: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed or unavailable:`, err);
      }
    }
    if (apiSuccess && apiResponse) {
      res.json({ text: apiResponse.text });
    } else {
      console.warn("All Gemini API models failed or returned empty. Falling back to local high-fidelity engine.");
      res.json({ text: getLocalResponse(message, file) });
    }
  } catch (error) {
    console.error("Critical error in tutor route, using local fallback:", error);
    const overallAvg2 = "15.42";
    const weakest2 = "Cybersecurity Essentials";
    res.json({
      text: `Bonjour Assane ! Notre service de connexion avec l'IA subit actuellement une forte demande.

Je reste disponible en mode local pour vous aider \xE0 progresser dans vos mati\xE8res comme **${weakest2}**.

*Que souhaitez-vous r\xE9viser ensemble aujourd'hui ?*`
    });
  }
});
tutorRouter.post("/admin/student-diagnostic", async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    res.status(400).json({ error: "L'identifiant de l'\xE9l\xE8ve est requis" });
    return;
  }
  try {
    const db = readDb();
    const student = (db.students || []).find((s) => s.id === studentId);
    if (!student) {
      res.status(404).json({ error: "\xC9l\xE8ve introuvable" });
      return;
    }
    const grades = db.grades || [];
    const homeworks2 = db.homeworks || [];
    const attendances = db.attendances || [];
    const studentAttendances = attendances.filter((a) => a.student_id === studentId);
    const getAvg = (g) => (parseFloat(g.cc) + parseFloat(g.examen)) / 2;
    const overallAvg = grades.length > 0 ? (grades.reduce((acc, g) => acc + getAvg(g), 0) / grades.length).toFixed(2) : student.average || "15.42";
    const sortedGrades = [...grades].sort((a, b) => getAvg(a) - getAvg(b));
    const weakest = sortedGrades[0]?.module || "Aucun point faible d\xE9tect\xE9";
    const strongest = sortedGrades[sortedGrades.length - 1]?.module || "Aucun point fort sp\xE9cifique";
    const gradesInfo = grades.map((g) => {
      const avg = getAvg(g).toFixed(2);
      return `- ${g.module} (Enseignant: ${g.prof}): Note CC: ${g.cc}/20, Note Examen: ${g.examen}/20, Moyenne: ${avg}/20 (Promo: ${g.moyPromo}/20)`;
    }).join("\n");
    const absencesCount = studentAttendances.filter((a) => a.status === "Refus\xE9" || a.status === "Absence").length;
    const presencesCount = studentAttendances.filter((a) => a.status !== "Refus\xE9" && a.status !== "Absence").length;
    const systemInstruction = `Tu es l'Analyste P\xE9dagogique Principal de l'\xC9cole 221.
Ton r\xF4le est d'analyser le dossier complet d'un \xE9tudiant pour le personnel administratif et les enseignants, afin de proposer un diagnostic acad\xE9mique rigoureux et des recommandations d'aide personnalis\xE9es.

Voici les donn\xE9es en temps r\xE9el de l'\xE9tudiant :
- Nom : ${student.name}
- Matricule : ${student.matricule}
- Moyenne g\xE9n\xE9rale calcul\xE9e : ${overallAvg}/20 (GPA: ${student.gpa}/4)
- Humeur / \xC9tat d'esprit actuel : ${student.mood || "N/A"}
- Statut des frais de scolarit\xE9 : ${student.statutFrais || "En R\xE8gle"}

D\xC9TAILS DES NOTES D\xC9TECT\xC9ES :
${gradesInfo}

ASSIDUIT\xC9 :
- Pr\xE9sences enregistr\xE9es : ${presencesCount}
- Absences / Acc\xE8s refus\xE9s : ${absencesCount}

TES ROLES ET DIRECTIVES :
1. ANALYSE CRITIQUE : Produis une analyse objective des forces et faiblesses de l'\xE9l\xE8ve.
2. ALERTE FINANCI\xC8RE OU SOCIALE : Si les frais de scolarit\xE9 sont en retard ("Paiement en retard"), mentionne poliment de v\xE9rifier aupr\xE8s de la comptabilit\xE9 s'il y a un impact ou besoin de facilit\xE9s, tout en restant concentr\xE9 sur le soutien p\xE9dagogique.
3. RECOMMANDATIONS ACTIONS : \xC9cris 3 actions concr\xE8tes que l'administration et les professeurs peuvent mettre en place imm\xE9diatement pour l'accompagner.
4. TON DE LA R\xC9PONSE : Professionnel, bienveillant, analytique, digne d'un rapport de conseil d'\xE9tablissement.
5. FORMATAGE : Formate avec du Markdown propre et soign\xE9 (titres, listes, mots en gras).`;
    const ai = getAiClient();
    const getLocalResponse = () => {
      return `### \u{1F52C} Rapport de Diagnostic IA pour **${student.name}** (${student.matricule})

**1. Synth\xE8se Globale Acad\xE9mique**
L'\xE9tudiant pr\xE9sente un dossier solide avec une moyenne g\xE9n\xE9rale de **${overallAvg}/20** (GPA: ${student.gpa}/4). Son point fort se situe en **${strongest}**, tandis que son axe de progression principal concerne **${weakest}**. 

**2. Assiduit\xE9 & Engagement**
- Taux de pr\xE9sence : **${presencesCount}** valid\xE9es.
- Absences ou acc\xE8s bloqu\xE9s : **${absencesCount}** au total. 
- \xC9tat d'esprit : *" ${student.mood || "Concentr\xE9"} "*.

**3. Alerte Administrative & Financi\xE8re**
- Statut Scolarit\xE9 : **${student.statutFrais || "En R\xE8gle"}**.
*Note : Si le statut de paiement est en retard, un accompagnement de l'\xE9tudiant via un \xE9ch\xE9ancier est pr\xE9conis\xE9 afin de ne pas perturber sa pr\xE9paration p\xE9dagogique.*

**4. Plan d'Accompagnement Recommand\xE9 (3 Actions)**
1. **Soutien cibl\xE9** : Organiser une session de tutorat de 2h/semaine pour renforcer les concepts de **${weakest}**.
2. **Am\xE9nagement d'\xE9ch\xE9ance** : Proposer un rendez-vous avec le service financier pour r\xE9gulariser sa scolarit\xE9 sans suspendre son QR code d'acc\xE8s de mani\xE8re brutale.
3. **Dialogue Direct** : Un entretien individuel avec son mentor p\xE9dagogique pour faire le point sur sa charge de travail et son humeur.`;
    };
    if (!ai) {
      console.warn("GEMINI_API_KEY is missing. Using high-fidelity local administrator diagnostic.");
      res.json({ text: getLocalResponse() });
      return;
    }
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest"];
    let apiResponse = null;
    let apiSuccess = false;
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting diagnostic with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [{ text: `G\xE9n\xE8re le rapport de diagnostic acad\xE9mique et administratif d\xE9taill\xE9 pour l'\xE9tudiant ${student.name}.` }]
            }
          ],
          config: {
            systemInstruction,
            temperature: 0.5
          }
        });
        if (response && response.text) {
          apiResponse = response;
          apiSuccess = true;
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} diagnostic failed:`, err);
      }
    }
    if (apiSuccess && apiResponse) {
      res.json({ text: apiResponse.text });
    } else {
      console.warn("All Gemini API models failed for diagnostic. Falling back.");
      res.json({ text: getLocalResponse() });
    }
  } catch (error) {
    console.error("Critical error in diagnostic route:", error);
    res.status(500).json({ error: "Erreur interne lors de la g\xE9n\xE9ration du diagnostic." });
  }
});

// backend/studentRouter.ts
var studentRouter = Router8();
studentRouter.use(profileRouter);
studentRouter.use(attendanceRouter);
studentRouter.use(homeworkRouter);
studentRouter.use(liveRouter);
studentRouter.use(liveInteractionsRouter);
studentRouter.use(coursesRouter);
studentRouter.use(tutorRouter);

// vrai_backend/modules/auth/infrastructure/config/AuthModuleConfig.ts
import { Router as Router9 } from "express";

// vrai_backend/shared/domain/Entity.ts
var Entity = class {
  _id;
  _props;
  constructor(id, props) {
    this._id = id;
    this._props = props;
  }
  get id() {
    return this._id;
  }
  equals(object) {
    if (object === null || object === void 0) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this._id === object._id;
  }
};

// vrai_backend/modules/auth/domain/model/User.ts
var User = class _User extends Entity {
  constructor(id, props) {
    super(id, props);
  }
  static create(id, email, nom, prenom, role) {
    return new _User(id, { email, nom, prenom, role });
  }
  get email() {
    return this._props.email;
  }
  get nom() {
    return this._props.nom;
  }
  get prenom() {
    return this._props.prenom;
  }
  get role() {
    return this._props.role;
  }
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      role: this.role
    };
  }
};

// vrai_backend/modules/auth/infrastructure/adapter/out/persistence/JsonAuthRepositoryAdapter.ts
var simulatedUsers = [
  {
    email: "admin@ecole221.sn",
    password: "passer",
    user: { id: "usr-admin-01", nom: "Sylla", prenom: "Admin", email: "admin@ecole221.sn", role: "ADMIN" },
    token: "fake-jwt-token-admin-12345"
  },
  {
    email: "etudiant221@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-01", nom: "Diop", prenom: "Assane", email: "etudiant221@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-221"
  },
  {
    email: "etudiant222@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-02", nom: "Sow", prenom: "Fatou", email: "etudiant222@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-222"
  },
  {
    email: "etudiant223@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-03", nom: "Ndiaye", prenom: "Malick", email: "etudiant223@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-223"
  },
  {
    email: "admin221@gmail.com",
    password: "ecole221",
    user: { id: "usr-admin-02", nom: "Ba", prenom: "Mariama", email: "admin221@gmail.com", role: "ADMIN" },
    token: "fake-jwt-token-admin-221"
  },
  {
    email: "professeur221@gmail.com",
    password: "ecole221",
    user: { id: "usr-prof-01", nom: "Cheikh Anta", prenom: "Dr.", email: "professeur221@gmail.com", role: "PROFESSEUR" },
    token: "fake-jwt-token-prof-221"
  },
  {
    email: "professeur222@gmail.com",
    password: "ecole221",
    user: { id: "usr-prof-02", nom: "Seynabou", prenom: "Mme.", email: "professeur222@gmail.com", role: "PROFESSEUR" },
    token: "fake-jwt-token-prof-222"
  },
  {
    email: "surv221@gmail.com",
    password: "ecole221",
    user: { id: "usr-surv-01", nom: "Sene", prenom: "Ousmane", email: "surv221@gmail.com", role: "SECRETAIRE" },
    token: "fake-jwt-token-surv-221"
  },
  {
    email: "surv222@gmail.com",
    password: "ecole221",
    user: { id: "usr-surv-02", nom: "Ndiaye", prenom: "Awa", email: "surv222@gmail.com", role: "SECRETAIRE" },
    token: "fake-jwt-token-surv-222"
  },
  {
    email: "vigile221@gmail.com",
    password: "ecole221",
    user: { id: "usr-vigil-01", nom: "Diallo", prenom: "Aboulaye", email: "vigile221@gmail.com", role: "VIGIL" },
    token: "fake-jwt-token-vigil-221"
  }
];
var JsonAuthRepositoryAdapter = class {
  async findByEmail(email) {
    const db = readDb();
    const users = db.users || [];
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() || u.tempIdentifier && u.tempIdentifier.toLowerCase() === email.toLowerCase().trim()
    );
    if (matched) {
      const userEntity2 = User.create(
        matched.id,
        matched.email,
        matched.nom,
        matched.prenom || "Candidat",
        matched.role
      );
      return {
        user: userEntity2,
        passwordHash: matched.password || "",
        token: matched.token || `fake-jwt-token-${matched.id}`
      };
    }
    const fallbackMatched = simulatedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!fallbackMatched) return null;
    const userEntity = User.create(
      fallbackMatched.user.id,
      fallbackMatched.user.email,
      fallbackMatched.user.nom,
      fallbackMatched.user.prenom,
      fallbackMatched.user.role
    );
    return {
      user: userEntity,
      passwordHash: fallbackMatched.password,
      token: fallbackMatched.token
    };
  }
};

// vrai_backend/modules/auth/application/service/LoginService.ts
var LoginService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async execute(email, passwordSecret) {
    if (!email || !passwordSecret) {
      throw new Error("Email et mot de passe requis");
    }
    const authData = await this.repository.findByEmail(email);
    if (!authData) {
      throw new Error("Identifiants de connexion invalides");
    }
    if (authData.passwordHash !== passwordSecret) {
      throw new Error("Identifiants de connexion invalides");
    }
    return {
      user: authData.user,
      token: authData.token
    };
  }
};

// vrai_backend/modules/auth/infrastructure/adapter/in/web/AuthController.ts
var AuthController = class {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }
  loginUseCase;
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email et mot de passe requis" });
        return;
      }
      const result = await this.loginUseCase.execute(email, password);
      res.json({
        user: result.user.toJSON(),
        token: result.token
      });
    } catch (error) {
      res.status(401).json({ error: error.message || "Erreur d'authentification" });
    }
  };
};

// vrai_backend/modules/auth/infrastructure/config/AuthModuleConfig.ts
var AuthModuleConfig = class {
  static bootstrap() {
    const router = Router9();
    const repository = new JsonAuthRepositoryAdapter();
    const loginUseCase = new LoginService(repository);
    const controller = new AuthController(loginUseCase);
    router.post("/auth/login", controller.login);
    return router;
  }
};

// vrai_backend/modules/vigil/infrastructure/config/VigilModuleConfig.ts
import { Router as Router10 } from "express";

// vrai_backend/modules/vigil/domain/model/BadgeScan.ts
var BadgeScan = class _BadgeScan {
  constructor(_id, _badgeId, _badgeOwner, _studentId, _status, _message, _assiduite, _statutFrais, _zone, _time, _date, _type) {
    this._id = _id;
    this._badgeId = _badgeId;
    this._badgeOwner = _badgeOwner;
    this._studentId = _studentId;
    this._status = _status;
    this._message = _message;
    this._assiduite = _assiduite;
    this._statutFrais = _statutFrais;
    this._zone = _zone;
    this._time = _time;
    this._date = _date;
    this._type = _type;
    if (!_badgeId) {
      throw new Error("L'identifiant du badge ne peut pas \xEAtre vide");
    }
  }
  _id;
  _badgeId;
  _badgeOwner;
  _studentId;
  _status;
  _message;
  _assiduite;
  _statutFrais;
  _zone;
  _time;
  _date;
  _type;
  static create(id, badgeId, badgeOwner, studentId, status, message, assiduite, statutFrais, zone, time, date, type) {
    return new _BadgeScan(
      id,
      badgeId,
      badgeOwner,
      studentId,
      status,
      message,
      assiduite,
      statutFrais,
      zone,
      time,
      date,
      type
    );
  }
  get id() {
    return this._id;
  }
  get badgeId() {
    return this._badgeId;
  }
  get badgeOwner() {
    return this._badgeOwner;
  }
  get studentId() {
    return this._studentId;
  }
  get status() {
    return this._status;
  }
  get message() {
    return this._message;
  }
  get assiduite() {
    return this._assiduite;
  }
  get statutFrais() {
    return this._statutFrais;
  }
  get zone() {
    return this._zone;
  }
  get time() {
    return this._time;
  }
  get date() {
    return this._date;
  }
  get type() {
    return this._type;
  }
  toJSON() {
    return {
      id: this._id,
      badgeOwner: this._badgeOwner,
      studentId: this._studentId,
      statut: this._status,
      message: this._message,
      assiduite: this._assiduite,
      statutFrais: this._statutFrais,
      zone: this._zone,
      time: this._time,
      date: this._date,
      type: this._type
    };
  }
};

// vrai_backend/modules/vigil/infrastructure/adapter/out/persistence/JsonBadgeScanRepositoryAdapter.ts
var JsonBadgeScanRepositoryAdapter = class {
  async save(scan) {
    const db = readDb();
    db.scanLogs = db.scanLogs || [];
    db.scanLogs.push({
      id: scan.id,
      badgeId: scan.badgeId,
      badgeOwner: scan.badgeOwner,
      studentId: scan.studentId,
      statut: scan.status,
      message: scan.message,
      assiduite: scan.assiduite,
      statutFrais: scan.statutFrais,
      zone: scan.zone,
      time: scan.time,
      date: scan.date,
      type: scan.type
    });
    writeDb(db);
  }
  async findAll() {
    const db = readDb();
    const list = db.scanLogs || [];
    return list.map(
      (item) => BadgeScan.create(
        item.id || "",
        item.badgeId || item.id || "",
        item.badgeOwner || "",
        item.studentId || "",
        item.statut || "Autoris\xE9",
        item.message || "",
        item.assiduite || "",
        item.statutFrais || "",
        item.zone || "",
        item.time || "",
        item.date || "",
        item.type || ""
      )
    );
  }
  async findRecent() {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return list[list.length - 1];
  }
  async findStudentByBadgeId(badgeId) {
    const db = readDb();
    const students = db.students || [];
    return students.find((s) => s.matricule === badgeId || s.id === badgeId) || null;
  }
  async findAttendancesForStudent(studentId) {
    const db = readDb();
    const attendances = db.attendances || [];
    return attendances.filter((a) => a.student_id === studentId);
  }
  async findPromotionById(promotionId) {
    const db = readDb();
    const promotions = db.promotions || [];
    return promotions.find((p) => p.id === promotionId) || null;
  }
};

// vrai_backend/modules/vigil/infrastructure/adapter/out/messaging/ConsoleSecurityEventPublisherAdapter.ts
var ConsoleSecurityEventPublisherAdapter = class {
  async publish(event) {
    console.log(`[Security Event Published] ${event.eventName} occurred at ${event.occurredAt.toISOString()}:`, JSON.stringify(event));
  }
};

// vrai_backend/modules/vigil/domain/model/BadgeScanFactory.ts
var BadgeScanFactory = class {
  static createNewScan(badgeId, badgeOwner, studentId, status, message, assiduite, statutFrais, zone, type = "Scanner") {
    const id = `scan-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const date = "Aujourd'hui";
    return BadgeScan.create(
      id,
      badgeId,
      badgeOwner,
      studentId,
      status,
      message,
      assiduite,
      statutFrais,
      zone,
      time,
      date,
      type
    );
  }
};

// vrai_backend/modules/vigil/domain/event/BadgeScannedEvent.ts
var BadgeScannedEvent = class {
  constructor(scanId, badgeId, studentId, ownerName, status, time) {
    this.scanId = scanId;
    this.badgeId = badgeId;
    this.studentId = studentId;
    this.ownerName = ownerName;
    this.status = status;
    this.time = time;
    this.occurredAt = /* @__PURE__ */ new Date();
    Object.freeze(this);
  }
  scanId;
  badgeId;
  studentId;
  ownerName;
  status;
  time;
  occurredAt;
  eventName = "BadgeScannedEvent";
};

// backend/qrSecurity.ts
function generateQRToken(matricule, minuteEpoch) {
  const input = `${matricule}:${minuteEpoch}:ecole221secret`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase();
}
function validateDynamicBadge(badgeId) {
  if (!badgeId.startsWith("STU_SECURE:")) {
    return { valid: false, error: "Format QR non s\xE9curis\xE9. Les copies ou photos de codes statiques ne sont pas autoris\xE9s." };
  }
  const parts = badgeId.split(":");
  if (parts.length !== 4) {
    return { valid: false, error: "Code QR corrompu ou invalide." };
  }
  const [_, matricule, minuteEpochStr, token] = parts;
  const minuteEpoch = parseInt(minuteEpochStr, 10);
  if (isNaN(minuteEpoch)) {
    return { valid: false, error: "Donn\xE9es temporelles du QR code invalides." };
  }
  const currentEpoch = Math.floor(Date.now() / 6e4);
  const diff = Math.abs(currentEpoch - minuteEpoch);
  if (diff > 1) {
    return { valid: false, error: "Code QR expir\xE9. Il se renouvelle automatiquement chaque minute pour \xE9viter la fraude." };
  }
  const expectedToken = generateQRToken(matricule, minuteEpoch);
  if (expectedToken !== token) {
    return { valid: false, error: "Cl\xE9 de s\xE9curit\xE9 QR invalide (suspicion de fraude)." };
  }
  return { valid: true, matricule };
}

// vrai_backend/modules/vigil/application/service/SubmitScanService.ts
var SubmitScanService = class {
  constructor(repository, publisher) {
    this.repository = repository;
    this.publisher = publisher;
  }
  repository;
  publisher;
  async execute(command) {
    const { badgeId, type = "Scanner", zone = "Portail Entr\xE9e" } = command;
    if (!badgeId || !badgeId.trim()) {
      throw new Error("L'identifiant du badge est requis");
    }
    const validation = validateDynamicBadge(badgeId);
    if (!validation.valid) {
      const scan2 = BadgeScanFactory.createNewScan(
        badgeId,
        "Inconnu",
        badgeId.substring(0, 15) + (badgeId.length > 15 ? "..." : ""),
        "Refus\xE9",
        validation.error || "Code QR non reconnu par l'\xC9cole 221",
        "0%",
        "Inconnu",
        zone,
        type
      );
      await this.repository.save(scan2);
      return scan2;
    }
    const student = await this.repository.findStudentByBadgeId(validation.matricule);
    if (!student) {
      const scan2 = BadgeScanFactory.createNewScan(
        badgeId,
        "Inconnu",
        validation.matricule,
        "Refus\xE9",
        "\xC9tudiant non enregistr\xE9 dans la base de donn\xE9es",
        "0%",
        "Inconnu",
        zone,
        type
      );
      await this.repository.save(scan2);
      return scan2;
    }
    const promotion = await this.repository.findPromotionById(student.promotion_id);
    const promoName = promotion?.name || "\xC9cole 221";
    const pastAtt = await this.repository.findAttendancesForStudent(student.id);
    const validAtt = pastAtt.filter((a) => a.status !== "Refus\xE9");
    const nextType = validAtt.length % 2 === 0 ? "arriv\xE9e" : "d\xE9part";
    const isLatePayment = student.statutFrais === "Paiement en retard";
    let scanStatus = isLatePayment ? "Refus\xE9" : "Autoris\xE9";
    let scanMessage = isLatePayment ? "Acc\xE8s refus\xE9 - Scolarit\xE9 non r\xE9gl\xE9e" : `Acc\xE8s autoris\xE9 - Promotion ${promoName} (${nextType})`;
    if (!isLatePayment && nextType === "d\xE9part" && validAtt.length > 0) {
      const lastArrival = validAtt[0];
      const lastArrivalTime = new Date(lastArrival.timestamp).getTime();
      const diffMs = Date.now() - lastArrivalTime;
      const delayMs = 2 * 60 * 1e3;
      if (diffMs < delayMs) {
        const remainingSec = Math.ceil((delayMs - diffMs) / 1e3);
        scanStatus = "Refus\xE9";
        scanMessage = `Tu es d\xE9j\xE0 entr\xE9. Attendez encore ${remainingSec}s avant de pouvoir marquer votre sortie.`;
      }
    }
    const scan = BadgeScanFactory.createNewScan(
      badgeId,
      student.name,
      student.matricule,
      scanStatus,
      scanMessage,
      `${Math.round(student.average * 6)}% d'assiduit\xE9`,
      isLatePayment ? "Paiement en retard" : "Scolarit\xE9 \xE0 jour",
      zone,
      type
    );
    await this.repository.save(scan);
    await this.publisher.publish(new BadgeScannedEvent(scan.id, scan.badgeId, scan.studentId, scan.badgeOwner, scan.status, scan.time));
    return scan;
  }
};

// vrai_backend/modules/vigil/infrastructure/adapter/in/web/VigilController.ts
var VigilController = class {
  constructor(submitScanUseCase, repository) {
    this.submitScanUseCase = submitScanUseCase;
    this.repository = repository;
  }
  submitScanUseCase;
  repository;
  handleProfile = async (req, res) => {
    res.json({
      id: "usr-vigil-01",
      nom: "Diallo",
      prenom: "Aboulaye",
      badgeId: "VIGIL-001",
      equipe: "\xC9quipe A",
      derniereConnexion: "Aujourd'hui, 08:00",
      statut: "Op\xE9rationnel"
    });
  };
  handleScan = async (req, res) => {
    try {
      const { badgeId } = req.body;
      if (!badgeId) {
        res.status(400).json({ error: "badgeId est requis" });
        return;
      }
      const scanResult = await this.submitScanUseCase.execute({
        badgeId,
        type: req.body.type || "Scanner",
        zone: req.body.zone || "Portail Entr\xE9e"
      });
      res.json(scanResult.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur lors du scan du badge" });
    }
  };
  handleLastScan = async (req, res) => {
    try {
      const lastScan = await this.repository.findRecent();
      if (!lastScan) {
        res.json({
          badgeOwner: "Moussa Gueye",
          studentId: "221-M382",
          statut: "Autoris\xE9",
          message: "Acc\xE8s autoris\xE9 - Promotion 221-GL",
          assiduite: "94% d'assiduit\xE9",
          statutFrais: "Scolarit\xE9 \xE0 jour",
          zone: "Portail Entr\xE9e",
          time: "Dernier scan"
        });
        return;
      }
      res.json(lastScan.toJSON());
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la r\xE9cup\xE9ration du dernier scan" });
    }
  };
  handleCheckIns = async (req, res) => {
    try {
      const allScans = await this.repository.findAll();
      res.json(allScans.map((s) => s.toJSON()));
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la r\xE9cup\xE9ration des pointages" });
    }
  };
};

// vrai_backend/shared/cache/MobileCacheManager.ts
var MobileCacheManager = class _MobileCacheManager {
  static cache = /* @__PURE__ */ new Map();
  static get(key) {
    const entry = this.cache.get(key);
    if (!entry) return void 0;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return void 0;
    }
    return entry;
  }
  static set(key, data, ttlMs = 3e4) {
    const eTag = `W/"${Buffer.from(JSON.stringify(data)).toString("base64").substring(0, 16)}"`;
    this.cache.set(key, {
      data,
      eTag,
      expiresAt: Date.now() + ttlMs
    });
    return eTag;
  }
  static invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  static middleware(ttlMs = 15e3) {
    return (req, res, next) => {
      if (req.method !== "GET") {
        const resource = req.path.split("/")[2];
        if (resource) {
          _MobileCacheManager.invalidatePattern(resource);
        }
        next();
        return;
      }
      const cacheKey = req.originalUrl || req.url;
      const cached = _MobileCacheManager.get(cacheKey);
      if (cached) {
        const clientETag = req.headers["if-none-match"];
        if (clientETag === cached.eTag) {
          res.status(304).end();
          return;
        }
        res.setHeader("ETag", cached.eTag);
        res.setHeader("X-Cache", "HIT - Mobile Optimized");
        res.json(cached.data);
        return;
      }
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        const eTag = _MobileCacheManager.set(cacheKey, body, ttlMs);
        res.setHeader("ETag", eTag);
        res.setHeader("X-Cache", "MISS");
        return originalJson(body);
      };
      next();
    };
  }
};

// vrai_backend/modules/vigil/infrastructure/config/VigilModuleConfig.ts
var VigilModuleConfig = class {
  static bootstrap() {
    const router = Router10();
    const repositoryAdapter = new JsonBadgeScanRepositoryAdapter();
    const eventPublisherAdapter = new ConsoleSecurityEventPublisherAdapter();
    const submitScanUseCase = new SubmitScanService(repositoryAdapter, eventPublisherAdapter);
    const controller = new VigilController(submitScanUseCase, repositoryAdapter);
    router.get("/vigil/profile", MobileCacheManager.middleware(6e4), controller.handleProfile);
    router.post("/vigil/scan", controller.handleScan);
    router.get("/vigil/last-scan", MobileCacheManager.middleware(5e3), controller.handleLastScan);
    router.get("/vigil/check-ins", MobileCacheManager.middleware(1e4), controller.handleCheckIns);
    return router;
  }
};

// vrai_backend/modules/eleve/infrastructure/config/EleveModuleConfig.ts
import { Router as Router11 } from "express";

// vrai_backend/shared/domain/ValueObject.ts
var ValueObject = class {
  props;
  constructor(props) {
    this.props = Object.freeze(props);
  }
  equals(vo) {
    if (vo === null || vo === void 0) {
      return false;
    }
    if (vo.props === void 0) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
};

// vrai_backend/modules/eleve/domain/valueobject/ScolariteStatut.ts
var ScolariteStatut = class _ScolariteStatut extends ValueObject {
  static create(state) {
    let label = "Scolarit\xE9 en r\xE8gle";
    if (state === "En Retard") {
      label = "Paiement en retard";
    } else if (state === "Paiement partiel") {
      label = "Paiement partiel effectu\xE9";
    }
    return new _ScolariteStatut({ state, label });
  }
  get state() {
    return this.props.state;
  }
  get label() {
    return this.props.label;
  }
};

// vrai_backend/modules/eleve/domain/model/Eleve.ts
var Eleve = class _Eleve extends Entity {
  constructor(id, props) {
    super(id, props);
  }
  static create(id, name, matricule, promotionId, scolariteState, average, gpa, mood) {
    return new _Eleve(id, {
      name,
      matricule,
      promotionId,
      scolarite: ScolariteStatut.create(scolariteState),
      average,
      gpa,
      mood
    });
  }
  get name() {
    return this._props.name;
  }
  get matricule() {
    return this._props.matricule;
  }
  get promotionId() {
    return this._props.promotionId;
  }
  get scolarite() {
    return this._props.scolarite;
  }
  get average() {
    return this._props.average;
  }
  get gpa() {
    return this._props.gpa;
  }
  get mood() {
    return this._props.mood;
  }
  updateMood(newMood) {
    this._props.mood = newMood;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      matricule: this.matricule,
      promotionId: this.promotionId,
      scolarite: this.scolarite.state,
      average: this.average,
      gpa: this.gpa,
      mood: this.mood
    };
  }
};

// vrai_backend/modules/eleve/infrastructure/adapter/out/persistence/JsonEleveRepositoryAdapter.ts
var JsonEleveRepositoryAdapter = class {
  async findById(id) {
    const db = readDb();
    const student = (db.students || []).find((s) => s.id === id);
    if (!student) return null;
    const scolariteVal = student.financialStatus === "En Retard" ? "En Retard" : "\xC0 Jour";
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || "p-1",
      scolariteVal,
      parseFloat(student.average) || 15,
      parseFloat(student.gpa) || 3.5,
      student.mood || ""
    );
  }
  async findByMatricule(matricule) {
    const db = readDb();
    const student = (db.students || []).find((s) => s.matricule === matricule);
    if (!student) return null;
    const scolariteVal = student.financialStatus === "En Retard" ? "En Retard" : "\xC0 Jour";
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || "p-1",
      scolariteVal,
      parseFloat(student.average) || 15,
      parseFloat(student.gpa) || 3.5,
      student.mood || ""
    );
  }
  async save(eleve) {
    const db = readDb();
    db.students = db.students || [];
    const idx = db.students.findIndex((s) => s.id === eleve.id);
    const updatedStudent = {
      id: eleve.id,
      name: eleve.name,
      matricule: eleve.matricule,
      promotion_id: eleve.promotionId,
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood || "",
      financialStatus: eleve.scolarite.state === "En Retard" ? "En Retard" : "En R\xE8gle",
      qrStatus: eleve.scolarite.state === "En Retard" ? "SUSPENDU" : "AUTORIS\xC9"
    };
    if (idx !== -1) {
      db.students[idx] = { ...db.students[idx], ...updatedStudent };
    } else {
      db.students.push(updatedStudent);
    }
    writeDb(db);
  }
  async findPromotionName(promotionId) {
    const db = readDb();
    const promo = (db.promotions || []).find((p) => p.id === promotionId);
    if (!promo) return null;
    return {
      name: promo.name,
      filiere: promo.filiere || "",
      faculte: promo.faculte || ""
    };
  }
};

// vrai_backend/modules/eleve/application/service/GetEleveProfileService.ts
var GetEleveProfileService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async execute(studentId) {
    const eleve = await this.repository.findById(studentId);
    if (!eleve) {
      throw new Error(`\xC9l\xE8ve avec l'ID ${studentId} introuvable`);
    }
    const promo = await this.repository.findPromotionName(eleve.promotionId);
    return {
      name: eleve.name,
      matricule: eleve.matricule,
      promotion: promo?.name || "Inconnu",
      filiere: promo?.filiere || "N/A",
      faculte: promo?.faculte || "N/A",
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood || "neutral"
    };
  }
};

// vrai_backend/modules/eleve/application/service/UpdateEleveMoodService.ts
var UpdateEleveMoodService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async execute(studentId, mood) {
    const eleve = await this.repository.findById(studentId);
    if (!eleve) {
      throw new Error(`\xC9l\xE8ve avec l'ID ${studentId} introuvable`);
    }
    eleve.updateMood(mood);
    await this.repository.save(eleve);
  }
};

// vrai_backend/modules/eleve/infrastructure/adapter/in/web/EleveController.ts
var EleveController = class {
  constructor(getProfileUseCase, updateMoodUseCase) {
    this.getProfileUseCase = getProfileUseCase;
    this.updateMoodUseCase = updateMoodUseCase;
  }
  getProfileUseCase;
  updateMoodUseCase;
  getProfile = async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const context = getStudentContext(authHeader);
      if (!context) {
        res.status(401).json({ error: "Acc\xE8s non autoris\xE9 ou profil \xE9tudiant introuvable" });
        return;
      }
      const profile = await this.getProfileUseCase.execute(context.student.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur lors de la r\xE9cup\xE9ration du profil" });
    }
  };
  updateMood = async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const context = getStudentContext(authHeader);
      if (!context) {
        res.status(401).json({ error: "Acc\xE8s non autoris\xE9 ou profil \xE9tudiant introuvable" });
        return;
      }
      const { mood } = req.body;
      if (!mood) {
        res.status(400).json({ error: "Le champ mood est requis" });
        return;
      }
      await this.updateMoodUseCase.execute(context.student.id, mood);
      res.json({ success: true, mood });
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur lors de la mise \xE0 jour du mood" });
    }
  };
};

// vrai_backend/modules/eleve/infrastructure/config/EleveModuleConfig.ts
var EleveModuleConfig = class {
  static bootstrap() {
    const router = Router11();
    const repository = new JsonEleveRepositoryAdapter();
    const getProfileUseCase = new GetEleveProfileService(repository);
    const updateMoodUseCase = new UpdateEleveMoodService(repository);
    const controller = new EleveController(getProfileUseCase, updateMoodUseCase);
    router.get("/student/profile", MobileCacheManager.middleware(3e4), controller.getProfile);
    router.post("/student/mood", controller.updateMood);
    return router;
  }
};

// vrai_backend/modules/admin/infrastructure/config/AdminModuleConfig.ts
import { Router as Router12 } from "express";

// vrai_backend/modules/admin/infrastructure/adapter/out/persistence/JsonAdminRepositoryAdapter.ts
var JsonAdminRepositoryAdapter = class {
  async getCounts() {
    const db = readDb();
    return {
      students: (db.students || []).length,
      professors: (db.professors || []).length,
      courses: (db.courses || []).length,
      promotions: (db.promotions || []).length
    };
  }
  async getUsers() {
    const db = readDb();
    return { students: db.students || [], professors: db.professors || [], promotions: db.promotions || [] };
  }
  saveItem(collectionKey, item) {
    const db = readDb();
    db[collectionKey] = db[collectionKey] || [];
    const idx = db[collectionKey].findIndex((x) => x.id === item.id);
    if (idx !== -1) db[collectionKey][idx] = { ...db[collectionKey][idx], ...item };
    else db[collectionKey].push(item);
    writeDb(db);
  }
  deleteItem(collectionKey, id) {
    const db = readDb();
    db[collectionKey] = db[collectionKey] || [];
    const initial = db[collectionKey].length;
    db[collectionKey] = db[collectionKey].filter((x) => x.id !== id);
    writeDb(db);
    return db[collectionKey].length < initial;
  }
  async saveStudent(s) {
    this.saveItem("students", s);
  }
  async deleteStudent(id) {
    return this.deleteItem("students", id);
  }
  async findStudentById(id) {
    return (readDb().students || []).find((s) => s.id === id) || null;
  }
  async saveProfessor(p) {
    this.saveItem("professors", p);
  }
  async deleteProfessor(id) {
    return this.deleteItem("professors", id);
  }
  async getSessions() {
    return readDb().sessions || [];
  }
  async findSessionById(id) {
    return (readDb().sessions || []).find((s) => s.id === id) || null;
  }
  async saveSession(s) {
    this.saveItem("sessions", s);
  }
  async savePromotion(p) {
    this.saveItem("promotions", p);
  }
  async saveCourse(c) {
    this.saveItem("courses", c);
  }
  async getPersonnel() {
    const db = readDb();
    return { professors: db.professors || [], staff: db.staff || [] };
  }
  async saveStaff(s) {
    this.saveItem("staff", s);
  }
  async deleteStaff(id) {
    return this.deleteItem("staff", id);
  }
};

// vrai_backend/modules/admin/application/service/GetAdminStatsService.ts
var GetAdminStatsService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async execute() {
    const counts = await this.repository.getCounts();
    return {
      studentsCount: counts.students,
      professorsCount: counts.professors,
      coursesCount: counts.courses,
      classesCount: counts.promotions,
      presentProfessors: "18 / 20",
      salleOccupation: "85%"
    };
  }
};

// vrai_backend/modules/admin/application/service/GetAdminUsersService.ts
var GetAdminUsersService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async execute() {
    return this.repository.getUsers();
  }
};

// vrai_backend/modules/admin/application/service/ManageStudentService.ts
var ManageStudentService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async addStudent(name, matricule, promotionId) {
    if (!name || !matricule) {
      throw new Error("Le nom et le matricule sont requis");
    }
    const newStudent = {
      id: `usr-etudiant-${Date.now()}`,
      name,
      matricule,
      promotion_id: promotionId || "p-1",
      average: 14,
      gpa: 3.2,
      mood: "Motiv\xE9"
    };
    await this.repository.saveStudent(newStudent);
    return newStudent;
  }
  async deleteStudent(id) {
    const success = await this.repository.deleteStudent(id);
    if (!success) {
      throw new Error("\xC9tudiant introuvable");
    }
  }
  async updatePayment(id, statutFrais) {
    const student = await this.repository.findStudentById(id);
    if (!student) {
      throw new Error("\xC9tudiant introuvable");
    }
    student.statutFrais = statutFrais;
    await this.repository.saveStudent(student);
    return student;
  }
  async addObservation(studentId, text, type, auteur) {
    if (!text) {
      throw new Error("Le texte de l'observation est requis");
    }
    const student = await this.repository.findStudentById(studentId);
    if (!student) {
      throw new Error("\xC9tudiant introuvable");
    }
    student.observations = student.observations || [];
    student.observations.push({
      id: `obs-${Date.now()}`,
      text,
      type: type || "G\xE9n\xE9ral",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      auteur: auteur || "Administrateur"
    });
    await this.repository.saveStudent(student);
    return student;
  }
  async bulkImport(students) {
    if (!students || !Array.isArray(students)) {
      throw new Error("Liste d'\xE9tudiants invalide");
    }
    const imported = [];
    for (const s of students) {
      if (!s.name) continue;
      const newStud = {
        id: `usr-etudiant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: s.name,
        matricule: s.matricule || `221-M${Math.floor(100 + Math.random() * 900)}`,
        promotion_id: s.promotion_id || "p-1",
        average: s.average ? Number(s.average) : 12,
        gpa: s.gpa ? Number(s.gpa) : 2.5,
        mood: s.mood || "Nouveau",
        statutFrais: s.statutFrais || "R\xE9gler",
        observations: s.observations || []
      };
      await this.repository.saveStudent(newStud);
      imported.push(newStud);
    }
    return { success: true, count: imported.length, imported };
  }
};

// vrai_backend/modules/admin/application/service/ManagePersonnelService.ts
var ManagePersonnelService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getPersonnel() {
    return this.repository.getPersonnel();
  }
  async addPersonnel(name, email, role, telephone) {
    if (!name || !email || !role) {
      throw new Error("Le nom, l'email et le r\xF4le sont requis");
    }
    if (role === "Professeur") {
      const newProf = { id: `prof-${Date.now()}`, name, email };
      await this.repository.saveProfessor(newProf);
      return newProf;
    } else {
      const newStaff = {
        id: `staff-${Date.now()}`,
        name,
        email,
        role,
        telephone: telephone || "Non renseign\xE9"
      };
      await this.repository.saveStaff(newStaff);
      return newStaff;
    }
  }
  async deletePersonnel(id) {
    if (id.startsWith("prof-")) {
      const success = await this.repository.deleteProfessor(id);
      if (!success) throw new Error("Professeur introuvable");
    } else {
      const success = await this.repository.deleteStaff(id);
      if (!success) throw new Error("Membre du personnel introuvable");
    }
  }
};

// vrai_backend/modules/admin/application/service/ManageAcademicService.ts
var ManageAcademicService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getSchedule() {
    return this.repository.getSessions();
  }
  async rescheduleSession(id, jourComplet, heureStr, salle) {
    const session = await this.repository.findSessionById(id);
    if (!session) {
      throw new Error("S\xE9ance introuvable");
    }
    if (jourComplet) {
      session.jourComplet = jourComplet.toUpperCase();
      session.jour = jourComplet.substring(0, 3).toUpperCase();
    }
    if (heureStr) session.heureStr = heureStr;
    if (salle) session.salle = salle;
    await this.repository.saveSession(session);
    return session;
  }
  async createPromotion(name, filiere, faculte) {
    if (!name || !filiere) {
      throw new Error("Le nom de classe et la fili\xE8re sont requis");
    }
    const newPromo = {
      id: `p-${Date.now()}`,
      name,
      filiere,
      faculte: faculte || "Sciences & Technologies"
    };
    await this.repository.savePromotion(newPromo);
    return newPromo;
  }
  async createCourse(titre, coefficient, professeurId, promotionId, prochainCours) {
    if (!titre || !promotionId) {
      throw new Error("Le titre et la promotion sont requis");
    }
    const newCourse = {
      id: `c-${Date.now()}`,
      titre,
      coefficient: Number(coefficient) || 3,
      progress: 0,
      unites: ["Chapitre 1: Introduction"],
      professeur_id: professeurId || "",
      promotion_id: promotionId,
      prochain_cours: prochainCours || "\xC0 d\xE9finir"
    };
    await this.repository.saveCourse(newCourse);
    return newCourse;
  }
};

// vrai_backend/modules/admin/infrastructure/adapter/in/web/AdminStatsController.ts
var AdminStatsController = class {
  constructor(getStatsUseCase, getUsersUseCase) {
    this.getStatsUseCase = getStatsUseCase;
    this.getUsersUseCase = getUsersUseCase;
  }
  getStatsUseCase;
  getUsersUseCase;
  getStats = async (req, res) => {
    try {
      const stats = await this.getStatsUseCase.execute();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur r\xE9cup\xE9ration des statistiques" });
    }
  };
  getUsers = async (req, res) => {
    try {
      const users = await this.getUsersUseCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur r\xE9cup\xE9ration des utilisateurs" });
    }
  };
};

// vrai_backend/modules/admin/infrastructure/adapter/in/web/AdminStudentController.ts
var AdminStudentController = class {
  constructor(useCase) {
    this.useCase = useCase;
  }
  useCase;
  addStudent = async (req, res) => {
    try {
      const { name, matricule, promotion_id } = req.body;
      const student = await this.useCase.addStudent(name, matricule, promotion_id);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  deleteStudent = async (req, res) => {
    try {
      const { id } = req.params;
      await this.useCase.deleteStudent(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  updatePayment = async (req, res) => {
    try {
      const { id } = req.params;
      const { statutFrais } = req.body;
      const student = await this.useCase.updatePayment(id, statutFrais);
      res.json({ success: true, item: student });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  addObservation = async (req, res) => {
    try {
      const { id } = req.params;
      const { text, type, auteur } = req.body;
      const student = await this.useCase.addObservation(id, text, type, auteur);
      res.json({ success: true, item: student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  bulkImport = async (req, res) => {
    try {
      const { students } = req.body;
      const result = await this.useCase.bulkImport(students);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
};

// vrai_backend/modules/admin/infrastructure/adapter/in/web/AdminPersonnelController.ts
var AdminPersonnelController = class {
  constructor(useCase) {
    this.useCase = useCase;
  }
  useCase;
  getPersonnel = async (req, res) => {
    try {
      const personnel = await this.useCase.getPersonnel();
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur r\xE9cup\xE9ration du personnel" });
    }
  };
  addPersonnel = async (req, res) => {
    try {
      const { name, email, role, telephone } = req.body;
      const result = await this.useCase.addPersonnel(name, email, role, telephone);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  deletePersonnel = async (req, res) => {
    try {
      const { id } = req.params;
      await this.useCase.deletePersonnel(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
};

// vrai_backend/modules/admin/infrastructure/adapter/in/web/AdminAcademicController.ts
var AdminAcademicController = class {
  constructor(useCase) {
    this.useCase = useCase;
  }
  useCase;
  getSchedule = async (req, res) => {
    try {
      const schedule2 = await this.useCase.getSchedule();
      res.json(schedule2);
    } catch (error) {
      res.status(500).json({ error: error.message || "Erreur r\xE9cup\xE9ration de l'emploi du temps" });
    }
  };
  rescheduleSession = async (req, res) => {
    try {
      const { id } = req.params;
      const { jourComplet, heureStr, salle } = req.body;
      const session = await this.useCase.rescheduleSession(id, jourComplet, heureStr, salle);
      res.json({ success: true, item: session });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  createPromotion = async (req, res) => {
    try {
      const { name, filiere, faculte } = req.body;
      const promotion = await this.useCase.createPromotion(name, filiere, faculte);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  createCourse = async (req, res) => {
    try {
      const { titre, coefficient, professeur_id, promotion_id, prochain_cours } = req.body;
      const course = await this.useCase.createCourse(
        titre,
        coefficient,
        professeur_id,
        promotion_id,
        prochain_cours
      );
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
};

// vrai_backend/modules/admin/infrastructure/config/AdminModuleConfig.ts
var AdminModuleConfig = class {
  static bootstrap() {
    const router = Router12();
    const repository = new JsonAdminRepositoryAdapter();
    const getStatsUseCase = new GetAdminStatsService(repository);
    const getUsersUseCase = new GetAdminUsersService(repository);
    const manageStudentUseCase = new ManageStudentService(repository);
    const managePersonnelUseCase = new ManagePersonnelService(repository);
    const manageAcademicUseCase = new ManageAcademicService(repository);
    const statsController = new AdminStatsController(getStatsUseCase, getUsersUseCase);
    const studentController = new AdminStudentController(manageStudentUseCase);
    const personnelController = new AdminPersonnelController(managePersonnelUseCase);
    const academicController = new AdminAcademicController(manageAcademicUseCase);
    router.get("/admin/stats", MobileCacheManager.middleware(15e3), statsController.getStats);
    router.get("/admin/users", MobileCacheManager.middleware(15e3), statsController.getUsers);
    router.get("/admin/personnel", MobileCacheManager.middleware(15e3), personnelController.getPersonnel);
    router.get("/admin/schedule", MobileCacheManager.middleware(15e3), academicController.getSchedule);
    router.post("/admin/students", studentController.addStudent);
    router.delete("/admin/students/:id", studentController.deleteStudent);
    router.post("/admin/students/:id/payment", studentController.updatePayment);
    router.post("/admin/students/:id/observations", studentController.addObservation);
    router.post("/admin/students/bulk", studentController.bulkImport);
    router.post("/admin/professors", personnelController.addPersonnel);
    router.post("/admin/personnel", personnelController.addPersonnel);
    router.delete("/admin/personnel/:id", personnelController.deletePersonnel);
    router.post("/admin/schedule/:id/reschedule", academicController.rescheduleSession);
    router.post("/admin/promotions", academicController.createPromotion);
    router.post("/admin/courses", academicController.createCourse);
    return router;
  }
};

// backend/routes/academic.ts
import { Router as Router13 } from "express";
var academicRouter = Router13();
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
  const homeworks2 = db.homeworks || [];
  const found = homeworks2.find((h) => h.id === id);
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
  const homeworks2 = db.homeworks || [];
  const found = homeworks2.find((h) => h.id === id);
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
  const homeworks2 = db.homeworks || [];
  const found = homeworks2.find((h) => h.id === id);
  if (!found) {
    res.status(404).json({ error: "Devoir introuvable" });
    return;
  }
  let fileUrl = "devoir_soumission_" + Date.now() + ".pdf";
  if (fileStr) {
    try {
      const { v2: cloudinary2 } = await import("cloudinary");
      cloudinary2.config({
        cloud_name: "qudmvipg",
        api_key: "423861318775332",
        api_secret: "LwQXYD_L2befowdg2wNItSF-s0A"
      });
      const uploadResponse = await cloudinary2.uploader.upload(fileStr, {
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
  res.json({ success: true, message: `Demande de r\xE9vision soumise pour la note ${id}` });
});
academicRouter.get("/schedule", (req, res) => {
  const db = readDb();
  const context = getStudentContext(req.headers.authorization || "");
  const slots = db.planningSlots || [];
  if (!context) {
    res.json(db.sessions || []);
    return;
  }
  const promoId = context.promotion.id;
  const mappedClassId = promoId === "p-2" ? "c-2" : "c-1";
  const studentSlots = slots.filter((s) => s.classeId === mappedClassId);
  const mappedSessions = studentSlots.map((s) => {
    const dayMap = {
      "Lundi": "LUN",
      "Mardi": "MAR",
      "Mercredi": "MER",
      "Jeudi": "JEU",
      "Vendredi": "VEN",
      "Samedi": "VEN"
    };
    let heureDebut = "08:00";
    let heureFin = "10:00";
    if (s.slot && s.slot.includes("-")) {
      const parts = s.slot.split("-");
      const cleanPart = (p) => {
        const num = parseInt(p.replace(/[^\d]/g, ""), 10);
        return isNaN(num) ? "08" : String(num).padStart(2, "0");
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
      description: `Cours de ${s.subject || "Cours"} dispens\xE9 par ${s.prof || "Professeur"} en ${s.roomName || "Salle de classe"}.`,
      status: s.isAbsent || s.status === "annule" ? "annule" : s.isLive ? "actuel" : "a_venir",
      cancellationReason: s.cancellationReason || ""
    };
  });
  res.json(mappedSessions);
});

// backend/routes/professorCourses.ts
import { Router as Router14 } from "express";
var professorCoursesRouter = Router14();
var modules = [
  { id: "mod-1", courseId: "course-4", title: "Module 1 : Cryptographie Sym\xE9trique", description: "AES, DES, etc." },
  { id: "mod-2", courseId: "course-4", title: "Module 2 : S\xE9curit\xE9 R\xE9seau", description: "TLS, SSL, etc." },
  { id: "mod-4", courseId: "course-1", title: "Module 1 : Analyse de Complexit\xE9", description: "Grand O" }
];
var lessons = [
  { id: "les-1", courseId: "course-4", moduleId: "mod-1", title: "Chapitre 1 : Introduction", description: "Bases.", dateStr: "Publi\xE9", attachmentName: "Cours.pdf" }
];
var reminders = [
  { id: "rem-1", courseId: "course-1", content: "Projet final programmation dynamique \xE0 soumettre.", dateStr: "Aujourd'hui", isUrgent: true }
];
var quizzes = [
  { id: "quiz-1", moduleId: "mod-1", title: "Quiz 1 : AES", description: "AES rounds", questions: [] }
];
var studentsEnrolled = [
  { id: "stud-1", name: "Assane Diop", matricule: "221-M382", progress: 85, attendanceRate: 95 },
  { id: "stud-2", name: "Fatou Sow", matricule: "221-M383", progress: 90, attendanceRate: 98 }
];
var studentGrades = [
  { studentId: "stud-1", studentName: "Assane Diop", matricule: "221-M382", cc: 15, examen: 16 },
  { studentId: "stud-2", studentName: "Fatou Sow", matricule: "221-M383", cc: 17, examen: 18 }
];
professorCoursesRouter.get("/professor/courses", (req, res) => {
  res.json([
    { id: "course-4", titre: "S\xE9curit\xE9 des SI", coefficient: 4, progress: 10, unites: ["Crypto"], prochainCours: "Mardi \xE0 13h00", salle: "Amphi B", classe: "M1 GL" },
    { id: "course-1", titre: "Algorithmique Avanc\xE9e", coefficient: 5, progress: 80, unites: ["Graphes"], prochainCours: "Lundi \xE0 08h00", salle: "Amphi A", classe: "M1 GL" }
  ]);
});
professorCoursesRouter.get("/professor/courses/:courseId/students", (req, res) => {
  res.json(studentsEnrolled);
});
professorCoursesRouter.get("/professor/courses/:courseId/grades", (req, res) => {
  res.json(studentGrades);
});
professorCoursesRouter.post("/professor/courses/:courseId/grades/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { cc, examen } = req.body;
  const found = studentGrades.find((g) => g.studentId === studentId);
  if (found) {
    found.cc = Number(cc);
    found.examen = Number(examen);
    res.json(found);
  } else {
    res.status(404).json({ error: "\xC9tudiant introuvable" });
  }
});
professorCoursesRouter.get("/professor/courses/:courseId/reminders", (req, res) => {
  res.json(reminders.filter((r) => r.courseId === req.params.courseId));
});
professorCoursesRouter.post("/professor/courses/:courseId/reminders", (req, res) => {
  const { content, isUrgent } = req.body;
  const newReminder = { id: "rem-" + Date.now(), courseId: req.params.courseId, content, dateStr: "Aujourd'hui", isUrgent: !!isUrgent };
  reminders.push(newReminder);
  res.json(newReminder);
});
professorCoursesRouter.get("/professor/courses/:courseId/lessons", (req, res) => {
  res.json(lessons.filter((l) => l.courseId === req.params.courseId));
});
professorCoursesRouter.post("/professor/courses/:courseId/lessons", (req, res) => {
  const { title, description, attachmentName, attachmentUrl, moduleId } = req.body;
  const newLesson = { id: "les-" + Date.now(), courseId: req.params.courseId, moduleId, title, description, dateStr: "Publi\xE9", attachmentName };
  lessons.push(newLesson);
  res.json(newLesson);
});
professorCoursesRouter.get("/professor/courses/:courseId/modules", (req, res) => {
  res.json(modules.filter((m) => m.courseId === req.params.courseId));
});
professorCoursesRouter.post("/professor/courses/:courseId/modules", (req, res) => {
  const { title, description } = req.body;
  const newModule = { id: "mod-" + Date.now(), courseId: req.params.courseId, title, description };
  modules.push(newModule);
  res.json(newModule);
});
professorCoursesRouter.get("/professor/courses/:courseId/quizzes", (req, res) => {
  res.json(quizzes);
});
professorCoursesRouter.post("/professor/modules/:moduleId/quizzes", (req, res) => {
  const { title, description, questions } = req.body;
  const newQuiz = { id: "quiz-" + Date.now(), moduleId: req.params.moduleId, title, description, questions: questions || [] };
  quizzes.push(newQuiz);
  res.json(newQuiz);
});

// backend/routes/professorSchedule.ts
import { Router as Router15 } from "express";
var professorScheduleRouter = Router15();
var homeworks = [
  { id: "hw-1", courseId: "course-1", titre: "Projet Dynamique", desc: "Optimisation de sac \xE0 dos", prio: "haute", deadlineStr: "Lundi" },
  { id: "hw-2", courseId: "course-4", titre: "Analyse AES", desc: "Rapport sur AES-256", prio: "normale", deadlineStr: "Mardi" }
];
var schedule = [
  { id: "sess-1", nom: "S\xE9curit\xE9 des SI", jour: "MAR", jourComplet: "MARDI", dateStr: "24 Oct", heureDebut: "13:00", heureFin: "16:00", heureStr: "13:00 - 16:00", type: "CM", salle: "Amphi B", professeur: "Prof. S. Diop", description: "Cryptographie avanc\xE9e", status: "a_venir" },
  { id: "sess-2", nom: "Algorithmique Avanc\xE9e", jour: "LUN", jourComplet: "LUNDI", dateStr: "23 Oct", heureDebut: "08:00", heureFin: "10:00", heureStr: "08:00 - 10:00", type: "CM", salle: "Amphi A", professeur: "Dr. Aly Diatta", description: "Programmation dynamique", status: "a_venir" },
  { id: "sess-wed-1", nom: "TD Algorithmique Avanc\xE9e", jour: "MER", jourComplet: "MERCREDI", dateStr: "25 Oct", heureDebut: "12:00", heureFin: "14:00", heureStr: "12:00 - 14:00", type: "TD", salle: "Labo 5", professeur: "Dr. Aly Diatta", description: "S\xE9ance pratique d'exercices sur la complexit\xE9 et les tris.", status: "a_venir" },
  { id: "sess-wed-2", nom: "S\xE9curit\xE9 des Syst\xE8mes d'Information", jour: "MER", jourComplet: "MERCREDI", dateStr: "25 Oct", heureDebut: "17:00", heureFin: "20:00", heureStr: "17:00 - 20:00", type: "CM", salle: "Amphi B", professeur: "Dr. Aly Diatta", description: "Cryptographie avanc\xE9e, mod\xE9lisation de menaces et protocoles de communication s\xE9curis\xE9s.", status: "a_venir" }
];
professorScheduleRouter.get("/professor/schedule", (req, res) => {
  const { profId } = req.query;
  const db = readDb();
  const slots = db.planningSlots || [];
  const professor = (db.professors || []).find((p) => p.id === profId) || { name: "Dr. Aly Diatta" };
  const profName = professor.name;
  const filteredSlots = slots.filter((s) => {
    if (!profId) return true;
    const sProf = (s.prof || "").toLowerCase();
    const pName = profName.toLowerCase();
    const lastName = pName.split(" ").pop() || "";
    return sProf.includes(lastName.toLowerCase()) || pName.includes(sProf);
  });
  const mappedSchedule = filteredSlots.map((s) => {
    const dayMapShort = {
      "Lundi": "LUN",
      "Mardi": "MAR",
      "Mercredi": "MER",
      "Jeudi": "JEU",
      "Vendredi": "VEN",
      "Samedi": "SAM"
    };
    let timeDebut = "08:00";
    let timeFin = "10:00";
    if (s.slot && s.slot.includes("-")) {
      const parts = s.slot.split("-");
      const cleanPart = (p) => {
        const num = parseInt(p.replace(/[^\d]/g, ""), 10);
        return isNaN(num) ? "08" : String(num).padStart(2, "0");
      };
      timeDebut = `${cleanPart(parts[0])}:00`;
      timeFin = `${cleanPart(parts[1])}:00`;
    }
    const classes = db.planningClasses || [];
    const cls = classes.find((c) => c.id === s.classeId) || { name: s.classeId || "L1" };
    return {
      id: s.id,
      nom: s.subject || "Cours",
      jour: dayMapShort[s.day] || "LUN",
      jourComplet: (s.day || "LUNDI").toUpperCase(),
      dateStr: "25 Oct",
      heureDebut: timeDebut,
      heureFin: timeFin,
      heureStr: s.slot || "08h - 10h",
      type: "CM",
      salle: s.roomName || "Salle de classe",
      professeur: s.prof || "Professeur",
      description: `Cours de ${s.subject || "Cours"} dispens\xE9 en salle ${s.roomName || "Salle de classe"}.`,
      status: s.isAbsent || s.status === "annule" ? "annule" : s.isLive ? "actuel" : "a_venir",
      cancellationReason: s.cancellationReason || "",
      classe: cls.name
    };
  });
  res.json(mappedSchedule);
});
professorScheduleRouter.post("/professor/schedule/:sessionId/cancel", (req, res) => {
  const { sessionId } = req.params;
  const { reason } = req.body;
  const db = readDb();
  const slots = db.planningSlots || [];
  const slotIdx = slots.findIndex((s) => s.id === sessionId);
  if (slotIdx > -1) {
    slots[slotIdx].isAbsent = true;
    slots[slotIdx].cancellationReason = reason;
    slots[slotIdx].status = "annule";
    db.planningSlots = slots;
    writeDb(db);
    res.json({ success: true, item: slots[slotIdx] });
    return;
  }
  const found = schedule.find((s) => s.id === sessionId);
  if (found) {
    found.status = "annule";
    found.cancellationReason = reason;
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Session introuvable" });
  }
});
professorScheduleRouter.post("/professor/schedule/:sessionId/reschedule", (req, res) => {
  const { sessionId } = req.params;
  const { day, time, room } = req.body;
  const db = readDb();
  const slots = db.planningSlots || [];
  const slotIdx = slots.findIndex((s) => s.id === sessionId);
  if (slotIdx > -1) {
    slots[slotIdx].day = day;
    slots[slotIdx].slot = time;
    slots[slotIdx].roomName = room;
    db.planningSlots = slots;
    writeDb(db);
    res.json({ success: true, item: slots[slotIdx] });
    return;
  }
  const found = schedule.find((s) => s.id === sessionId);
  if (found) {
    found.jour = String(day).slice(0, 3).toUpperCase();
    found.jourComplet = String(day).toUpperCase();
    found.heureStr = time;
    found.salle = room;
    res.json({ success: true, item: found });
  } else {
    res.status(404).json({ error: "Session introuvable" });
  }
});
professorScheduleRouter.get("/professor/courses/:courseId/homeworks", (req, res) => {
  res.json(homeworks.filter((h) => h.courseId === req.params.courseId));
});
professorScheduleRouter.post("/professor/courses/:courseId/homeworks", (req, res) => {
  const { titre, desc, prio, deadlineStr } = req.body;
  const newHomework = {
    id: "hw-" + Date.now(),
    courseId: req.params.courseId,
    titre,
    desc,
    prio: prio || "normale",
    deadlineStr: deadlineStr || "Dans 1 semaine"
  };
  homeworks.push(newHomework);
  res.json(newHomework);
});
professorScheduleRouter.get("/vigil/check-ins", (req, res) => {
  res.json([
    { id: "chk-1", studentName: "Assane Diop", matricule: "221-M382", status: "Valid\xE9", timestamp: "Aujourd'hui, 08:02" },
    { id: "chk-2", studentName: "Fatou Sow", matricule: "221-M383", status: "Valid\xE9", timestamp: "Aujourd'hui, 08:05" }
  ]);
});

// backend/routes/candidatures.ts
import { Router as Router16 } from "express";
var candidaturesRouter = Router16();
candidaturesRouter.get("/candidatures/settings", (req, res) => {
  const db = readDb();
  const settings = db.candidatureSettings || {
    ouvert: true,
    dateOuverture: "2026-06-01",
    dateFermeture: "2026-09-30",
    messageAvis: "La campagne d'inscription officielle pour l'ann\xE9e universitaire 2026/2027 est active.",
    showRegisterButton: true
  };
  res.json(settings);
});
candidaturesRouter.post("/admin/candidatures/settings", (req, res) => {
  const { ouvert, dateOuverture, dateFermeture, messageAvis, showRegisterButton } = req.body;
  const db = readDb();
  db.candidatureSettings = {
    ouvert: ouvert === void 0 ? true : !!ouvert,
    dateOuverture: dateOuverture || "2026-06-01",
    dateFermeture: dateFermeture || "2026-09-30",
    messageAvis: messageAvis || "",
    showRegisterButton: showRegisterButton === void 0 ? true : !!showRegisterButton
  };
  writeDb(db);
  res.json({ success: true, settings: db.candidatureSettings });
});
candidaturesRouter.post("/candidatures", (req, res) => {
  const {
    nomComplet,
    email,
    telephone,
    typeDepot,
    promotionNom,
    motivation,
    numeroCni,
    dernierEtablissement,
    dernierDiplome,
    nomFichierCni,
    nomFichierBulletin,
    nomFichierDiplome
  } = req.body;
  if (!nomComplet || !email || !telephone || !typeDepot || !promotionNom) {
    res.status(400).json({ error: "Tous les champs requis doivent \xEAtre remplis." });
    return;
  }
  const db = readDb();
  const settings = db.candidatureSettings || {
    ouvert: true,
    dateOuverture: "2026-06-01",
    dateFermeture: "2026-09-30",
    messageAvis: ""
  };
  if (!settings.ouvert) {
    res.status(400).json({ error: "Le d\xE9p\xF4t de candidatures est actuellement ferm\xE9 par l'administration." });
    return;
  }
  const candidatures = db.candidatures || [];
  const newCandidature = {
    id: `cand-${Date.now()}`,
    nomComplet,
    email,
    telephone,
    typeDepot,
    // 'En ligne' or 'Présentiel'
    promotionNom,
    motivation: motivation || "",
    numeroCni: numeroCni || "N/A",
    dernierEtablissement: dernierEtablissement || "N/A",
    dernierDiplome: dernierDiplome || "N/A",
    nomFichierCni: nomFichierCni || "Non fourni",
    nomFichierBulletin: nomFichierBulletin || "Non fourni",
    nomFichierDiplome: nomFichierDiplome || "Non fourni",
    statut: "En attente",
    // 'En attente', 'Accepté', 'Refusé'
    dateSoumission: (/* @__PURE__ */ new Date()).toISOString()
  };
  candidatures.push(newCandidature);
  db.candidatures = candidatures;
  const users = db.users || [];
  const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim());
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
    db.users = users;
  }
  writeDb(db);
  res.status(201).json({ success: true, item: newCandidature, token: `fake-jwt-token-visitor-${Date.now()}` });
});
candidaturesRouter.post("/admissions/online", (req, res) => {
  const {
    nomComplet,
    email,
    telephone,
    promotionNom,
    motivation,
    numeroCni,
    dernierEtablissement,
    dernierDiplome,
    nomFichierCni,
    nomFichierBulletin,
    nomFichierDiplome
  } = req.body;
  if (!nomComplet || !email || !telephone || !promotionNom) {
    res.status(400).json({ error: "Le nom, email, t\xE9l\xE9phone et la promotion sont requis." });
    return;
  }
  const db = readDb();
  const candidatures = db.candidatures || [];
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
    dernierDiplome: dernierDiplome || "Baccalaur\xE9at G\xE9n\xE9ral",
    nomFichierCni: nomFichierCni || "Non fourni",
    nomFichierBulletin: nomFichierBulletin || "Non fourni",
    nomFichierDiplome: nomFichierDiplome || "Non fourni",
    statut: "En attente",
    dateSoumission: (/* @__PURE__ */ new Date()).toISOString()
  };
  candidatures.push(newCandidature);
  db.candidatures = candidatures;
  const users = db.users || [];
  const existingUserIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase().trim());
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
  db.users = users;
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
candidaturesRouter.post("/admin/admissions/physical", (req, res) => {
  const { nomComplet, email, telephone, promotionNom, motivation, numeroCni } = req.body;
  if (!nomComplet || !email || !telephone || !promotionNom) {
    res.status(400).json({ error: "Tous les champs obligatoires (Nom, Email, T\xE9l\xE9phone, Promotion) doivent \xEAtre fournis." });
    return;
  }
  const db = readDb();
  const candidatures = db.candidatures || [];
  const newCandidature = {
    id: `cand-${Date.now()}`,
    nomComplet,
    email,
    telephone,
    typeDepot: "Pr\xE9sentiel",
    promotionNom,
    motivation: motivation || "",
    numeroCni: numeroCni || "N/A",
    dernierEtablissement: "N/A",
    dernierDiplome: "Baccalaur\xE9at",
    nomFichierCni: "Pr\xE9sent\xE9 physiquement",
    nomFichierBulletin: "Pr\xE9sent\xE9 physiquement",
    nomFichierDiplome: "Pr\xE9sent\xE9 physiquement",
    statut: "En attente",
    dateSoumission: (/* @__PURE__ */ new Date()).toISOString()
  };
  candidatures.push(newCandidature);
  db.candidatures = candidatures;
  const tempIdentifier = `PHYS-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const activationToken = `ACT-${Math.floor(1e5 + Math.random() * 9e5)}`;
  const users = db.users || [];
  users.push({
    id: `usr-cand-${Date.now()}`,
    email: email.toLowerCase().trim(),
    nom: nomComplet,
    prenom: "Candidat",
    role: "VISITEUR",
    isActivated: false,
    tempIdentifier,
    activationToken,
    password: activationToken,
    // Allows using activation token as password at login
    token: `fake-jwt-token-phys-${Date.now()}`
  });
  db.users = users;
  writeDb(db);
  res.json({
    success: true,
    item: newCandidature,
    tempIdentifier,
    activationToken
  });
});
candidaturesRouter.post("/admissions/finalize-account", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "L'adresse email et le mot de passe sont obligatoires." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caract\xE8res." });
    return;
  }
  const db = readDb();
  const users = db.users || [];
  const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!foundUser) {
    res.status(404).json({ error: "Aucun dossier candidat trouv\xE9 pour cet email." });
    return;
  }
  foundUser.password = password;
  foundUser.isActivated = true;
  foundUser.token = `fake-jwt-token-active-${Date.now()}`;
  db.users = users;
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
candidaturesRouter.get("/student/admission-status", (req, res) => {
  const email = req.query.email;
  if (!email) {
    res.status(400).json({ error: "Email requis pour consulter l'avancement." });
    return;
  }
  const db = readDb();
  const candidatures = db.candidatures || [];
  const foundCand = candidatures.find((c) => c.email.toLowerCase() === email.toLowerCase().trim());
  const users = db.users || [];
  const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  const role = foundUser ? foundUser.role : "VISITEUR";
  if (!foundCand) {
    res.json({
      statut: "Dossier D\xE9pos\xE9",
      role
    });
    return;
  }
  res.json({
    statut: foundCand.statut,
    // 'En attente', 'Accepté', 'Refusé'
    role
  });
});
candidaturesRouter.get("/admin/candidatures", (req, res) => {
  const db = readDb();
  const candidatures = db.candidatures || [];
  res.json(candidatures);
});
candidaturesRouter.post("/admin/candidatures/:id/status", (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  if (!statut) {
    res.status(400).json({ error: "Le statut est requis." });
    return;
  }
  const db = readDb();
  const candidatures = db.candidatures || [];
  const found = candidatures.find((c) => c.id === id);
  if (!found) {
    res.status(404).json({ error: "Candidature introuvable." });
    return;
  }
  found.statut = statut;
  db.candidatures = candidatures;
  if (statut === "Accept\xE9") {
    db.students = db.students || [];
    const studentExists = db.students.some((s) => s.email === found.email || s.name === found.nomComplet);
    if (!studentExists) {
      const randNum = Math.floor(100 + Math.random() * 900);
      const matricule = `221-C${randNum}`;
      const promo = (db.promotions || []).find((p) => p.name.toLowerCase().includes(found.promotionNom.toLowerCase())) || { id: "p-1" };
      const newStudent = {
        id: `usr-etudiant-cand-${Date.now()}`,
        name: found.nomComplet,
        matricule,
        promotion_id: promo.id,
        average: 12,
        gpa: 2.8,
        mood: "Nouveau",
        statutFrais: "Scolarit\xE9 \xE0 jour",
        email: found.email
      };
      db.students.push(newStudent);
    }
  }
  writeDb(db);
  res.json({ success: true, item: found });
});
candidaturesRouter.post("/admin/students/:id/activate", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const candidatures = db.candidatures || [];
  const foundCand = candidatures.find((c) => c.id === id || c.email === id);
  if (!foundCand) {
    res.status(404).json({ error: "Dossier d'inscription introuvable." });
    return;
  }
  foundCand.statut = "Accept\xE9";
  const users = db.users || [];
  const foundUser = users.find((u) => u.email.toLowerCase() === foundCand.email.toLowerCase());
  const matricule = `221-ETU-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const qrCodeToken = `QR-STU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  if (foundUser) {
    foundUser.role = "ETUDIANT";
  } else {
    users.push({
      id: `usr-etu-${Date.now()}`,
      email: foundCand.email.toLowerCase(),
      nom: foundCand.nomComplet,
      prenom: "\xC9tudiant",
      role: "ETUDIANT",
      password: "ecole221",
      isActivated: true,
      token: `fake-jwt-token-stu-${Date.now()}`
    });
  }
  db.users = users;
  db.students = db.students || [];
  const studentIndex = db.students.findIndex((s) => s.email.toLowerCase() === foundCand.email.toLowerCase());
  const studentData = {
    id: `stu-${Date.now()}`,
    name: foundCand.nomComplet,
    matricule,
    promotion_id: "p-1",
    average: 14.5,
    gpa: 3.4,
    mood: "\u{1F393} Admis officiellement \xE0 l'\xC9cole 221 !",
    statutFrais: "Scolarit\xE9 \xE0 jour",
    email: foundCand.email,
    qrCode: qrCodeToken
  };
  if (studentIndex === -1) {
    db.students.push(studentData);
  } else {
    db.students[studentIndex].matricule = matricule;
    db.students[studentIndex].qrCode = qrCodeToken;
    db.students[studentIndex].mood = "\u{1F393} Admis officiellement \xE0 l'\xC9cole 221 !";
  }
  writeDb(db);
  res.json({
    success: true,
    matricule,
    qrCode: qrCodeToken,
    email: foundCand.email
  });
});
candidaturesRouter.get("/admissions/db", (req, res) => {
  const db = readDb();
  let modified = false;
  if (!db.admissions_campaigns) {
    db.admissions_campaigns = [
      {
        id: "camp-1",
        title: "Licence 1 G\xE9nie Logiciel 2026",
        code: "BAC",
        state: "Ouverte",
        deadline: "2026-10-31",
        fees: 5e4,
        requirements: ["Relev\xE9 de notes du Bac", "Copie de la CNI / Passeport", "Photo d'identit\xE9"],
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-2",
        title: "Admission Sp\xE9cifique Licence 2 (L2)",
        code: "L2",
        state: "Ouverte",
        deadline: "2026-10-31",
        fees: 5e4,
        requirements: ["Relev\xE9 de notes de L1", "Relev\xE9 de notes du Bac", "Justificatif de transfert"],
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-3",
        title: "Master 1 & 2 Management & Big Data",
        code: "M1",
        state: "Suspendue",
        deadline: "2026-08-30",
        fees: 75e3,
        requirements: ["Dipl\xF4me de Licence", "Lettre de recommandation", "CV d\xE9taill\xE9"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-4",
        title: "Validation des Acquis de l'Exp\xE9rience (VAE)",
        code: "VAE",
        state: "Ouverte",
        deadline: "2026-11-15",
        fees: 5e4,
        requirements: ["CV professionnel", "Justificatifs d'exp\xE9rience (3 ans min)", "Lettre de motivation"],
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: "camp-5",
        title: "Doctorat en Intelligence Artificielle",
        code: "DOC",
        state: "Planifi\xE9e",
        deadline: "2026-07-31",
        fees: 1e5,
        requirements: ["Projet de th\xE8se", "Dipl\xF4me de Master", "Accord d'un directeur de th\xE8se"],
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
        course: "Licence 1 G\xE9nie Logiciel",
        step: "new",
        docs: { diploma: true, idCard: false },
        registrationFeePaid: false,
        notifications: [
          { id: "not-1", type: "dossier_recu", message: "Dossier de candidature en L1 re\xE7u par la scolarit\xE9.", sentAt: "2026-07-01T10:00:00Z" }
        ]
      },
      {
        id: "cand-2026-002",
        name: "Ibrahima Ba",
        email: "ibrahima.ba@gmail.com",
        type: "TRANSFER",
        course: "Licence 2 G\xE9nie Civil",
        step: "docs",
        docs: { diploma: true, idCard: true, transcripts: true, originalUniDecision: true },
        registrationFeePaid: false,
        details: {
          universityOfOrigin: "Universit\xE9 Cheikh Anta Diop (UCAD)",
          facultyOfOrigin: "FST",
          departmentOfOrigin: "Physique-Chimie",
          validatedCredits: 60,
          transferReason: "Rapprochement familial \xE0 Dakar",
          originalUniDecision: "Accord favorable du Doyen"
        },
        equivalence: {
          status: "pending",
          comparedProgram: "L1 Sciences de l'Ing\xE9nieur vs L1 G\xE9nie Civil",
          validatedCredits: 50,
          dispenses: ["Physique G\xE9n\xE9rale", "Alg\xE8bre 1"],
          complements: ["Dessin Technique de B\xE2timent"],
          decisionBy: "Commission P\xE9dagogique"
        },
        notifications: [
          { id: "not-2", type: "dossier_recu", message: "Dossier de transfert universitaire enregistr\xE9.", sentAt: "2026-07-02T11:30:00Z" },
          { id: "not-3", type: "etude_equivalences", message: "Mise en \xE9tude des \xE9quivalences par la commission p\xE9dagogique.", sentAt: "2026-07-03T09:00:00Z" }
        ]
      },
      {
        id: "cand-2026-003",
        name: "Amadou Sow",
        email: "amadou.sow@gmail.com",
        type: "CHANGE_FILIERE",
        course: "Licence 2 R\xE9seaux & T\xE9l\xE9coms",
        step: "new",
        docs: { diploma: true, idCard: true, transcripts: true },
        registrationFeePaid: true,
        details: {
          oldFiliere: "Licence 1 G\xE9nie Civil",
          newFiliere: "Licence 2 R\xE9seaux & T\xE9l\xE9coms",
          reorientationReason: "R\xE9alignement avec mon projet professionnel dans la cybers\xE9curit\xE9"
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
          visaStatus: "Visa d'\xE9tudes valid\xE9",
          insuranceChecked: true
        },
        notifications: [
          { id: "not-4", type: "dossier_recu", message: "Candidature internationale re\xE7ue.", sentAt: "2026-07-05T14:20:00Z" },
          { id: "not-5", type: "demande_pieces", message: "Copie de l'attestation d'\xE9quivalence consulaire valid\xE9e.", sentAt: "2026-07-06T10:00:00Z" }
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
          { id: "not-6", type: "dossier_recu", message: "Demande de r\xE9inscription d\xE9pos\xE9e.", sentAt: "2026-07-10T08:00:00Z" },
          { id: "not-7", type: "admission_conditionnelle", message: "R\xE9inscription admissible apr\xE8s audit automatique des frais et du bulletin.", sentAt: "2026-07-11T12:00:00Z" }
        ]
      },
      {
        id: "cand-2026-006",
        name: "Ch\xE9rif Ousmane Sarr",
        email: "cherif.sarr@gmail.com",
        type: "REINSCRIPTION",
        course: "Master 2 Administration des Affaires",
        step: "new",
        docs: { diploma: true, idCard: true },
        registrationFeePaid: false,
        details: {
          previousYearValidated: true,
          unpaidDues: 15e4,
          sanctionsCount: 1
        },
        notifications: [
          { id: "not-8", type: "dossier_incomplet", message: "Alerte auto-check : Bloqu\xE9 pour arri\xE9r\xE9s de paiement de l'ann\xE9e pass\xE9e.", sentAt: "2026-07-12T09:15:00Z" }
        ]
      },
      {
        id: "cand-2026-007",
        name: "Marie-Antoinette Gomes",
        email: "marie.gomes@pro.sn",
        type: "VAE",
        course: "Master 2 G\xE9nie Logiciel (VAE)",
        step: "docs",
        docs: { diploma: true, idCard: true, transcripts: true },
        registrationFeePaid: true,
        details: {
          vaeExperienceYears: 8,
          vaeTargetDegree: "Master Professionnel G\xE9nie Logiciel"
        },
        notifications: [
          { id: "not-9", type: "etude_equivalences", message: "Dossier VAE transf\xE9r\xE9 aux jurys acad\xE9miques.", sentAt: "2026-07-12T16:00:00Z" }
        ]
      },
      {
        id: "cand-2026-008",
        name: "Souleymane Camara",
        email: "souleymane.camara@gmail.com",
        type: "EXCEPT",
        course: "Licence 3 R\xE9seaux",
        step: "docs",
        docs: { diploma: true, idCard: true, officialDecisionDoc: true },
        registrationFeePaid: true,
        details: {
          exceptionalJustification: "Sportif s\xE9n\xE9galais de haut niveau (M\xE9daill\xE9 d'Or aux Jeux de l'UEMOA)",
          exceptionalAuthority: "Doyen de la Facult\xE9 / Convention Minist\xE8re des Sports",
          officialDecisionRef: "DEC-RECT-2026-342"
        },
        notifications: [
          { id: "not-10", type: "dossier_recu", message: "Dossier d'admission d\xE9rogatoire / exceptionnelle enregistr\xE9 sous r\xE9f\xE9rence DEC-RECT-2026-342.", sentAt: "2026-07-13T10:00:00Z" }
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
candidaturesRouter.post("/admissions/db", (req, res) => {
  const { candidates, campaigns, auditLogs, messages } = req.body;
  const db = readDb();
  if (candidates !== void 0) db.admissions_candidates = candidates;
  if (campaigns !== void 0) db.admissions_campaigns = campaigns;
  if (auditLogs !== void 0) db.admissions_logs = auditLogs;
  if (messages !== void 0) db.admissions_messages = messages;
  writeDb(db);
  res.json({ success: true });
});

// backend/routes/upload.ts
import { Router as Router17 } from "express";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "qudmvipg",
  api_key: "423861318775332",
  api_secret: "LwQXYD_L2befowdg2wNItSF-s0A"
});
var uploadRouter = Router17();
uploadRouter.post("/upload", async (req, res) => {
  try {
    const { fileStr } = req.body;
    if (!fileStr) {
      res.status(400).json({ error: "Aucun fichier fourni sous forme de cha\xEEne de caract\xE8res Base64 (fileStr)" });
      return;
    }
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: "auto",
      folder: "ecole221"
    });
    res.json({
      success: true,
      url: uploadResponse.secure_url,
      originalName: uploadResponse.original_filename
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: error.message || "Erreur de t\xE9l\xE9versement Cloudinary" });
  }
});

// backend/routes/planning.ts
import { Router as Router18 } from "express";
var planningRouter = Router18();
var DEFAULT_ROOMS = [
  { id: "r-1", name: "Salle 1 - Amphi A", capacity: 120, equipment: ["Projecteur", "Climatisation"], status: "Disponible" },
  { id: "r-2", name: "Salle 2 - Informatique", capacity: 40, equipment: ["PC Fixes", "Climatisation"], status: "Occup\xE9e" },
  { id: "r-3", name: "Salle 3 - Labo GC", capacity: 30, equipment: ["Maquettes", "Projecteur"], status: "Disponible" }
];
var DEFAULT_FILIERES = [
  { id: "f-1", name: "G\xE9nie Civil & Construction", code: "GC", description: "\xC9tude des structures et chantiers" },
  { id: "f-2", name: "Technologies de l'Information", code: "TI", description: "G\xE9nie logiciel et intelligence artificielle" }
];
var DEFAULT_CLASSES = [
  { id: "c-1", name: "L1 G\xE9nie Civil", level: "L1", filiereId: "f-1", capacityMax: 50, price: 85e4 },
  { id: "c-2", name: "L3 CM (Construction M\xE9tallique)", level: "L3", filiereId: "f-1", capacityMax: 40, price: 95e4 },
  { id: "c-3", name: "Master 1 Sp\xE9cialit\xE9 IA", level: "M1", filiereId: "f-2", capacityMax: 30, price: 14e5 }
];
var DEFAULT_SLOTS = [
  { id: "p-1", day: "Lundi", slot: "08h - 10h", classeId: "c-1", subject: "R\xE9sistance des Mat\xE9riaux", prof: "Prof Diallo", roomName: "Salle 1 - Amphi A" },
  { id: "p-2", day: "Mardi", slot: "10h - 12h", classeId: "c-2", subject: "Charpentes M\xE9talliques", prof: "Mme Sow", roomName: "Salle 2 - Informatique", isLive: true },
  { id: "p-3", day: "Mercredi", slot: "14h - 16h", classeId: "c-3", subject: "Intelligence Artificielle", prof: "Dr Diop", roomName: "Salle 1 - Amphi A", isLive: true }
];
planningRouter.get("/planning/slots", (req, res) => {
  const db = readDb();
  if (!db.planningSlots) {
    db.planningSlots = DEFAULT_SLOTS;
    writeDb(db);
  }
  res.json(db.planningSlots);
});
planningRouter.put("/planning/slots", (req, res) => {
  const db = readDb();
  db.planningSlots = req.body;
  writeDb(db);
  res.json({ success: true, slots: db.planningSlots });
});
planningRouter.get("/planning/rooms", (req, res) => {
  const db = readDb();
  if (!db.planningRooms) {
    db.planningRooms = DEFAULT_ROOMS;
    writeDb(db);
  }
  res.json(db.planningRooms);
});
planningRouter.put("/planning/rooms", (req, res) => {
  const db = readDb();
  db.planningRooms = req.body;
  writeDb(db);
  res.json({ success: true, rooms: db.planningRooms });
});
planningRouter.get("/planning/classes", (req, res) => {
  const db = readDb();
  if (!db.planningClasses) {
    db.planningClasses = DEFAULT_CLASSES;
    writeDb(db);
  }
  res.json(db.planningClasses);
});
planningRouter.put("/planning/classes", (req, res) => {
  const db = readDb();
  db.planningClasses = req.body;
  writeDb(db);
  res.json({ success: true, classes: db.planningClasses });
});
planningRouter.get("/planning/filieres", (req, res) => {
  const db = readDb();
  if (!db.planningFilieres) {
    db.planningFilieres = DEFAULT_FILIERES;
    writeDb(db);
  }
  res.json(db.planningFilieres);
});
planningRouter.put("/planning/filieres", (req, res) => {
  const db = readDb();
  db.planningFilieres = req.body;
  writeDb(db);
  res.json({ success: true, filieres: db.planningFilieres });
});

// backend/api-index.ts
var app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
syncFromPostgres().catch((err) => console.error("API Index sync error:", err));
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", runtime: "vercel-ts" });
});
app.use("/api", AuthModuleConfig.bootstrap());
app.use("/api", VigilModuleConfig.bootstrap());
app.use("/api", EleveModuleConfig.bootstrap());
app.use("/api", AdminModuleConfig.bootstrap());
app.use("/api", academicRouter);
app.use("/api/student", academicRouter);
app.use("/api", professorCoursesRouter);
app.use("/api", professorScheduleRouter);
app.use("/api", candidaturesRouter);
app.use("/api", uploadRouter);
app.use("/api", planningRouter);
app.use("/api/student", studentRouter);
var api_index_default = app;
export {
  api_index_default as default
};
