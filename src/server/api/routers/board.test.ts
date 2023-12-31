import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import { type AppRouter, appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { getBoardsInDB, initialBoards, resetDB, testUser } from "@/utils/test";

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

    test("should throw UNAUTHORIZED when getting boards without session", () => {
      const ctx = createInnerTRPCContext({ session: null });
      const caller = appRouter.createCaller(ctx);

      expect(async () => {
        await caller.board.getAll();
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("getting boards by id", () => {
    test("should get board by id", async () => {
      const boards = await getBoardsInDB();
      const boardToGet = boards[0];
      const board = await caller.board.getById({ id: boardToGet?.id ?? "" });

      expect(board).toMatchObject(boardToGet ?? {});
    });

    test("should throw UNAUTHORIZED when getting board by id without session", () => {
      const ctx = createInnerTRPCContext({ session: null });
      const caller = appRouter.createCaller(ctx);

      expect(async () => {
        await caller.board.getById({ id: "whatever" });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    test("should throw NOT_FOUND when board not found", () => {
      expect(async () => {
        await caller.board.getById({ id: "notindb" });
      }).toThrow(new TRPCError({ code: "NOT_FOUND" }));
    });

    test("should throw FORBIDDEN when user is not owner", async () => {
      const boards = await getBoardsInDB();
      const boardToGet = boards[0];

      const notOwnerSession = {
        user: {
          id: "not_owner",
          name: "NotOwner",
          email: "notowner@example.com",
        },
        expires: "1",
      };

      const ctx = createInnerTRPCContext({ session: notOwnerSession });
      const forbiddenCaller = appRouter.createCaller(ctx);

      expect(async () => {
        await forbiddenCaller.board.getById({ id: boardToGet?.id ?? "" });
      }).toThrow(new TRPCError({ code: "FORBIDDEN" }));
    });
  });

  describe("creating boards", () => {
    test("should create a board", async () => {
      const newBoard = await caller.board.create(testBoardInput);
      const boardsAfter = await getBoardsInDB();
      const titles = boardsAfter.map((b) => b.title);

      expect(newBoard).toMatchObject({
        title: testBoardInput.title,
        userId: testUser.id,
      });
      expect(boardsAfter).toHaveLength(initialBoards.length + 1);
      expect(titles).toContain(testBoardInput.title);
    });
  });
});
