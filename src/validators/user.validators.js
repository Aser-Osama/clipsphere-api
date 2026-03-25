const { z } = require('zod');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const updateMeSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(200).optional(),
  avatarKey: z.string().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one profile field is required'
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
}).refine(
  (data) =>
    Object.values(data).some(
      (group) => group && Object.keys(group).length > 0
    ),
  {
    message: 'At least one notification preference is required'
  }
);

const objectIdParamSchema = z.object({
  id: z.string().regex(objectIdPattern, 'Invalid ID format')
});

module.exports = { updateMeSchema, preferencesSchema, objectIdParamSchema };
