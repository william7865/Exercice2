const { getPool } = require("../db_pg");
const { randomUUID } = require("crypto");

// Ne garder que les champs utiles
const mapRow = (r) => ({
  id: r.id,
  title: r.title,
  createdAt:
    r.created_at && typeof r.created_at.toISOString === "function"
      ? r.created_at.toISOString()
      : r.created_at || null,
});

class PostgresRepository {
  constructor() {
    this.pool = getPool();
  }

  // Lister toutes les tâches (ordre chronologique)
  async all() {
    const { rows } = await this.pool.query(
      `SELECT id, title, created_at FROM tasks ORDER BY created_at ASC`
    );
    return rows.map(mapRow);
  }

  // Récupérer une tâche par id
  async get(id) {
    const { rows } = await this.pool.query(
      `SELECT id, title, created_at FROM tasks WHERE id = $1`,
      [id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  // Créer une nouvelle tâche (title obligatoire)
  async create({ title }) {
    const id = randomUUID();
    const { rows } = await this.pool.query(
      `INSERT INTO tasks (id, title) VALUES ($1, $2)
       RETURNING id, title, created_at`,
      [id, title]
    );
    return mapRow(rows[0]);
  }

  // Supprimer une tâche
  async delete(id) {
    const { rowCount } = await this.pool.query(
      `DELETE FROM tasks WHERE id = $1`,
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = PostgresRepository;
