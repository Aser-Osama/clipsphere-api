const express = require('express');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const adminController = require('../controllers/adminController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /admin/health:
 *   get:
 *     tags: [Admin]
 *     summary: Admin health and runtime diagnostics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Health details for process and database connection
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
 *                     uptime:
 *                       type: number
 *                       example: 123.45
 *                     memoryUsage:
 *                       type: object
 *                       properties:
 *                         rss:
 *                           type: number
 *                         heapTotal:
 *                           type: number
 *                         heapUsed:
 *                           type: number
 *                         external:
 *                           type: number
 *                         arrayBuffers:
 *                           type: number
 *                     dbStatus:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                       example: connected
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/health', protect, restrictTo('admin'), adminController.getHealth);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Aggregated admin metrics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated platform statistics
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
 *                     totalUsers:
 *                       type: number
 *                       example: 42
 *                     totalVideos:
 *                       type: number
 *                       example: 120
 *                     totalTips:
 *                       type: number
 *                       example: 0
 *                     mostActiveUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           owner:
 *                             type: string
 *                             example: 65ab12cd34ef56ab78cd90ef
 *                           videoCount:
 *                             type: number
 *                             example: 7
 *                           username:
 *                             type: string
 *                             example: creator01
 *                           avatarKey:
 *                             type: string
 *                             example: avatars/creator01.png
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', protect, restrictTo('admin'), adminController.getStats);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a user's account status and active flag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended, banned]
 *                 example: suspended
 *     responses:
 *       200:
 *         description: User status updated
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
 *                     _id:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     accountStatus:
 *                       type: string
 *       400:
 *         description: Invalid status value or invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/users/:id/status', protect, restrictTo('admin'), adminController.setUserStatus);

/**
 * @swagger
 * /admin/moderation:
 *   get:
 *     tags: [Admin]
 *     summary: Get moderation queue for flagged and low-rated videos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Moderation queue retrieved
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
 *                     flagged:
 *                       type: array
 *                       items:
 *                         type: object
 *                     lowRated:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/moderation', protect, restrictTo('admin'), adminController.getModerationQueue);

module.exports = router;
