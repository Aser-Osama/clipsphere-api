const Video = require('../models/Video');
const { AppError, asyncWrapper } = require('./errorHandler');

exports.ensureVideoOwnerForUpdate = asyncWrapper(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  if (video.owner.toString() !== req.user.id.toString()) {
    return next(new AppError('You can only update your own videos', 403));
  }

  next();
});

exports.ensureVideoOwnerOrAdminForDelete = asyncWrapper(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  const isOwner = video.owner.toString() === req.user.id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Not authorized to delete this video', 403));
  }

  next();
});
