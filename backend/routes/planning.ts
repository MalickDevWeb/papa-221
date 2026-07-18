import { Router } from "express";
import { readDb, writeDb } from "../db";

export const planningRouter = Router();

const DEFAULT_ROOMS = [
  { id: 'r-1', name: 'Salle 1 - Amphi A', capacity: 120, equipment: ['Projecteur', 'Climatisation'], status: 'Disponible' },
  { id: 'r-2', name: 'Salle 2 - Informatique', capacity: 40, equipment: ['PC Fixes', 'Climatisation'], status: 'Occupée' },
  { id: 'r-3', name: 'Salle 3 - Labo GC', capacity: 30, equipment: ['Maquettes', 'Projecteur'], status: 'Disponible' },
];

const DEFAULT_FILIERES = [
  { id: 'f-1', name: 'Génie Civil & Construction', code: 'GC', description: 'Étude des structures et chantiers' },
  { id: 'f-2', name: 'Technologies de l\'Information', code: 'TI', description: 'Génie logiciel et intelligence artificielle' },
];

const DEFAULT_CLASSES = [
  { id: 'c-1', name: 'L1 Génie Civil', level: 'L1', filiereId: 'f-1', capacityMax: 50, price: 850000 },
  { id: 'c-2', name: 'L3 CM (Construction Métallique)', level: 'L3', filiereId: 'f-1', capacityMax: 40, price: 950000 },
  { id: 'c-3', name: 'Master 1 Spécialité IA', level: 'M1', filiereId: 'f-2', capacityMax: 30, price: 1400000 },
];

const DEFAULT_SLOTS = [
  { id: 'p-1', day: 'Lundi', slot: '08h - 10h', classeId: 'c-1', subject: 'Résistance des Matériaux', prof: 'Prof Diallo', roomName: 'Salle 1 - Amphi A' },
  { id: 'p-2', day: 'Mardi', slot: '10h - 12h', classeId: 'c-2', subject: 'Charpentes Métalliques', prof: 'Mme Sow', roomName: 'Salle 2 - Informatique', isLive: true },
  { id: 'p-3', day: 'Mercredi', slot: '14h - 16h', classeId: 'c-3', subject: 'Intelligence Artificielle', prof: 'Dr Diop', roomName: 'Salle 1 - Amphi A', isLive: true },
];

// 1. Slots routes
planningRouter.get("/planning/slots", (req, res) => {
  const db = readDb() as any;
  if (!db.planningSlots) {
    db.planningSlots = DEFAULT_SLOTS;
    writeDb(db);
  }
  res.json(db.planningSlots);
});

planningRouter.put("/planning/slots", (req, res) => {
  const db = readDb() as any;
  db.planningSlots = req.body;
  writeDb(db);
  res.json({ success: true, slots: db.planningSlots });
});

// 2. Rooms routes
planningRouter.get("/planning/rooms", (req, res) => {
  const db = readDb() as any;
  if (!db.planningRooms) {
    db.planningRooms = DEFAULT_ROOMS;
    writeDb(db);
  }
  res.json(db.planningRooms);
});

planningRouter.put("/planning/rooms", (req, res) => {
  const db = readDb() as any;
  db.planningRooms = req.body;
  writeDb(db);
  res.json({ success: true, rooms: db.planningRooms });
});

// 3. Classes routes
planningRouter.get("/planning/classes", (req, res) => {
  const db = readDb() as any;
  if (!db.planningClasses) {
    db.planningClasses = DEFAULT_CLASSES;
    writeDb(db);
  }
  res.json(db.planningClasses);
});

planningRouter.put("/planning/classes", (req, res) => {
  const db = readDb() as any;
  db.planningClasses = req.body;
  writeDb(db);
  res.json({ success: true, classes: db.planningClasses });
});

// 4. Filieres routes
planningRouter.get("/planning/filieres", (req, res) => {
  const db = readDb() as any;
  if (!db.planningFilieres) {
    db.planningFilieres = DEFAULT_FILIERES;
    writeDb(db);
  }
  res.json(db.planningFilieres);
});

planningRouter.put("/planning/filieres", (req, res) => {
  const db = readDb() as any;
  db.planningFilieres = req.body;
  writeDb(db);
  res.json({ success: true, filieres: db.planningFilieres });
});
