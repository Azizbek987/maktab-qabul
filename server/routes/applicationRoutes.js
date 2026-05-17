const express = require('express');
const router = express.Router();
const sendTelegramMessage = require('../utils/telegram');

// 📥 Yangi ariza topshirish (POST)
router.post('/create', async (req, res) => {
  try {
    const { parent_name, child_name, phone } = req.body;

    // 1. Bu yerda arizani bazaga (Supabase/Postgres) saqlash kodi bo'ladi
    // Masalan: const newApplication = await db.query(...) 

    // 2. 🚀 Ariza muvaffaqiyatli bo'lsa, srazi Telegram Botga xabar boradi:
    const telegramText = `
📥 *YANGI ARIZA TUSHDI!*

👨 *Ota-ona:* ${parent_name}
👶 *Bola:* ${child_name}
📱 *Telefon:* ${phone}

_Tizim: Maktab Qabul Online_
    `;

    await sendTelegramMessage(telegramText);

    // Frontendga javob qaytarish
    res.status(201).json({ success: true, message: "Ariza qabul qilindi va Telegramga yuborildi!" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;