const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Morgan yuklandi
const logger = require('./utils/logger'); // Logger yuklandi
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes'); // Auth routeri
const schoolRoutes = require('./routes/schoolRoutes'); // 🚨 YANGI: Maktab routerini yuklaymiz!

const app = express();

// Middleware sozlamalari
app.use(cors());
app.use(express.json());

// Request Logger
app.use(morgan('dev')); 

// Routerlarni ulash
app.use('/api/application', applicationRoutes);
app.use('/api/auth', authRoutes); 

// 🚨 YANGI: Frontend /api/schools/all va /api/school/all deb so'raganda ushlab qolish uchun eshiklar:
app.use('/api/schools', schoolRoutes);
app.use('/api/school', schoolRoutes); 

// Bosh sahifa testi
app.get('/', (req, res) => {
  res.send('Maktab Qabul API Tizimi Ishlamoqda... 🚀');
});

// 🛠️ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global xatolik aniqlandi:", err.stack);
  
  // Xatoni error.log fayliga yozamiz
  logger.error(`Global Server Xatosi: ${err.message} - Stack: ${err.stack}`);
  
  res.status(500).json({
    message: 'Tizimda ichki server xatosi yuz berdi!'
  });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server daxshat bo'lib localhost:${PORT} portida ishga tushdi! 🔥`);
});