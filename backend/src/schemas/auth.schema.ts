import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(50),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
