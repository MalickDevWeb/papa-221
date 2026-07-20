import { Router } from "express";
import fs from "fs";
import path from "path";

export const syncRouter = Router();

const DB_PATH = path.resolve(process.cwd(), "backend", "db.json");

syncRouter.get("/sync/check", (req, res) => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const stat = fs.statSync(DB_PATH);
      const timestamp = stat.mtime.getTime();
      const size = stat.size;
      return res.json({
        success: true,
        timestamp,
        version: `${timestamp}-${size}`,
        message: "Version database récupérée."
      });
    }
  } catch (err) {
    console.error("Sync check error:", err);
  }
  return res.json({
    success: true,
    timestamp: Date.now(),
    version: "fresh",
    message: "Version database fraîche générée."
  });
});
