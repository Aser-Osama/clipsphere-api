const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

router.get('/health', protect, restrictTo('admin'), (req, res) => {
  res.json({
    status: 'success',
    data: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      message: 'Admin route working'
    }
  });
});

module.exports = router;