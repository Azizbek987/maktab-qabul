const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// 📥 To'lov yaratish (POST /api/payment/create)
router.post('/create', async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    // 1. To'lovni bazaga 'pending' (kutilmoqda) holatida saqlaymiz
    const result = await pool.query(
      'INSERT INTO payments (user_id, amount) VALUES ($1, $2) RETURNING *',
      [user_id, amount]
    );

    // 2. DEMO TO'LOV URL (Hozircha test rejimi uchun Payme chekout havolasi)
    // Keyinchalik Click/Payme integratsiya qilinganda bu yerga haqiqiy so'rov havolasi yoziladi
    const paymentUrl = 'https://checkout.paycom.uz';

    return res.json({
      success: true,
      url: paymentUrl,
      payment: result.rows[0]
    });

  } catch (err) {
    console.error("💥 To'lov yaratishda xato:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;