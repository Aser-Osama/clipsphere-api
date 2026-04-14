const Video = require('../models/Video');
const Review = require('../models/Review');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notification.service');

exports.createVideo = async (userId, data) => {
  return Video.create({ ...data, owner: userId });
};

exports.getVideos = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return Video.find({ status: 'public' })
    .populate('owner', 'username avatarKey')
    .skip(skip)
    .limit(limit);
};

exports.updateVideo = async (videoId, updates) => {
  const video = await Video.findById(videoId);
  if (!video) throw new AppError('Video not found', 404);

  Object.assign(video, updates);
  await video.save();
  return video;
};

exports.deleteVideo = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw new AppError('Video not found', 404);

  await video.deleteOne();
};

exports.addReview = async (userId, videoId, data) => {
  const video = await Video.findById(videoId);
  if (!video) throw new AppError('Video not found', 404);

  const review = await Review.create({ ...data, user: userId, video: videoId });
  const videoOwner = await User.findById(video.owner);

  await notificationService.handlePreferenceAwareNotification({
    recipientUser: videoOwner,
    actorId: userId,
    type: 'comment',
    preferenceKey: 'comments',
    videoId: video._id
  });

  return review;
};
