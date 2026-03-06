import z from "zod";

export const registerSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(50, { error: 'Password is too long' }),
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(20, { error: 'Name is too long' }),
});

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(50, { error: 'Password is too long' }),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8, { error: 'Password must be at least 8 characters' }),
  newPassword: z
    .string()
    .min(8, { error: 'New password must be at least 8 characters' })
    .max(50, { error: 'Password is too long' }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(20).optional(),
  birthDate: z.iso.datetime().optional(),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type updateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
