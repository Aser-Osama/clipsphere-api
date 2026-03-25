const { AppError } = require('../middleware/errorHandler');

const getAccountStateError = (user) => {
  if (!user) {
    return null;
  }

  if (user.accountStatus === 'banned') {
    return new AppError('Account is banned', 403);
  }

  if (user.accountStatus === 'suspended') {
    return new AppError('Account is suspended', 403);
  }

  if (!user.active || user.accountStatus !== 'active') {
    return new AppError('Account is deactivated', 403);
  }

  return null;
};

module.exports = {
  getAccountStateError
};
