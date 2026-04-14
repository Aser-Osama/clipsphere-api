const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { reviewIdParamSchema, updateReviewSchema } = require('../validators/reviewManage.validators');

router.patch('/:id', protect, validate(reviewIdParamSchema, 'params'), validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', protect, validate(reviewIdParamSchema, 'params'), reviewController.deleteReview);

module.exports = router;
