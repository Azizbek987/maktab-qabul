const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Bazaga ulanish
const sendTelegramMessage = require('../utils/telegram'); // Telegram bot ulanishi

// 📥 1. Yangi ariza topshirish (POST /api/application/create)
router.post('/create', async (req, res) => {
  try {
    const { parent_name, child_name, phone } = req.body;

    // 📝 Neon PostgreSQL bazasiga arizani saqlash (Jadvalingiz nomiga qarab o'zgartiring agar kerak bo'lsa)
    const result = await pool.query(
      'INSERT INTO applications (parent_name, child_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [parent_name, child_name, phone]
    );

    // 🚀 Ariza muvaffaqiyatli bo'lsa, Telegram Botga xabar boradi:
    const telegramText = `📥 *YANGI ARIZA TUSHDI!*\n\n👨 *Ota-ona:* ${parent_name}\n👶 *Bola:* ${child_name}\n📱 *Telefon:* ${phone}\n\n_Tizim: Maktab Qabul Online_`;

    try {
      await sendTelegramMessage(telegramText);
      console.log("🤖 Arizadan Telegram xabari muvaffaqiyatli ketdi!");
    } catch (botErr) {
      console.error("❌ Telegram bot xabar yuborishda xato:", botErr.message);
    }

    return res.status(201).json({ 
      success: true, 
      message: "Ariza qabul qilindi va Telegramga yuborildi!",
      application: result.rows[0]
    });

  } catch (err) {
    console.error("💥 Arizada xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 🔍 2. Frontend so'rayotgan shaxsiy arizalarni olish (GET /api/application/my/:id)
// 🚨 Aynan mana shu yo'l yo'qligi uchun frontend 404 xatosi berayotgan edi!
router.get('/my/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Foydalanuvchining arizasini bazadan qidirish
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    
    // Agar ariza bo'lmasa ham bo'sh massiv qaytaramiz (frontend sinib qolmasligi uchun)
    return res.json(result.rows || []);
  } catch (err) {
    console.error("💥 Arizalarni olishda xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;