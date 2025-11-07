const jwt = require("jsonwebtoken");
const User = require("../models/userMongo");

const JWT_SECRET = process.env.JWT_SECRET || "secretkeyappearshere";

// Inscription
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Cet email est déjà utilisé." });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Connexion
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return res.status(400).json({ error: "Identifiants incorrects." });
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
