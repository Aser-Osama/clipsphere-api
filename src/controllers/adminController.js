const adminService = require('../services/adminService');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const { objectIdParamSchema, setUserStatusSchema } = require('../validators/admin.validators');

const formatValidationIssues = (issues) =>
  issues.map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message)).join(', ');

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
  const paramResult = objectIdParamSchema.safeParse(req.params);
  if (!paramResult.success) throw new AppError(formatValidationIssues(paramResult.error.issues), 400);

  const bodyResult = setUserStatusSchema.safeParse(req.body);
  if (!bodyResult.success) throw new AppError(formatValidationIssues(bodyResult.error.issues), 400);

  const { id } = paramResult.data;
  const { status } = bodyResult.data;

  const updatedUser = await adminService.setUserStatus(id, status);

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
