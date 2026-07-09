import { Router } from "express";
import { readDb, writeDb } from "../db";

export const liveInteractionsRouter = Router();

liveInteractionsRouter.post("/live-sessions/:id/reaction", (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const db = readDb();
  const idx = db.liveSessions?.findIndex((s) => s.id === id);
  if (idx !== undefined && idx !== -1) {
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
  if (idx !== undefined && idx !== -1) {
    const s = db.liveSessions[idx];
    if (!s.chatMessages) {
      s.chatMessages = [];
    }
    const activeUser = user || db.students?.[0]?.name || "Écolier Anonyme";
    const now = new Date();
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
