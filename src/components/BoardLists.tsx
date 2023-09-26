import CreateList from "@/components/CreateList";
import List from "@/components/List";
import { api } from "@/utils/api";

type BoardProps = { boardId: string };

const BoardLists = ({ boardId }: BoardProps) => {
  const { data: lists } = api.list.getAll.useQuery({ boardId });

  return (
    <div className="flex h-full items-start gap-2 overflow-x-scroll border border-yellow-500 pb-2">
      {lists?.map((list) => {
        return <List key={list.id} list={list} />;
      })}

      <CreateList boardId={boardId} />
    </div>
  );
};

export default BoardLists;
