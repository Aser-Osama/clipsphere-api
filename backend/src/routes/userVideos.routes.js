const express = require('express');
const router = express.Router();
const { getUserVideos } = require('../controllers/userVideos.controller');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { objectIdParamSchema } = require('../validators/user.validators');

router.get('/:id/videos', validate(objectIdParamSchema, 'params'), optionalAuth, getUserVideos);

module.exports = router;
