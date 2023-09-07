import { z } from "zod";

export const getByIdListSchema = z.object({
  id: z.string(),
});

export const createListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
});

export const deleteListSchema = z.object({
  id: z.string(),
});
