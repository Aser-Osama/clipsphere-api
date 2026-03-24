const userService = require('../services/user.service');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const {
  updateMeSchema,
  preferencesSchema,
  objectIdParamSchema
} = require('../validators/user.validators');

const validateObjectIdParam = (params) => {
  const parsed = objectIdParamSchema.safeParse(params);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues.map((i) => i.message).join(', '), 400);
  }
  return parsed.data.id;
};

exports.getMe = asyncWrapper(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json({ status: 'success', data: user });
});

exports.updateMe = asyncWrapper(async (req, res) => {
  const result = updateMeSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues.map(i => i.message).join(', '), 400);
  }
  const updatedUser = await userService.updateMe(req.user.id, result.data);
  res.json({ status: 'success', data: updatedUser });
});

exports.getUserById = asyncWrapper(async (req, res) => {
  const userId = validateObjectIdParam(req.params);
  const user = await userService.getUserById(userId);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', data: user });
});

exports.updatePreferences = asyncWrapper(async (req, res) => {
  const result = preferencesSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues.map((i) => i.message).join(', '), 400);
  }

  const updated = await userService.updatePreferences(req.user.id, result.data);
  if (!updated) {
    throw new AppError('User not found', 404);
  }

  res.json({ status: 'success', data: updated });
});
