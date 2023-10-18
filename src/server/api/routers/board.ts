import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createBoardSchema,
  deleteBoardSchema,
  getByIdBoardSchema,
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
        updatedAt: "asc",
      },
    });
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
      return await ctx.db.board.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
});
