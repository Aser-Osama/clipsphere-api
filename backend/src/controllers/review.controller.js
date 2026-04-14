const Review = require('../models/Review');
const { asyncWrapper, AppError } = require('../middleware/errorHandler');

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update your own review
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                     review:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only edit your own reviews
 *       404:
 *         description: Review not found
 */
exports.updateReview = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.user.toString() !== req.user.id) {
    throw new AppError('You can only edit your own reviews', 403);
  }

  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;

  await review.save();

  res.json({
    status: 'success',
    data: { review }
  });
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete your own review
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                       example: Review deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only delete your own reviews
 *       404:
 *         description: Review not found
 */
exports.deleteReview = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.user.toString() !== req.user.id) {
    throw new AppError('You can only delete your own reviews', 403);
  }

  await review.deleteOne();

  res.json({
    status: 'success',
    data: { message: 'Review deleted' }
  });
});
