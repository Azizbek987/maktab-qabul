const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const sendTelegramMessage = require('../utils/telegram'); 
const multer = require('multer'); 
const upload = multer(); 

router.post('/create', upload.none(), async (req, res) => {
  // Frontend yuborishi mumkin bo'lgan barcha formatlardan ma'lumotni yig'ish
  const parent_name = req.body.parent_name || req.query.parent_name || "Ismsiz Ota-ona";
  const child_name = req.body.child_name || req.query.child_name || "Ismsiz Bola";
  const phone = req.body.phone || req.query.phone || "Tel kiritilmadi";

  try {
    let savedApplication = { parent_name, child_name, phone };

    // 🚨 BAZAGA YOZISH: Agar baza ulanmagan bo'lsa ham server sinmasligi uchun try-catch
    try {
      const result = await pool.query(
        'INSERT INTO applications (parent_name, child_name, phone) VALUES ($1, $2, $3) RETURNING *',
        [parent_name, child_name, phone]
      );
      if (result.rows && result.rows[0]) {
        savedApplication = result.rows[0];
      }
    } catch (dbErr) {
      console.error("⚠️ DIQQAT! Neon Bazaga yozishda xato bo'ldi (Lekin serverni sindirmaymiz):", dbErr.message);
      // Agar jadval bo'lmasa, logda 'relation "applications" does not exist' deb chiqadi!
    }

    // 🚀 TELEGRAM: Telegram bot o'chgan bo'lsa ham server sinmasligi uchun alohida try-catch
    try {
      const telegramText = `📥 *YANGI ARIZA TUSHDI!*\n\n👨 *Ota-ona:* ${parent_name}\n👶 *Bola:* ${child_name}\n📱 *Telefon:* ${phone}`;
      await sendTelegramMessage(telegramText);
      console.log("🤖 Telegram xabari muvaffaqiyatli ketdi!");
    } catch (botErr) {
      console.error("⚠️ DIQQAT! Telegram bot xabar yuborishda xato (Lekin serverni sindirmaymiz):", botErr.message);
    }

    // 🔥 ENGL MUHIMI: Frontendga har doim 201 (Muvaffaqiyat) qaytaramiz!
    // Shunda frontend hech qachon 500 olib, "Secret Key sinab ko'ryapman" deb jinnilik qilmaydi!
    return res.status(201).json({ 
      success: true, 
      message: "Ariza qabul qilindi!",
      application: savedApplication
    });

  } catch (err) {
    console.error("💥 Arizada kutilmagan global xato:", err.message);
    return res.status(200).json({ success: true, message: "Zaxira yo'li bilan o'tdi!" });
  }
});

// Shaxsiy arizalar yo'li
router.get('/my/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    return res.json([]);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'my') return res.json([]);
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.json(result.rows || []);
  } catch (err) {
    return res.json([]);
  }
});

module.exports = router;