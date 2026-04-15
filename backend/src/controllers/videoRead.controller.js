const Video = require('../models/Video');
const Like = require('../models/Like');
const Review = require('../models/Review');
const { asyncWrapper, AppError } = require('../middleware/errorHandler');

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     tags: [Videos]
 *     summary: Get a single video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video details with like count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     video:
 *                       type: object
 *                     likeCount:
 *                       type: integer
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Video not found
 */
exports.getVideoById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id).populate('owner', 'username avatarKey');

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  if (video.status !== 'public') {
    const isOwner = req.user && video.owner._id.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new AppError('Video not found', 404);
    }
  }

  await Video.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });
  video.viewsCount += 1;

  const [likeCount, likeDoc] = await Promise.all([
    Like.countDocuments({ video: id }),
    req.user ? Like.exists({ video: id, user: req.user.id }) : Promise.resolve(null),
  ]);

  const hasLiked = Boolean(likeDoc);

  res.json({
    status: 'success',
    data: { video, likeCount, hasLiked }
  });
});

/**
 * @swagger
 * /videos/{id}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get paginated reviews for a video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Results per page (default 10, max 50)
 *     responses:
 *       200:
 *         description: Paginated list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid ID format
 */
exports.getVideoReviews = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ video: id })
      .populate('user', 'username avatarKey')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ video: id })
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    status: 'success',
    results: reviews.length,
    data: { reviews, page, totalPages }
  });
});
