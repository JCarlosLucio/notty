import { type inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, expect, test } from "vitest";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getBoardInDB,
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
  bg: "linear-gradient(0deg, #000, #000)",
  thumb: "linear-gradient(0deg, #000, #000)",
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

    test("should throw UNAUTHORIZED when getting boards without session", async () => {
      await expect(unauthorizedCaller.board.getAll()).rejects.toThrowError(
        /UNAUTHORIZED/,
      );
    });
  });

  describe("getting infinite boards", () => {
    test("should get limit amount of infinite boards", async () => {
      const limit = 1;
      const { boards, nextCursor } = await caller.board.getInfinite({ limit });
      const expectedCursor = (await getBoardsInDB())[limit]?.id ?? "";

      expect(boards).toHaveLength(limit);
      expect(nextCursor).toBe(expectedCursor);
    });

    test("should get last available infinite boards", async () => {
      const limit = 5;
      const { boards, nextCursor } = await caller.board.getInfinite({
        limit,
      });

      expect(boards).toHaveLength(initialBoards.length);
      expect(nextCursor).not.toBeDefined();
    });
  });

  describe("getting boards by id", () => {
    test("should get board by id", async () => {
      const boardToGet = await getBoardInDB();

      const board = await caller.board.getById({ id: boardToGet.id });

      expect(board).toMatchObject(boardToGet);
    });

    test("should throw UNAUTHORIZED when getting board by id without session", async () => {
      await expect(
        unauthorizedCaller.board.getById({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });

    test("should throw NOT_FOUND when board not found", async () => {
      await expect(
        caller.board.getById({ id: "notindb" }),
      ).rejects.toThrowError(/NOT_FOUND/);
    });

    test("should throw FORBIDDEN when user is not owner", async () => {
      const boardToGet = await getBoardInDB();

      await expect(
        notOwnerCaller.board.getById({ id: boardToGet.id }),
      ).rejects.toThrowError(/FORBIDDEN/);
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

    test("should throw UNAUTHORIZED when creating board without session", async () => {
      await expect(
        unauthorizedCaller.board.create(testBoardInput),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });

    test("should throw 'Title is required' when title is empty string", async () => {
      await expect(caller.board.create({ title: "" })).rejects.toThrowError(
        "Title is required",
      );

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(initialBoards.length);
    });
  });

  describe("deleting boards", () => {
    test("should delete a board", async () => {
      const boardToDelete = await getBoardInDB();

      await caller.board.delete({ id: boardToDelete.id });

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(initialBoards.length - 1);

      const titles = boardsAfter.map((b) => b.title);
      expect(titles).not.toContain(boardToDelete?.title);
    });

    test("should throw UNAUTHORIZED when deleting board without session", async () => {
      await expect(
        unauthorizedCaller.board.delete({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });

    test("should throw FORBIDDEN when user is not owner", async () => {
      const boardToDelete = await getBoardInDB();

      await expect(
        notOwnerCaller.board.delete({ id: boardToDelete.id }),
      ).rejects.toThrowError(/FORBIDDEN/);

      const boardsAfter = await getBoardsInDB();
      expect(boardsAfter).toHaveLength(initialBoards.length);

      const titles = boardsAfter.map((b) => b.title);
      expect(titles).toContain(boardToDelete.title);
    });
  });

  describe("updating boards", () => {
    test("should update a board", async () => {
      const boardToUpdate = await getBoardInDB();

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
      const boardToUpdate = await getBoardInDB();

      const testUpdateInput: BoardUpdateInput = {
        id: boardToUpdate.id,
        ...partialUpdateInput,
      };

      await expect(
        notOwnerCaller.board.update(testUpdateInput),
      ).rejects.toThrowError(/FORBIDDEN/);

      const boardsAfter = await getBoardsInDB();
      const titles = boardsAfter.map((b) => b.title);
      expect(titles).not.toContain(testUpdateInput.title);
    });
  });
});
