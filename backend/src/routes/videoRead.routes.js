const express = require('express');
const router = express.Router();
const videoReadController = require('../controllers/videoRead.controller');
const validate = require('../middleware/validate');
const optionalAuth = require('../middleware/optionalAuth');
const { videoIdParamSchema } = require('../validators/feed.validators');

router.get('/:id', validate(videoIdParamSchema, 'params'), optionalAuth, videoReadController.getVideoById);
router.get('/:id/reviews', validate(videoIdParamSchema, 'params'), videoReadController.getVideoReviews);

module.exports = router;
