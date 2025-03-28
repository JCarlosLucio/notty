import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ComponentProps, type CSSProperties } from "react";

import NoteDetails from "@/components/NoteDetails";
import { Card, CardHeader } from "@/components/ui/card";
import { type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/utils";

type NoteProps = {
  note: RouterOutputs["note"]["create"];
} & ComponentProps<"div">;

const Note = ({ note, className, ...props }: NoteProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      type: "Note",
      note,
    },
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Translate.toString(transform),
    width: "100%",
  };

  return (
    <div
      ref={setNodeRef}
      className="px-2 py-1"
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        className={cn(
          "bg-secondary/60 hover:bg-secondary/70 cursor-grab rounded-md",
          isDragging &&
            "border-destructive cursor-grabbing border-2 opacity-50",
          className,
        )}
        data-testid="note"
        title={note.title}
        {...props}
      >
        <CardHeader className="group flex h-12 flex-row items-center gap-1 space-y-0 p-2">
          <p className="w-full truncate pl-1">{note.title}</p>
          <NoteDetails
            note={note}
            className="flex group-hover:flex xl:hidden"
          />
        </CardHeader>
      </Card>
    </div>
  );
};

export default Note;
