const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const filterAllowedUpdates = (updates) => {
  const allowedFields = ['username', 'bio', 'avatarKey'];

  return Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

exports.updateMe = async (userId, updates) => {
  const safeUpdates = filterAllowedUpdates(updates);
  if (Object.keys(safeUpdates).length === 0) {
    throw new AppError('No valid profile fields provided', 400);
  }

  const user = await User.findByIdAndUpdate(userId, safeUpdates, {
    new: true,
    runValidators: true
  }).select('-password');

  return user;
};


exports.getUserById = async (id) => {
  return User.findById(id).select('username bio avatarKey role');
};

exports.updatePreferences = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...updates,
    inApp: { ...user.notificationPreferences.inApp, ...updates.inApp },
    email: { ...user.notificationPreferences.email, ...updates.email }
  };

  await user.save();
  return user.notificationPreferences;
};
