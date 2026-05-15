const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// 1. Ma'lumotlar bazasi ulanishi
const pool = require('./config/db')

// 2. Routelarni import qilish
const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const schoolRoutes = require('./routes/schoolRoutes')

const app = express()

// 3. Middleware'lar
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 4. API Yo'nalishlari (Routes)
app.use('/api/auth', authRoutes)
app.use('/api/application', applicationRoutes)
app.use('/api/schools', schoolRoutes)

// 5. Asosiy test yo'li
app.get('/', (req, res) => {
  res.send('Backend muvaffaqiyatli ishladi!')
})

// 6. Ma'lumotlar bazasini tekshirish yo'li
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({
      message: "Bazaga ulanish muvaffaqiyatli!",
      time: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({
      error: "Bazaga ulanishda xatolik!",
      details: error.message,
    })
  }
})

// 7. Serverni ishga tushirish
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishga tushdi`)
  console.log(`🔗 http://localhost:${PORT}`)
})