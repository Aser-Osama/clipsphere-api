const authService = require('../services/auth.service');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const { registerSchema, loginSchema } = require('../validators/auth.validators');

exports.register = asyncWrapper(async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues.map(issue => issue.message).join(', '), 400);
  }

  const data = await authService.register(result.data);

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.login = asyncWrapper(async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues.map(issue => issue.message).join(', '), 400);
  }

  const data = await authService.login(result.data);

  res.status(200).json({
    status: 'success',
    data
  });
});