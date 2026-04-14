const router = require('express').Router();
const { getVideoStream } = require('../controllers/stream.controller');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/:id/stream', optionalAuth, getVideoStream);

module.exports = router;
