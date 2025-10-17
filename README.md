# Exercice2 — API ToDoList Express (MVC)

Création d'une API **ToDoList** en **JavaScript** avec **Express** et architecture **MVC**.  
Cette API supporte plusieurs bases de données : **MongoDB** ou **PostgreSQL**, au choix au moment du lancement.

---

## 🚀 Installation et configuration de l’environnement

```bash
cd Exercice2-Todo-Express
npm install
# ou depuis zéro
npm init -y
npm install express cors dotenv mongoose pg
npm install --save-dev nodemon cross-env

## Scripts (package.json)
```json
{
    "start": "node server.js",
    "dev": "nodemon server.js",
    "dev:mongo": "cross-env DB_PROVIDER=mongo nodemon server.js",
    "dev:pg": "cross-env DB_PROVIDER=postgres nodemon server.js"
}
```

## Lancer le serveur
```bash
# PostgreSQL
npm run dev:pg

# MongoDB
npm run dev:mongo

```

## Endpoints
- GET /           — index JSON
- GET /tasks      — afficher les tâches
- POST /tasks     — ajouter une tâche
- PATCH /tasks/:id/done — marquer terminée
- DELETE /tasks/:id — supprimer une tâche

## Exemples curl
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Faire les courses","priority":"high"}' http://127.0.0.1:5000/tasks
curl http://127.0.0.1:5000/tasks
curl -X PATCH http://127.0.0.1:5000/tasks/<ID>/done
curl -X DELETE http://127.0.0.1:5000/tasks/<ID>
```

## Architecture
```
Exercice2-Todo-Express/
├── server.js
├── .env
├── package.json
└── src/
    ├── controllers/
    │   └── taskController.js
    ├── db.js
    ├── db_pg.js
    ├── models/
    │   └── TaskMongo.js
    ├── repository/
    │   ├── MongoRepository.js
    │   └── PostgresRepository.js
    └── routes/
        └── taskRoutes.js

```

## Persistance
Les données sont stockées dans `~/.todo_express/tasks.json`. Change le chemin avec la variable d'environnement `TODO_API_DB`.
