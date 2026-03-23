const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  let token;

  // check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    if (!user.active) {
      return next(new AppError('Account is deactivated', 401));
    }

    // attach user to request
    req.user = user;

    return next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

module.exports = protect;