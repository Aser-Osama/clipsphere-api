const express = require('express');
const router = express.Router();
const { optionalAuth, getUserVideos } = require('../controllers/userVideos.controller');
const validate = require('../middleware/validate');
const { videoIdParamSchema } = require('../validators/feed.validators');

router.get('/:id/videos', validate(videoIdParamSchema, 'params'), optionalAuth, getUserVideos);

module.exports = router;
