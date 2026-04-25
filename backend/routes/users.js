import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ─── Get all users ───────────────────────────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      "SELECT id, name, email FROM users ORDER BY id",
    );
    connection.release();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── Get user by id ─────────────────────────────────────────────────────────
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id],
    );
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
