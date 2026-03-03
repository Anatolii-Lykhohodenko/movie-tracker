import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
  name: z.string().min(2).max(20),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(20).optional(),
  birthDate: z.iso.datetime().optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8).max(50),
  newPassword: z.string().min(8).max(50),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type updateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
