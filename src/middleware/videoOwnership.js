const Video = require('../models/Video');
const { AppError } = require('./errorHandler');

exports.ensureVideoOwnerForUpdate = async (user, videoId) => {
  const video = await Video.findById(videoId);
  if (!video) {
    throw new AppError('Video not found', 404);
  }

  if (video.owner.toString() !== user.id.toString()) {
    throw new AppError('You can only update your own videos', 403);
  }
};

exports.ensureVideoOwnerOrAdminForDelete = async (user, videoId) => {
  const video = await Video.findById(videoId);
  if (!video) {
    throw new AppError('Video not found', 404);
  }

  const isOwner = video.owner.toString() === user.id.toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized to delete this video', 403);
  }
};
