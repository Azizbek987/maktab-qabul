const express = require('express')
const pool = require('../config/db')
const upload = require('../middleware/upload')

// 📍 3-QADAM — EMAIL FUNKSIYASINI IMPORT QILISH
const sendEmail = require('../utils/email') 

const router = express.Router()

// 1. CREATE APPLICATION (ARIZA YARATISH) - 📍 BACKEND UPDATE (user_id bilan)
router.post(
  '/create',
  upload.single('document'),
  async (req, res) => {
    try {
      // 📍 4-QADAM — req.body dan user_id ni ham olamiz
      const {
        parent_name,
        child_name,
        age,
        school_id, 
        phone,
        user_id // 👈 Frontenddan kelayotgan ID
      } = req.body

      const document = req.file ? req.file.filename : null

      // 1. Ma'lumotlarni bazaga saqlash - 📍 user_id qo'shildi
      const result = await pool.query(
        `INSERT INTO applications
        (
          parent_name,
          child_name,
          age,
          school_id,
          phone,
          document,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          parent_name,
          child_name,
          age,
          school_id,
          phone,
          document,
          user_id
        ]
      )

      // 📍 EMAIL YUBORISH
      try {
        await sendEmail(
          'admin@gmail.com', 
          'Yangi ariza keldi', 
          `${child_name} uchun yangi ariza yuborildi. Telefon: ${phone}`
        )
        console.log('📩 Yangi ariza email yuborildi')
      } catch (mailError) {
        console.error("Email yuborishda muammo:", mailError.message)
      }

      res.json(result.rows[0])

    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
)

// 2. GET ALL APPLICATIONS (BARCHA ARIZALAR)
router.get('/all', async (req, res) => {
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

// 5-QADAM — USER APPLICATION API (FOYDALANUVCHINING O'Z ARIZALARI)
// 📍 Eng pastiga, module.exports dan tepaga qo'shildi
router.get('/my/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT applications.*, schools.name AS school_name
       FROM applications
       LEFT JOIN schools
       ON applications.school_id = schools.id
       WHERE user_id=$1
       ORDER BY applications.id DESC`,
      [id]
    )

    res.json(result.rows)

  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

// 3. GET STATS (STATISTIKA)
router.get('/stats', async (req, res) => {
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

// 4. UPDATE STATUS (STATUSNI YANGILASH)
router.put('/status/:id', async (req, res) => {
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