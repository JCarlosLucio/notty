import {
  DndContext,
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
import { api, type RouterOutputs } from "@/utils/api";

type BoardProps = { boardId: string };
type ActiveList = RouterOutputs["list"]["getById"];
type ActiveNote = RouterOutputs["note"]["create"];

const BoardLists = ({ boardId }: BoardProps) => {
  const [activeList, setActiveList] = useState<ActiveList | null>(null);
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [prevOverListId, setPrevOverListId] = useState<string | null>(null);
  const [prevOverNoteId, setPrevOverNoteId] = useState<string | null>(null);

  const { data: lists } = api.list.getAll.useQuery({ boardId });

  const ctx = api.useContext();

  const { mutate: moveList } = api.list.move.useMutation({
    onMutate: async ({ id, targetId, boardId }) => {
      // cancel outgoing fetches (so they don't overwrite our optimistic update)
      await ctx.list.getAll.cancel({ boardId });

      // Get all data from queryCache
      const previousList = ctx.list.getAll.getData();

      // optimistically update data with updated post
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        if (oldList) {
          const activeIdx = oldList.findIndex((l) => l.id === id);
          const overIdx = oldList.findIndex((l) => l.id === targetId);

          return arrayMove(oldList, activeIdx, overIdx);
        }
        return oldList;
      });

      return { previousList };
    },
    onSuccess: (updatedList, { id, boardId }) => {
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        if (oldList) {
          return oldList.map((l) => (l.id === id ? updatedList : l));
        }

        return oldList;
      });
    },
    onError: (_err, { boardId }, context) => {
      ctx.list.getAll.setData({ boardId }, context?.previousList);
    },
  });

  const { mutate: moveNote } = api.note.move.useMutation({
    onMutate: async ({ listId }) => {
      // cancel outgoing fetches (so they don't overwrite our optimistic update)
      await ctx.note.getAll.cancel({ listId });

      // Get all data from queryCache
      const previousNotes = ctx.note.getAll.getData();

      return { previousNotes };
    },
    onSuccess: (updatedNote, { id, listId }) => {
      ctx.note.getAll.setData({ listId }, (oldNotes) => {
        if (oldNotes) {
          return oldNotes.map((l) => (l.id === id ? updatedNote : l));
        }

        return oldNotes;
      });
    },
    onError: (_err, { listId }, context) => {
      ctx.note.getAll.setData({ listId }, context?.previousNotes);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(e: DragStartEvent) {
    const { active } = e;
    console.log("ON DRAG START");
    console.log(active.data.current);

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
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveANote = active.data.current?.type === "Note";
    const isOverANote = over.data.current?.type === "Note";

    console.log("DRAG OVER");
    console.log("active", active, { isActiveANote });
    console.log("over", over, { isOverANote });
    console.log("prevOverListId", prevOverListId);
    console.log("activeId === overId", activeId === overId);

    if (activeId === overId) return;
    // TODO: Move list to desired index temporarily

    if (!isActiveANote) return;

    let overListId: string | null = null;
    // Dropping a Note over another Note
    if (isActiveANote && isOverANote) {
      const currOverNote = over.data.current?.note as ActiveNote | undefined;
      console.log("OVER NOTE", "prevOverNoteId", currOverNote?.id);
      setPrevOverNoteId(currOverNote?.id ?? null);
      overListId = currOverNote?.listId ?? null;
    }

    const isOverAList = over.data.current?.type === "List";

    // Dropping a Note over a List
    if (isActiveANote && isOverAList) {
      console.log("OVER LIST");
      const currOverList = over.data.current?.list as ActiveList | undefined;
      setPrevOverNoteId(null);
      overListId = currOverList?.id ?? null;
    }

    if (!overListId) return;

    // Remove activeNote from the previous over list
    if (prevOverListId) {
      ctx.note.getAll.setData({ listId: prevOverListId }, (oldNotes) => {
        if (oldNotes && activeNote) {
          return oldNotes.filter((n) => n.id !== activeNote.id);
        }
        return oldNotes;
      });
    }

    // Add activeNote to the current over list (temporarily)
    ctx.note.getAll.setData({ listId: overListId }, (oldNotes) => {
      const hasActiveNote = oldNotes?.some((n) => n?.id === activeNote?.id);

      if (oldNotes && activeNote && !hasActiveNote) {
        setPrevOverListId(overListId);

        // Move activeNote to the correct position
        const newNotes = [activeNote, ...oldNotes];

        // const activeIdx = newNotes.findIndex((n) => n.id === activeNote.id);
        // const overIdx = isOverANote
        //   ? newNotes.findIndex((n) => n.id === over.id)
        //   : activeIdx;

        // return arrayMove(newNotes, activeIdx, overIdx);
        return newNotes;
      }
      return oldNotes;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveList(null);
    setActiveNote(null);

    const { active, over } = e;

    console.log("DRAG END");
    console.log("active", active);
    console.log("over", over);
    console.log("prevOverListId", prevOverListId);
    console.log("prevOverNoteId", prevOverNoteId);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const isActiveAList = active.data.current?.type === "List";
    const isActiveANote = active.data.current?.type === "Note";
    const isOverAList = over.data.current?.type === "List";

    if (isActiveAList) {
      if (activeId === overId) return;
      moveList({
        id: activeId.toString(),
        targetId: overId.toString(),
        boardId,
      });
    }

    if (isActiveANote) {
      const currActiveNote = active.data.current?.note as
        | ActiveNote
        | undefined;

      if (!prevOverListId) return;

      const isMovingLists = currActiveNote?.listId !== prevOverListId;

      // TWO cases when moving lists and moving to the top of the list
      //    1. Just over the list prevOverNoteId === null
      //        1a. This gives position "n" (really bad cause it could be duplicated)
      //    2. Over the first note but coming from top - prevOverNoteId === first item id
      //        2a. Correct position
      //    3. Over itself but prevOverNoteId is not being set correctly (sets first item id)
      //        3a. prevOverNoteId === first item id && over.id === over.id
      //        3b. Sets it to the second position when it should be first

      // When over a only list set targetId === active.id
      if (isMovingLists && isOverAList) {
        moveNote({
          id: activeId.toString(),
          targetId: activeId.toString(),
          listId: prevOverListId,
        });
      }
    }

    setPrevOverListId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full items-start gap-2 overflow-x-scroll border border-yellow-500 pb-2">
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
