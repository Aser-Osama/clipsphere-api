const formatValidationIssues = (issues) =>
  issues
    .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
    .join(', ');

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: formatValidationIssues(result.error.issues)
    });
  }

  req[source] = result.data;
  next();
};

validate.formatValidationIssues = formatValidationIssues;

module.exports = validate;
