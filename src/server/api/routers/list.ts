import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const createListSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

export type CreateListInput = z.infer<typeof createListSchema>;

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
    .input(createListSchema)
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
