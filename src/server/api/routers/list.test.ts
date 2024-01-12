import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getBoardsInDB,
  getListsInDB,
  initialLists,
  resetDB,
  unauthorizedCaller,
} from "@/utils/test";

type ListInput = inferProcedureInput<AppRouter["list"]["create"]>;

describe("Lists", () => {
  beforeEach(async () => {
    await resetDB();
  });

  describe("getting lists", () => {
    test("should get lists", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      const lists = await caller.list.getAll({ boardId: board.id });

      expect(lists).toHaveLength(initialLists.length);
    });

    test("should throw UNAUTHORIZED when getting lists without session", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      expect(async () => {
        await unauthorizedCaller.list.getAll({ boardId: board.id });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("getting lists by id", () => {
    test("should get list by id", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      const lists = await getListsInDB(board.id);
      const listToGet = lists[0];

      if (!listToGet) {
        return expect().fail("Couldn't get list in test");
      }

      const list = await caller.list.getById({ id: listToGet.id });

      expect(list).toMatchObject(listToGet);
    });

    test("should throw UNAUTHORIZED when getting list by id without session", () => {
      expect(async () => {
        await unauthorizedCaller.list.getById({ id: "whatever" });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("creating lists", () => {
    test("should create a list", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }
      const testListInput: ListInput = {
        title: "List Test",
        boardId: board.id,
      };

      const newList = await caller.list.create(testListInput);
      const listsAfter = await getListsInDB(board.id);
      const titles = listsAfter.map((b) => b.title);

      expect(newList).toMatchObject({
        title: testListInput.title,
        position: "z",
        color: null,
        boardId: board.id,
      });
      expect(listsAfter).toHaveLength(initialLists.length + 1);
      expect(titles).toContain(testListInput.title);
    });

    test("should throw UNAUTHORIZED when creating list without session", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }
      const testListInput: ListInput = {
        title: "List Test",
        boardId: board.id,
      };

      expect(async () => {
        await unauthorizedCaller.list.create(testListInput);
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    test("should throw 'Title is required' when title is empty string", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      expect(async () => {
        await caller.list.create({ title: "", boardId: board.id });
      }).toThrow("Title is required");

      const listsAfter = await getListsInDB(board.id);
      expect(listsAfter).toHaveLength(initialLists.length);
    });
  });

  describe("deleting lists", () => {
    test("should delete a list", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      const lists = await getListsInDB(board.id);
      const listToDelete = lists[0];

      if (!listToDelete) {
        return expect().fail("Couldn't get list in test");
      }

      await caller.list.delete({ id: listToDelete.id });

      const listsAfter = await getListsInDB(board.id);
      expect(listsAfter).toHaveLength(initialLists.length - 1);

      const titles = listsAfter.map((li) => li.title);
      expect(titles).not.toContain(listToDelete.title);
    });

    test("should throw UNAUTHORIZED when deleting list without session", () => {
      expect(async () => {
        await unauthorizedCaller.list.delete({ id: "whatever" });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });
});
