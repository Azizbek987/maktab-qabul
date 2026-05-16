const http = require('http');
const { Server } = require('socket.io');
const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet') // 🛡 Xavfsiz headerlar uchun
const rateLimit = require('express-rate-limit') // 🛑 DDoS dan himoya uchun
require('dotenv').config()

// 1. Ma'lumotlar bazasi ulanishi
const pool = require('./config/db')

// 2. Routelarni import qilish
const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const schoolRoutes = require('./routes/schoolRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()
const PORT = process.env.PORT || 10000;

// 🛑 3. Rate Limiter (15 daqiqada bitta IP dan ko'pi bilan 100 ta so'rovga ruxsat)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: "Xavfsizlik tizimi: Judayam ko'p so'rov yubordingiz. Birozdan keyin qayta urinib ko'ring!" }
})

// 🛡 4. Xavfsizlik Middleware'larini amalda qo'llash
app.use(helmet()) // Xakerlik hujumlaridan headerlarni berkitadi
app.use(limiter)  // DDoS hujumlarini srazi to'xtatadi
app.use(cors({ origin: '*' })) // CORS himoyasi
app.use(express.json({ limit: '10mb' })) // 💾 Katta fayllar orqali serverni qulatishdan himoya

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 5. API Yo'nalishlari (Routes)
app.use('/api/auth', authRoutes)
app.use('/api/application', applicationRoutes)
app.use('/api/schools', schoolRoutes)
app.use('/api/chat', chatRoutes)

// 6. Asosiy test yo'llari
app.get('/', (req, res) => {
  res.send('Backend xavfsiz holatda muvaffaqiyatli ishladi! 🛡')
})

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

// 🛠 Server va Socket.IO sozlamalari
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('🟢 Realtime: yangi foydalanuvchi ulandi!');
  socket.on('disconnect', () => {
    console.log('🔴 Realtime: foydalanuvchi uzildi.');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});