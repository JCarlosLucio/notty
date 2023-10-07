import {
  DndContext,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";

import CreateList from "@/components/CreateList";
import List from "@/components/List";
import Note from "@/components/Note";
import { useToast } from "@/components/ui/use-toast";
import { api, type RouterOutputs } from "@/utils/api";

type BoardProps = { boardId: string };
type ActiveList = RouterOutputs["list"]["getById"];
type ActiveNote = RouterOutputs["note"]["create"];

const BoardLists = ({ boardId }: BoardProps) => {
  const [activeList, setActiveList] = useState<ActiveList | null>(null);
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [prevOverListId, setPrevOverListId] = useState<string | null>(null);

  const { toast } = useToast();

  const { data: lists } = api.list.getAll.useQuery({ boardId });

  const ctx = api.useContext();

  const { mutate: moveList } = api.list.move.useMutation({
    onMutate: async ({ boardId }) => {
      // cancel outgoing fetches (so they don't overwrite our optimistic update)
      await ctx.list.getAll.cancel({ boardId });
      // optimistical update is done in onDragEnd
    },
    onSuccess: (updatedList, { id, boardId }) => {
      // update the updatedList in the correct place
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        if (oldList) {
          return oldList.map((l) => (l.id === id ? updatedList : l));
        }
        return oldList;
      });
    },
    onError: (_err) => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
      void ctx.list.invalidate();
    },
  });

  const { mutate: moveNote } = api.note.move.useMutation({
    onMutate: async ({ listId }) => {
      // cancel outgoing fetches (so they don't overwrite our optimistic update)
      await ctx.note.getAll.cancel({ listId });
      // optimistical update is done in onDragEnd
    },
    onSuccess: (updatedNote, { id, listId }) => {
      // update the updatedNote in the correct place
      ctx.note.getAll.setData({ listId }, (oldNotes) => {
        if (oldNotes) {
          return oldNotes.map((l) => (l.id === id ? updatedNote : l));
        }
        return oldNotes;
      });
    },
    onError: (_err) => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
      void ctx.note.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const removeNoteFromList = (listId: string, noteId?: string) => {
    ctx.note.getAll.setData({ listId }, (oldNotes) => {
      if (oldNotes && noteId) {
        return oldNotes.filter((n) => n.id !== noteId);
      }
      return oldNotes;
    });
  };

  const addNoteToListAndSort = (listId: string, note?: ActiveNote) => {
    ctx.note.getAll.setData({ listId }, (oldNotes) => {
      if (oldNotes) {
        const newNotes = note ? [note, ...oldNotes] : [...oldNotes];
        return newNotes.sort((a, b) =>
          a.position < b.position ? -1 : a.position === b.position ? 0 : 1
        );
      }
      return oldNotes;
    });
  };

  const resetNotesOnLists = (prevListId: string, activeNote: ActiveNote) => {
    if (!prevListId || !activeNote) return;
    // Has visited other lists
    if (prevListId !== activeNote.listId) {
      // Removes from last visited
      removeNoteFromList(prevListId, activeNote?.id);
      // Re-add to original list and sort
      addNoteToListAndSort(activeNote.listId, activeNote);
    } else {
      // last visited is original list so just sort list
      addNoteToListAndSort(activeNote.listId);
    }
  };

  function onDragStart(e: DragStartEvent) {
    const { active } = e;

    if (active.data.current?.type === "List") {
      setActiveList(active.data.current.list as ActiveList);
      return;
    }

    if (active.data.current?.type === "Note") {
      setActiveNote(active.data.current.note as ActiveNote);
      setPrevOverListId((active.data.current.note as ActiveNote).listId);
      return;
    }
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;

    // is dropped outside list/note then reset lists
    if (!over) {
      if (!prevOverListId || !activeNote) return;
      resetNotesOnLists(prevOverListId, activeNote);
      setPrevOverListId(activeNote.listId);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const isActiveANote = active.data.current?.type === "Note";

    if (activeId === overId) return; // prevents duplication of notes

    if (!isActiveANote) return;

    // Dragging over a Note over another Note
    const currOverNote = over.data.current?.note as ActiveNote | undefined;
    // Dragging over a Note over a List
    const currOverList = over.data.current?.list as ActiveList | undefined;
    const overListId = currOverNote?.listId ?? currOverList?.id;

    if (!overListId) return;

    // Fixes duplication when slowly moving note to another list
    if (prevOverListId === overListId) return;

    // Remove activeNote from the previous over list
    if (prevOverListId) {
      removeNoteFromList(prevOverListId, activeNote?.id);
    }

    // Add activeNote to the current over list (temporarily) for the sorting/moving animations of notes
    ctx.note.getAll.setData({ listId: overListId }, (oldNotes) => {
      const hasActiveNote = oldNotes?.some((n) => n?.id === activeNote?.id);
      if (oldNotes && activeNote && !hasActiveNote) {
        setPrevOverListId(overListId);
        return [activeNote, ...oldNotes];
      }
      return oldNotes;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;

    if (!over) {
      setActiveList(null);
      setActiveNote(null);
      setPrevOverListId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const isActiveAList = active.data.current?.type === "List";
    const isActiveANote = active.data.current?.type === "Note";
    const isOverANote = over.data.current?.type === "Note";
    const isOverAList = over.data.current?.type === "List";

    if (isActiveAList) {
      // Move activeList to the correct position
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        if (oldList && activeList && isOverAList) {
          const activeIdx = oldList.findIndex((l) => l.id === activeList.id);
          const overIdx = oldList.findIndex((l) => l.id === over.id);

          return arrayMove(oldList, activeIdx, overIdx);
        }
        return oldList;
      });

      if (activeId === overId) return; // is in the start position

      // Save the sorting of the list to the correct position
      moveList({
        id: activeId.toString(),
        targetId: overId.toString(),
        boardId,
      });
    }

    // Moved activeNote to the correct position
    if (isActiveANote) {
      if (!prevOverListId) return;

      const isMovingLists = activeNote?.listId !== prevOverListId;

      // Move activeNote to the correct position
      ctx.note.getAll.setData({ listId: prevOverListId }, (oldNotes) => {
        if (oldNotes && activeNote && isOverANote) {
          const activeIdx = oldNotes.findIndex((n) => n.id === activeNote.id);
          const overIdx = oldNotes.findIndex((n) => n.id === over.id);

          return arrayMove(oldNotes, activeIdx, overIdx);
        }
        return oldNotes;
      });

      // Move to the top of the list when only moving to another list (targetId === activeId)
      const targetId =
        isMovingLists && isOverAList ? activeId.toString() : overId.toString();

      // Save the sorting of the note within a list to the correct position
      // if place is in another list it also moves the note to the correct list
      moveNote({
        id: activeId.toString(),
        targetId,
        listId: prevOverListId,
      });
    }

    setActiveList(null);
    setActiveNote(null);
    setPrevOverListId(null);
  }

  function onDragCancel(_e: DragCancelEvent) {
    if (!prevOverListId || !activeNote) return;
    resetNotesOnLists(prevOverListId, activeNote);
    setActiveList(null);
    setActiveNote(null);
    setPrevOverListId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex h-full items-start gap-2 overflow-x-scroll pb-2">
        {lists && (
          <SortableContext items={lists}>
            {lists.map((list) => {
              return <List key={list.id} list={list} />;
            })}
          </SortableContext>
        )}

        <CreateList boardId={boardId} />
      </div>
      {createPortal(
        <DragOverlay>
          {activeList && <List list={activeList} />}
          {activeNote && <Note note={activeNote} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default BoardLists;
