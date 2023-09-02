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
});
