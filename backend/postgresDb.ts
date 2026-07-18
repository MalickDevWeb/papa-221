import pg from 'pg';
import { TABLE_SCHEMAS } from './postgresSchema';

const connectionString = "postgresql://neondb_owner:npg_0BmIzioWCZ7d@ep-young-smoke-atbll7kk-pooler.c-9.us-east-1.aws.neon.tech/ecole-221?sslmode=require&channel_binding=require";

export const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initPostgres(): Promise<void> {
  const client = await pool.connect();
  try {
    // Enable cascading setup by executing schemas sequentially
    for (const schema of TABLE_SCHEMAS) {
      await client.query(schema);
    }
    console.log("All PostgreSQL relational database tables initialized successfully with references.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL relational tables:", error);
  } finally {
    client.release();
  }
}
