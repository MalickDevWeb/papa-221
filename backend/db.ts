import fs from "fs";
import path from "path";
import { DbSchema } from "./types";
import { initPostgres, pool } from "./postgresDb";
import { fetchFromPostgres, saveToPostgres } from "./postgresSync";

const DB_PATH = path.resolve(process.cwd(), "backend", "db.json");
let cachedDb: DbSchema | null = null;

export function readDb(): DbSchema {
  if (cachedDb) return cachedDb;
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    cachedDb = JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as DbSchema;
    return cachedDb;
  } catch (err) {
    console.error("Error reading db.json, returning empty:", err);
    return {};
  }
}

export function writeDb(data: DbSchema): void {
  cachedDb = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    
    // Asynchronously update PostgreSQL in the background
    saveToPostgres(data).catch(err => console.error("Async Postgres write error:", err));
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

export async function syncFromPostgres(): Promise<void> {
  try {
    await initPostgres();
    const localDb = readDb();

    const client = await pool.connect();
    try {
      const checkRes = await client.query("SELECT COUNT(*) as count FROM promotions");
      const count = parseInt(checkRes.rows[0].count, 10);
      
      if (count === 0 && Object.keys(localDb).length > 0) {
        console.log("PostgreSQL relational database is empty. Seeding from local db.json...");
        await saveToPostgres(localDb);
        console.log("Seeding complete!");
      } else {
        console.log("Fetching relational data from PostgreSQL...");
        const pgDb = await fetchFromPostgres();
        Object.assign(localDb, pgDb);
        cachedDb = localDb;
        fs.writeFileSync(DB_PATH, JSON.stringify(localDb, null, 2), "utf-8");
        console.log("Database successfully synchronized from PostgreSQL tables.");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to sync database with PostgreSQL:", error);
  }
}
