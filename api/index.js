import express from 'express';
import cors from 'cors';
import { studentRouter } from '../backend/studentRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', runtime: 'vercel' });
});
app.use('/api/student', studentRouter);

export default app;
