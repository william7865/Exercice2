const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./src/routes/taskRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'ToDoList API (Express)',
    status: 'ok',
    endpoints: {
      'GET /tasks': 'Lister les tâches',
      'POST /tasks': 'Créer une tâche',
      'DELETE /tasks/:id': 'Supprimer une tâche',
      'PATCH /tasks/:id/done': 'Marquer terminée'
    }
  });
});

app.use('/tasks', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on http://127.0.0.1:${PORT}`));
