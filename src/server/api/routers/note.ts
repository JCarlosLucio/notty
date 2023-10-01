import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createNoteSchema, getAllNoteSchema } from "@/utils/schemas";
import { midString } from "@/utils/sorting";

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
      const notes = await ctx.prisma.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const lastItem = notes.at(-1);
      const lastPosition = lastItem ? lastItem.position : "";

      return await ctx.prisma.note.create({
        data: {
          listId: input.listId,
          content: input.content,
          position: midString(lastPosition, ""),
        },
      });
    }),
});
