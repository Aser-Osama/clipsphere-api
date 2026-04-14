const router = require('express').Router();
const protect = require('../middleware/protect');
const { uploadVideo, handleMulterError } = require('../middleware/upload');
const validateVideoDuration = require('../middleware/validateVideoDuration');
const { uploadVideoHandler } = require('../controllers/upload.controller');

router.post('/upload', protect, uploadVideo, handleMulterError, validateVideoDuration, uploadVideoHandler);

module.exports = router;
