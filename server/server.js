const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 

// ROUTERLARNI YUKLASH
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

const paymentRoutes = require('./routes/paymentRoutes');

// 🤖 YANGI: AI Assistant routeri qo'shildi
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// MIDDLEWARE SOZLAMALARI
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev')); 

// API ESHIKLARI
app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/schools', schoolRoutes);
app.use('/api/school', schoolRoutes); 
app.use('/api/payment', paymentRoutes);

// 🤖 YANGI: AI eshigi ulash:
app.use('/api/ai', aiRoutes);

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