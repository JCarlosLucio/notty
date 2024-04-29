import { type inferProcedureInput } from "@trpc/server";
import { assert, beforeEach, describe, expect, test } from "vitest";

import { type AppRouter } from "@/server/api/root";
import {
  caller,
  getListInDB,
  getListsInDB,
  getNoteInDB,
  getNotesInDB,
  initialNotes,
  resetDB,
  unauthorizedCaller,
} from "@/utils/test";

type NoteCreateInput = inferProcedureInput<AppRouter["note"]["create"]>;
type NoteUpdateInput = inferProcedureInput<AppRouter["note"]["update"]>;

const partialCreateInput: Omit<NoteCreateInput, "listId"> = {
  title: "Created new note",
};

const partialUpdateInput: Omit<NoteUpdateInput, "id"> = {
  title: "Updated note title",
  content: "Updated note content",
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

      await expect(
        unauthorizedCaller.note.getAll({ listId: list.id }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("getting notes by id", () => {
    test("should get note by id", async () => {
      const noteToGet = await getNoteInDB();

      const note = await caller.note.getById({ id: noteToGet.id });

      expect(note).toMatchObject(noteToGet);
    });

    test("should throw UNAUTHORIZED when getting note by id without session", async () => {
      await expect(
        unauthorizedCaller.note.getById({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
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

      const titles = notesAfter.map((b) => b.title);
      expect(titles).toContain(testNoteInput.title);
    });

    test("should throw UNAUTHORIZED when creating note without session", async () => {
      const list = await getListInDB();

      const testNoteInput: NoteCreateInput = {
        listId: list.id,
        ...partialCreateInput,
      };
      await expect(
        unauthorizedCaller.note.create(testNoteInput),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });

    test("should throw 'Title is required' when title is empty string", async () => {
      const list = await getListInDB();

      await expect(
        caller.note.create({ title: "", listId: list.id }),
      ).rejects.toThrowError("Title is required");

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

      const titles = notesAfter.map((n) => n.title);
      expect(titles).not.toContain(noteToUpdate.title);
      expect(titles).toContain(testUpdateInput.title);

      const contents = notesAfter.map((n) => n.content);
      expect(contents).toContain(testUpdateInput.content);
    });

    test("should throw UNAUTHORIZED when updating note without session", async () => {
      await expect(
        unauthorizedCaller.note.update({
          id: "whatever",
          ...partialUpdateInput,
        }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("moving notes", () => {
    test("should move a note", async () => {
      const notes = await getNotesInDB();

      const originIdx = 0;
      const noteToMove = notes[originIdx];

      const targetIdx = 1;
      const targetNote = notes[targetIdx];

      if (!noteToMove || !targetNote) {
        return assert.fail("Couldn't get note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: noteToMove.listId,
        targetId: targetNote.id,
      });

      const expectedNewPosition = "w";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const notesAfter = await getNotesInDB();
      const sortedNotesAfter = notesAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx - 1;

      const titlesAfter = sortedNotesAfter.map((n) => n.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetNote.title);
      expect(titlesAfter[targetIdx]).toBe(noteToMove.title);

      const positionsAfter = sortedNotesAfter.map((n) => n.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetNote.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move first note to last place", async () => {
      const notes = await getNotesInDB();

      const originIdx = 0;
      const noteToMove = notes[originIdx];

      const targetIdx = notes.length - 1;
      const targetNote = notes[targetIdx];

      if (!noteToMove || !targetNote) {
        return assert.fail("Couldn't get note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: noteToMove.listId,
        targetId: targetNote.id,
      });

      const expectedNewPosition = "zn";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const notesAfter = await getNotesInDB();
      const sortedNotesAfter = notesAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx - 1;

      const titlesAfter = sortedNotesAfter.map((n) => n.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetNote.title);
      expect(titlesAfter[targetIdx]).toBe(noteToMove.title);

      const positionsAfter = sortedNotesAfter.map((n) => n.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetNote.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move second note to first place", async () => {
      const notes = await getNotesInDB();

      const originIdx = 1;
      const noteToMove = notes[originIdx];

      const targetIdx = 0;
      const targetNote = notes[targetIdx];

      if (!noteToMove || !targetNote) {
        return assert.fail("Couldn't get note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: noteToMove.listId,
        targetId: targetNote.id,
      });

      const expectedNewPosition = "g";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const notesAfter = await getNotesInDB();
      const sortedNotesAfter = notesAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx + 1;

      const titlesAfter = sortedNotesAfter.map((n) => n.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetNote.title);
      expect(titlesAfter[targetIdx]).toBe(noteToMove.title);

      const positionsAfter = sortedNotesAfter.map((n) => n.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetNote.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move last note to second place", async () => {
      const notes = await getNotesInDB();

      const originIdx = notes.length - 1;
      const noteToMove = notes[originIdx];

      const targetIdx = 1;
      const targetNote = notes[targetIdx];

      if (!noteToMove || !targetNote) {
        return assert.fail("Couldn't get note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: noteToMove.listId,
        targetId: targetNote.id,
      });

      const expectedNewPosition = "r";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const notesAfter = await getNotesInDB();
      const sortedNotesAfter = notesAfter.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetIdx + 1;

      const titlesAfter = sortedNotesAfter.map((n) => n.title);
      expect(titlesAfter[expectedTargetNewIdx]).toBe(targetNote.title);
      expect(titlesAfter[targetIdx]).toBe(noteToMove.title);

      const positionsAfter = sortedNotesAfter.map((n) => n.position);
      expect(positionsAfter[expectedTargetNewIdx]).toBe(targetNote.position);
      expect(positionsAfter[targetIdx]).toBe(expectedNewPosition);
    });

    test("should move note to a different list", async () => {
      const lists = await getListsInDB();
      const noteToMove = await getNoteInDB();

      const targetIdx = 1;
      const targetList = lists[targetIdx];

      if (!noteToMove || !targetList) {
        return assert.fail("Couldn't get list / note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: targetList.id,
        targetId: noteToMove.id,
      });

      const expectedNewPosition = "n";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        listId: targetList.id,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const originalNotesAfter = await getNotesInDB();
      const titlesAfter = originalNotesAfter.map((n) => n.title);
      expect(titlesAfter).not.toContain(noteToMove.title);
    });

    test("should move note to a different list and sort within that list", async () => {
      const lists = await getListsInDB();
      const noteToMove = await getNoteInDB();

      const targetIdx = 1;
      const targetList = lists[targetIdx];

      if (!noteToMove || !targetList) {
        return assert.fail("Couldn't get list / note in test");
      }

      const movedNote = await caller.note.move({
        id: noteToMove.id,
        listId: targetList.id,
        targetId: noteToMove.id,
      });

      const expectedNewPosition = "n";

      expect(movedNote).toMatchObject({
        ...noteToMove,
        listId: targetList.id,
        updatedAt: movedNote.updatedAt,
        position: expectedNewPosition,
      });

      const originalNotesAfter = await getNotesInDB();
      const titlesAfter = originalNotesAfter.map((n) => n.title);
      expect(titlesAfter).not.toContain(noteToMove.title);

      // move note back to original list
      const notes = await getNotesInDB();
      const targetReturnIdx = 1;
      const targetReturnNote = notes[targetReturnIdx];

      if (!targetReturnNote) {
        return assert.fail("Couldn't get list / note in test");
      }

      const returnedNote = await caller.note.move({
        id: noteToMove.id,
        listId: noteToMove.listId,
        targetId: targetReturnNote.id,
      });

      const expectedReturnPosition = "y";

      expect(returnedNote).toMatchObject({
        ...noteToMove,
        listId: noteToMove.listId,
        updatedAt: returnedNote.updatedAt,
        position: expectedReturnPosition,
      });

      const originalNotesAfterReturn = await getNotesInDB();
      const sortedNotesAfterReturn = originalNotesAfterReturn.toSorted((a, b) =>
        a.position.localeCompare(b.position),
      );

      const expectedTargetNewIdx = targetReturnIdx + 1;

      const titlesAfterReturn = sortedNotesAfterReturn.map((n) => n.title);
      expect(titlesAfterReturn[expectedTargetNewIdx]).toBe(noteToMove.title);
      expect(titlesAfterReturn[targetReturnIdx]).toBe(targetReturnNote.title);

      const positionsAfterReturn = sortedNotesAfterReturn.map(
        (n) => n.position,
      );
      expect(positionsAfterReturn[expectedTargetNewIdx]).toBe(
        expectedReturnPosition,
      );
      expect(positionsAfterReturn[targetReturnIdx]).toBe(
        targetReturnNote.position,
      );
    });

    test("should throw UNAUTHORIZED when moving note without session", async () => {
      const note = await getNoteInDB();

      await expect(
        unauthorizedCaller.note.move({
          id: "whatever",
          targetId: "whichever",
          listId: note.listId,
        }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });

  describe("deleting notes", () => {
    test("should delete a note", async () => {
      const noteToDelete = await getNoteInDB();

      await caller.note.delete({ id: noteToDelete.id });

      const notesAfter = await getNotesInDB();
      expect(notesAfter).toHaveLength(initialNotes.length - 1);

      const titles = notesAfter.map((n) => n.title);
      expect(titles).not.toContain(noteToDelete.title);
    });

    test("should throw UNAUTHORIZED when deleting note without session", async () => {
      await expect(
        unauthorizedCaller.note.delete({ id: "whatever" }),
      ).rejects.toThrowError(/UNAUTHORIZED/);
    });
  });
});
