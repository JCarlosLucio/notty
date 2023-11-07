import { boardRouter } from "@/server/api/routers/board";
import { listRouter } from "@/server/api/routers/list";
import { noteRouter } from "@/server/api/routers/note";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  list: listRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
