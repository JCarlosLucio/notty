import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createListSchema,
  deleteListSchema,
  getAllListSchema,
  getByIdListSchema,
} from "@/utils/schemas";

export const listRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdListSchema)
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.list.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!list) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return list;
    }),

  getAll: protectedProcedure
    .input(getAllListSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.list.findMany({
        where: {
          boardId: input.boardId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  create: protectedProcedure
    .input(createListSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.list.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(deleteListSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.prisma.list.findUnique({
        where: {
          id: input.id,
        },
      });

      const listBelongsToUser = list?.userId === ctx.session.user.id;

      if (!listBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.list.delete({
        where: {
          id: input.id,
        },
      });

      return input.id;
    }),
});
