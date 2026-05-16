const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// 1. HAMMA XABARLARNI OLISH
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 2. XABAR YUBORISH
router.post('/send', async (req, res) => {
  try {
    const { sender, text } = req.body

    const result = await pool.query(
      `INSERT INTO messages (sender, text) VALUES ($1, $2) RETURNING *`,
      [sender, text]
    )

    // 🔌 Socket.IO orqali hamma ulanganlarga REALTIME yangi xabarni tarqatamiz
    const io = req.app.get('io')
    if (io) {
      io.emit('new_message', result.rows[0])
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router