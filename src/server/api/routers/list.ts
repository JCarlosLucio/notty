import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createListSchema,
  deleteListSchema,
  getAllListSchema,
  getByIdListSchema,
  moveListSchema,
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
          position: "asc",
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

  move: protectedProcedure
    .input(moveListSchema)
    .mutation(async ({ ctx, input }) => {
      const lists = await ctx.prisma.list.findMany({
        where: {
          boardId: input.boardId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const activeIdx = lists.findIndex((l) => l.id === input.id);
      const targetIdx = lists.findIndex((l) => l.id === input.targetId);

      let prevIdx = targetIdx - 1;
      let nextIdx = targetIdx;

      if (activeIdx < targetIdx) {
        prevIdx++;
        nextIdx++;
      }
      const prevPos = lists[prevIdx]?.position ?? "";
      const nextPos = lists[nextIdx]?.position ?? "";

      return await ctx.prisma.list.update({
        where: {
          id: input.id,
        },
        data: {
          position: midString(prevPos, nextPos),
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
