const { z } = require('zod');

const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format')
});

const setUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'banned'], {
    required_error: 'Status is required',
    invalid_type_error: "Status must be one of: 'active', 'suspended', 'banned'"
  })
});

module.exports = { objectIdParamSchema, setUserStatusSchema };
