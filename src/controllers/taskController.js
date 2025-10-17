const provider = (process.env.DB_PROVIDER || "").toLowerCase();

let repo;
if (provider === "mongo") {
  const MongoRepository = require("../repository/MongoRepository");
  repo = new MongoRepository();
} else if (provider === "postgres") {
  const PostgresRepository = require("../repository/PostgresRepository");
  repo = new PostgresRepository();
} else {
  throw new Error("DB_PROVIDER doit être 'mongo' ou 'postgres'.");
}

exports.list = async (req, res, next) => {
  try {
    res.json(await repo.all());
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
    const item = await repo.create({ title, description, priority, dueDate });
    res.status(201).json(item);
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
    const item = await repo.markDone(req.params.id);
    if (!item) return res.status(404).json({ error: "Task not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
};
