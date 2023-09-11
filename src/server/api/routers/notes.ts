import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createNoteSchema, getAllNoteSchema } from "@/utils/schemas";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(getAllNoteSchema)
    .query(async ({ ctx, input }) => {
      const notes = await ctx.prisma.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!notes) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return notes;
    }),

  create: protectedProcedure
    .input(createNoteSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.note.create({
        data: {
          listId: input.listId,
          content: input.content,
        },
      });
    }),
});
