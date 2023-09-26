import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import CreateList from "@/components/CreateList";
import List from "@/components/List";
import { api } from "@/utils/api";

type BoardProps = { boardId: string };

const BoardLists = ({ boardId }: BoardProps) => {
  const { data: lists } = api.list.getAll.useQuery({ boardId });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext sensors={sensors}>
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
    </DndContext>
  );
};

export default BoardLists;
