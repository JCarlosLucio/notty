import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createListSchema,
  deleteListSchema,
  getAllListSchema,
  getByIdListSchema,
} from "@/utils/schemas";
import { midString } from "@/utils/sorting";

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
          updatedAt: "asc",
        },
      });
    }),

  create: protectedProcedure
    .input(createListSchema)
    .mutation(async ({ ctx, input }) => {
      const lists = await ctx.prisma.list.findMany({
        where: {
          boardId: input.boardId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const lastItem = lists.at(-1);
      const lastPosition = lastItem ? lastItem.position : "";

      return await ctx.prisma.list.create({
        data: {
          title: input.title,
          boardId: input.boardId,
          position: midString(lastPosition, ""),
        },
      });
    }),

  delete: protectedProcedure
    .input(deleteListSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.list.delete({
        where: {
          id: input.id,
        },
      });

      return input.id;
    }),
});
