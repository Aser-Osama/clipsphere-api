/**
 * @swagger
 * /videos/{id}/stream:
 *   get:
 *     tags: [Media]
 *     summary: Get a presigned URL for video playback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Presigned URL for video streaming
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
 *         description: Video not found or not public
 */
const Video = require('../models/Video');
const { getPresignedUrl } = require('../services/storage.service');
const { VIDEOS_BUCKET } = require('../config/s3');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');

exports.getVideoStream = asyncWrapper(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video || video.status !== 'public') {
    throw new AppError('Video not found', 404);
  }

  if (!video.key) {
    throw new AppError('Video file not available', 404);
  }

  const url = await getPresignedUrl(VIDEOS_BUCKET, video.key, 3600);

  res.status(200).json({
    status: 'success',
    data: { url, expiresIn: 3600 },
  });
});
