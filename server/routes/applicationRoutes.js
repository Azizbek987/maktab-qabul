const express = require('express');
const router = express.Router();
const logger = require('../utils/logger'); // Logger import qilindi

// 1. Maktablar ro'yxatini olish (all)
router.get('/all', async (req, res) => {
  try {
    // Bu yerda maktablarni bazadan yuklash kodi bo'ladi (misol uchun bo'sh massiv)
    res.status(200).json([]); 
  } catch (err) {
    logger.error(`Maktablarni yuklashda xatolik: ${err.message}`); // Xato logga yozildi
    res.status(500).json({ error: err.message });
  }
});

// 2. Yangi ariza yaratish (create)
router.post('/create', async (req, res) => {
  try {
    // Ariza yaratish va Supabase'ga yuklash kodlari shu yerda bo'ladi
    res.status(201).json({ message: "🎉 Ariza muvaffaqiyatli yaratildi!" });
  } catch (err) {
    logger.error(`Ariza yaratishda xatolik: ${err.message}`); // Xato logga yozildi
    res.status(500).json({ error: err.message });
  }
});

// 3. Foydalanuvchining o'z arizalarini olish (my/:id)
router.get('/my/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    res.status(200).json([]);
  } catch (err) {
    logger.error(`Foydalanuvchi arizalarini yuklashda xatolik: ${err.message}`); // Xato logga yozildi
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;