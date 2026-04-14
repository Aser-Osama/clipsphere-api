const { z } = require('zod');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

// Schema for creating a video
const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoURL: z.string().min(1, 'Video URL is required'),
  duration: z.number().positive('Duration must be greater than 0').max(300, 'Duration must be <= 300 seconds')
});

// Schema for updating a video
const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one video field is required'
});

// Schema for adding a review
const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional()
});

const listVideosQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer').optional(),
  limit: z.coerce.number().int().positive('Limit must be a positive integer').max(100, 'Limit must be at most 100').optional()
});

const objectIdParamSchema = z.object({
  id: z.string().regex(objectIdPattern, 'Invalid ID format')
});

module.exports = { createVideoSchema, updateVideoSchema, reviewSchema, listVideosQuerySchema, objectIdParamSchema };
