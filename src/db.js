const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
if (!uri)
  console.warn("MONGODB_URI non défini dans .env — fallback JSON actif.");
async function connectDB() {
  if (!uri) return null;
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log(" MongoDB connecté");
    return mongoose.connection;
  } catch (err) {
    console.error("Erreur connexion MongoDB:", err.message);
    process.exit(1);
  }
}
module.exports = { connectDB };
