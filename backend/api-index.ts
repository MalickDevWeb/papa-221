import express from 'express';
import cors from 'cors';
import { studentRouter } from './studentRouter';
import { AuthModuleConfig } from '../vrai_backend/modules/auth/infrastructure/config/AuthModuleConfig';
import { VigilModuleConfig } from '../vrai_backend/modules/vigil/infrastructure/config/VigilModuleConfig';
import { EleveModuleConfig } from '../vrai_backend/modules/eleve/infrastructure/config/EleveModuleConfig';
import { AdminModuleConfig } from '../vrai_backend/modules/admin/infrastructure/config/AdminModuleConfig';
import { academicRouter } from './routes/academic';
import { professorCoursesRouter } from './routes/professorCourses';
import { professorScheduleRouter } from './routes/professorSchedule';
import { candidaturesRouter } from './routes/candidatures';
import { uploadRouter } from './routes/upload';
import { planningRouter } from './routes/planning';
import { collaborationRouter } from './routes/collaboration';
import { syncRouter } from './routes/sync';
import { syncFromPostgres } from './db';

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Call syncFromPostgres on cold start
syncFromPostgres().catch(err => console.error("API Index sync error:", err));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', runtime: 'vercel-ts' });
});

// Mount routers identically to server.ts
app.use('/api', AuthModuleConfig.bootstrap());
app.use('/api', VigilModuleConfig.bootstrap());
app.use('/api', EleveModuleConfig.bootstrap());
app.use('/api', AdminModuleConfig.bootstrap());
app.use('/api', academicRouter);
app.use('/api/student', academicRouter);
app.use('/api', professorCoursesRouter);
app.use('/api', professorScheduleRouter);
app.use('/api', candidaturesRouter);
app.use('/api', uploadRouter);
app.use('/api', planningRouter);
app.use('/api', collaborationRouter);
app.use('/api', syncRouter);
app.use('/api/student', studentRouter);

export default app;
