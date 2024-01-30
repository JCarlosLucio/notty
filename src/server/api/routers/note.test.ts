import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import {
  caller,
  getListInDB,
  initialNotes,
  resetDB,
  unauthorizedCaller,
} from "@/utils/test";

describe("Notes", () => {
  beforeEach(async () => {
    await resetDB();
  });

  describe("getting notes", () => {
    test("should get notes", async () => {
      const list = await getListInDB();

      const notes = await caller.note.getAll({ listId: list.id });

      expect(notes).toHaveLength(initialNotes.length);
    });

    test("should throw UNAUTHORIZED when getting notes without session", async () => {
      const list = await getListInDB();

      expect(async () => {
        await unauthorizedCaller.note.getAll({ listId: list.id });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });
});
