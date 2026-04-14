const { z } = require('zod');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer').optional(),
  limit: z.coerce.number().int().positive('Limit must be a positive integer').max(100, 'Limit must be at most 100').optional()
});

const videoIdParamSchema = z.object({
  id: z.string().regex(objectIdPattern, 'Invalid video ID format')
});

module.exports = { feedQuerySchema, videoIdParamSchema };
