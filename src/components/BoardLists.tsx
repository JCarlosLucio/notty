import {
  DndContext,
  type DragEndEvent,
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
type IList = RouterOutputs["list"]["getById"];
type INote = RouterOutputs["note"]["create"];

const BoardLists = ({ boardId }: BoardProps) => {
  const [activeList, setActiveList] = useState<IList | null>(null);
  const [activeNote, setActiveNote] = useState<INote | null>(null);
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
      setActiveList(active.data.current.list as IList);
      return;
    }

    if (active.data.current?.type === "Note") {
      setActiveNote(active.data.current.note as INote);
      return;
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveList(null);
    setActiveNote(null);

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
