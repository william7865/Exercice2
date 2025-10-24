const fs = require("fs");
const path = require("path");
const os = require("os");
const Task = require("../models/Task");

const DEFAULT_PATH = path.join(os.homedir(), ".todo_express", "tasks.json");

class JsonRepository {
  constructor(dbPath = process.env.TODO_API_DB || DEFAULT_PATH) {
    this.path = dbPath;
    const dir = path.dirname(this.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, "[]", "utf-8");
  }

  // Lecture du fichier
  _read() {
    try {
      return JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } catch (e) {
      return [];
    }
  }

  // Écriture du fichier
  _write(items) {
    const tmp = this.path + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(items, null, 2));
    fs.renameSync(tmp, this.path);
  }

  // Liste toutes les tâches
  all() {
    return this._read().map((d) => new Task(d));
  }

  // Crée une nouvelle tâche
  create(data) {
    const items = this._read();
    const task = new Task(data);
    items.push(task);
    this._write(items);
    return task;
  }

  // Supprime une tâche
  delete(id) {
    const items = this._read();
    const after = items.filter((d) => d.id !== id);
    const changed = after.length !== items.length;
    if (changed) this._write(after);
    return changed;
  }
}

module.exports = JsonRepository;
