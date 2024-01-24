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

type ListCreateInput = inferProcedureInput<AppRouter["list"]["create"]>;
type ListUpdateInput = inferProcedureInput<AppRouter["list"]["update"]>;

const partialCreateInput: Omit<ListCreateInput, "boardId"> = {
  title: "Created title",
};
const partialUpdateInput: Omit<ListUpdateInput, "id"> = {
  title: "Updated title",
  color: "#FF0000",
};

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
      const testListInput: ListCreateInput = {
        boardId: board.id,
        ...partialCreateInput,
      };

      const newList = await caller.list.create(testListInput);
      const listsAfter = await getListsInDB(board.id);
      const titles = listsAfter.map((b) => b.title);

      expect(newList).toMatchObject({
        position: "z",
        color: null,
        ...testListInput,
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
      const testListInput: ListCreateInput = {
        boardId: board.id,
        ...partialCreateInput,
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

  describe("updating lists", () => {
    test("should update a list", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      const lists = await getListsInDB(board.id);
      const listToUpdate = lists[0];

      if (!listToUpdate) {
        return expect().fail("Couldn't get list in test");
      }

      const testUpdateInput: ListUpdateInput = {
        id: listToUpdate.id,
        ...partialUpdateInput,
      };

      const updatedList = await caller.list.update(testUpdateInput);

      expect(updatedList).toMatchObject(testUpdateInput);

      const listsAfter = await getListsInDB(board.id);

      const titles = listsAfter.map((li) => li.title);
      expect(titles).not.toContain(listToUpdate.title);
      expect(titles).toContain(testUpdateInput.title);

      const colors = listsAfter.map((li) => li.color);
      expect(colors).toContain(testUpdateInput.color);
    });

    test("should throw UNAUTHORIZED when updating list without session", () => {
      expect(async () => {
        await unauthorizedCaller.list.update({
          id: "whatever",
          ...partialUpdateInput,
        });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("moving lists", () => {
    test("should move a list", async () => {
      const boards = await getBoardsInDB();
      const board = boards[0];

      if (!board) {
        return expect().fail("Couldn't get board in test");
      }

      const lists = await getListsInDB(board.id);
      const listToMove = lists[0];
      const targetList = lists[1];

      if (!listToMove || !targetList) {
        return expect().fail("Couldn't get list in test");
      }

      const movedList = await caller.list.move({
        id: listToMove.id,
        boardId: board.id,
        targetId: targetList.id,
      });

      const expectedNewPosition = "w";

      expect(movedList).toMatchObject({
        id: listToMove.id,
        title: listToMove.title,
        color: listToMove.color,
        boardId: listToMove.boardId,
        position: expectedNewPosition,
      });

      const listsAfter = await getListsInDB(board.id);
      const sortedListsAfter = listsAfter.toSorted(
        (a, b) => a.position.charCodeAt(0) - b.position.charCodeAt(0),
      );
      const titlesAfter = sortedListsAfter.map((li) => li.title);
      expect(titlesAfter[0]).toBe(targetList.title);
      expect(titlesAfter[1]).toBe(listToMove.title);

      const positionsAfter = sortedListsAfter.map((li) => li.position);
      expect(positionsAfter[0]).toBe(targetList.position);
      expect(positionsAfter[1]).toBe(expectedNewPosition);
    });
  });
});
