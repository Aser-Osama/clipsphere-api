const Video = require('../models/Video');
const { getPresignedUrl } = require('../services/storage.service');
const { VIDEOS_BUCKET } = require('../config/s3');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');

exports.getVideoThumbnail = asyncWrapper(async (req, res) => {
  const video = await Video.findById(req.params.id).select('thumbnailKey status owner');

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  if (video.status !== 'public') {
    const isOwner = req.user && video.owner.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new AppError('Video not found', 404);
    }
  }

  if (!video.thumbnailKey) {
    throw new AppError('Thumbnail not available', 404);
  }

  const url = await getPresignedUrl(VIDEOS_BUCKET, video.thumbnailKey, 3600);

  res.status(200).json({
    status: 'success',
    data: { url, expiresIn: 3600 },
  });
});
