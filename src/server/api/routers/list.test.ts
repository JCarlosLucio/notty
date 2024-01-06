import { beforeEach, describe, expect, test } from "bun:test";

import { caller, getBoardsInDB, initialLists, resetDB } from "@/utils/test";

describe("lists", () => {
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
  });
});
