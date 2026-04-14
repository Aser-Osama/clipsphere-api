const router = require('express').Router();
const { getVideoStream } = require('../controllers/stream.controller');

router.get('/:id/stream', getVideoStream);

module.exports = router;
