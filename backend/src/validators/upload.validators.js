const { z } = require('zod');

const uploadVideoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  status: z.enum(['public', 'private']).optional().default('public'),
});

module.exports = { uploadVideoSchema };
