import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";

import NoteDetails from "@/components/NoteDetails";
import { Card, CardHeader } from "@/components/ui/card";
import { type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/utils";

type NoteProps = {
  note: RouterOutputs["note"]["create"];
  className?: string;
};

const Note = ({ note, className }: NoteProps) => {
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
          "rounded-md bg-secondary/60 hover:bg-secondary/70",
          isDragging && "border-2 border-destructive opacity-50",
          className,
        )}
        data-testid="note"
        title={note.title}
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
