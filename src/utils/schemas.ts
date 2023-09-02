import { z } from "zod";

export const createListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
});
