const adminService = require('../services/adminService');
const { asyncWrapper } = require('../middleware/errorHandler');

exports.getHealth = asyncWrapper(async (req, res) => {
  const health = adminService.getHealth();

  res.status(200).json({
    status: 'success',
    data: health
  });
});

exports.getStats = asyncWrapper(async (req, res) => {
  const stats = await adminService.getStats();

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.setUserStatus = asyncWrapper(async (req, res) => {
  const updatedUser = await adminService.setUserStatus(req.params.id, req.body.status);

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.getModerationQueue = asyncWrapper(async (req, res) => {
  const queue = await adminService.getModerationQueue();

  res.status(200).json({
    status: 'success',
    data: queue
  });
});
