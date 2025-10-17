const JsonRepository = require("../repository/JsonRepository");
let repo;
if (process.env.MONGODB_URI) {
  const MongoRepository = require("../repository/MongoRepository");
  repo = new MongoRepository();
} else {
  repo = new JsonRepository();
}
exports.list = async (req, res, next) => {
  try {
    const tasks = await repo.all();
    res.json(tasks);
  } catch (e) {
    next(e);
  }
};
exports.create = async (req, res, next) => {
  try {
    const {
      title,
      description = "",
      priority = "medium",
      dueDate = null,
    } = req.body || {};
    if (!title) return res.status(400).json({ error: "Missing field: title" });
    const payload = { title, description, priority };
    if (dueDate) payload.dueDate = dueDate;
    if (process.env.MONGODB_URI) {
      const task = await repo.create(payload);
      return res.status(201).json(task);
    } else {
      const TaskLocal = require("../models/Task");
      const t = new TaskLocal(payload);
      await repo.save(t);
      return res.status(201).json(t.toJSON());
    }
  } catch (e) {
    next(e);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const ok = await repo.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (e) {
    next(e);
  }
};
exports.done = async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      const item = await repo.markDone(req.params.id);
      if (!item) return res.status(404).json({ error: "Task not found" });
      return res.json(item);
    } else {
      const r = new JsonRepository();
      const t = r.get(req.params.id);
      if (!t) return res.status(404).json({ error: "Task not found" });
      t.markDone();
      await r.save(t);
      return res.json(t.toJSON());
    }
  } catch (e) {
    next(e);
  }
};
