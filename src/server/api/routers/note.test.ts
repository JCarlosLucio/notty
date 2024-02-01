import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test } from "bun:test";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getListInDB,
  getNoteInDB,
  getNotesInDB,
  initialNotes,
  resetDB,
  unauthorizedCaller,
} from "@/utils/test";

type NoteCreateInput = inferProcedureInput<AppRouter["note"]["create"]>;
type NoteUpdateInput = inferProcedureInput<AppRouter["note"]["update"]>;

const partialCreateInput: Omit<NoteCreateInput, "listId"> = {
  content: "Created content",
};

const partialUpdateInput: Omit<NoteUpdateInput, "id"> = {
  content: "Updated content",
};

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

  describe("getting notes by id", () => {
    test("should get note by id", async () => {
      const noteToGet = await getNoteInDB();

      const note = await caller.note.getById({ id: noteToGet.id });

      expect(note).toMatchObject(noteToGet);
    });

    test("should throw UNAUTHORIZED when getting note by id without session", () => {
      expect(async () => {
        await unauthorizedCaller.note.getById({ id: "whatever" });
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("creating notes", () => {
    test("should create a note", async () => {
      const list = await getListInDB();

      const testNoteInput: NoteCreateInput = {
        listId: list.id,
        ...partialCreateInput,
      };

      const newNote = await caller.note.create(testNoteInput);

      expect(newNote).toMatchObject({
        position: "zn",
        ...testNoteInput,
      });

      const notesAfter = await getNotesInDB();
      expect(notesAfter).toHaveLength(initialNotes.length + 1);

      const contents = notesAfter.map((b) => b.content);
      expect(contents).toContain(testNoteInput.content);
    });

    test("should throw UNAUTHORIZED when creating note without session", async () => {
      const list = await getListInDB();

      const testNoteInput: NoteCreateInput = {
        listId: list.id,
        ...partialCreateInput,
      };
      expect(async () => {
        await unauthorizedCaller.note.create(testNoteInput);
      }).toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    test("should throw 'Content is required' when content is empty string", async () => {
      const list = await getListInDB();

      expect(async () => {
        await caller.note.create({ content: "", listId: list.id });
      }).toThrow("Content is required");

      const notesAfter = await getNotesInDB();
      expect(notesAfter).toHaveLength(initialNotes.length);
    });
  });

  describe("updating notes", () => {
    test("should update a note", async () => {
      const noteToUpdate = await getNoteInDB();

      const testUpdateInput: NoteUpdateInput = {
        id: noteToUpdate.id,
        ...partialUpdateInput,
      };

      const updatedNote = await caller.note.update(testUpdateInput);

      expect(updatedNote).toMatchObject(testUpdateInput);

      const notesAfter = await getNotesInDB();

      const contents = notesAfter.map((n) => n.content);
      expect(contents).not.toContain(noteToUpdate.content);
      expect(contents).toContain(testUpdateInput.content);
    });
  });
});
