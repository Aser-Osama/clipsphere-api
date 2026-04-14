const express = require('express');
const router = express.Router();
const { getUserVideos } = require('../controllers/userVideos.controller');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { videoIdParamSchema } = require('../validators/feed.validators');

router.get('/:id/videos', validate(videoIdParamSchema, 'params'), optionalAuth, getUserVideos);

module.exports = router;
