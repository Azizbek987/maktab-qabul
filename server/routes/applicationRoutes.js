const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Bazaga ulanish
const sendTelegramMessage = require('../utils/telegram'); // Telegram bot ulanishi

// 📥 1. Yangi ariza topshirish (POST /api/application/create)
router.post('/create', async (req, res) => {
  try {
    const { parent_name, child_name, phone } = req.body;

    const result = await pool.query(
      'INSERT INTO applications (parent_name, child_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [parent_name, child_name, phone]
    );

    const telegramText = `📥 *YANGI ARIZA TUSHDI!*\n\n👨 *Ota-ona:* ${parent_name}\n👶 *Bola:* ${child_name}\n📱 *Telefon:* ${phone}\n\n_Tizim: Maktab Qabul Online_`;

    try {
      await sendTelegramMessage(telegramText);
      console.log("🤖 Telegram xabari ketdi!");
    } catch (botErr) {
      console.error("❌ Telegram botda xato:", botErr.message);
    }

    return res.status(201).json({ 
      success: true, 
      message: "Ariza qabul qilindi!",
      application: result.rows[0]
    });

  } catch (err) {
    console.error("💥 Arizada xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 🔍 2. VARIANT A: Frontend /api/application/my/1 deb so'rasa shu eshik ishlaydi
router.get('/my/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    console.error("💥 Xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 🔍 3. VARIANT B: Frontend adashib /api/application/1 (o'rtada "my" siz) so'rasa shu eshik ishlaydi!
// 🚨 Aynan mana shu zaxira yo'li o'sha la'nati 404 xatosini o'ldiradi!
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Agar id "my" so'zi bo'lsa frontend xato so'ragan bo'ladi, uni o'tkazib yuboramiz
    if (id === 'my') return res.json([]); 

    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    console.error("💥 Xato:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;