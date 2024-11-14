import { z } from "zod";

import {
  MAX_CONTENT_LENGTH,
  MAX_QUERY_LENGTH,
  MAX_TITLE_LENGTH,
} from "@/utils/constants";

const errorMessage = {
  titleIsRequired: "Title is required",
  maxTitleLength: `Title must contain at most ${MAX_TITLE_LENGTH} characters`,
  maxQueryLength: `Query must contain at most ${MAX_QUERY_LENGTH} characters`,
  maxContentLength: `Content must contain at most ${MAX_CONTENT_LENGTH} characters`,
};

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
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
});

export const deleteBoardSchema = z.object({
  id: z.string(),
});

export const updateBoardSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
  bg: z.string().nullable(),
  thumb: z.string().nullable(),
});

export const getImagesSchema = z.object({
  page: z.number(),
  query: z.string().trim().max(MAX_QUERY_LENGTH, errorMessage.maxQueryLength),
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
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
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
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
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
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
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
    .min(1, errorMessage.titleIsRequired)
    .max(MAX_TITLE_LENGTH, errorMessage.maxTitleLength),
  content: z
    .string()
    .trim()
    .max(MAX_CONTENT_LENGTH, errorMessage.maxContentLength),
});

export const deleteNoteSchema = z.object({
  id: z.string(),
});
