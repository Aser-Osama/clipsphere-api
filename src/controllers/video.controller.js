const videoService = require('../services/video.service');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const {
  createVideoSchema,
  updateVideoSchema,
  reviewSchema,
  objectIdParamSchema
} = require('../validators/video.validators');
const {
  ensureVideoOwnerForUpdate,
  ensureVideoOwnerOrAdminForDelete
} = require('../middleware/videoOwnership');

const formatValidationIssues = (issues) => {
  return issues
    .map((issue) => {
      const path = issue.path && issue.path.length ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    })
    .join(', ');
};

const validateObjectIdParam = (params) => {
  const parsed = objectIdParamSchema.safeParse(params);
  if (!parsed.success) {
    throw new AppError(formatValidationIssues(parsed.error.issues), 400);
  }
  return parsed.data.id;
};

exports.createVideo = asyncWrapper(async (req, res) => {
  const result = createVideoSchema.safeParse(req.body);
  if (!result.success) throw new AppError(formatValidationIssues(result.error.issues), 400);
  const video = await videoService.createVideo(req.user.id, result.data);
  res.status(201).json({ status: 'success', data: video });
});

exports.getVideos = asyncWrapper(async (req, res) => {
  const videos = await videoService.getVideos();
  res.json({ status: 'success', data: videos });
});

exports.updateVideo = asyncWrapper(async (req, res) => {
  const videoId = validateObjectIdParam(req.params);
  const result = updateVideoSchema.safeParse(req.body);
  if (!result.success) throw new AppError(formatValidationIssues(result.error.issues), 400);
  await ensureVideoOwnerForUpdate(req.user, videoId);
  const video = await videoService.updateVideo(videoId, result.data);
  res.json({ status: 'success', data: video });
});

exports.deleteVideo = asyncWrapper(async (req, res) => {
  const videoId = validateObjectIdParam(req.params);
  await ensureVideoOwnerOrAdminForDelete(req.user, videoId);
  await videoService.deleteVideo(videoId);
  res.json({ status: 'success', data: { message: 'Video deleted' } });
});

exports.addReview = asyncWrapper(async (req, res) => {
  const videoId = validateObjectIdParam(req.params);
  const result = reviewSchema.safeParse(req.body);
  if (!result.success) throw new AppError(formatValidationIssues(result.error.issues), 400);
  const review = await videoService.addReview(req.user.id, videoId, result.data);
  res.status(201).json({ status: 'success', data: review });
});
