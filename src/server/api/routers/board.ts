import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getByIdBoardSchema } from "@/utils/schemas";

export const boardRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdBoardSchema)
    .query(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!board) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const boardBelongsToUser = board?.userId === ctx.session.user.id;

      if (!boardBelongsToUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return board;
    }),
});
