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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveANote = active.data.current?.type === "Note";
    const isOverANote = over.data.current?.type === "Note";

    console.log("DRAG OVER");
    console.log("active", active, { isActiveANote });
    console.log("over", over, { isOverANote });

    // TODO: Move list to desired index temporarily

    if (!isActiveANote) return;

    let overListId: string | null = null;
    // Im dropping a Note over another Note
    if (isActiveANote && isOverANote) {
      console.log("OVER NOTE");
      const currOverNote = over.data.current?.note as ActiveNote | undefined;
      overListId = currOverNote?.listId ?? null;
    }

    const isOverAList = over.data.current?.type === "List";

    // Im dropping a Note over a List
    if (isActiveANote && isOverAList) {
      console.log("OVER LIST");
      const currOverList = over.data.current?.list as ActiveList | undefined;
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
        return [activeNote, ...oldNotes];
      }
      return oldNotes;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveList(null);
    setActiveNote(null);
    setPrevOverListId(null);

    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveAList = active.data.current?.type === "List";
    if (!isActiveAList) return;

    moveList({ id: activeId.toString(), targetId: overId.toString(), boardId });
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
