const { randomUUID } = require('crypto');

class Task {
  constructor({ title, description = '', priority = 'medium', dueDate = null, status = 'pending', id = randomUUID(), createdAt = new Date().toISOString(), updatedAt = new Date().toISOString() } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  markDone(){ this.status='done'; this.updatedAt = new Date().toISOString(); }
  toJSON(){ return {id:this.id,title:this.title,description:this.description,priority:this.priority,dueDate:this.dueDate,status:this.status,createdAt:this.createdAt,updatedAt:this.updatedAt}; }
}
module.exports = Task;
