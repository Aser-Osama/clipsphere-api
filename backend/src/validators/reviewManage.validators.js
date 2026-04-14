const { z } = require('zod');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const reviewIdParamSchema = z.object({
  id: z.string().regex(objectIdPattern, 'Invalid review ID')
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(1).max(1000).optional()
}).refine(data => data.rating !== undefined || data.comment !== undefined, {
  message: 'At least one of rating or comment is required'
});

module.exports = { reviewIdParamSchema, updateReviewSchema };
