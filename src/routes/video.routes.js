const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const protect = require('../middleware/protect');

/**
 * @swagger
 * tags:
 *   - name: Videos
 *     description: Video metadata management endpoints
 *   - name: Reviews
 *     description: Review endpoints for videos
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
 *               title: { type: string }
 *               description: { type: string }
 *               videoURL: { type: string }
 *               duration: { type: number, maximum: 300 }
 *     responses:
 *       201:
 *         description: Video created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
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
 *         description: Array of videos
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get('/', videoController.getVideos);

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
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Updated video
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not video owner
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
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Video deleted
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
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Video not found
 *       409:
 *         description: Duplicate review for this video
 */
router.post('/:id/reviews', protect, videoController.addReview);

module.exports = router;
