/**
 * @swagger
 * /users/avatar:
 *   post:
 *     tags: [Media]
 *     summary: Upload a profile avatar image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 5 MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatarKey:
 *                           type: string
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /users/{id}/avatar:
 *   get:
 *     tags: [Media]
 *     summary: Get a presigned URL for a user's avatar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Presigned URL for avatar
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
 *         description: User or avatar not found
 */
const User = require('../models/User');
const { uploadObject, deleteObject, getPresignedUrl } = require('../services/storage.service');
const { AVATARS_BUCKET } = require('../config/s3');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const { randomUUID } = require('crypto');

exports.uploadAvatar = asyncWrapper(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `avatars/${req.user._id}/${randomUUID()}-${sanitizedName}`;

  await uploadObject(AVATARS_BUCKET, key, req.file.buffer, req.file.mimetype);

  const oldKey = req.user.avatarKey;

  try {
    req.user.avatarKey = key;
    await req.user.save();
  } catch (dbErr) {
    try {
      await deleteObject(AVATARS_BUCKET, key);
    } catch (cleanupErr) {
      console.error('Failed to clean up avatar after DB error:', cleanupErr.message);
    }
    throw dbErr;
  }

  if (oldKey) {
    try {
      await deleteObject(AVATARS_BUCKET, oldKey);
    } catch (cleanupErr) {
      console.error('Failed to delete old avatar:', cleanupErr.message);
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatarKey: req.user.avatarKey,
      },
    },
  });
});

exports.getAvatar = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.avatarKey) {
    throw new AppError('Avatar not found', 404);
  }

  const url = await getPresignedUrl(AVATARS_BUCKET, user.avatarKey, 3600);

  res.status(200).json({
    status: 'success',
    data: { url, expiresIn: 3600 },
  });
});
