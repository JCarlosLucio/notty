import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createNoteSchema,
  getAllNoteSchema,
  moveNoteSchema,
} from "@/utils/schemas";
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

  move: protectedProcedure
    .input(moveNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const notes = await ctx.prisma.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const activeIdx = notes.findIndex((n) => n.id === input.id);
      const targetIdx = notes.findIndex((n) => n.id === input.targetId);

      let prevIdx = targetIdx;
      let nextIdx = targetIdx + 1;

      // only happens when moving to new list and placed at the top
      if (input.id === input.targetId) {
        prevIdx = -1;
        nextIdx = 0;
      }

      const prevPos = notes[prevIdx]?.position ?? "";
      const nextPos = notes[nextIdx]?.position ?? "";

      return await ctx.prisma.note.update({
        where: {
          id: input.id,
        },
        data: {
          position: midString(prevPos, nextPos),
          listId: input.listId,
        },
      });
    }),
});
