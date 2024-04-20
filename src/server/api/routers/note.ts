import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createNoteSchema,
  deleteNoteSchema,
  getAllNoteSchema,
  getByIdNoteSchema,
  moveNoteSchema,
  updateNoteSchema,
} from "@/utils/schemas";
import { midString } from "@/utils/sorting";

export const noteRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdNoteSchema)
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return note;
    }),
  getAll: protectedProcedure
    .input(getAllNoteSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.note.findMany({
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
      const notes = await ctx.db.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const lastItem = notes.at(-1);
      const lastPosition = lastItem ? lastItem.position : "";

      return await ctx.db.note.create({
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
      /**
       * Sorts notes within list, moves notes to a list, moves notes to a list and sorts it within that list.
       */
      const notes = await ctx.db.note.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: {
          position: "asc",
        },
      });

      const activeIdx = notes.findIndex((n) => n.id === input.id);
      const targetIdx = notes.findIndex((n) => n.id === input.targetId);

      let prevIdx = targetIdx - 1;
      let nextIdx = targetIdx;

      if (activeIdx < targetIdx) {
        prevIdx++;
        nextIdx++;
      }

      // When move is over a list (not over a note) then id === targetId so we place it at the top of the list
      if (input.id === input.targetId) {
        // this values are to place the note at the TOP with the correct position
        prevIdx = -1;
        nextIdx = 0;
      }

      const prevPos = notes[prevIdx]?.position ?? "";
      const nextPos = notes[nextIdx]?.position ?? "";

      return await ctx.db.note.update({
        where: {
          id: input.id,
        },
        data: {
          position: midString(prevPos, nextPos),
          listId: input.listId,
        },
      });
    }),

  update: protectedProcedure
    .input(updateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),

  delete: protectedProcedure
    .input(deleteNoteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.note.delete({
        where: {
          id: input.id,
        },
      });

      return input.id;
    }),
});
