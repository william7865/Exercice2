require("dotenv").config();

const express = require("express");
const cors = require("cors");
const taskRoutes = require("./src/routes/taskRoutes");
const { connectDB } = require("./src/db"); // Mongo (if chosen)
const { connectPG } = require("./src/db_pg"); // Postgres (if chosen)

const provider = (process.env.DB_PROVIDER || "").toLowerCase();
if (!["mongo", "postgres"].includes(provider)) {
  console.error("❌ DB_PROVIDER doit être 'mongo' ou 'postgres'.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "ToDoList API (Express)",
    status: "ok",
    db: provider,
    endpoints: {
      "GET /tasks": "Lister les tâches",
      "POST /tasks": "Créer une tâche",
      "DELETE /tasks/:id": "Supprimer une tâche",
      "PATCH /tasks/:id/done": "Marquer terminée",
    },
  });
});

app.use("/tasks", taskRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

(async () => {
  if (provider === "mongo") {
    await connectDB();
  } else if (provider === "postgres") {
    await connectPG();
  }
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://127.0.0.1:${PORT}`)
  );
})();
