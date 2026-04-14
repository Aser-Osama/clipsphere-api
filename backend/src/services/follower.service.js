const Follower = require('../models/Follower');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notification.service');

exports.followUser = async (followerId, followingId) => {
  const followedUser = await User.findById(followingId);
  if (!followedUser) {
    throw new AppError('User not found', 404);
  }

  try {
    const followDoc = await Follower.create({ followerId, followingId });
    const notifications = await notificationService.handlePreferenceAwareNotification({
      recipientUser: followedUser,
      actorId: followerId,
      type: 'follower',
      preferenceKey: 'followers'
    });

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
