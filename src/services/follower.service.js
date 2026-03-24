const Follower = require('../models/Follower');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.followUser = async (followerId, followingId) => {
  const followedUser = await User.findById(followingId);
  if (!followedUser) {
    throw new AppError('User not found', 404);
  }

  try {
    const followDoc = await Follower.create({ followerId, followingId });
    const notifications = [];

    const prefs = followedUser.notificationPreferences;
    if (prefs?.inApp?.followers) {
      notifications.push({
        type: 'inApp',
        user: followingId,
        message: 'Stub: In-app follower notification'
      });
    }

    if (prefs?.email?.followers) {
      notifications.push({
        type: 'email',
        user: followingId,
        message: 'Stub: Email follower notification queued'
      });
    }

    if (notifications.length > 0) {
      console.log('Follow notification stubs', {
        followerId,
        followingId,
        notifications
      });
    }

    return { followDoc, notifications };
  } catch (err) {
    if (err.message && err.message.includes('Cannot follow yourself')) {
      throw new AppError('Cannot follow yourself', 400);
    }
    throw err;
  }
};

exports.unfollowUser = async (followerId, followingId) => {
  const targetUserExists = await User.exists({ _id: followingId });
  if (!targetUserExists) {
    throw new AppError('User not found', 404);
  }

  const result = await Follower.findOneAndDelete({ followerId, followingId });
  if (!result) throw new AppError('Not following this user', 404);
};

exports.getFollowers = async (userId) => {
  const targetUserExists = await User.exists({ _id: userId });
  if (!targetUserExists) {
    throw new AppError('User not found', 404);
  }

  return Follower.find({ followingId: userId })
    .populate('followerId', 'username avatarKey');
};

exports.getFollowing = async (userId) => {
  const targetUserExists = await User.exists({ _id: userId });
  if (!targetUserExists) {
    throw new AppError('User not found', 404);
  }

  return Follower.find({ followerId: userId })
    .populate('followingId', 'username avatarKey');
};
