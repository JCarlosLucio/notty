import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createNoteSchema } from "@/utils/schemas";

export const noteRouter = createTRPCRouter({
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
