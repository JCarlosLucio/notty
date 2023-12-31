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

export const updateBoardSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
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

export const moveListSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  boardId: z.string(),
});

export const deleteListSchema = z.object({
  id: z.string(),
});

export const updateListSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
  color: z.string().nullable(),
});

// NOTE
export const getByIdNoteSchema = z.object({
  id: z.string(),
});

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

export const moveNoteSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  listId: z.string(),
});

export const updateNoteSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(256, "Content must contain at most 256 characters"),
});
