import { z } from "zod";

// BOARD
export const getByIdBoardSchema = z.object({
  id: z.string(),
});

export const createBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
});

export const deleteBoardSchema = z.object({
  id: z.string(),
});

// LIST
export const getByIdListSchema = z.object({
  id: z.string(),
});

export const getAllListSchema = z.object({
  boardId: z.string(),
});

export const createListSchema = z.object({
  boardId: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
});

export const deleteListSchema = z.object({
  id: z.string(),
});

// NOTE
export const getAllNoteSchema = z.object({
  listId: z.string(),
});

export const createNoteSchema = z.object({
  listId: z.string(),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(256, "Content must contain at most 256 characters"),
});
