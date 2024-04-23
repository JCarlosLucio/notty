import { type inferProcedureInput } from "@trpc/server";
import { assert, beforeEach, describe, expect, test } from "vitest";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getBoardInDB,
  getListInDB,
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
      const board = await getBoardInDB();

      const lists = await caller.list.getAll({ boardId: board.id });

      expect(lists).toHaveLength(initialLists.length);
    });

    test("should throw UNAUTHORIZED when getting lists without session", async () => {
      const board = await getBoardInDB();

      expect(
        async () => await unauthorizedCaller.list.getAll({ boardId: board.id }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("getting lists by id", () => {
    test("should get list by id", async () => {
      const listToGet = await getListInDB();

      const list = await caller.list.getById({ id: listToGet.id });

      expect(list).toMatchObject(listToGet);
    });

    test("should throw UNAUTHORIZED when getting list by id without session", () => {
      expect(
        async () => await unauthorizedCaller.list.getById({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("creating lists", () => {
    test("should create a list", async () => {
      const board = await getBoardInDB();

      const testListInput: ListCreateInput = {
        boardId: board.id,
        ...partialCreateInput,
      };

      const newList = await caller.list.create(testListInput);

      const listsAfter = await getListsInDB();
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
      const board = await getBoardInDB();

      const testListInput: ListCreateInput = {
        boardId: board.id,
        ...partialCreateInput,
      };

      expect(
        async () => await unauthorizedCaller.list.create(testListInput),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });

    test("should throw 'Title is required' when title is empty string", async () => {
      const board = await getBoardInDB();

      expect(
        async () => await caller.list.create({ title: "", boardId: board.id }),
      ).rejects.toThrowError("Title is required");

      const listsAfter = await getListsInDB();
      expect(listsAfter).toHaveLength(initialLists.length);
    });
  });

  describe("deleting lists", () => {
    test("should delete a list", async () => {
      const listToDelete = await getListInDB();

      await caller.list.delete({ id: listToDelete.id });

      const listsAfter = await getListsInDB();
      expect(listsAfter).toHaveLength(initialLists.length - 1);

      const titles = listsAfter.map((li) => li.title);
      expect(titles).not.toContain(listToDelete.title);
    });

    test("should throw UNAUTHORIZED when deleting list without session", () => {
      expect(
        async () => await unauthorizedCaller.list.delete({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("updating lists", () => {
    test("should update a list", async () => {
      const listToUpdate = await getListInDB();

      const testUpdateInput: ListUpdateInput = {
        id: listToUpdate.id,
        ...partialUpdateInput,
      };

      const updatedList = await caller.list.update(testUpdateInput);

      expect(updatedList).toMatchObject(testUpdateInput);

      const listsAfter = await getListsInDB();

      const titles = listsAfter.map((li) => li.title);
      expect(titles).not.toContain(listToUpdate.title);
      expect(titles).toContain(testUpdateInput.title);

      const colors = listsAfter.map((li) => li.color);
      expect(colors).toContain(testUpdateInput.color);
    });

    test("should throw UNAUTHORIZED when updating list without session", () => {
      expect(
        async () =>
          await unauthorizedCaller.list.update({
            id: "whatever",
            ...partialUpdateInput,
          }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("moving lists", () => {
    test("should move a list", async () => {
      const board = await getBoardInDB();
      const lists = await getListsInDB();

      const originIdx = 0;
      const listToMove = lists[originIdx];

      const targetIdx = 1;
      const targetList = lists[targetIdx];

      if (!listToMove || !targetList) {
        return assert.fail("Couldn't get list in test");
      }

      const movedList = await caller.list.move({
        id: listToMove.id,
        boardId: board.id,
        targetId: targetList.id,
      });

      const expectedNewPosition = "w";

      expect(movedList).toMatchObject({
        ...listToMove,
        updatedAt: movedList.updatedAt,
        position: expectedNewPosition,
      });

      const listsAfter = await getListsInDB();
      const sortedListsAfter = listsAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx - 1;

      const titlesAfter = sortedListsAfter.map((li) => li.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetList.title);
      expect(titlesAfter[targetIdx]).toBe(listToMove.title);

      const positionsAfter = sortedListsAfter.map((li) => li.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetList.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move first list to last place", async () => {
      const board = await getBoardInDB();
      const lists = await getListsInDB();

      const originIdx = 0;
      const listToMove = lists[originIdx];

      const targetIdx = lists.length - 1;
      const targetList = lists[targetIdx];

      if (!listToMove || !targetList) {
        return assert.fail("Couldn't get list in test");
      }

      const movedList = await caller.list.move({
        id: listToMove.id,
        boardId: board.id,
        targetId: targetList.id,
      });

      const expectedNewPosition = "z";

      expect(movedList).toMatchObject({
        ...listToMove,
        updatedAt: movedList.updatedAt,
        position: expectedNewPosition,
      });

      const listsAfter = await getListsInDB();
      const sortedListsAfter = listsAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx - 1;

      const titlesAfter = sortedListsAfter.map((li) => li.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetList.title);
      expect(titlesAfter[targetIdx]).toBe(listToMove.title);

      const positionsAfter = sortedListsAfter.map((li) => li.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetList.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move second list to first place", async () => {
      const board = await getBoardInDB();
      const lists = await getListsInDB();

      const originIdx = 1;
      const listToMove = lists[originIdx];

      const targetIdx = 0;
      const targetList = lists[targetIdx];

      if (!listToMove || !targetList) {
        return assert.fail("Couldn't get list in test");
      }

      const movedList = await caller.list.move({
        id: listToMove.id,
        boardId: board.id,
        targetId: targetList.id,
      });

      const expectedNewPosition = "g";

      expect(movedList).toMatchObject({
        ...listToMove,
        updatedAt: movedList.updatedAt,
        position: expectedNewPosition,
      });

      const listsAfter = await getListsInDB();
      const sortedListsAfter = listsAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx + 1;

      const titlesAfter = sortedListsAfter.map((li) => li.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetList.title);
      expect(titlesAfter[targetIdx]).toBe(listToMove.title);

      const positionsAfter = sortedListsAfter.map((li) => li.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetList.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move last list to second place", async () => {
      const board = await getBoardInDB();
      const lists = await getListsInDB();

      const originIdx = lists.length - 1;
      const listToMove = lists[originIdx];

      const targetIdx = 1;
      const targetList = lists[targetIdx];

      if (!listToMove || !targetList) {
        return assert.fail("Couldn't get list in test");
      }

      const movedList = await caller.list.move({
        id: listToMove.id,
        boardId: board.id,
        targetId: targetList.id,
      });

      const expectedNewPosition = "r";

      expect(movedList).toMatchObject({
        ...listToMove,
        updatedAt: movedList.updatedAt,
        position: expectedNewPosition,
      });

      const listsAfter = await getListsInDB();
      const sortedListsAfter = listsAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx + 1;

      const titlesAfter = sortedListsAfter.map((li) => li.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetList.title);
      expect(titlesAfter[targetIdx]).toBe(listToMove.title);

      const positionsAfter = sortedListsAfter.map((li) => li.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetList.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should throw BAD_REQUEST when moving list id is targetId", async () => {
      const board = await getBoardInDB();
      const listToMove = await getListInDB();

      if (!listToMove) {
        return assert.fail("Couldn't get list in test");
      }

      expect(
        async () =>
          await caller.list.move({
            id: listToMove.id,
            boardId: board.id,
            targetId: listToMove.id,
          }),
      ).rejects.toThrowError("id cannot be targetId");
    });

    test("should throw UNAUTHORIZED when moving list without session", async () => {
      const board = await getBoardInDB();

      expect(
        async () =>
          await unauthorizedCaller.list.move({
            id: "whatever",
            targetId: "whichever",
            boardId: board.id,
          }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });
});
