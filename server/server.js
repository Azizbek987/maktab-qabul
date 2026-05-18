const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 

// 🚨 1. ROUTERLARNI YUKLASH (To'lov tizimi qo'shildi)
let applicationRoutes;
try {
  applicationRoutes = require('./routes/applicationRoutes');
} catch (e) {
  applicationRoutes = require('./routes/applicationRouter'); 
}

const authRoutes = require('./routes/authRoutes'); 

let schoolRoutes;
try {
  schoolRoutes = require('./routes/schoolRouter');
} catch (e) {
  schoolRoutes = require('./routes/schoolRoutes');
}

// 💵 Yangi qo'shilgan To'lov tizimi routeri:
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// 🚨 MIDDLEWARE SOZLAMALARI
app.use(cors());

// Frontenddan JSON ma'lumot kelsa o'qish uchun:
app.use(express.json()); 

// Frontend Form-Data yoki URL-encoded yuborgan bo'lsa ham o'qiy oladigan parser:
app.use(express.urlencoded({ extended: true })); 

app.use(morgan('dev')); 

// 🚨 2. API ESHIKLARI (To'lov tizimi eshigi joylandi)
app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/schools', schoolRoutes);
app.use('/api/school', schoolRoutes); 

// 💵 Yangi to'lov tizimi eshigi (/api/payment/create uchun):
app.use('/api/payment', paymentRoutes);

// Bosh sahifa testi
app.get('/', (req, res) => {
  res.send('Maktab Qabul API Tizimi Ishlamoqda... 🚀');
});

// Global xatoliklar ushlagichi
app.use((err, req, res, next) => {
  console.error("Global xatolik aniqlandi:", err.stack);
  res.status(500).json({ message: 'Tizimda ichki server xatosi yuz berdi!' });
});

// Server porti
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server daxshat bo'lib localhost:${PORT} portida ishga tushdi! 🔥`);
});