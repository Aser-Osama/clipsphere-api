const { z } = require('zod');

// Schema for creating a video
const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoURL: z.string().min(1, 'Video URL is required'),
  duration: z.number().max(300, 'Duration must be <= 300 seconds')
});

// Schema for updating a video
const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional()
});

// Schema for adding a review
const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional()
});

const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format')
});

module.exports = { createVideoSchema, updateVideoSchema, reviewSchema, objectIdParamSchema };
