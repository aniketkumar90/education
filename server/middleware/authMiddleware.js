const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token = req.cookies ? req.cookies.jwt : undefined;

  // Fallback: Authorization header Bearer token (important for API callers / mobile / cross-site fallback)
  if (!token && req.headers.authorization && /^Bearer\s+/i.test(req.headers.authorization)) {
    token = req.headers.authorization.replace(/^Bearer\s+/i, '').trim();
  }

  if (!token || token === 'null' || token === 'undefined') {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token invalid or expired'));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as admin'));
  }
};

module.exports = { protect, adminOnly };
