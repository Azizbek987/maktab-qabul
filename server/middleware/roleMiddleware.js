const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // req.user ichida kim so'rov yuborayotgani (authMiddleware orqali) keladi
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Tizimga kirish taqiqlangan: Sizda yetarli huquqlar yo‘q!'
      })
    }
    next()
  }
}

module.exports = roleMiddleware