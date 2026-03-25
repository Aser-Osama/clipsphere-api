class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const getDuplicateKeyMessage = (err) => {
  const duplicateFields = Object.keys(err.keyPattern || err.keyValue || {});

  if (duplicateFields.includes('followerId') && duplicateFields.includes('followingId')) {
    return 'You are already following this user';
  }

  if (duplicateFields.includes('user') && duplicateFields.includes('video')) {
    return 'You have already reviewed this video';
  }

  const duplicateField = duplicateFields[0] || 'field';
  return `${duplicateField} already in use`;
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((validationError) => validationError.message)
      .join(', ') || 'Validation failed';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = getDuplicateKeyMessage(err);
  }

  res.status(statusCode).json({
    status: 'error',
    message
  });
};

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  asyncWrapper
};
