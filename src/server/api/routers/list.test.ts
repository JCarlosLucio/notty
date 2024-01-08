import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import {
  caller,
  getBoardsInDB,
  getListsInDB,
  initialLists,
  resetDB,
  unauthorizedCaller,
} from "@/utils/test";

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
});
