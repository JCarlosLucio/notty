import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createListSchema,
  deleteListSchema,
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

      const listBelongsToUser = list?.userId === ctx.session.user.id;

      if (!listBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return list;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.list.findMany({
      where: {
        userId: ctx.session.user.id,
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
