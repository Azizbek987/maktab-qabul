const express = require('express')
const pool = require('../config/db')
const multer = require('multer')
const supabase = require('../config/supabase') // ☁️ Supabase ulandi

const router = express.Router()

// Faylni vaqtincha xotirada (Buffer) ushlab turish uchun Multer sozlamasi
const storage = multer.memoryStorage()
const upload = multer({ storage })

// 1. ARIZA YARATISH (Fayl Supabase Storage'ga yuklanadi)
router.post('/create', upload.single('document'), async (req, res) => {
  try {
    const { parent_name, child_name, age, school_id, phone, user_id } = req.body
    let documentUrl = null

    if (req.file) {
      // Supabase'da fayl nomi unikal bo'lishi uchun vaqt qo'shamiz
      const fileName = `${Date.now()}_${req.file.originalname}`

      // ☁️ Faylni Supabase "hujjatlar" bucketiga yuklash
      const { data, error } = await supabase.storage
        .from('hujjatlar')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        })

      if (error) throw error

      // Yuklangan faylning umumiy internet linkini (URL) olish
      const { data: publicData } = supabase.storage
        .from('hujjatlar')
        .getPublicUrl(fileName)

      documentUrl = publicData.publicUrl
    }

    // Bazaga to'liq internet havolasini saqlaymiz
    const result = await pool.query(
      `INSERT INTO applications (parent_name, child_name, age, school_id, phone, document, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [parent_name, child_name, age, school_id, phone, documentUrl, user_id]
    )

    const io = req.app.get('io')
    if (io) {
      io.emit('new_application', { message: `🔥 Yangi ariza keldi! ${child_name} uchun.` })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 2. HAMMA ARIZALARNI OLISH
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT applications.*, schools.name AS school_name FROM applications
      LEFT JOIN schools ON applications.school_id = schools.id ORDER BY applications.id DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 3. FOYDALANUVCHINING O'Z ARIZALARI
router.get('/my/:id', async (req, res) => {
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

// 4. STATISTIKA
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

// 5. STATUSNI YANGILASH
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params
    const result = await pool.query('UPDATE applications SET status=$1 WHERE id=$2 RETURNING *', [status, id])
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router