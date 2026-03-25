const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

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
 *     security:
 *       - bearerAuth: []
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
 *                 description: Must be less than 300 seconds
 *                 maximum: 299
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
router.post('/', protect, videoController.createVideo);

/**
 * @swagger
 * /videos:
 *   get:
 *     tags: [Videos]
 *     summary: List all public videos
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
 */
router.get('/', videoController.getVideos);

/**
 * @swagger
 * /videos/{id}:
 *   patch:
 *     tags: [Videos]
 *     summary: Update video title or description
 *     security:
 *       - bearerAuth: []
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
router.patch('/:id', protect, videoController.updateVideo);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     tags: [Videos]
 *     summary: Delete a video (owner or admin)
 *     security:
 *       - bearerAuth: []
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
router.delete('/:id', protect, videoController.deleteVideo);

/**
 * @swagger
 * /videos/{id}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Add a review to a video
 *     security:
 *       - bearerAuth: []
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
 *                 type: integer
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
 *         description: Duplicate review for this video
 */
router.post('/:id/reviews', protect, videoController.addReview);

module.exports = router;