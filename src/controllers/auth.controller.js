const authService = require('../services/auth.service');
const { asyncWrapper } = require('../middleware/errorHandler');

exports.register = asyncWrapper(async (req, res) => {
  const data = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.login = asyncWrapper(async (req, res) => {
  const data = await authService.login(req.body);

  res.status(200).json({
    status: 'success',
    data
  });
});