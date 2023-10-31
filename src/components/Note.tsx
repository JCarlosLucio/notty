import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";

import NoteDetails from "@/components/NoteDetails";
import { Card, CardHeader } from "@/components/ui/card";
import { type RouterOutputs } from "@/utils/api";

type NoteProps = { note: RouterOutputs["note"]["create"] };

const Note = ({ note }: NoteProps) => {
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
    <Card
      ref={setNodeRef}
      className={
        isDragging
          ? "rounded-md border-2 border-destructive opacity-50"
          : "rounded-md bg-secondary/60 hover:bg-secondary/70"
      }
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="group flex flex-row items-center space-y-0 p-2">
        <p className="w-full truncate pl-1">{note.content}</p>
        <NoteDetails note={note} className="invisible group-hover:visible" />
      </CardHeader>
    </Card>
  );
};

export default Note;
