import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createNoteSchema, getAllNoteSchema } from "@/utils/schemas";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(getAllNoteSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          position: "asc",
        },
      });
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
