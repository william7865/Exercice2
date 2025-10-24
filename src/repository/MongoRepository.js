const Task = require("../models/TaskMongo");

class MongoRepository {
  // Récupère toutes les tâches
  async all() {
    const items = await Task.find().sort({ createdAt: 1 }).exec();
    return items.map((t) => t.toJSON());
  }

  // Récupère une tâche par ID
  async get(id) {
    const doc = await Task.findById(id).exec();
    return doc ? doc.toJSON() : null;
  }

  // Crée une nouvelle tâche
  async create(data) {
    const doc = await Task.create(data);
    return doc.toJSON();
  }

  // Supprime une tâche
  async delete(id) {
    const res = await Task.findByIdAndDelete(id).exec();
    return !!res;
  }
}

module.exports = MongoRepository;
