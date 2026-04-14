const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const {
  createVideoSchema,
  updateVideoSchema,
  reviewSchema,
  listVideosQuerySchema,
  objectIdParamSchema
} = require('../validators/video.validators');
const { ensureVideoOwnerForUpdate, ensureVideoOwnerOrAdminForDelete } = require('../middleware/videoOwnership');

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video metadata management endpoints
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review endpoints for videos
 */

/**
 * @swagger
 * /videos:
 *   post:
 *     tags: [Videos]
 *     summary: Create a new video (metadata only)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - videoURL
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               videoURL:
 *                 type: string
 *               duration:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 description: Must be less than or equal to 300 seconds
 *                 maximum: 300
 *               status:
 *                 type: string
 *                 enum: [public, private, flagged]
 *     responses:
 *       201:
 *         description: Video created successfully
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
 *       400:
 *         description: Validation error or invalid duration
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, validate(createVideoSchema), videoController.createVideo);

/**
 * @swagger
 * /videos:
 *   get:
 *     tags: [Videos]
 *     summary: List all public videos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Optional page number for feed pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Optional page size for feed pagination
 *     responses:
 *       200:
 *         description: Array of public videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid pagination query parameters
 */
router.get('/', validate(listVideosQuerySchema, 'query'), videoController.getVideos);

/**
 * @swagger
 * /videos/{id}:
 *   patch:
 *     tags: [Videos]
 *     summary: Update video title/description
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated video successfully
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
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the owner can update this video
 *       404:
 *         description: Video not found
 */
router.patch('/:id', protect, validate(objectIdParamSchema, 'params'), ensureVideoOwnerForUpdate, validate(updateVideoSchema), videoController.updateVideo);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     tags: [Videos]
 *     summary: Delete a video (owner or admin)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted successfully
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
 *                     message:
 *                       type: string
 *                       example: Video deleted
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this video
 *       404:
 *         description: Video not found
 */
router.delete('/:id', protect, validate(objectIdParamSchema, 'params'), ensureVideoOwnerOrAdminForDelete, videoController.deleteVideo);

/**
 * @swagger
 * /videos/{id}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Add a review to a video
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *       400:
 *         description: Validation error, invalid ID format, or invalid rating
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 *       409:
 *         description: Duplicate review from the same user for this video
 */
router.post('/:id/reviews', protect, validate(objectIdParamSchema, 'params'), validate(reviewSchema), videoController.addReview);

module.exports = router;