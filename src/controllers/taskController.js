const Task = require('../models/Task');
const JsonRepository = require('../repository/JsonRepository');
const repo = new JsonRepository();

exports.list = (req, res) => {
  res.json(repo.all().map(t=>t.toJSON()));
};

exports.create = (req, res) => {
  const { title, description='', priority='medium', dueDate=null } = req.body || {};
  if(!title) return res.status(400).json({ error: 'Missing field: title' });
  const task = new Task({ title, description, priority, dueDate });
  repo.save(task);
  res.status(201).json(task.toJSON());
};

exports.remove = (req, res) => {
  const ok = repo.delete(req.params.id);
  if(!ok) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
};

exports.done = (req, res) => {
  const task = repo.get(req.params.id);
  if(!task) return res.status(404).json({ error: 'Task not found' });
  task.markDone();
  repo.save(task);
  res.json(task.toJSON());
};
