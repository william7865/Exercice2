const { getPool } = require("../db_pg");
const { randomUUID } = require("crypto");

const mapRow = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  priority: r.priority,
  dueDate: r.due_date ? new Date(r.due_date).toISOString() : null,
  status: r.status,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at.toISOString(),
});

class PostgresRepository {
  constructor() {
    this.pool = getPool();
  }

  async all() {
    const { rows } = await this.pool.query(
      `SELECT * FROM tasks ORDER BY created_at ASC`
    );
    return rows.map(mapRow);
  }

  async get(id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async create({
    title,
    description = "",
    priority = "medium",
    dueDate = null,
  }) {
    const id = randomUUID();
    const { rows } = await this.pool.query(
      `INSERT INTO tasks (id, title, description, priority, due_date, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [id, title, description, priority, dueDate]
    );
    return mapRow(rows[0]);
  }

  async update(id, { title, description, priority, dueDate, status }) {
    const fields = [];
    const params = [];
    let idx = 1;
    const push = (col, val) => {
      fields.push(`${col} = $${idx++}`);
      params.push(val);
    };

    if (title !== undefined) push("title", title);
    if (description !== undefined) push("description", description);
    if (priority !== undefined) push("priority", priority);
    if (dueDate !== undefined) push("due_date", dueDate);
    if (status !== undefined) push("status", status);
    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
      const { rows } = await this.pool.query(
        `SELECT * FROM tasks WHERE id=$1`,
        [id]
      );
      return rows[0] ? mapRow(rows[0]) : null;
    }

    params.push(id);
    const { rows } = await this.pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const { rowCount } = await this.pool.query(
      `DELETE FROM tasks WHERE id=$1`,
      [id]
    );
    return rowCount > 0;
  }

  async markDone(id) {
    const { rows } = await this.pool.query(
      `UPDATE tasks SET status='done', updated_at=NOW() WHERE id=$1 RETURNING *`,
      [id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }
}

module.exports = PostgresRepository;
