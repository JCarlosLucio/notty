import { beforeEach, describe, expect, test } from "bun:test";

import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { initialBoards, resetDB, testUser } from "@/utils/test";

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
  });
});
