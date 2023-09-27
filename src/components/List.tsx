import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import CreateNote from "@/components/CreateNote";
import Note from "@/components/Note";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/utils";

type ListProps = { list: RouterOutputs["list"]["getById"] };

const List = ({ list }: ListProps) => {
  const { data: notes } = api.note.getAll.useQuery({ listId: list.id });

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex max-h-full w-full shrink-0 flex-col lg:w-72",
        isDragging && "border-2 border-destructive opacity-70"
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="shrink-0 p-3 pb-0">
        <CardTitle className="text-md">{list.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-hidden p-3 hover:overflow-y-scroll ">
        {notes ? (
          notes.map((note) => {
            return <Note key={note.id} note={note} />;
          })
        ) : (
          <p>Loading...</p>
        )}
      </CardContent>
      <CardFooter className="shrink-0 p-3 pt-0">
        <CreateNote listId={list.id} />
      </CardFooter>
    </Card>
  );
};

export default List;
