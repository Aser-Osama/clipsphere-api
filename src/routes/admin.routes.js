const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const mongoose = require('mongoose');

router.get('/health', protect, restrictTo('admin'), (req, res) => {
  res.json({
    status: 'success',
    data: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      dbStatus: mongoose.connection.readyState
    }
  });
});

module.exports = router;
