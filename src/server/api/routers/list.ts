import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const listRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.list.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } catch (error) {
      console.log("error getting list", error);
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().trim().min(1, "Title is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.list.create({
          data: {
            title: input.title,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error posting list", error);
      }
    }),
});
