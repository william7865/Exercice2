const Task = require("../models/TaskMongo");
class MongoRepository {
  async all() {
    const items = await Task.find().sort({ createdAt: 1 }).exec();
    return items.map((t) => t.toJSON());
  }
  async get(id) {
    const doc = await Task.findById(id).exec();
    return doc ? doc.toJSON() : null;
  }
  async create(data) {
    const doc = await Task.create(data);
    return doc.toJSON();
  }
  async update(id, data) {
    const doc = await Task.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? doc.toJSON() : null;
  }
  async delete(id) {
    const res = await Task.findByIdAndDelete(id).exec();
    return !!res;
  }
  async markDone(id) {
    const doc = await Task.findByIdAndUpdate(
      id,
      { status: "done" },
      { new: true }
    ).exec();
    return doc ? doc.toJSON() : null;
  }
}
module.exports = MongoRepository;
