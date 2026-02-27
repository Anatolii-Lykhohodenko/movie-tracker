import z from "zod";

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(10),
});


export type ratingSchemaType = z.infer<typeof ratingSchema>;
