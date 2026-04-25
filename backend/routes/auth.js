import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ─── Signup ──────────────────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit avoir au moins 6 caractères" });
  }

  try {
    const connection = await pool.getConnection();

    // Vérifier si l'email existe
    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const [result] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    connection.release();

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({ token, user: { id: result.insertId, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email et mot de passe obligatoires" });
  }

  try {
    const connection = await pool.getConnection();

    const [users] = await connection.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email],
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── Change password ─────────────────────────────────────────────────────────
router.patch("/change-password", verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Ancien et nouveau mot de passe obligatoires" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({
        error: "Le nouveau mot de passe doit avoir au moins 6 caractères",
      });
  }

  try {
    const connection = await pool.getConnection();

    // Récupérer l'utilisateur actuel
    const [users] = await connection.query(
      "SELECT id, password FROM users WHERE id = ?",
      [req.userId],
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = users[0];

    // Vérifier l'ancien mot de passe
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ error: "Ancien mot de passe incorrect" });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await connection.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.userId,
    ]);
    connection.release();

    res.json({ success: true, message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// ─── Logout ──────────────────────────────────────────────────────────────────
router.post("/logout", verifyToken, async (req, res) => {
  res.json({ success: true, message: "Déconnecté avec succès" });
});

export default router;
