import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
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
    <Button
      ref={setNodeRef}
      variant="secondary"
      className={
        isDragging
          ? "border-2 border-destructive opacity-50"
          : "bg-secondary/60"
      }
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="w-full truncate text-start">{note.content}</span>
    </Button>
  );
};

export default Note;
