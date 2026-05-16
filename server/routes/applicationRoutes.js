const express = require('express')
const pool = require('../config/db')
const upload = require('../middleware/upload')
const sendEmail = require('../utils/email') 
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware') // 👈 Yangi qo'shildi

const router = express.Router()

// 1. ARIZA YARATISH (Buni hamma login qilgan 'parent'lar qila oladi)
router.post('/create', authMiddleware, upload.single('document'), async (req, res) => {
    try {
      const { parent_name, child_name, age, school_id, phone, user_id } = req.body
      const document = req.file ? req.file.filename : null

      const result = await pool.query(
        `INSERT INTO applications (parent_name, child_name, age, school_id, phone, document, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [parent_name, child_name, age, school_id, phone, document, user_id]
      )

      const io = req.app.get('io')
      if (io) {
        io.emit('new_application', { message: `🔥 Yangi ariza keldi! ${child_name} uchun.` })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// 2. HAMMA ARIZALARNI OLISH (Faqat super_admin va school_admin ko'ra oladi)
// 🔐 HIMOYA KUCHAYTIRILDI!
router.get('/all', authMiddleware, roleMiddleware('super_admin', 'school_admin'), async (req, res) => {
  try {
    let result;
    
    // 🏫 SCHOOL ADMIN REJASI (NEXT LEVEL):
    // Agar kirgan foydalanuvchi maktab admini bo'lsa, faqat uning maktabiga tegishli arizalar chiqadi
    if (req.user.role === 'school_admin') {
      result = await pool.query(`
        SELECT applications.*, schools.name AS school_name FROM applications
        LEFT JOIN schools ON applications.school_id = schools.id
        WHERE applications.school_id = $1 ORDER BY applications.id DESC
      `, [req.user.school_id]) // school_id foydalanuvchi jadvalidan olinadi
    } else {
      // super_admin bo'lsa hamma maktablarni ko'radi
      result = await pool.query(`
        SELECT applications.*, schools.name AS school_name FROM applications
        LEFT JOIN schools ON applications.school_id = schools.id ORDER BY applications.id DESC
      `)
    }
    
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 3. FOYDALANUVCHINING O'Z ARIZALARI
router.get('/my/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT applications.*, schools.name AS school_name FROM applications
       LEFT JOIN schools ON applications.school_id = schools.id WHERE user_id=$1 ORDER BY applications.id DESC`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 4. STATISTIKA (Faqat super_admin va school_admin uchun)
router.get('/stats', authMiddleware, roleMiddleware('super_admin', 'school_admin'), async (req, res) => {
  try {
    let total, pending, approved, rejected;

    if (req.user.role === 'school_admin') {
      // Maktab admini uchun faqat o'z maktabi statistikasi
      total = await pool.query('SELECT COUNT(*) FROM applications WHERE school_id=$1', [req.user.school_id])
      pending = await pool.query("SELECT COUNT(*) FROM applications WHERE status='pending' AND school_id=$1", [req.user.school_id])
      approved = await pool.query("SELECT COUNT(*) FROM applications WHERE status='approved' AND school_id=$1", [req.user.school_id])
      rejected = await pool.query("SELECT COUNT(*) FROM applications WHERE status='rejected' AND school_id=$1", [req.user.school_id])
    } else {
      // Super admin uchun umumiy statistika
      total = await pool.query('SELECT COUNT(*) FROM applications')
      pending = await pool.query("SELECT COUNT(*) FROM applications WHERE status='pending'")
      approved = await pool.query("SELECT COUNT(*) FROM applications WHERE status='approved'")
      rejected = await pool.query("SELECT COUNT(*) FROM applications WHERE status='rejected'")
    }

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

// 5. STATUSNI YANGILASH (Faqat super_admin va school_admin)
router.put('/status/:id', authMiddleware, roleMiddleware('super_admin', 'school_admin'), async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    const result = await pool.query(
      'UPDATE applications SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    )

    const io = req.app.get('io')
    if (io) {
      io.emit('status_updated', { message: `📋 Ariza statusi yangilandi: ${status}`, application_id: id, status })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router