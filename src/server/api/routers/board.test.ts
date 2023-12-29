import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import { type AppRouter, appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { initialBoards, resetDB, testUser } from "@/utils/test";

type BoardInput = inferProcedureInput<AppRouter["board"]["create"]>;

const testBoardInput: BoardInput = { title: "Board Test" };
const testSession = {
  user: testUser,
  expires: "1",
};

const ctx = createInnerTRPCContext({ session: testSession });
const caller = appRouter.createCaller(ctx);

describe("Boards", () => {
  beforeEach(async () => {
    await resetDB();
  });

  describe("getting boards", () => {
    test("should get boards", async () => {
      const boards = await caller.board.getAll();

      expect(boards).toHaveLength(initialBoards.length);
    });

    test("should throw when getting boards without session", () => {
      const ctx = createInnerTRPCContext({ session: null });
      const caller = appRouter.createCaller(ctx);

      expect(async () => {
        await caller.board.getAll();
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("creating boards", () => {
    test("should create a board", async () => {
      const newBoard = await caller.board.create(testBoardInput);

      expect(newBoard).toMatchObject({
        title: testBoardInput.title,
        userId: testUser.id,
      });
    });
  });
});
