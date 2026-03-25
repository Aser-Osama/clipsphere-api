const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const protect = require('../middleware/protect');

const followerController = require('../controllers/follower.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile, followers, and notification preference endpoints
 */

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     tags: [Users]
 *     summary: Follow a user
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID to follow
 *     responses:
 *       201:
 *         description: Followed
 *       400:
 *         description: Invalid ID format or self-follow attempt
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post('/:id/follow', protect, followerController.followUser);

/**
 * @swagger
 * /users/{id}/unfollow:
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found or not following
 */
router.delete('/:id/unfollow', protect, followerController.unfollowUser);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     tags: [Users]
 *     summary: List followers of a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose followers should be listed
 *     responses:
 *       200:
 *         description: Followers list
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/:id/followers', followerController.getFollowers);

/**
 * @swagger
 * /users/{id}/following:
 *   get:
 *     tags: [Users]
 *     summary: List accounts a user follows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose following list should be listed
 *     responses:
 *       200:
 *         description: Following list
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/:id/following', followerController.getFollowing);

/**
 * @swagger
 * /users/preferences:
 *   patch:
 *     tags: [Users]
 *     summary: Update notification preferences
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inApp:
 *                 type: object
 *                 properties:
 *                   followers:
 *                     type: boolean
 *                   comments:
 *                     type: boolean
 *                   likes:
 *                     type: boolean
 *                   tips:
 *                     type: boolean
 *               email:
 *                 type: object
 *                 properties:
 *                   followers:
 *                     type: boolean
 *                   comments:
 *                     type: boolean
 *                   likes:
 *                     type: boolean
 *                   tips:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Updated preferences
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch('/preferences', protect, userController.updatePreferences);


/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user's profile
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/me', protect, userController.getMe);


/**
 * @swagger
 * /users/updateMe:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user's profile
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Optional new username
 *               bio:
 *                 type: string
 *                 maxLength: 200
 *                 description: Optional profile biography
 *               avatarKey:
 *                 type: string
 *                 description: Optional avatar object key
 *     responses:
 *       200:
 *         description: Updated profile
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch('/updateMe', protect, userController.updateMe);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get public profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for public profile lookup
 *     responses:
 *       200:
 *         description: Public profile
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

module.exports = router;
