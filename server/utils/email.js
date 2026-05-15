const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'your_app_password'
  }
})

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: 'Maktab Qabul Tizimi',
    to,
    subject,
    text
  })
}

module.exports = sendEmail