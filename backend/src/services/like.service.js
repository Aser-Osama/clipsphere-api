const Like = require('../models/Like');
const Video = require('../models/Video');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notification.service');

exports.likeVideo = async (userId, videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw new AppError('Video not found', 404);

  try {
    await Like.create({ user: userId, video: videoId });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('You have already liked this video', 409);
    }
    throw err;
  }

  const likeCount = await Like.countDocuments({ video: videoId });

  // Send notification to video owner
  const videoOwner = await User.findById(video.owner);
  await notificationService.handlePreferenceAwareNotification({
    recipientUser: videoOwner,
    actorId: userId,
    type: 'like',
    preferenceKey: 'likes',
    videoId: video._id
  });

  return { likeCount };
};

exports.unlikeVideo = async (userId, videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw new AppError('Video not found', 404);

  const result = await Like.findOneAndDelete({ user: userId, video: videoId });
  if (!result) throw new AppError('Like not found', 404);

  const likeCount = await Like.countDocuments({ video: videoId });
  return { likeCount };
};
