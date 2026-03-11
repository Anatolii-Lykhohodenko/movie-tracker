import z from "zod";

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(10),
  comment: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be at most 1000 characters')
    .optional(),
});


export type ratingSchemaType = z.infer<typeof ratingSchema>;
