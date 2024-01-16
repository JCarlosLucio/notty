import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getBoardsInDB,
  initialBoards,
  notOwnerCaller,
  resetDB,
  testUser,
  unauthorizedCaller,
} from "@/utils/test";

type BoardCreateInput = inferProcedureInput<AppRouter["board"]["create"]>;
type BoardUpdateInput = inferProcedureInput<AppRouter["board"]["update"]>;

const testBoardInput: BoardCreateInput = { title: "Board Test" };
const partialUpdateInput: Omit<BoardUpdateInput, "id"> = {
  title: "Updated title",
};

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
      expect(async () => {
        await unauthorizedCaller.board.getAll();
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("getting boards by id", () => {
    test("should get board by id", async () => {
      const boards = await getBoardsInDB();
      const boardToGet = boards[0];

      if (!boardToGet) {
        return expect().fail("Couldn't get board in test");
      }

      const board = await caller.board.getById({ id: boardToGet.id });

      expect(board).toMatchObject(boardToGet);
    });

    test("should throw UNAUTHORIZED when getting board by id without session", () => {
      expect(async () => {
        await unauthorizedCaller.board.getById({ id: "whatever" });
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

      if (!boardToGet) {
        return expect().fail("Couldn't get board in test");
      }

      expect(async () => {
        await notOwnerCaller.board.getById({ id: boardToGet.id });
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

    test("should throw UNAUTHORIZED when creating board without session", () => {
      expect(async () => {
        await unauthorizedCaller.board.create(testBoardInput);
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    test("should throw 'Title is required' when title is empty string", async () => {
      expect(async () => {
        await caller.board.create({ title: "" });
      }).toThrow("Title is required");

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(initialBoards.length);
    });
  });

  describe("deleting boards", () => {
    test("should delete a board", async () => {
      const boards = await getBoardsInDB();
      const boardToDelete = boards[0];

      if (!boardToDelete) {
        return expect().fail("Couldn't get board in test");
      }

      await caller.board.delete({ id: boardToDelete.id });

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(boards.length - 1);

      const titles = boardsAfter.map((b) => b.title);
      expect(titles).not.toContain(boardToDelete?.title);
    });

    test("should throw UNAUTHORIZED when deleting board without session", () => {
      expect(async () => {
        await unauthorizedCaller.board.delete({ id: "whatever" });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    test("should throw FORBIDDEN when user is not owner", async () => {
      const boards = await getBoardsInDB();
      const boardToDelete = boards[0];

      if (!boardToDelete) {
        return expect().fail("Couldn't get board in test");
      }

      expect(async () => {
        await notOwnerCaller.board.delete({ id: boardToDelete.id });
      }).toThrow(new TRPCError({ code: "FORBIDDEN" }));

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(boards.length);

      const titles = boardsAfter.map((b) => b.title);
      expect(titles).toContain(boardToDelete.title);
    });
  });

  describe("updating boards", () => {
    test("should update a board", async () => {
      const boards = await getBoardsInDB();
      const boardToUpdate = boards[0];

      if (!boardToUpdate) {
        return expect().fail("Couldn't get board in test");
      }

      const testUpdateInput: BoardUpdateInput = {
        id: boardToUpdate.id,
        ...partialUpdateInput,
      };

      const updatedBoard = await caller.board.update(testUpdateInput);

      expect(updatedBoard.title).toBe(testUpdateInput.title);

      const boardsAfter = await getBoardsInDB();
      const titles = boardsAfter.map((b) => b.title);
      expect(titles).not.toContain(boardToUpdate.title);
      expect(titles).toContain(testUpdateInput.title);
    });

    test("should throw FORBIDDEN when user is not owner", async () => {
      const boards = await getBoardsInDB();
      const boardToUpdate = boards[0];

      if (!boardToUpdate) {
        return expect().fail("Couldn't get board in test");
      }

      const testUpdateInput = {
        id: boardToUpdate.id,
        ...partialUpdateInput,
      };

      expect(async () => {
        await notOwnerCaller.board.update(testUpdateInput);
      }).toThrow(new TRPCError({ code: "FORBIDDEN" }));

      const boardsAfter = await getBoardsInDB();
      const titles = boardsAfter.map((b) => b.title);
      expect(titles).not.toContain(testUpdateInput.title);
    });
  });
});
