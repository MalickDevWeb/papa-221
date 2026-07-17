import { Router } from "express";
import { readDb, writeDb } from "../db";
import { getStudentContext } from "../authHelper";

export const liveRouter = Router();

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
  const filtered = list.filter((s) => studentCourseIds.has(s.course_id) || s.status === 'active');

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
    const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    // Standard Google Meet format is abc-defg-hij
    finalMeetUrl = `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`;
  }

  const courses = db.courses || [];
  let matchedCourse = courses.find((c) => (c.titre || "").toLowerCase() === (courseName || "").toLowerCase());
  if (!matchedCourse && courseName) {
    matchedCourse = courses.find((c) => 
      (c.titre || "").toLowerCase().includes(courseName.toLowerCase()) ||
      courseName.toLowerCase().includes((c.titre || "").toLowerCase())
    );
  }
  const courseId = matchedCourse ? matchedCourse.id : "c-3";

  const newSession = {
    id: "live-" + Date.now(),
    course_id: courseId,
    title: title || "Cours Magistral Interactif",
    startTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
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
