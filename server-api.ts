import express from "express";
import cors from "cors";
import { studentRouter } from "./backend/studentRouter";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", server: "api", uptime: process.uptime() });
});

// Student API routes
app.use("/api/student", studentRouter);

app.listen(PORT, () => {
  console.log(`[École 221 API] Backend Express → http://localhost:${PORT}`);
  console.log(`[École 221 API] Health        → http://localhost:${PORT}/api/health`);
});
