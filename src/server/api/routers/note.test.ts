import { beforeEach, describe, expect, test } from "bun:test";

import { caller, getListInDB, initialNotes, resetDB } from "@/utils/test";

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
  });
});
