import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createBoardSchema, getByIdBoardSchema } from "@/utils/schemas";

export const boardRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdBoardSchema)
    .query(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
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
    return await ctx.prisma.board.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  create: protectedProcedure
    .input(createBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.board.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),
});
