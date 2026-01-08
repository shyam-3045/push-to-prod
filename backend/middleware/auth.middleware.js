const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");



exports.requireAuth = (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(" ")[1];
   

    if (!token) {
      return next(new AppError("No token provided, authorization denied", 401));
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };
    

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }
    return next(new AppError("Unauthorized", 401));
  }
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};
