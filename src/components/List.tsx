import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import CreateNote from "@/components/CreateNote";
import ListDetails from "@/components/ListDetails";
import ListNotes from "@/components/ListNotes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/utils";

type ListProps = {
  list: RouterOutputs["list"]["getById"];
  className?: string;
};

const List = ({ list, className }: ListProps) => {
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
        isDragging && "border-2 border-destructive opacity-70 [&>*]:invisible",
        className,
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ListDetails list={list} />
      <CardContent className="flex flex-col gap-2 overflow-hidden p-3 pb-0 hover:overflow-y-scroll ">
        <ListNotes listId={list.id} />
      </CardContent>
      <CardFooter className="shrink-0 p-3">
        <CreateNote listId={list.id} />
      </CardFooter>
    </Card>
  );
};

export default List;
