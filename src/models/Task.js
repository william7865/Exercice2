const { randomUUID } = require("crypto");

class Task {
  constructor({
    title,
    id = randomUUID(),
    createdAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.title = title;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Task;
