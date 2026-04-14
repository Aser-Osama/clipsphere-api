const { probeVideo } = require('../utils/videoProbe');
const { AppError } = require('./errorHandler');

const validateVideoDuration = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return next(new AppError('No video file provided', 400));
    }

    const probe = await probeVideo(req.file.buffer);

    if (probe.duration > 300) {
      return next(
        new AppError('Video duration exceeds the 5-minute limit', 400)
      );
    }

    req.videoDuration = probe.duration;
    req.videoMetadata = probe;
    next();
  } catch (err) {
    next(new AppError('Failed to process video file', 400));
  }
};

module.exports = validateVideoDuration;
