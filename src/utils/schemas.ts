import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});
