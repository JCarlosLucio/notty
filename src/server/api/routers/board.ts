import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { unsplash } from "@/server/unsplash";
import {
  INFINITE_PHOTOS_LIMIT,
  MAX_INFINITE_PHOTOS_PAGES,
} from "@/utils/constants";
import {
  createBoardSchema,
  deleteBoardSchema,
  getByIdBoardSchema,
  getInfiniteBoardsSchema,
  getInfinitePhotosSchema,
  updateBoardSchema,
} from "@/utils/schemas";

export const boardRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdBoardSchema)
    .query(async ({ ctx, input }) => {
      const board = await ctx.db.board.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!board) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const boardBelongsToUser = board?.userId === ctx.session.user.id;

      if (!boardBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return board;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.board.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getInfinite: protectedProcedure
    .input(getInfiniteBoardsSchema)
    .query(async ({ ctx, input }) => {
      const { cursor, limit = 30 } = input;

      const boards = await ctx.db.board.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          userId: ctx.session.user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });

      let nextCursor: typeof cursor = undefined;

      if (boards.length > limit) {
        const nextBoard = boards.pop(); // return the last item from the array
        nextCursor = nextBoard?.id;
      }

      return {
        boards,
        nextCursor,
      };
    }),

  // get photos from unsplash
  getInfinitePhotos: protectedProcedure
    .input(getInfinitePhotosSchema)
    .query(async ({ input }) => {
      const { query, cursor = 1, limit = INFINITE_PHOTOS_LIMIT } = input;

      const res = await unsplash.search.getPhotos({
        query: query || "wallpaper",
        page: cursor,
        perPage: limit,
        orientation: "landscape",
        contentFilter: "high",
        orderBy: "relevant",
      });

      if (res.type === "error") {
        throw new TRPCError({
          message: res.errors[0],
          code: res.status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR",
        });
      }

      const photos = res.response.results;

      const maxPages = Math.min(
        res.response.total_pages,
        MAX_INFINITE_PHOTOS_PAGES,
      );
      let nextPage: number | undefined = undefined;

      if (cursor && maxPages >= cursor + 1) {
        nextPage = cursor + 1;
      }

      return { photos, nextPage };
    }),

  create: protectedProcedure
    .input(createBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.board.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(deleteBoardSchema)
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.db.board.findUnique({
        where: {
          id: input.id,
        },
      });

      const boardBelongsToUser = board?.userId === ctx.session.user.id;

      if (!boardBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.board.delete({
        where: {
          id: input.id,
        },
      });

      return input.id;
    }),

  update: protectedProcedure
    .input(updateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.db.board.findUnique({
        where: {
          id: input.id,
        },
      });

      const boardBelongsToUser = board?.userId === ctx.session.user.id;

      if (!boardBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await ctx.db.board.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          bg: input.bg,
          thumb: input.thumb,
        },
      });
    }),
});
