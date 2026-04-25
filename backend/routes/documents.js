import express from 'express';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ─── Get all documents (pour cet utilisateur) ────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [documents] = await connection.query(
      'SELECT id, type, name, expiryDate, notes, createdAt FROM documents WHERE userId = ? ORDER BY createdAt DESC',
      [req.userId]
    );
    connection.release();

    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Add document ────────────────────────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
  const { type, name, expiryDate, notes } = req.body;

  if (!type || !name || !expiryDate) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO documents (userId, type, name, expiryDate, notes) VALUES (?, ?, ?, ?, ?)',
      [req.userId, type, name, expiryDate, notes || null]
    );
    connection.release();

    res.json({ id: result.insertId, type, name, expiryDate, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Update document ────────────────────────────────────────────────────────
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { type, name, expiryDate, notes } = req.body;

  try {
    const connection = await pool.getConnection();

    // Vérifier que le document appartient à cet utilisateur
    const [check] = await connection.query(
      'SELECT id FROM documents WHERE id = ? AND userId = ?',
      [id, req.userId]
    );

    if (check.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    await connection.query(
      'UPDATE documents SET type = ?, name = ?, expiryDate = ?, notes = ? WHERE id = ?',
      [type, name, expiryDate, notes, id]
    );
    connection.release();

    res.json({ id, type, name, expiryDate, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Delete document ────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    // Vérifier que le document appartient à cet utilisateur
    const [check] = await connection.query(
      'SELECT id FROM documents WHERE id = ? AND userId = ?',
      [id, req.userId]
    );

    if (check.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    await connection.query('DELETE FROM documents WHERE id = ?', [id]);
    connection.release();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
