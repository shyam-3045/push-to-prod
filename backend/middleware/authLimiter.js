const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,                  
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many attempts. Try later."
    });
  }
});

module.exports = authLimiter