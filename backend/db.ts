import fs from "fs";
import path from "path";
import { DbSchema } from "./types";

const DB_PATH = path.resolve(process.cwd(), "backend", "db.json");

export function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return {};
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data) as DbSchema;
  } catch (err) {
    console.error("Error reading db.json, returning empty structure:", err);
    return {};
  }
}

export function writeDb(data: DbSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}
