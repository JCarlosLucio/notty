import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { unsplash } from "@/server/unsplash";
import {
  createBoardSchema,
  deleteBoardSchema,
  getByIdBoardSchema,
  getImagesSchema,
  getInfiniteBoardsSchema,
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
      const limit = input.limit ?? 30;
      const { cursor } = input;

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
  getPhotos: protectedProcedure
    .input(getImagesSchema)
    .query(async ({ input }) => {
      const res = await unsplash.search.getPhotos({
        query: input.query || "wallpaper",
        page: input.page,
        perPage: 30,
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

      return res.response.results;
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
