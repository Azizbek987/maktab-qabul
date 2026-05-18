const express = require('express');
const router = express.Router();

// 🤖 AI Chat eshigi (POST /api/ai/chat)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Xabar bo'sh bo'lishi mumkin emas!" });
    }

    let reply = '';
    const lower = message.toLowerCase();

    // 🧠 Mahalliy AI mantiqiy qoidalari (Smart Rule-based System)
    if (lower.includes('salom') || lower.includes('assalom')) {
      reply = 'Assalomu alaykum! Maktab qabul elektron yordamchisiman. Sizga qanday yordam bera olaman? 😊';
    } 
    else if (lower.includes('ariza') || lower.includes('hujjat') || lower.includes('topshirish')) {
      reply = "Ariza topshirish juda oson! Yuqoridagi menyudan 'Apply' tugmasini bosing va bola hamda ota-ona ma'lumotlarini kiriting. Keyin Telegram botingizga bildirishnoma boradi.";
    } 
    else if (lower.includes('login') || lower.includes('kira') || lower.includes('parol')) {
      reply = "Tizimga kirish uchun 'Login' sahifasiga o'ting, ro'yxatdan o'tgan telefon raqamingiz va parolingizni kiriting. Agar profilingiz bo'lmasa, 'Register' bo'limidan ro'yxatdan o'ting.";
    } 
    else if (lower.includes('to\'lov') || lower.includes('tolov') || lower.includes('pul') || lower.includes('click') || lower.includes('payme')) {
      reply = "To'lov qilish uchun menyudagi yashil 'To'lov' tugmasini bosing. Arizangiz faollashishi uchun 50 000 so'm to'lov to'lanishi kerak.";
    }
    else if (lower.includes('qr') || lower.includes('kod') || lower.includes('tekshirish')) {
      reply = "Har bir muvaffaqiyatli arizangiz uchun unikal QR-kod generatsiya qilinadi. Uni 'QR Code' sahifasidan ko'rishingiz va adminlarga ko'rsatishingiz mumkin.";
    }
    else {
      reply = 'Savolingizni qabul qildim! Tizim bo\'yicha qo\'shimcha savollaringiz bo\'lsa, bemalol so\'rang 😊';
    }

    return res.json({ success: true, reply });

  } catch (err) {
    console.error("💥 AI Chatda xato:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;