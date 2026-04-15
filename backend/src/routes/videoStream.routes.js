const router = require('express').Router();
const { getVideoStream } = require('../controllers/stream.controller');
const { getVideoThumbnail } = require('../controllers/thumbnail.controller');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/:id/stream', optionalAuth, getVideoStream);
router.get('/:id/thumbnail', optionalAuth, getVideoThumbnail);

module.exports = router;
