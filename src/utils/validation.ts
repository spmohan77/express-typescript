import { z } from 'zod';

export const userIdSchema = z.coerce
  .number()
  .int('id must be an integer')
  .positive('id must be positive');

export const createUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
  })
  .strict();

export type CreateUserBody = z.infer<typeof createUserSchema>;
