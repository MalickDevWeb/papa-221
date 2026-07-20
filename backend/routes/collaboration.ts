import { Router } from "express";
import { readDb, writeDb } from "../db";
import { updateDbCollection, createBalancedGroups, handleDocumentUpload } from "./collaborationHelper";

export const collaborationRouter = Router();

collaborationRouter.get("/collaboration/students", (req, res) => {
  res.json((readDb() as any).students || []);
});

collaborationRouter.get("/collaboration/meets", (req, res) => {
  res.json((readDb() as any).virtualClasses || []);
});

collaborationRouter.post("/collaboration/meets", (req, res) => {
  const newMeet = { id: `meet-${Date.now()}`, ...req.body };
  res.json(updateDbCollection("virtualClasses", newMeet));
});

collaborationRouter.get("/collaboration/admin-meets", (req, res) => {
  res.json((readDb() as any).adminMeetings || []);
});

collaborationRouter.get("/collaboration/workgroups", (req, res) => {
  res.json((readDb() as any).workgroups || []);
});

collaborationRouter.post("/collaboration/workgroups", (req, res) => {
  const { name, classId, members, type, criteria, numGroups } = req.body;
  if (type === "automatic" || type === "balanced") {
    return res.json(createBalancedGroups(name, classId, criteria, numGroups));
  }
  const newGroup = {
    id: `group-${Date.now()}`,
    name,
    description: "Groupe créé manuellement.",
    creationDate: new Date().toLocaleDateString("fr-FR"),
    classId,
    members: members || [],
    projects: [],
    leaderId: members?.[0]?.id || "",
    leaderName: members?.[0]?.name || ""
  };
  res.json(updateDbCollection("workgroups", newGroup));
});

collaborationRouter.get("/collaboration/workgroups/:groupId/messages", (req, res) => {
  const msgs = (readDb() as any).collabMessages || [];
  res.json(msgs.filter((m: any) => m.groupId === req.params.groupId));
});

collaborationRouter.post("/collaboration/workgroups/:groupId/messages", (req, res) => {
  const newMsg = { id: `m-${Date.now()}`, groupId: req.params.groupId, ...req.body };
  res.json(updateDbCollection("collabMessages", newMsg));
});

collaborationRouter.get("/collaboration/workgroups/:groupId/documents", (req, res) => {
  const docs = (readDb() as any).collabDocuments || [];
  res.json(docs.filter((d: any) => d.groupId === req.params.groupId));
});

collaborationRouter.post("/collaboration/workgroups/:groupId/documents", (req, res) => {
  const { name, description, author } = req.body;
  res.json(handleDocumentUpload(req.params.groupId, name, description, author));
});

collaborationRouter.get("/collaboration/workgroups/:groupId/tasks", (req, res) => {
  const tasks = (readDb() as any).collabTasks || [];
  res.json(tasks.filter((t: any) => t.groupId === req.params.groupId));
});

collaborationRouter.post("/collaboration/workgroups/:groupId/tasks", (req, res) => {
  const db = readDb() as any;
  const { id, title, status, assignedTo, deadline, checklist } = req.body;
  db.collabTasks = db.collabTasks || [];
  if (id) {
    const idx = db.collabTasks.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      db.collabTasks[idx] = { ...db.collabTasks[idx], title, status, assignedTo, deadline, checklist };
      writeDb(db);
      return res.json(db.collabTasks[idx]);
    }
  }
  const newTask = { id: `task-${Date.now()}`, groupId: req.params.groupId, title, status, assignedTo, deadline, checklist: checklist || [] };
  db.collabTasks.push(newTask);
  writeDb(db);
  res.json(newTask);
});

collaborationRouter.get("/collaboration/workgroups/:groupId/homeworks", (req, res) => {
  const hws = (readDb() as any).collabHomeworks || [];
  res.json(hws.filter((h: any) => h.targetGroups && h.targetGroups.includes(req.params.groupId)));
});

collaborationRouter.post("/collaboration/workgroups/:groupId/homeworks", (req, res) => {
  const db = readDb() as any;
  const { id, title, description, deadline, submissions } = req.body;
  db.collabHomeworks = db.collabHomeworks || [];
  if (id) {
    const hw = db.collabHomeworks.find((h: any) => h.id === id);
    if (hw) {
      if (submissions) hw.submissions = submissions;
      writeDb(db);
      return res.json(hw);
    }
  }
  const newHw = { id: `hw-${Date.now()}`, title, description, deadline, targetGroups: [req.params.groupId], submissions: [] };
  db.collabHomeworks.push(newHw);
  writeDb(db);
  res.json(newHw);
});
