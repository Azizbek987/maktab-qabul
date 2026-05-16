const express = require('express')
const pool = require('../config/db')
const upload = require('../middleware/upload')
const sendEmail = require('../utils/email') 

// 📍 1-QADAM: HIMOYACHINI IMPORT QILISH
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// 1. CREATE APPLICATION (ARIZA YARATISH)
router.post(
  '/create',
  upload.single('document'),
  async (req, res) => {
    try {
      const {
        parent_name,
        child_name,
        age,
        school_id, 
        phone,
        user_id 
      } = req.body

      const document = req.file ? req.file.filename : null

      const result = await pool.query(
        `INSERT INTO applications
        (parent_name, child_name, age, school_id, phone, document, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [parent_name, child_name, age, school_id, phone, document, user_id]
      )

      try {
        await sendEmail(
          'admin@gmail.com', 
          'Yangi ariza keldi', 
          `${child_name} uchun yangi ariza yuborildi. Telefon: ${phone}`
        )
      } catch (mailError) {
        console.error("Email yuborishda muammo:", mailError.message)
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// 2. GET ALL APPLICATIONS (ADMIN UCHUN) - 📍 HIMOYALANDI
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        applications.*, 
        schools.name AS school_name
      FROM applications
      LEFT JOIN schools ON applications.school_id = schools.id
      ORDER BY applications.id DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 3. USER APPLICATION API (FOYDALANUVCHINING O'Z ARIZALARI)
router.get('/my/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT applications.*, schools.name AS school_name
       FROM applications
       LEFT JOIN schools ON applications.school_id = schools.id
       WHERE user_id=$1
       ORDER BY applications.id DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 4. GET STATS (STATISTIKA) - 📍 HIMOYALANDI
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM applications')
    const pending = await pool.query("SELECT COUNT(*) FROM applications WHERE status='pending'")
    const approved = await pool.query("SELECT COUNT(*) FROM applications WHERE status='approved'")
    const rejected = await pool.query("SELECT COUNT(*) FROM applications WHERE status='rejected'")

    res.json({
      total: total.rows[0].count,
      pending: pending.rows[0].count,
      approved: approved.rows[0].count,
      rejected: rejected.rows[0].count
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 5. UPDATE STATUS (STATUSNI YANGILASH) - 📍 HIMOYALANDI
router.put('/status/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    const result = await pool.query(
      'UPDATE applications SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router