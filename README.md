# Exercice2 — API ToDoList Express (MVC)

Création d'une API **ToDoList** en **JavaScript** avec **Express** (architecture **MVC**).

## Installation et configuration de l’environnement
```bash
cd Exercice2-Todo-Express
npm install
# ou depuis zéro, comme demandé
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

## Scripts (package.json)
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Lancer le serveur
```bash
npm run dev   # dev avec nodemon
# ou
npm start     # prod simple
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
    ├── models/
    │   └── Task.js
    ├── repository/
    │   └── JsonRepository.js
    └── routes/
        └── taskRoutes.js
```

## Persistance
Les données sont stockées dans `~/.todo_express/tasks.json`. Change le chemin avec la variable d'environnement `TODO_API_DB`.
