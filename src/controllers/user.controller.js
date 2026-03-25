const userService = require('../services/user.service');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');

exports.getMe = asyncWrapper(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json({ status: 'success', data: user });
});

exports.updateMe = asyncWrapper(async (req, res) => {
  const updatedUser = await userService.updateMe(req.user.id, req.body);
  res.json({ status: 'success', data: updatedUser });
});

exports.getUserById = asyncWrapper(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ status: 'success', data: user });
});

exports.updatePreferences = asyncWrapper(async (req, res) => {
  const updated = await userService.updatePreferences(req.user.id, req.body);
  if (!updated) {
    throw new AppError('User not found', 404);
  }

  res.json({ status: 'success', data: updated });
});
