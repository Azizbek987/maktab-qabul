const express = require('express');
const pool = require('../config/db'); // Sizning bazangiz yo'li
const sendTelegramMessage = require('../utils/telegram'); // Markazlashgan bot
const router = express.Router();

// 📍 1. REGISTER — RO'YXATDAN O'TISH VA OTP YUBORISH
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    // 6 xonali tasodifiy OTP yaratish
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Foydalanuvchi mavjudligini tekshirish
    const userCheck = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (userCheck.rows.length > 0) {
      // Mavjud foydalanuvchi uchun OTPni yangilash
      await pool.query(
        'UPDATE users SET otp = $1 WHERE phone = $2',
        [otp, phone]
      );
    } else {
      // Yangi foydalanuvchi yaratish (is_verified standart FALSE bo'ladi)
      await pool.query(
        'INSERT INTO users (name, phone, password, otp) VALUES ($1, $2, $3, $4)',
        [name, phone, password, otp]
      );
    }

    // 📍 LOG CHIQARISH (Terminalda kodni ko'rish uchun)
    console.log('---------------------------');
    console.log(`📞 TEL: ${phone}`);
    console.log(`🔢 OTP CODE: ${otp}`);
    console.log('---------------------------');

    // 🤖 TELEGRAM BOT ORQALI KODNI YUBORISH
    const telegramText = `🔔 *YANGI RO'YXATDAN O'TISH SO'ROVI*\n\n👤 *Ism:* ${name}\n📞 *Tel:* ${phone}\n🔢 *OTP KOD:* \`${otp}\``;

    // 🔥 Xavfsizlik qalqoni: Telegram bot o'chib qolsa ham frontendga 500 xato bermasligi uchun alohida try-catch qilamiz
    try {
      // Bu yerga majburiy AWAIT qo'shdik, xabarni to'liq ketishini ta'minlaydi
      await sendTelegramMessage(telegramText);
      console.log("🤖 Telegram botga xabar muvaffaqiyatli ketdi!");
    } catch (telegramError) {
      // Telegram qulasa, sababini logda ko'ramiz, lekin ro'yxatdan o'tish to'xtab qolmaydi
      console.error("❌ Telegram util funksiyasida xato:", telegramError.message);
    }

    // Muvaffaqiyatli javob (Zaxira tariqasida OTP kod baribir logda ko'rinadi)
    return res.status(200).json({ 
      success: true, 
      message: "OTP kod yuborildi (Telegram botingizni tekshiring!)" 
    });

  } catch (error) {
    console.error("💥 Registerda umumiy xato:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 📍 2. LOGIN — KIRISH (is_verified tekshiruvi bilan)
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Foydalanuvchini bazadan qidirish
    const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = userResult.rows[0];

    // 1. Foydalanuvchi mavjudligini tekshirish
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    // 2. Akkaunt tasdiqlanganmi?
    if (!user.is_verified) {
      return res.status(401).json({
        message: 'Account verify qilinmagan. Iltimos, raqamingizni tasdiqlang!'
      });
    }

    // 3. Parolni tekshirish
    if (user.password !== password) {
      return res.status(400).json({ message: 'Parol xato!' });
    }

    // Hammasi to'g'ri bo'lsa
    return res.json({ 
      success: true,
      message: 'Tizimga muvaffaqiyatli kirdingiz!', 
      user: { name: user.name, phone: user.phone } 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 📍 3. VERIFY — KODNI TASDIQLASH (is_verified ustunini TRUE qilish)
router.post('/verify', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // 1. Foydalanuvchini bazadan qidirish
    const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    // 2. OTP kodni solishtirish
    if (userResult.rows[0].otp != otp) {
      return res.status(400).json({ message: 'Xato OTP kod kiritildi!' });
    }

    // 3. Tasdiqlangan deb belgilash va OTPni o'chirish
    await pool.query(
      'UPDATE users SET is_verified = true, otp = NULL WHERE phone = $1',
      [phone]
    );

    return res.json({ success: true, message: 'Tabriklaymiz! Raqamingiz muvaffaqiyatli tasdiqlandi.' });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;