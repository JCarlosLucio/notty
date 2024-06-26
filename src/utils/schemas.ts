import { z } from "zod";

// BOARD
export const getByIdBoardSchema = z.object({
  id: z.string(),
});

export const getInfiniteBoardsSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
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
  bg: z.string().nullable(),
  thumb: z.string().nullable(),
});

export const getImagesSchema = z.object({
  page: z.number(),
  query: z
    .string()
    .trim()
    .max(256, "Query must contain at most 256 characters"),
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
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
});

export const moveNoteSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  listId: z.string(),
});

export const updateNoteSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(256, "Title must contain at most 256 characters"),
  content: z
    .string()
    .trim()
    .max(256, "Content must contain at most 256 characters"),
});

export const deleteNoteSchema = z.object({
  id: z.string(),
});
