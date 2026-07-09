import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { studentRouter } from "./backend/studentRouter";
import { authRouter } from "./backend/routes/auth";
import { vigilRouter } from "./backend/routes/vigil";
import { academicRouter } from "./backend/routes/academic";
import { professorCoursesRouter } from "./backend/routes/professorCourses";
import { professorScheduleRouter } from "./backend/routes/professorSchedule";
import { adminRouter } from "./backend/routes/admin";
import { candidaturesRouter } from "./backend/routes/candidatures";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Mount real high-completeness routers
  app.use("/api", authRouter);
  app.use("/api", vigilRouter);
  app.use("/api", academicRouter);
  app.use("/api/student", academicRouter); // Fallback for student sub-route matching
  app.use("/api", professorCoursesRouter);
  app.use("/api", professorScheduleRouter);
  app.use("/api", adminRouter);
  app.use("/api", candidaturesRouter);

  // Main high-completeness API endpoint routing mounts
  app.use("/api/student", studentRouter);

  // Vite development integration or production bundle serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[École 221 Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
