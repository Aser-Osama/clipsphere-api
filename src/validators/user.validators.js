const { z } = require('zod');

const updateMeSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(200).optional(),
  avatarKey: z.string().optional(),
});

const preferencesSchema = z.object({
  inApp: z.object({
    followers: z.boolean().optional(),
    comments: z.boolean().optional(),
    likes: z.boolean().optional(),
    tips: z.boolean().optional()
  }).optional(),
  email: z.object({
    followers: z.boolean().optional(),
    comments: z.boolean().optional(),
    likes: z.boolean().optional(),
    tips: z.boolean().optional()
  }).optional()
});

const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format')
});

module.exports = { updateMeSchema, preferencesSchema, objectIdParamSchema };