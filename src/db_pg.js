const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST || "127.0.0.1",
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || "todo_express",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

async function connectPG() {
  const p = getPool();
  await p.connect();

  // Activer l'extension pgcrypto (UUID)
  await p.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).catch(() => {});

  // Créer une table minimale
  await p.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("✅ PostgreSQL connecté");
  return p;
}

module.exports = { getPool, connectPG };
