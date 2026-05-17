const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const logger = require('./utils/logger'); 

// 🚨 1. Fayl nomlarini har qanday variantga moslab tekshirib yuklaymiz:
let applicationRoutes;
try {
  applicationRoutes = require('./routes/applicationRoutes');
} catch (e) {
  // Agar fayl nomi oxirida 's' siz bo'lsa (applicationRouter) shuni o'qiydi:
  applicationRoutes = require('./routes/applicationRouter'); 
}

const authRoutes = require('./routes/authRoutes'); 

let schoolRoutes;
try {
  schoolRoutes = require('./routes/schoolRouter');
} catch (e) {
  schoolRoutes = require('./routes/schoolRoutes');
}

const app = express();

// Middleware sozlamalari
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

// 🚨 2. MANA BU JOYI JUDA MUHIM! FRONTEND /api/application/... DEB SO'RAYAPTI
// Har qanday holatda ham 404 bermasligi uchun barcha yo'llarni yozamiz:
app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationRoutes); // Zaxira variant

app.use('/api/auth', authRoutes); 
app.use('/api/schools', schoolRoutes);
app.use('/api/school', schoolRoutes); 

// Bosh sahifa testi
app.get('/', (req, res) => {
  res.send('Maktab Qabul API Tizimi Ishlamoqda... 🚀');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global xatolik aniqlandi:", err.stack);
  res.status(500).json({ message: 'Tizimda ichki server xatosi yuz berdi!' });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server daxshat bo'lib localhost:${PORT} portida ishga tushdi! 🔥`);
});