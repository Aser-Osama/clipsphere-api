const router = require('express').Router();
const protect = require('../middleware/protect');
const { uploadAvatar: uploadAvatarMiddleware, handleMulterError } = require('../middleware/upload');
const { uploadAvatar, getAvatar } = require('../controllers/avatar.controller');

router.post('/avatar', protect, uploadAvatarMiddleware, handleMulterError, uploadAvatar);
router.get('/:id/avatar', getAvatar);

module.exports = router;
