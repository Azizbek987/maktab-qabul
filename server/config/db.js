const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  // Neon-dan olingan uzun URL ni ishlatish uchun:
  connectionString: process.env.DATABASE_URL,
  // Cloud bazaga ulanishda SSL majburiy hisoblanadi:
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool