const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

exports.updateMe = async (userId, updates) => {
  // Prevent restricted fields
  if (updates.email || updates.password || updates.role) {
    throw new AppError('Cannot update email, password, or role', 400);
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  return user;
};

exports.getUserById = async (id) => {
  return User.findById(id).select('username bio avatarKey role');
};
