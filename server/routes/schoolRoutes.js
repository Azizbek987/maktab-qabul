const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// Maktab yaratish
router.post('/create', async (req, res) => {
  try {
    const { name, address } = req.body
    const result = await pool.query(
      'INSERT INTO schools (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Barcha maktablarni olish
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schools')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router