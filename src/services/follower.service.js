const Follower = require('../models/Follower');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.followUser = async (followerId, followingId) => {
  try {
    const followDoc = await Follower.create({ followerId, followingId });

    // Preference check stub
    const followedUser = await User.findById(followingId);
    if (followedUser) {
      const prefs = followedUser.notificationPreferences;
      if (prefs?.inApp?.followers) {
        console.log(`Stub: Create in-app notification for ${followingId}`);
      }
      if (prefs?.email?.followers) {
        console.log(`Stub: Queue email notification for ${followingId}`);
      }
    }

    return followDoc;
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Already following this user', 409);
    }
    if (err.message.includes('Cannot follow yourself')) {
      throw new AppError('Cannot follow yourself', 400);
    }
    throw err;
  }
};


exports.unfollowUser = async (followerId, followingId) => {
  const result = await Follower.findOneAndDelete({ followerId, followingId });
  if (!result) throw new AppError('Not following this user', 404);
};

exports.getFollowers = async (userId) => {
  return Follower.find({ followingId: userId })
    .populate('followerId', 'username avatarKey');
};

exports.getFollowing = async (userId) => {
  return Follower.find({ followerId: userId })
    .populate('followingId', 'username avatarKey');
};

exports.updatePreferences = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Merge updates into existing preferences
  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...updates,
    inApp: { ...user.notificationPreferences.inApp, ...updates.inApp },
    email: { ...user.notificationPreferences.email, ...updates.email }
  };

  await user.save();
  return user.notificationPreferences;
};
