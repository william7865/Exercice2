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

// Liste toutes les tâches
exports.list = async (req, res, next) => {
  try {
    const tasks = await repo.all();
    res.json(tasks);
  } catch (e) {
    next(e);
  }
};

// Crée une nouvelle tâche
exports.create = async (req, res, next) => {
  try {
    const { title } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: "Le champ 'title' est requis." });
    }
    const item = await repo.create({ title });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
};

// Supprime une tâche
exports.remove = async (req, res, next) => {
  try {
    const ok = await repo.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Tâche non trouvée." });
    }
    res.json({ message: "Tâche supprimée." });
  } catch (e) {
    next(e);
  }
};

exports.done = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof repo.update !== "function") {
      return res
        .status(501)
        .json({ error: "Fonction 'done' non implémentée dans le repository." });
    }
    const updated = await repo.update(id, { done: true });
    if (!updated) {
      return res.status(404).json({ error: "Tâche non trouvée." });
    }
    res.json(updated);
  } catch (e) {
    next(e);
  }
};
