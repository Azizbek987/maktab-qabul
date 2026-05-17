const TelegramBot = require('node-telegram-bot-api');

// Botni ulash
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

const sendTelegramMessage = async (message) => {
  try {
    // Sizning Telegram ID'ngizga xabar yuborish
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.log("Telegramga xabar ketmadi:", err.message);
  }
};

module.exports = sendTelegramMessage;