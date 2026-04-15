/**
 * @swagger
 * /videos/upload:
 *   post:
 *     tags: [Media]
 *     summary: Upload a video file with metadata
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *               - title
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (max 100 MB)
 *               title:
 *                 type: string
 *                 description: Video title
 *               description:
 *                 type: string
 *                 description: Video description
 *               status:
 *                 type: string
 *                 enum: [public, private]
 *                 default: public
 *     responses:
 *       201:
 *         description: Video uploaded successfully
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
 *       400:
 *         description: Validation error, file too large, or invalid video duration
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Storage upload failed
 */
const { randomUUID } = require('crypto');
const Video = require('../models/Video');
const { uploadObject, deleteObject } = require('../services/storage.service');
const { VIDEOS_BUCKET } = require('../config/s3');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const { uploadVideoSchema } = require('../validators/upload.validators');
const { generateThumbnail } = require('../utils/thumbnailGenerator');

const uploadVideoHandler = asyncWrapper(async (req, res) => {
  const parsed = uploadVideoSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    throw new AppError(message, 400);
  }

  const { title, description, status } = parsed.data;

  const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `videos/${req.user._id}/${randomUUID()}-${safeName}`;

  try {
    await uploadObject(VIDEOS_BUCKET, key, req.file.buffer, req.file.mimetype);
  } catch (err) {
    throw new AppError('Failed to upload video to storage', 500);
  }

  let thumbnailKey;
  try {
    const thumbBuffer = await generateThumbnail(req.file.buffer);
    thumbnailKey = key.replace(/\.[^.]+$/, '-thumb.jpg');
    await uploadObject(VIDEOS_BUCKET, thumbnailKey, thumbBuffer, 'image/jpeg');
  } catch (err) {
    console.warn('Thumbnail generation failed, continuing without:', err.message);
    thumbnailKey = undefined;
  }

  let video;
  try {
    video = await Video.create({
      title,
      description,
      status: status || 'public',
      owner: req.user._id,
      key,
      thumbnailKey,
      videoURL: key,
      duration: req.videoDuration,
    });
  } catch (dbErr) {
    try {
      await deleteObject(VIDEOS_BUCKET, key);
    } catch (cleanupErr) {
      console.error('S3 cleanup failed after DB error:', cleanupErr);
    }
    throw dbErr;
  }

  res.status(201).json({ status: 'success', data: { video } });
});

module.exports = { uploadVideoHandler };
