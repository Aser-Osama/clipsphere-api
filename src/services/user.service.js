const User = require('../models/User');

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

exports.updateMe = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
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
