import { exampleRouter } from "@/server/api/routers/example";
import { listRouter } from "@/server/api/routers/list";
import { noteRouter } from "@/server/api/routers/notes";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  list: listRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
