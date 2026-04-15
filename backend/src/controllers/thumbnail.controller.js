/**
 * @swagger
 * /videos/{id}/thumbnail:
 *   get:
 *     tags: [Media]
 *     summary: Get a presigned URL for a video's thumbnail
 *     description: Returns a time-limited presigned URL for fetching the video thumbnail. Non-public videos are only accessible to their owner or an admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Presigned thumbnail URL
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
 *                     url:
 *                       type: string
 *                       description: Presigned S3 URL (expires in 1 hour)
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       404:
 *         description: Video not found, not public, or thumbnail not yet generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
