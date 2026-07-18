import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { studentRouter } from "./backend/studentRouter";
import { AuthModuleConfig } from "./vrai_backend/modules/auth/infrastructure/config/AuthModuleConfig";
import { VigilModuleConfig } from "./vrai_backend/modules/vigil/infrastructure/config/VigilModuleConfig";
import { EleveModuleConfig } from "./vrai_backend/modules/eleve/infrastructure/config/EleveModuleConfig";
import { AdminModuleConfig } from "./vrai_backend/modules/admin/infrastructure/config/AdminModuleConfig";
import { academicRouter } from "./backend/routes/academic";
import { professorCoursesRouter } from "./backend/routes/professorCourses";
import { professorScheduleRouter } from "./backend/routes/professorSchedule";
import { candidaturesRouter } from "./backend/routes/candidatures";
import { uploadRouter } from "./backend/routes/upload";
import { interopAdminRouter } from "./backend/routes/interopAdmin";
import { interopSecurityRouter } from "./backend/routes/interopSecurity";
import { interopStudentProfRouter } from "./backend/routes/interopStudentProf";
import { tutorRouter } from "./backend/routes/tutor";
import { planningRouter } from "./backend/routes/planning";
import { syncFromPostgres } from "./backend/db";

async function startServer() {
  // Sync the database state with PostgreSQL first
  await syncFromPostgres();

  const app = express();
  const PORT = 3000;

  // Increase payload limit to support base64 uploads easily
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Logging middleware for API routes only (prevents static/source files from polluting logs)
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[École 221 Log] ${req.method} ${req.url}`);
    }
    next();
  });

  // API Health status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Mount real high-completeness routers (Modular DDD)
  app.use("/api", AuthModuleConfig.bootstrap());
  app.use("/api", VigilModuleConfig.bootstrap());
  app.use("/api", EleveModuleConfig.bootstrap());
  app.use("/api", academicRouter);
  app.use("/api/student", academicRouter); // Fallback for student sub-route matching
  app.use("/api", professorCoursesRouter);
  app.use("/api", professorScheduleRouter);
  app.use("/api", AdminModuleConfig.bootstrap());
  app.use("/api", candidaturesRouter);
  app.use("/api", uploadRouter);
  app.use("/api", interopAdminRouter);
  app.use("/api", interopSecurityRouter);
  app.use("/api", interopStudentProfRouter);
  app.use("/api", tutorRouter);
  app.use("/api", planningRouter);

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
