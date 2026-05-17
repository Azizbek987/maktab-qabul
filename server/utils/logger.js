const winston = require('winston');

// Xatoliklarni qayd qiluvchi asosiy logger configuratsiyasi
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    // Xatoliklarni 'error.log' degan faylga avtomatik yozib boradi
    new winston.transports.File({ filename: 'error.log' })
  ]
});

module.exports = logger;