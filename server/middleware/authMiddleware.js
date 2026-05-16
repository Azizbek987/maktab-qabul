const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Standart bo'yicha headerni tekshirish
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token topilmadi. Tizimga qayta kiring!'
    })
  }

  try {
    // "Bearer TOKEN_STR" ko'rinishidan faqat TOKEN_STR qismini ajratib olish
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Token formati noto‘g‘ri' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Foydalanuvchi ma'lumotlarini req.user ga biriktirish
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Yaroqsiz token yoki token muddati tugagan!'
    })
  }
}

module.exports = authMiddleware