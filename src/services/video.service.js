const Video = require('../models/Video');
const Review = require('../models/Review');
const { AppError } = require('../middleware/errorHandler');

exports.createVideo = async (userId, data) => {
  return Video.create({ ...data, owner: userId });
};

exports.getVideos = async () => {
  return Video.find({ status: 'public' }).populate('owner', 'username avatarKey');
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

  return Review.create({ ...data, user: userId, video: videoId });
};
