const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // So'rovning bosh qismidan (header) tokenni olamiz
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Ruxsat yo‘q, token topilmadi' });
  }

  try {
    // Tokenni maxfiy kalit bilan tekshiramiz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Foydalanuvchi ma'lumotini saqlab qo'yamiz
    next(); // Hammasi yaxshi bo'lsa, keyingi bosqichga o'tkazamiz
  } catch (err) {
    res.status(401).json({ message: 'Token xato yoki muddati o‘tgan' });
  }
};

module.exports = authMiddleware;