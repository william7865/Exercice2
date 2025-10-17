require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/db");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "ToDoList API (Express)",
    status: "ok",
    db: process.env.MONGODB_URI ? "mongodb" : "json",
    endpoints: {
      "GET /tasks": "Lister les tâches",
      "POST /tasks": "Créer une tâche",
      "DELETE /tasks/:id": "Supprimer une tâche",
      "PATCH /tasks/:id/done": "Marquer terminée",
    },
  });
});

app.use("/tasks", taskRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

(async () => {
  if (process.env.MONGODB_URI) await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://127.0.0.1:${PORT}`)
  );
})();
