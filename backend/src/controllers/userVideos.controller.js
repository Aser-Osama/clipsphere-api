const jwt = require('jsonwebtoken');
const Video = require('../models/Video');
const User = require('../models/User');
const { asyncWrapper } = require('../middleware/errorHandler');

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch {}
  next();
};

/**
 * @swagger
 * /users/{id}/videos:
 *   get:
 *     tags: [Videos]
 *     summary: Get videos for a specific user
 *     description: Returns public videos for the user. If the authenticated user is the owner, all videos (including private) are returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: Results per page (default 12, max 50)
 *     responses:
 *       200:
 *         description: Paginated list of user videos
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
 *                     videos:
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
const getUserVideos = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const filter = { owner: id };

  // Only the owner sees all statuses; everyone else sees only public
  if (!req.user || req.user.id !== id) {
    filter.status = 'public';
  }

  const [videos, total] = await Promise.all([
    Video.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Video.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    status: 'success',
    results: videos.length,
    data: { videos, page, totalPages }
  });
});

module.exports = { optionalAuth, getUserVideos };
