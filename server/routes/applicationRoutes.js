const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const sendTelegramMessage = require('../utils/telegram'); 
const multer = require('multer'); // FormData'ni o'qish uchun tarjimon
const upload = multer(); 

// 📥 1. Yangi ariza topshirish (POST /api/application/create)
// upload.none() — frontend FormData yuborayotgan bo'lsa, matnlarni req.body'ga chiqarib beradi!
router.post('/create', upload.none(), async (req, res) => {
  try {
    // Frontend ma'lumotni qayerga yashirgan bo'lsa ham qidirib topamiz:
    const parent_name = req.body.parent_name || req.query.parent_name;
    const child_name = req.body.child_name || req.query.child_name;
    const phone = req.body.phone || req.query.phone;

    // Tekshirish: Agar frontend baribir bo'sh yuborayotgan bo'lsa, server qulab tushmasligi uchun:
    if (!parent_name || !child_name) {
      console.log("⚠️ Frontenddan kelgan ma'lumotlar bo'sh:", req.body);
      return res.status(400).json({ 
        success: false, 
        error: "Ota-ona yoki bola ismi kiritilmadi! req.body bo'sh." 
      });
    }

    // Neon Baza bilan ishlash
    const result = await pool.query(
      'INSERT INTO applications (parent_name, child_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [parent_name, child_name, phone]
    );

    // Telegram Bot xabari
    const telegramText = `📥 *YANGI ARIZA TUSHDI!*\n\n👨 *Ota-ona:* ${parent_name}\n👶 *Bola:* ${child_name}\n📱 *Telefon:* ${phone}`;
    try {
      await sendTelegramMessage(telegramText);
    } catch (bErr) {
      console.error("Telegram xatosi:", bErr.message);
    }

    return res.status(201).json({ 
      success: true, 
      message: "Ariza muvaffaqiyatli qabul qilindi!",
      application: result.rows[0]
    });

  } catch (err) {
    console.error("💥 Arizada haqiqiy xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 🔍 2. Shaxsiy arizalarni olish
router.get('/my/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Zaxira yo'nalish
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'my') return res.json([]);
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;