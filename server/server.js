const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const logger = require('./utils/logger'); 

// 🚨 Fayl nomlarini siz aytgandek aniq yozib yuklaymiz:
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes'); 
const schoolRoutes = require('./routes/schoolRouter'); // Oxirida 'Router' turibdi, 'Routes' emas!

const app = express();

// Middleware sozlamalari
app.use(cors());
app.use(express.json());

// Request Logger (Terminalda so'rovlarni ko'rish uchun)
app.use(morgan('dev')); 

// 🚨 ESHIKLARNI OCHAMIZ:
app.use('/api/application', applicationRoutes);
app.use('/api/auth', authRoutes); 

// Frontend /api/schools/all va /api/school/all deb so'rayapti, ikkalasini ham schoolRoutes'ga yo'naltiramiz:
app.use('/api/schools', schoolRoutes);
app.use('/api/school', schoolRoutes); 

// Bosh sahifa testi
app.get('/', (req, res) => {
  res.send('Maktab Qabul API Tizimi Ishlamoqda... 🚀');
});

// 🛠️ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global xatolik aniqlandi:", err.stack);
  if (logger && logger.error) {
    logger.error(`Global Server Xatosi: ${err.message} - Stack: ${err.stack}`);
  }
  res.status(500).json({
    message: 'Tizimda ichki server xatosi yuz berdi!'
  });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server daxshat bo'lib localhost:${PORT} portida ishga tushdi! 🔥`);
});